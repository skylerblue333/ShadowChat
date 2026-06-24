// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateUserStats
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle db instance is in './db'
import { users } from './schema'; // Assuming Drizzle schema for users is in './schema'
import { userStatLogs } from './schema'; // Assuming Drizzle schema for userStatLogs is in './schema'

const updateUserStatsInput = z.object({
  userId: z.string().uuid(),
  newStats: z.object({
    gamesPlayed: z.number().int().min(0).optional(),
    wins: z.number().int().min(0).optional(),
    losses: z.number().int().min(0).optional(),
    // Add other stats fields as needed
  }).partial().refine(data => Object.keys(data).length > 0, { message: 'At least one stat field must be provided' }),
});

export const userRouter = router({
  updateUserStats: publicProcedure
    .input(updateUserStatsInput)
    .mutation(async ({ input }) => {
      try {
        const { userId, newStats } = input;

        const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        if (existingUser.length === 0) {
          throw new Error('User not found');
        }

        const updatedUser = await db.update(users)
          .set({
            stats: { ...existingUser[0].stats, ...newStats },
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId))
          .returning();

        if (updatedUser.length === 0) {
          throw new Error('Failed to update user stats');
        }

                // Log the stat update
        await db.insert(userStatLogs).values({
          userId: userId,
          previousStats: existingUser[0].stats,
          newStats: newStats,
          updatedAt: new Date(),
        });

        return { success: true, user: updatedUser[0] };
      } catch (error) {
        console.error('Error updating user stats:', error);
        throw new Error(`Failed to update user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
