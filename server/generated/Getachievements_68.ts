// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getAchievements
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { achievements } from '../db/schema';

export const achievementRouter = router({
  getAchievements: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .output(z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      unlockedAt: z.date().nullable(),
    })))
    .query(async ({ input }) => {
      try {
        const userAchievements = await db.select()
          .from(achievements)
          .where(eq(achievements.userId, input.userId));

        if (!userAchievements || userAchievements.length === 0) {
          // Optionally handle case where no achievements are found for the user
          // For now, returning an empty array is sufficient as per output schema
          return [];
        }

        return userAchievements.map(achievement => ({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          unlockedAt: achievement.unlockedAt,
        }));
      } catch (error) {
        console.error('Error fetching achievements:', error);
        throw new Error('Failed to retrieve achievements.');
      }
    }),
});
