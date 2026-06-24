// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: sellNft
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db'; // Assuming your Drizzle DB instance
import { nfts, listings } from '../db/schema'; // Assuming your Drizzle schema

export const nftRouter = router({
  sellNft: publicProcedure
    .input(
      z.object({
        nftId: z.string().uuid('Invalid NFT ID format.'),
        sellerId: z.string().uuid('Invalid seller ID format.'),
        price: z.number().positive('Price must be a positive number.'),
      })
    )
    .mutation(async ({ input }) => {
      const { nftId, sellerId, price } = input;

      // 1. Verify NFT ownership and existence
      const existingNft = await db.select().from(nfts).where(eq(nfts.id, nftId)).limit(1);

      if (existingNft.length === 0) {
        throw new Error('NFT not found.');
      }

      if (existingNft[0].ownerId !== sellerId) {
        throw new Error('You do not own this NFT.');
      }

      if (existingNft[0].status === 'for_sale') {
        throw new Error('NFT is already listed for sale.');
      }

      // 2. Update NFT status to 'for_sale' and set price
      await db.update(nfts)
        .set({ status: 'for_sale', price: price.toString(), updatedAt: new Date() })
        .where(eq(nfts.id, nftId));

      // 3. Create a new listing entry
      const newListing = await db.insert(listings).values({
        nftId,
        sellerId,
        price: price.toString(),
        status: 'active',
        listedAt: new Date(),
      }).returning();

      // 4. Return success message or listing details
      return {
        message: 'NFT successfully listed for sale.',
        listing: newListing[0],
      };
    }),
});