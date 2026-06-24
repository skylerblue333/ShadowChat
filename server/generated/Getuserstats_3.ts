// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getUserStats

import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db instance is imported
import { users, posts } from './schema'; // Assuming Drizzle schema is imported

export const userStatsRouter = router({
  getUserStats: publicProcedure
    .input(z.object({
      userId: z.string().uuid('Invalid user ID format'),
    }))
    .output(z.object({
      id: z.string().uuid(),
      username: z.string(),
      postsCount: z.number().int().nonnegative(),
      commentsCount: z.number().int().nonnegative(), // Hypothetical, not implemented in query
      joinedDate: z.date(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;

      // 1. Fetch user from database
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 2. Count posts for the user
      const userPosts = await db.query.posts.findMany({
        where: eq(posts.userId, userId),
      });
      const postsCount = userPosts.length;

      // 3. Simulate comments count (for demonstration, not querying actual comments table)
      const commentsCount = Math.floor(Math.random() * 100); // Placeholder

      // 4. Return user stats
      return {
        id: user.id,
        username: user.username,
        postsCount,
        commentsCount,
        joinedDate: user.createdAt, // Assuming createdAt field exists
      };
    }),
});
