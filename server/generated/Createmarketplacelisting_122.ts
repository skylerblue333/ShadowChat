// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createMarketplaceListing
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { marketplaceListings } from '../schema';

export const marketplaceRouter = router({
  createMarketplaceListing: publicProcedure
    .input(
      z.object({
        itemName: z.string().min(1, 'Item name cannot be empty'),
        description: z.string().optional(),
        price: z.number().positive('Price must be a positive number'),
        currency: z.string().min(1, 'Currency cannot be empty'),
        sellerId: z.string().min(1, 'Seller ID cannot be empty'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [newListing] = await db.insert(marketplaceListings).values({
          itemName: input.itemName,
          description: input.description,
          price: input.price.toString(),
          currency: input.currency,
          sellerId: input.sellerId,
        }).returning();

        if (!newListing) {
          throw new Error('Failed to create marketplace listing.');
        }

        return {
          success: true,
          message: 'Marketplace listing created successfully.',
          listing: newListing,
        };
      } catch (error) {
        console.error('Error creating marketplace listing:', error);
        throw new Error('An unexpected error occurred while creating the listing.');
      }
    }),
});