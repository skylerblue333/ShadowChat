// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getDocuments
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { documents } from '../db/schema';

export const documentRouter = router({
  getDocuments: publicProcedure
    .input(z.object({
      userId: z.string().uuid().optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      try {
        const { userId, limit, offset } = input;

        let query = db.select().from(documents);

        if (userId) {
          query = query.where(eq(documents.userId, userId));
        }

        const result = await query.limit(limit).offset(offset);

        if (!result || result.length === 0) {
          return { documents: [], message: 'No documents found.' };
        }

        return { documents: result, message: 'Documents fetched successfully.' };
      } catch (error) {
        console.error('Error fetching documents:', error);
        throw new Error('Failed to fetch documents.');
      }
    }),
});