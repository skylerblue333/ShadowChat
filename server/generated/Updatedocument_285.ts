// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateDocument
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { documents } from '../db/schema';
import { TRPCError } from '@trpc/server';

const updateDocumentInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

const updateDocumentOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(), // Assuming createdAt exists and is returned
  updatedAt: z.date(),
});

export const documentRouter = router({
  updateDocument: publicProcedure
    .input(updateDocumentInput)
    .output(updateDocumentOutput)
    .mutation(async ({ input }) => {
      const { id, title, content } = input;

      if (!title && !content) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'At least one field (title or content) must be provided for update.',
        });
      }

      const [updatedDocument] = await db
        .update(documents)
        .set({
          ...(title && { title }),
          ...(content && { content }),
          updatedAt: new Date(),
        })
        .where(eq(documents.id, id))
        .returning();

      if (!updatedDocument) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Document with ID ${id} not found.`,
        });
      }

      return updatedDocument;
    }),
});