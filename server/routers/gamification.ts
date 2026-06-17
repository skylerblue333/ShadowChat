import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const gamificationRouter = router({
  // Get user points
  getUserPoints: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.user.id,
      totalPoints: Math.floor(Math.random() * 50000),
      level: Math.floor(Math.random() * 100) + 1,
      rank: Math.floor(Math.random() * 1000) + 1,
      streak: Math.floor(Math.random() * 30),
    };
  }),

  // Add points for action
  addPoints: protectedProcedure
    .input(z.object({ action: z.string(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, pointsAdded: input.amount, totalPoints: 50000 + input.amount };
    }),

  // Get badges
  getBadges: protectedProcedure.query(async ({ ctx }) => {
    return [
      { id: 1, name: "First Steps", description: "Complete first course", earned: true },
      { id: 2, name: "Mining Master", description: "Mine 1000 tokens", earned: true },
      { id: 3, name: "Social Butterfly", description: "Follow 50 users", earned: false },
      { id: 4, name: "Trader", description: "Complete 100 swaps", earned: true },
      { id: 5, name: "Philanthropist", description: "Burn 10000 tokens", earned: false },
    ];
  }),

  // Get achievements
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    return [
      { id: 1, title: "Learner", description: "Complete 5 courses", progress: 3, total: 5 },
      { id: 2, title: "Miner", description: "Mine 5000 tokens", progress: 2847, total: 5000 },
      { id: 3, title: "Trader", description: "Complete 50 trades", progress: 42, total: 50 },
      { id: 4, title: "Wealthy", description: "Accumulate $100k", progress: 58000, total: 100000 },
    ];
  }),

  // Get leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({ category: z.enum(["points", "level", "wealth", "mining"]).default("points") }))
    .query(async ({ ctx, input }) => {
      return [
        { rank: 1, userId: 4521, username: "CryptoKing", value: 250000, medal: "🥇" },
        { rank: 2, userId: 8834, username: "BlockchainPro", value: 185000, medal: "🥈" },
        { rank: 3, userId: 2156, username: "MiningMaster", value: 156000, medal: "🥉" },
        { rank: 4, userId: 7743, username: "TradingGuru", value: 145000, medal: "⭐" },
        { rank: 5, userId: 9012, username: "DeFiWizard", value: 128000, medal: "⭐" },
      ];
    }),

  // Unlock achievement
  unlockAchievement: protectedProcedure
    .input(z.object({ achievementId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, achievement: "Miner", reward: 1000 };
    }),

  // Daily reward
  claimDailyReward: protectedProcedure.mutation(async ({ ctx }) => {
    return { success: true, reward: 100, nextClaimIn: 86400 };
  }),
});
