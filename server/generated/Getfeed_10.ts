// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getFeed

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming these are defined
import { db } from '../db'; // Assuming Drizzle client is exported as 'db'
import { posts } from '../schema'; // Assuming Drizzle schema is exported as 'posts'

// Input schema for the getFeed procedure
const getFeedInput = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  userId: z.string().optional(), // Optional: to fetch a personalized feed
});

// Output schema for a single feed post
const feedPostSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  authorId: z.string().uuid(),
  createdAt: z.date(),
});

// Output schema for the getFeed procedure
const getFeedOutput = z.object({
  posts: z.array(feedPostSchema),
  totalCount: z.number(),
  hasMore: z.boolean(),
});

export const feedRouter = router({
  getFeed: publicProcedure
    .input(getFeedInput)
    .output(getFeedOutput) // Explicitly define output schema for better type safety
    .query(async ({ input }) => {
      const { limit, offset, userId } = input;

      try {
        // Step 1: Build the query for posts, optionally filtering by userId
        let postsQuery = db.select().from(posts);

        if (userId) {
          postsQuery = postsQuery.where(eq(posts.authorId, userId));
        }

        // Step 2: Execute the query with pagination and ordering
        const fetchedPosts = await postsQuery
          .limit(limit)
          .offset(offset)
          .orderBy(posts.createdAt.desc());

        // Step 3: Get the total count of posts, considering the userId filter
        let countQuery = db.select({ count: count() }).from(posts);
        if (userId) {
          countQuery = countQuery.where(eq(posts.authorId, userId));
        }
        const totalCountResult = await countQuery;
        const totalCount = totalCountResult[0]?.count || 0;

        // Step 4: Determine if there are more posts available
        const hasMore = (offset + fetchedPosts.length) < totalCount;

        return {
          posts: fetchedPosts,
          totalCount,
          hasMore,
        };
      } catch (error) {
        console.error("Failed to fetch feed:", error);
        // Step 5: Handle errors gracefully
        throw new Error("Unable to retrieve feed at this time.");
      }
    }),
});
