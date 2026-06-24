// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateNFT
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { nfts } from '../schema';

export const nftRouter = router({
  updateNFT: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        imageUrl: z.string().url().optional(),
        ownerId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod schema)
        const { id, ...updateData } = input;

        if (Object.keys(updateData).length === 0) {
          throw new Error('No update data provided');
        }

        // 2. Perform database update
        const result = await db.update(nfts)
          .set(updateData)
          .where(eq(nfts.id, id))
          .returning();

        // 3. Check if NFT was found and updated
        if (result.length === 0) {
          throw new Error(`NFT with ID ${id} not found`);
        }

        // 4. Return the updated NFT
        return result[0];
      } catch (error) {
        console.error('Error updating NFT:', error);
        throw new Error(`Failed to update NFT: ${error.message}`);
      }
    }),
});