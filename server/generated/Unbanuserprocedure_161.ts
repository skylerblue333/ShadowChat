// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: unbanUserProcedure

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in ./trpc
import { db } from './db'; // Assuming Drizzle db connection is in ./db
import { users } from './schema'; // Assuming Drizzle schema for users is in ./schema

export const unbanUserProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid({ message: "Invalid user ID format." }),
  }))
  .mutation(async ({ input }) => {
    const { userId } = input;

    // 1. Find the user in the database
    const userToUnban = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (userToUnban.length === 0) {
      throw new Error("User not found.");
    }

    const user = userToUnban[0];

    // 2. Check if the user is already unbanned
    if (!user.banned) {
      return { success: true, message: "User is already unbanned." };
    }

    // 3. Update the user's banned status
    await db.update(users)
      .set({
        banned: false,
        bannedReason: null,
        bannedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true, message: `User ${userId} has been unbanned successfully.` };
  });

export const appRouter = router({
  unbanUser: unbanUserProcedure,
});

export type AppRouter = typeof appRouter;
