// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: rateMarketplaceSeller

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { ratings, sellers } from '../db/schema'; // Assuming Drizzle schema

export const marketplaceRouter = router({
  rateMarketplaceSeller: publicProcedure
    .input(z.object({
      sellerId: z.string().uuid(),
      raterId: z.string().uuid(), // Assuming user is authenticated and ID is passed
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(500).optional(),
    }))
    .output(z.object({
      success: z.boolean(),
      message: z.string(),
      newAverageRating: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { sellerId, raterId, rating, comment } = input;

      // Operation 1: Check if seller exists
      const existingSeller = await db.select().from(sellers).where(eq(sellers.id, sellerId)).limit(1);
      if (!existingSeller.length) {
        throw new Error('Seller not found.');
      }

      // Operation 2: Insert new rating
      await db.insert(ratings).values({
        sellerId,
        raterId,
        rating,
        comment,
        createdAt: new Date(),
      });

      // Operation 3: Calculate new average rating for the seller
      const allRatingsForSeller = await db.select({ rating: ratings.rating }).from(ratings).where(eq(ratings.sellerId, sellerId));
      const totalRatings = allRatingsForSeller.length;
      const sumRatings = allRatingsForSeller.reduce((sum, r) => sum + r.rating, 0);
      const newAverageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(2)) : 0;

      // Operation 4: Update seller's average rating and total ratings count
      await db.update(sellers).set({ averageRating: newAverageRating, totalRatings }).where(eq(sellers.id, sellerId));

      return {
        success: true,
        message: 'Seller rated successfully.',
        newAverageRating,
      };
    }),
});
