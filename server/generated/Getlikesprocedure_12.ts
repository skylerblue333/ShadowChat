// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getLikesProcedure
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance

export const getLikesProcedure = publicProcedure
  .input(z.object({
    postId: z.number().int().positive(),
  }))
  .query(async ({ input }) => {
    try {
      const { postId } = input;

      const postExists = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
      if (postExists.length === 0) {
        throw new Error('Post not found');
      }

      const postLikes = await db.select({
        id: likes.id,
        userId: likes.userId,
        postId: likes.postId,
        createdAt: likes.createdAt,
        userName: users.name,
      })
      .from(likes)
      .leftJoin(users, eq(likes.userId, users.id))
      .where(eq(likes.postId, postId));

      return postLikes;
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw new Error('Failed to fetch likes');
    }
  });

export const appRouter = router({
  getLikes: getLikesProcedure,
});

export type AppRouter = typeof appRouter;
