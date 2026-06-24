// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBotStats
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db context is available
import { botStats } from './schema'; // Assuming a Drizzle schema for botStats

export const getBotStatsProcedure = publicProcedure
  .input(z.object({
    botId: z.string().uuid(),
  }))
  .output(z.object({
    id: z.string().uuid(),
    botId: z.string().uuid(),
    totalUsers: z.number().int().nonnegative(),
    activeUsers: z.number().int().nonnegative(),
    commandsUsed: z.number().int().nonnegative(),
    lastUpdated: z.date(),
  }).nullable())
  .query(async ({ input }) => {
    const { botId } = input;

    try {
      const stats = await db.select().from(botStats).where(eq(botStats.botId, botId)).limit(1);

      if (stats.length === 0) {
        return null; // Or throw a specific error if preferred
      }

      return stats[0];
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      throw new Error('Failed to fetch bot statistics.');
    }
  });

export const appRouter = router({
  getBotStats: getBotStatsProcedure,
});

export type AppRouter = typeof appRouter;
