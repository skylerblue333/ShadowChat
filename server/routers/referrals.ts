import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { referrals, referralStats } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const referralsRouter = router({
  generateReferralCode: protectedProcedure.mutation(async ({ ctx }) => {
    const code = `REF_${ctx.user.id}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return { code, url: `https://skycoin4444-izajymrg.manus.space?ref=${code}` };
  }),

  getReferralStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalReferrals: 0, activeReferrals: 0, totalRewardsEarned: 0 };
    try {
      const stats = await db.select().from(referralStats).where(eq(referralStats.userId, ctx.user.id));
      return stats[0] || { totalReferrals: 0, activeReferrals: 0, totalRewardsEarned: 0 };
    } catch {
      return { totalReferrals: 0, activeReferrals: 0, totalRewardsEarned: 0 };
    }
  }),

  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    try {
      return await db.select().from(referrals).where(eq(referrals.referrerId, ctx.user.id));
    } catch {
      return [];
    }
  }),

  claimReferralRewards: protectedProcedure.mutation(async ({ ctx }) => {
    return { success: true, amount: 500, token: "SKY444" };
  }),
});
