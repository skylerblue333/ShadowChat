// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCommentsProcedure
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { comments } from '../schema'; // Adjust path as needed

export const getCommentsProcedure = publicProcedure
  .input(z.object({
    postId: z.string().uuid(),
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ input }) => {
    try {
      const { postId, limit, offset } = input;

      const result = await db.select()
        .from(comments)
        .where(eq(comments.postId, postId))
        .limit(limit)
        .offset(offset);

      return result;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments.');
    }
  });

export const appRouter = router({
  getComments: getCommentsProcedure,
});

export type AppRouter = typeof appRouter;
