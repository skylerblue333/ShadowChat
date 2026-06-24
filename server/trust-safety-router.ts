/**
 * Trust & Safety Engine Router
 * Moderation rules, rate limiting, audit logs, trust score system
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// ─── Trust Score Weights ──────────────────────────────────────────────────────
const TRUST_WEIGHTS = {
  accountAge: 0.15,       // days since registration
  postCount: 0.10,        // total posts
  likeRatio: 0.10,        // likes received / posts
  reportCount: -0.20,     // reports received (negative)
  verifiedEmail: 0.10,
  walletConnected: 0.10,
  followersCount: 0.10,
  charityDonations: 0.05,
  questsCompleted: 0.05,
  kycVerified: 0.15,
};

// ─── DB Helpers ───────────────────────────────────────────────────────────────
async function ensureTrustTables() {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS trust_scores (
      user_id INT PRIMARY KEY,
      score DECIMAL(5,2) NOT NULL DEFAULT 50.00,
      account_age_days INT NOT NULL DEFAULT 0,
      post_count INT NOT NULL DEFAULT 0,
      like_ratio DECIMAL(5,2) NOT NULL DEFAULT 0,
      report_count INT NOT NULL DEFAULT 0,
      verified_email TINYINT(1) NOT NULL DEFAULT 0,
      wallet_connected TINYINT(1) NOT NULL DEFAULT 0,
      followers_count INT NOT NULL DEFAULT 0,
      charity_donations INT NOT NULL DEFAULT 0,
      quests_completed INT NOT NULL DEFAULT 0,
      kyc_verified TINYINT(1) NOT NULL DEFAULT 0,
      risk_level ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
      last_calculated BIGINT NOT NULL,
      INDEX idx_score (score),
      INDEX idx_risk_level (risk_level)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS moderation_rules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      rule_type ENUM('keyword','pattern','threshold','behavior') NOT NULL,
      pattern TEXT NOT NULL,
      action ENUM('flag','warn','mute','ban','shadow_ban','delete') NOT NULL,
      severity ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      trigger_count INT NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      INDEX idx_rule_type (rule_type),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS moderation_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      moderator_id INT,
      action_type ENUM('flag','warn','mute','ban','shadow_ban','delete','unban','unmute') NOT NULL,
      reason TEXT NOT NULL,
      content_id INT,
      content_type VARCHAR(64),
      rule_id INT,
      expires_at BIGINT,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at BIGINT NOT NULL,
      INDEX idx_user_id (user_id),
      INDEX idx_action_type (action_type),
      INDEX idx_is_active (is_active),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS rate_limit_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      ip_address VARCHAR(64),
      action_type VARCHAR(64) NOT NULL,
      count INT NOT NULL DEFAULT 1,
      window_start BIGINT NOT NULL,
      window_end BIGINT NOT NULL,
      is_blocked TINYINT(1) NOT NULL DEFAULT 0,
      INDEX idx_user_id (user_id),
      INDEX idx_action_type (action_type),
      INDEX idx_window_start (window_start)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS safety_audit_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_id INT,
      actor_type ENUM('user','system','admin','ai') NOT NULL DEFAULT 'system',
      action VARCHAR(128) NOT NULL,
      target_id INT,
      target_type VARCHAR(64),
      details JSON,
      ip_address VARCHAR(64),
      severity ENUM('info','warning','error','critical') NOT NULL DEFAULT 'info',
      created_at BIGINT NOT NULL,
      INDEX idx_actor_id (actor_id),
      INDEX idx_action (action),
      INDEX idx_severity (severity),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function logAuditEvent(opts: {
  actorId?: number;
  actorType?: "user" | "system" | "admin" | "ai";
  action: string;
  targetId?: number;
  targetType?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  severity?: "info" | "warning" | "error" | "critical";
}) {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`
    INSERT INTO safety_audit_log
      (actor_id, actor_type, action, target_id, target_type, details, ip_address, severity, created_at)
    VALUES
      (${opts.actorId ?? null}, ${opts.actorType ?? "system"}, ${opts.action},
       ${opts.targetId ?? null}, ${opts.targetType ?? null},
       ${JSON.stringify(opts.details ?? {})}, ${opts.ipAddress ?? null},
       ${opts.severity ?? "info"}, ${Date.now()})
  `);
}

async function calculateTrustScore(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 50;

  // Get user data
  const userRows = await db.execute(sql`
    SELECT u.created_at, u.email,
      COUNT(DISTINCT p.id) as post_count,
      COALESCE(SUM(p.likes_count), 0) as total_likes,
      COUNT(DISTINCT f.follower_id) as followers_count
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id
    LEFT JOIN follows f ON f.following_id = u.id
    WHERE u.id = ${userId}
    GROUP BY u.id
  `);
  const ur = (userRows as any).rows ?? userRows;
  if (ur.length === 0) return 50;
  const user = ur[0];

  const accountAgeDays = Math.floor(
    (Date.now() - Number(user.created_at)) / (1000 * 60 * 60 * 24)
  );
  const postCount = parseInt(user.post_count ?? "0");
  const totalLikes = parseInt(user.total_likes ?? "0");
  const likeRatio = postCount > 0 ? totalLikes / postCount : 0;
  const followersCount = parseInt(user.followers_count ?? "0");

  // Get report count
  const reportRows = await db.execute(sql`
    SELECT COUNT(*) as cnt FROM moderation_actions
    WHERE user_id = ${userId} AND action_type IN ('flag','warn','ban') AND is_active = 1
  `);
  const rr = (reportRows as any).rows ?? reportRows;
  const reportCount = parseInt(rr[0]?.cnt ?? "0");

  // Compute score (0-100)
  let score = 50; // baseline
  score += Math.min(accountAgeDays / 365, 1) * 100 * TRUST_WEIGHTS.accountAge;
  score += Math.min(postCount / 100, 1) * 100 * TRUST_WEIGHTS.postCount;
  score += Math.min(likeRatio / 10, 1) * 100 * TRUST_WEIGHTS.likeRatio;
  score += Math.min(followersCount / 1000, 1) * 100 * TRUST_WEIGHTS.followersCount;
  score -= Math.min(reportCount * 10, 50) * Math.abs(TRUST_WEIGHTS.reportCount);

  score = Math.max(0, Math.min(100, score));

  const riskLevel =
    score >= 70 ? "low" : score >= 40 ? "medium" : score >= 20 ? "high" : "critical";

  await db.execute(sql`
    INSERT INTO trust_scores
      (user_id, score, account_age_days, post_count, like_ratio, report_count,
       followers_count, risk_level, last_calculated)
    VALUES
      (${userId}, ${score}, ${accountAgeDays}, ${postCount}, ${likeRatio}, ${reportCount},
       ${followersCount}, ${riskLevel}, ${Date.now()})
    ON DUPLICATE KEY UPDATE
      score = ${score},
      account_age_days = ${accountAgeDays},
      post_count = ${postCount},
      like_ratio = ${likeRatio},
      report_count = ${reportCount},
      followers_count = ${followersCount},
      risk_level = ${riskLevel},
      last_calculated = ${Date.now()}
  `);

  return score;
}

// ─── Default Moderation Rules ─────────────────────────────────────────────────
const DEFAULT_RULES = [
  { name: "Spam Detection", type: "behavior", pattern: "post_rate > 20/hour", action: "mute", severity: "medium" },
  { name: "Hate Speech Filter", type: "keyword", pattern: "hate|slur|racial", action: "flag", severity: "high" },
  { name: "Scam Link Detection", type: "pattern", pattern: "bit\\.ly|tinyurl|free.*crypto", action: "delete", severity: "high" },
  { name: "Phishing Attempt", type: "pattern", pattern: "wallet.*seed|private.*key|send.*eth", action: "ban", severity: "critical" },
  { name: "Excessive Reports", type: "threshold", pattern: "reports > 5 in 24h", action: "shadow_ban", severity: "high" },
  { name: "NSFW Content", type: "keyword", pattern: "explicit|nsfw|adult", action: "flag", severity: "medium" },
  { name: "Doxxing Prevention", type: "pattern", pattern: "address|phone.*number|ssn", action: "delete", severity: "critical" },
  { name: "Bot Behavior", type: "behavior", pattern: "identical_posts > 3", action: "mute", severity: "medium" },
];

// ─── Router ───────────────────────────────────────────────────────────────────
export const trustSafetyRouter = router({
  // Get trust score for current user
  getMyTrustScore: protectedProcedure.query(async ({ ctx }) => {
    await ensureTrustTables();
    const score = await calculateTrustScore(ctx.user.id);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const rows = await db.execute(
      sql`SELECT * FROM trust_scores WHERE user_id = ${ctx.user.id}`
    );
    const r = (rows as any).rows ?? rows;
    if (r.length === 0) {
      return { score, riskLevel: "medium", breakdown: {} };
    }
    const row = r[0];
    return {
      score: parseFloat(row.score ?? "50"),
      riskLevel: row.risk_level,
      breakdown: {
        accountAgeDays: row.account_age_days,
        postCount: row.post_count,
        likeRatio: parseFloat(row.like_ratio ?? "0"),
        reportCount: row.report_count,
        followersCount: row.followers_count,
      },
      lastCalculated: Number(row.last_calculated),
    };
  }),

  // Get trust score for any user (public)
  getUserTrustScore: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      await ensureTrustTables();
      const score = await calculateTrustScore(input.userId);
      return { score, userId: input.userId };
    }),

  // Get moderation rules (admin)
  getModerationRules: protectedProcedure.query(async ({ ctx }) => {
    await ensureTrustTables();
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Seed default rules if empty
    const countRows = await db.execute(sql`SELECT COUNT(*) as cnt FROM moderation_rules`);
    const cr = (countRows as any).rows ?? countRows;
    if (parseInt(cr[0]?.cnt ?? "0") === 0) {
      const now = Date.now();
      for (const rule of DEFAULT_RULES) {
        await db.execute(sql`
          INSERT INTO moderation_rules (name, rule_type, pattern, action, severity, is_active, trigger_count, created_at, updated_at)
          VALUES (${rule.name}, ${rule.type}, ${rule.pattern}, ${rule.action}, ${rule.severity}, 1, 0, ${now}, ${now})
        `);
      }
    }

    const rows = await db.execute(sql`
      SELECT * FROM moderation_rules ORDER BY severity DESC, trigger_count DESC
    `);
    const r = (rows as any).rows ?? rows;
    return {
      rules: r.map((row: any) => ({
        id: row.id,
        name: row.name,
        ruleType: row.rule_type,
        pattern: row.pattern,
        action: row.action,
        severity: row.severity,
        isActive: Boolean(row.is_active),
        triggerCount: row.trigger_count,
        createdAt: Number(row.created_at),
      })),
    };
  }),

  // Toggle moderation rule active state
  toggleRule: protectedProcedure
    .input(z.object({ ruleId: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ensureTrustTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`
        UPDATE moderation_rules SET is_active = ${input.isActive ? 1 : 0}, updated_at = ${Date.now()}
        WHERE id = ${input.ruleId}
      `);
      await logAuditEvent({
        actorId: ctx.user.id,
        actorType: "admin",
        action: "toggle_moderation_rule",
        targetId: input.ruleId,
        targetType: "moderation_rule",
        details: { isActive: input.isActive },
        severity: "info",
      });
      return { success: true };
    }),

  // Get moderation actions (admin view)
  getModerationActions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        actionType: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      await ensureTrustTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db.execute(sql`
        SELECT ma.*, u.name as user_name, u.username as user_username
        FROM moderation_actions ma
        LEFT JOIN users u ON u.id = ma.user_id
        WHERE 1=1
          ${input.actionType ? sql`AND ma.action_type = ${input.actionType}` : sql``}
          ${input.userId ? sql`AND ma.user_id = ${input.userId}` : sql``}
        ORDER BY ma.created_at DESC
        LIMIT ${input.limit} OFFSET ${input.offset}
      `);
      const r = (rows as any).rows ?? rows;
      return {
        actions: r.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          userName: row.user_name ?? `User #${row.user_id}`,
          userUsername: row.user_username ?? `user${row.user_id}`,
          actionType: row.action_type,
          reason: row.reason,
          contentId: row.content_id,
          contentType: row.content_type,
          isActive: Boolean(row.is_active),
          expiresAt: row.expires_at ? Number(row.expires_at) : null,
          createdAt: Number(row.created_at),
        })),
      };
    }),

  // Apply moderation action
  applyModerationAction: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        actionType: z.enum(["flag", "warn", "mute", "ban", "shadow_ban", "delete"]),
        reason: z.string().min(1).max(500),
        contentId: z.number().optional(),
        contentType: z.string().optional(),
        durationHours: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ensureTrustTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const expiresAt = input.durationHours
        ? Date.now() + input.durationHours * 60 * 60 * 1000
        : null;

      await db.execute(sql`
        INSERT INTO moderation_actions
          (user_id, moderator_id, action_type, reason, content_id, content_type, expires_at, is_active, created_at)
        VALUES
          (${input.userId}, ${ctx.user.id}, ${input.actionType}, ${input.reason},
           ${input.contentId ?? null}, ${input.contentType ?? null},
           ${expiresAt}, 1, ${Date.now()})
      `);

      // Update rule trigger count if applicable
      await db.execute(sql`
        UPDATE moderation_rules SET trigger_count = trigger_count + 1
        WHERE action = ${input.actionType} AND is_active = 1
        LIMIT 1
      `);

      await logAuditEvent({
        actorId: ctx.user.id,
        actorType: "admin",
        action: `moderation_${input.actionType}`,
        targetId: input.userId,
        targetType: "user",
        details: { reason: input.reason, contentId: input.contentId },
        severity: ["ban", "shadow_ban"].includes(input.actionType) ? "critical" : "warning",
      });

      // Recalculate trust score
      await calculateTrustScore(input.userId);

      return { success: true };
    }),

  // Get audit log
  getAuditLog: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(200).default(100),
        offset: z.number().min(0).default(0),
        severity: z.enum(["info", "warning", "error", "critical"]).optional(),
        action: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      await ensureTrustTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db.execute(sql`
        SELECT sal.*, u.name as actor_name
        FROM safety_audit_log sal
        LEFT JOIN users u ON u.id = sal.actor_id
        WHERE 1=1
          ${input.severity ? sql`AND sal.severity = ${input.severity}` : sql``}
          ${input.action ? sql`AND sal.action LIKE ${`%${input.action}%`}` : sql``}
        ORDER BY sal.created_at DESC
        LIMIT ${input.limit} OFFSET ${input.offset}
      `);
      const r = (rows as any).rows ?? rows;
      return {
        events: r.map((row: any) => ({
          id: row.id,
          actorId: row.actor_id,
          actorName: row.actor_name ?? row.actor_type,
          actorType: row.actor_type,
          action: row.action,
          targetId: row.target_id,
          targetType: row.target_type,
          details: typeof row.details === "string" ? JSON.parse(row.details) : (row.details ?? {}),
          ipAddress: row.ip_address,
          severity: row.severity,
          createdAt: Number(row.created_at),
        })),
      };
    }),

  // Get rate limit stats
  getRateLimitStats: protectedProcedure.query(async () => {
    await ensureTrustTables();
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const windowStart = Date.now() - 60 * 60 * 1000; // last hour
    const rows = await db.execute(sql`
      SELECT
        action_type,
        COUNT(*) as event_count,
        SUM(count) as total_requests,
        SUM(is_blocked) as blocked_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM rate_limit_events
      WHERE window_start > ${windowStart}
      GROUP BY action_type
      ORDER BY total_requests DESC
    `);
    const r = (rows as any).rows ?? rows;

    const totalBlocked = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM rate_limit_events
      WHERE is_blocked = 1 AND window_start > ${windowStart}
    `);
    const tb = (totalBlocked as any).rows ?? totalBlocked;

    return {
      byAction: r.map((row: any) => ({
        actionType: row.action_type,
        eventCount: parseInt(row.event_count ?? "0"),
        totalRequests: parseInt(row.total_requests ?? "0"),
        blockedCount: parseInt(row.blocked_count ?? "0"),
        uniqueUsers: parseInt(row.unique_users ?? "0"),
      })),
      totalBlockedLastHour: parseInt(tb[0]?.cnt ?? "0"),
      windowHours: 1,
    };
  }),

  // Record a rate limit event (called by middleware)
  recordRateLimitEvent: protectedProcedure
    .input(
      z.object({
        actionType: z.string(),
        count: z.number().default(1),
        isBlocked: z.boolean().default(false),
        ipAddress: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ensureTrustTables();
      const db = await getDb();
      if (!db) return { success: false };
      const now = Date.now();
      await db.execute(sql`
        INSERT INTO rate_limit_events
          (user_id, ip_address, action_type, count, window_start, window_end, is_blocked)
        VALUES
          (${ctx.user.id}, ${input.ipAddress ?? null}, ${input.actionType},
           ${input.count}, ${now}, ${now + 60000}, ${input.isBlocked ? 1 : 0})
      `);
      if (input.isBlocked) {
        await logAuditEvent({
          actorId: ctx.user.id,
          actorType: "system",
          action: "rate_limit_blocked",
          details: { actionType: input.actionType, ipAddress: input.ipAddress },
          severity: "warning",
        });
      }
      return { success: true };
    }),

  // Get platform-wide safety stats (public)
  getSafetyStats: publicProcedure.query(async () => {
    await ensureTrustTables();
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const [scoreRows, actionRows, auditRows] = await Promise.all([
      db.execute(sql`
        SELECT
          AVG(score) as avg_score,
          COUNT(*) as total_scored,
          SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_risk,
          SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_risk,
          SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk,
          SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_risk
        FROM trust_scores
      `),
      db.execute(sql`
        SELECT action_type, COUNT(*) as cnt
        FROM moderation_actions
        WHERE created_at > ${Date.now() - 24 * 60 * 60 * 1000}
        GROUP BY action_type
      `),
      db.execute(sql`
        SELECT severity, COUNT(*) as cnt
        FROM safety_audit_log
        WHERE created_at > ${Date.now() - 24 * 60 * 60 * 1000}
        GROUP BY severity
      `),
    ]);

    const sr = (scoreRows as any).rows ?? scoreRows;
    const ar = (actionRows as any).rows ?? actionRows;
    const aur = (auditRows as any).rows ?? auditRows;

    return {
      trustScores: {
        avgScore: parseFloat(sr[0]?.avg_score ?? "50"),
        totalScored: parseInt(sr[0]?.total_scored ?? "0"),
        lowRisk: parseInt(sr[0]?.low_risk ?? "0"),
        mediumRisk: parseInt(sr[0]?.medium_risk ?? "0"),
        highRisk: parseInt(sr[0]?.high_risk ?? "0"),
        criticalRisk: parseInt(sr[0]?.critical_risk ?? "0"),
      },
      moderationActions24h: ar.map((row: any) => ({
        actionType: row.action_type,
        count: parseInt(row.cnt ?? "0"),
      })),
      auditEvents24h: aur.map((row: any) => ({
        severity: row.severity,
        count: parseInt(row.cnt ?? "0"),
      })),
    };
  }),
});
