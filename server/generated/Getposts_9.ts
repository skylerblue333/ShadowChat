// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getPosts
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db instance is exported from here
import { posts, users } from './schema'; // Assuming Drizzle schema is exported from here

export const postRouter = router({
  getPosts: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      authorId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const { limit, offset, authorId } = input;

        let query = db.select().from(posts).limit(limit).offset(offset);

        if (authorId) {
          query = query.where(eq(posts.authorId, authorId));
        }

        const result = await query;

        // Optionally, join with users to get author details
        const postsWithAuthors = await Promise.all(result.map(async (post) => {
          if (post.authorId) {
            const author = await db.select().from(users).where(eq(users.id, post.authorId)).limit(1);
            return { ...post, author: author[0] || null };
          }
          return { ...post, author: null };
        }));

        return postsWithAuthors;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
      }
    }),
});