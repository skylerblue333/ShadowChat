// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteComment
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { comments } from '../db/schema';

export const commentRouter = router({
  deleteComment: publicProcedure
    .input(
      z.object({
        commentId: z.string().uuid('Invalid comment ID format. Must be a UUID.'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Input validation (handled by Zod schema)

      // 2. Authentication check
      if (!ctx.userId) {
        throw new Error('UNAUTHORIZED: User not authenticated.');
      }

      // 3. Retrieve comment to verify ownership
      const comment = await db.query.comments.findFirst({
        where: eq(comments.id, input.commentId),
      });

      if (!comment) {
        throw new Error('NOT_FOUND: Comment not found.');
      }

      // 4. Authorization check: Ensure the authenticated user owns the comment
      if (comment.userId !== ctx.userId) {
        throw new Error('FORBIDDEN: You do not have permission to delete this comment.');
      }

      // 5. Perform the deletion operation
      const deleteResult = await db.delete(comments)
        .where(eq(comments.id, input.commentId))
        .returning({ id: comments.id });

      // 6. Check if deletion was successful
      if (deleteResult.length === 0) {
        throw new Error('INTERNAL_SERVER_ERROR: Failed to delete comment.');
      }

      return { success: true, message: 'Comment deleted successfully.', deletedCommentId: input.commentId };
    }),
});