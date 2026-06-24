// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getFollowing

import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming your Drizzle DB instance is exported as 'db'
import { users, follows } from '../schema'; // Assuming your Drizzle schema is in '../schema'

export const skycoin4444Router = router({
  getFollowing: publicProcedure
    .input(
      z.object({
        userId: z.number().int().positive('User ID must be a positive integer.'),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          username: z.string(),
          email: z.string().email(),
        })
      )
    )
    .query(async ({ input }) => {
      const { userId } = input;

      // 1. Check if the requesting user exists
      const requestingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (requestingUser.length === 0) {
        throw new Error('User not found.');
      }

      // 2. Get the IDs of users that the requesting user is following
      const followingRecords = await db.select({ followingId: follows.followingId })
        .from(follows)
        .where(eq(follows.followerId, userId));

      if (followingRecords.length === 0) {
        return []; // Return an empty array if the user is not following anyone
      }

      const followingIds = followingRecords.map(record => record.followingId);

      // 3. Fetch details of the users being followed
      const followingUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
        .from(users)
        .where(inArray(users.id, followingIds));

      // 4. Return the list of followed users
      return followingUsers;
    }),
});

export type Skycoin4444Router = typeof skycoin4444Router;
