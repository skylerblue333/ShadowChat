// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateUserProfile
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { users } from '../schema';

export const userRouter = router({
  updateUserProfile: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, name, email } = input;

      try {
        const [updatedUser] = await db.update(users)
          .set({
            ...(name && { name }),
            ...(email && { email }),
            updatedAt: new Date(),
          })
          .where(eq(users.id, id))
          .returning();

        if (!updatedUser) {
          throw new Error('User not found or not updated');
        }

        return updatedUser;
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
      }
    }),
});
