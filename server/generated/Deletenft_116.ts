// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteNFT
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../../db'; // Adjust path as needed
import { nfts } from '../../db/schema'; // Adjust path as needed

export const nftRouter = router({
  deleteNFT: publicProcedure
    .input(z.object({
      nftId: z.string().uuid('Invalid NFT ID format. Must be a UUID.'),
    }))
    .mutation(async ({ input }) => {
      try {
        const deletedNfts = await db.delete(nfts)
          .where(eq(nfts.id, input.nftId))
          .returning({ id: nfts.id });

        if (deletedNfts.length === 0) {
          throw new Error('NFT not found or already deleted.');
        }

        return { success: true, message: `NFT with ID ${input.nftId} deleted successfully.`, deletedId: deletedNfts[0].id };
      } catch (error) {
        console.error('Error deleting NFT:', error);
        throw new Error(`Failed to delete NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});