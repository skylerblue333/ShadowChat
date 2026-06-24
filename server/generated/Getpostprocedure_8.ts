// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getPostProcedure
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Adjust path as needed
import { db } from './db'; // Adjust path as needed
import { posts } from './db/schema'; // Adjust path as needed

export const getPostProcedure = publicProcedure
  .input(z.object({
    id: z.string().uuid('Invalid post ID format.'),
  }))
  .output(z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }).nullable())
  .query(async ({ input }) => {
    // 1. Input validation (handled by Zod schema)

    // 2. Database query to fetch the post
    const post = await db.select()
      .from(posts)
      .where(eq(posts.id, input.id))
      .limit(1);

    // 3. Error handling: if post not found
    if (!post || post.length === 0) {
      return null; // Or throw an error if preferred, e.g., new TRPCError({ code: 'NOT_FOUND', message: 'Post not found.' });
    }

    // 4. Return the post data
    return post[0];
  });

// Example of how this procedure would be added to a router:
// export const appRouter = router({
//   getPost: getPostProcedure,
// });