// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteDocument
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { documents } from '../schema';

export const documentRouter = router({
  deleteDocument: publicProcedure
    .input(z.object({
      id: z.string().uuid('Invalid document ID format'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await db.delete(documents).where(eq(documents.id, input.id)).returning();

        if (result.length === 0) {
          throw new Error('Document not found');
        }

        return { success: true, message: 'Document deleted successfully', deletedId: input.id };
      } catch (error) {
        console.error('Error deleting document:', error);
        throw new Error(`Failed to delete document: ${error.message}`);
      }
    }),
});
