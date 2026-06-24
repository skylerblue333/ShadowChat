// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deletePostProcedure

import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { posts } from '../schema';

export const deletePostProcedure = publicProcedure
  .input(z.object({
    postId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    try {
      const { postId } = input;

      // Check if the post exists before attempting to delete
      const existingPost = await db.select().from(posts).where(eq(posts.id, postId)).execute();

      if (existingPost.length === 0) {
        throw new Error('Post not found');
      }

      // Delete the post
      await db.delete(posts).where(eq(posts.id, postId)).execute();

      return { success: true, message: `Post with ID ${postId} deleted successfully.` };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  });
