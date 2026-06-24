// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: rateCodeSnippet
import { z } from 'zod';
import { protectedProcedure, publicProcedure, createTRPCRouter } from '../trpc';
import { db } from '../../db';
import { ratings } from '../../db/schema';

export const codeSnippetRouter = createTRPCRouter({
  rateCodeSnippet: protectedProcedure
    .input(z.object({
      snippetId: z.number(),
      rating: z.number().min(1).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const { snippetId, rating } = input;
      const userId = ctx.session.user.id; // Assuming user is authenticated

      // Check if the user has already rated this snippet
      const existingRating = await db.query.ratings.findFirst({
        where: eq(ratings.snippetId, snippetId) && eq(ratings.userId, userId),
      });

      if (existingRating) {
        // Update existing rating
        await db.update(ratings)
          .set({ rating, createdAt: new Date() })
          .where(eq(ratings.snippetId, snippetId) && eq(ratings.userId, userId));
        return { message: 'Rating updated successfully' };
      } else {
        // Insert new rating
        await db.insert(ratings).values({
          snippetId,
          userId,
          rating,
        });
        return { message: 'Rating added successfully' };
      }
    }),
});
