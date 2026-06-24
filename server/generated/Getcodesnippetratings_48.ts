// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCodeSnippetRatings
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { codeSnippetRatings } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const codeSnippetRatingsRouter = router({
  getCodeSnippetRatings: publicProcedure
    .input(z.object({
      codeSnippetId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const ratings = await db.select()
          .from(codeSnippetRatings)
          .where(eq(codeSnippetRatings.codeSnippetId, input.codeSnippetId));

        if (!ratings || ratings.length === 0) {
          // Handle case where no ratings are found for the given snippet ID
          return { success: true, data: [], message: 'No ratings found for this code snippet.' };
        }

        return { success: true, data: ratings, message: 'Code snippet ratings retrieved successfully.' };
      } catch (error) {
        console.error('Error fetching code snippet ratings:', error);
        // In a production environment, you might want to return a more generic error message
        throw new Error('Failed to retrieve code snippet ratings.');
      }
    }),
});