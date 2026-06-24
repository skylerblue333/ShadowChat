// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getFollowers
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { users, followers } from '../schema';

export const getFollowers = publicProcedure
  .input(z.object({
    userId: z.string().uuid('Invalid user ID format. Must be a UUID.'),
  }))
  .output(z.array(z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
  })))
  .query(async ({ input }) => {
    const { userId } = input;

    // 1. Check if the target user exists
    const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (targetUser.length === 0) {
      throw new Error('User not found.');
    }

    // 2. Fetch followers for the given userId
    const userFollowers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(followers)
      .innerJoin(users, eq(followers.followerId, users.id))
      .where(eq(followers.followingId, userId));

    // 3. Return the list of followers
    return userFollowers;
  });