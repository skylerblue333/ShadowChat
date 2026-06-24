// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateMarketplaceListing
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { marketplaceListings } from './schema'; // Assuming schema.ts defines your Drizzle schema

const updateMarketplaceListingInput = z.object({
  listingId: z.string().uuid(),
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  // Add other fields that can be updated
});

export const marketplaceRouter = router({
  updateMarketplaceListing: publicProcedure
    .input(updateMarketplaceListingInput)
    .mutation(async ({ input }) => {
      const { listingId, ...updates } = input;

      try {
        const [updatedListing] = await db.update(marketplaceListings)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(marketplaceListings.id, listingId))
          .returning();

        if (!updatedListing) {
          throw new Error('Listing not found or no changes applied.');
        }

        return {
          success: true,
          message: 'Marketplace listing updated successfully.',
          listing: updatedListing,
        };
      } catch (error) {
        console.error('Error updating marketplace listing:', error);
        throw new Error('Failed to update marketplace listing.');
      }
    }),
});

export type MarketplaceRouter = typeof marketplaceRouter;
