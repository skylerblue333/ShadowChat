// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getUserProfile
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db'; // Assuming db instance is available
import { users } from '../schema'; // Assuming Drizzle schema for users table

export const userRouter = router({
  getUserProfile: publicProcedure
    .input(z.object({
      userId: z.string().uuid('Invalid user ID format'),
    }))
    .output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    }).nullable())
    .query(async ({ input }) => {
      try {
        const user = await db.select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1);

        if (!user || user.length === 0) {
          // In a real application, you might throw a specific tRPC error like TRPCError
          // For simplicity, returning null as per output schema's nullable type
          return null;
        }

        // Assuming user[0] contains the profile data matching the output schema
        return user[0];
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Re-throw or handle error as per application's error handling strategy
        // For production, consider using a custom error handler or TRPCError
        throw new Error('Failed to retrieve user profile');
      }
    }),
});