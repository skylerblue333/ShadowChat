// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: unfollowUser

// Imports
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { TRPCError } from '@trpc/server';

// Input schema for unfollowUser
const unfollowUserInput = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
});

// Output schema for unfollowUser
const unfollowUserOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const unfollowUserProcedure = publicProcedure
  .input(unfollowUserInput)
  .output(unfollowUserOutput)
  .mutation(async ({ input }) => {
    const { followerId, followingId } = input;

    // Operation 1: Validate input - check if follower and following are the same
    if (followerId === followingId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot unfollow yourself.',
      });
    }

    // Operation 2: Validate existence of both users
    const [followerExists, followingExists] = await Promise.all([
      db.select().from(users).where(eq(users.id, followerId)).limit(1),
      db.select().from(users).where(eq(users.id, followingId)).limit(1),
    ]);

    if (followerExists.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Follower user not found.',
      });
    }

    if (followingExists.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User to unfollow not found.',
      });
    }

    // Operation 3: Attempt to delete the follow relationship
    const result = await db.delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .returning({ id: follows.followerId }); // Return something to check if a row was affected

    // Operation 4: Check if any row was actually deleted
    if (result.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Follow relationship not found or already unfollowed.',
      });
    }

    return {
      success: true,
      message: 'User unfollowed successfully.',
    };
  });

export const appRouter = router({
  unfollowUser: unfollowUserProcedure,
});

export type AppRouter = typeof appRouter;
