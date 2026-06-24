// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTopicPosts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle db instance
import { posts, topics } from '../schema'; // Assuming Drizzle schema

export const topicRouter = router({
  getTopicPosts: publicProcedure
    .input(
      z.object({
        topicId: z.string().uuid("Invalid topic ID format."),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().uuid().optional(), // For infinite scrolling
      })
    )
    .output(
      z.object({
        posts: z.array(
          z.object({
            id: z.string().uuid(),
            title: z.string(),
            content: z.string(),
            createdAt: z.date(),
            topicId: z.string().uuid(),
          })
        ),
        nextCursor: z.string().uuid().optional(),
      })
    )
    .query(async ({ input }) => {
      const { topicId, limit, cursor } = input;

      // 1. Validate topic existence
      const topicExists = await db.select({ id: topics.id }).from(topics).where(eq(topics.id, topicId)).limit(1);
      if (topicExists.length === 0) {
        throw new Error("Topic not found."); // Or use tRPC's TRPCError
      }

      // 2. Fetch posts with pagination
      const fetchedPosts = await db.select()
        .from(posts)
        .where(
          and(
            eq(posts.topicId, topicId),
            cursor ? gt(posts.id, cursor) : undefined // Apply cursor for pagination
          )
        )
        .orderBy(posts.id) // Ensure consistent ordering for cursor-based pagination
        .limit(limit + 1); // Fetch one extra to check for next cursor

      let nextCursor: string | undefined = undefined;
      if (fetchedPosts.length > limit) {
        const lastPost = fetchedPosts.pop(); // Remove the extra post
        nextCursor = lastPost?.id;
      }

      // 3. Return posts and next cursor
      return {
        posts: fetchedPosts,
        nextCursor,
      };
    }),
});
