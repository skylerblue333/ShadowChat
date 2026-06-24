// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: unlockAchievement

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { achievements, userAchievements } from '../schema'; // Adjust path as needed

export const achievementRouter = router({
  unlockAchievement: publicProcedure
    .input(z.object({
      userId: z.string().uuid("Invalid user ID format."),
      achievementId: z.string().uuid("Invalid achievement ID format."),
    }))
    .mutation(async ({ input }) => {
      const { userId, achievementId } = input;

      try {
        // Operation 1: Check if the achievement exists
        const existingAchievement = await db.select().from(achievements).where(eq(achievements.id, achievementId)).limit(1);

        if (existingAchievement.length === 0) {
          throw new Error('Achievement not found.');
        }

        // Operation 2: Check if the user already has this achievement
        const existingUserAchievement = await db.select().from(userAchievements).where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievementId)
          )
        ).limit(1);

        if (existingUserAchievement.length > 0) {
          return { success: true, message: 'Achievement already unlocked.' };
        }

        // Operation 3: Unlock the achievement for the user
        await db.insert(userAchievements).values({
          userId,
          achievementId,
        });

        return { success: true, message: 'Achievement unlocked successfully!' };
      } catch (error) {
        console.error('Failed to unlock achievement:', error);
        throw new Error(`Failed to unlock achievement: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
