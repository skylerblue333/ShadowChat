// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getLeaderboard
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../schema';

export const leaderboardRouter = router({
  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          score: z.number(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        const leaderboard = await db
          .select({
            id: users.id,
            name: users.name,
            score: users.score,
          })
          .from(users)
          .orderBy(desc(users.score))
          .limit(input.limit)
          .offset(input.offset);

        return leaderboard;
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        throw new Error('Could not retrieve leaderboard data.');
      }
    }),
});