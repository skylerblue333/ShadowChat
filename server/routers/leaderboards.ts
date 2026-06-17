import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { miningOperations, stakingPositions, burningEvents, cryptoWallets } from "../../drizzle/schema";
import { eq, desc, sum } from "drizzle-orm";

export const leaderboardsRouter = router({
  // Top miners by total mined
  getTopMiners: protectedProcedure
    .input(z.object({ limit: z.number().default(10), token: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          userId: miningOperations.userId,
          totalMined: sum(miningOperations.rewardAmount).mapWith(Number),
        })
        .from(miningOperations)
        .where(eq(miningOperations.status, "completed"))
        .groupBy(miningOperations.userId)
        .orderBy(desc(sum(miningOperations.rewardAmount)))
        .limit(input.limit);

      return results;
    }),

  // Top stakers by total staked value
  getTopStakers: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          userId: stakingPositions.userId,
          totalStaked: sum(stakingPositions.amount).mapWith(Number),
          totalRewards: sum(stakingPositions.rewardsClaimed).mapWith(Number),
          positionCount: sum(stakingPositions.id).mapWith(Number),
        })
        .from(stakingPositions)
        .groupBy(stakingPositions.userId)
        .orderBy(desc(sum(stakingPositions.amount)))
        .limit(input.limit);

      return results;
    }),

  // Top burners by total burned
  getTopBurners: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          userId: burningEvents.userId,
          totalBurned: sum(burningEvents.amount).mapWith(Number),
          supplyReduction: sum(burningEvents.supplyReduction).mapWith(Number),
          burnCount: sum(burningEvents.id).mapWith(Number),
        })
        .from(burningEvents)
        .groupBy(burningEvents.userId)
        .orderBy(desc(sum(burningEvents.amount)))
        .limit(input.limit);

      return results;
    }),

  // Richest wallets by total balance
  getWealthiest: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          userId: cryptoWallets.userId,
          totalBalance: sum(cryptoWallets.balance).mapWith(Number),
          stakedBalance: sum(cryptoWallets.stakedBalance).mapWith(Number),
          walletCount: sum(cryptoWallets.id).mapWith(Number),
        })
        .from(cryptoWallets)
        .groupBy(cryptoWallets.userId)
        .orderBy(desc(sum(cryptoWallets.balance)))
        .limit(input.limit);

      return results;
    }),

  // User rank in each category
  getUserRanks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { miningRank: 0, stakingRank: 0, burningRank: 0, wealthRank: 0 };

    // Mining rank
    const miners = await db
      .select({ userId: miningOperations.userId, total: sum(miningOperations.rewardAmount) })
      .from(miningOperations)
      .where(eq(miningOperations.status, "completed"))
      .groupBy(miningOperations.userId)
      .orderBy(desc(sum(miningOperations.rewardAmount)));

    const miningRank = miners.findIndex((m) => m.userId === ctx.user.id) + 1;

    // Staking rank
    const stakers = await db
      .select({ userId: stakingPositions.userId, total: sum(stakingPositions.amount) })
      .from(stakingPositions)
      .groupBy(stakingPositions.userId)
      .orderBy(desc(sum(stakingPositions.amount)));

    const stakingRank = stakers.findIndex((s) => s.userId === ctx.user.id) + 1;

    // Burning rank
    const burners = await db
      .select({ userId: burningEvents.userId, total: sum(burningEvents.amount) })
      .from(burningEvents)
      .groupBy(burningEvents.userId)
      .orderBy(desc(sum(burningEvents.amount)));

    const burningRank = burners.findIndex((b) => b.userId === ctx.user.id) + 1;

    // Wealth rank
    const wealthy = await db
      .select({ userId: cryptoWallets.userId, total: sum(cryptoWallets.balance) })
      .from(cryptoWallets)
      .groupBy(cryptoWallets.userId)
      .orderBy(desc(sum(cryptoWallets.balance)));

    const wealthRank = wealthy.findIndex((w) => w.userId === ctx.user.id) + 1;

    return { miningRank, stakingRank, burningRank, wealthRank };
  }),

  // Weekly rewards (mock - would be calculated from timestamps)
  getWeeklyRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { miningReward: 0, stakingReward: 0, burningReward: 0 };

    // Get this week's mining
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const miningOps = await db
      .select({ reward: sum(miningOperations.rewardAmount) })
      .from(miningOperations)
      .where(eq(miningOperations.userId, ctx.user.id));

    const miningReward = miningOps[0]?.reward || 0;

    // Get this week's staking rewards
    const stakingOps = await db
      .select({ reward: sum(stakingPositions.rewardsClaimed) })
      .from(stakingPositions)
      .where(eq(stakingPositions.userId, ctx.user.id));

    const stakingReward = stakingOps[0]?.reward || 0;

    // Burning doesn't give rewards, but track it
    const burningOps = await db
      .select({ amount: sum(burningEvents.amount) })
      .from(burningEvents)
      .where(eq(burningEvents.userId, ctx.user.id));

    const burningReward = (Number(burningOps[0]?.amount) || 0) * 0.001; // 0.1% burn bonus

    return {
      miningReward: Number(miningReward) || 0,
      stakingReward: Number(stakingReward) || 0,
      burningReward: Number(burningReward) || 0,
    };
  }),
});
