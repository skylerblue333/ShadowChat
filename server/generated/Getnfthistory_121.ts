// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getNFTHistory
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { nftHistory } from '../db/schema';

// Input schema for getNFTHistory
const GetNFTHistoryInputSchema = z.object({
  nftId: z.string().min(1, 'NFT ID is required'),
  userId: z.string().optional(), // Optional user ID to filter history for a specific user
});

// Output schema for getNFTHistory
const NFTHistoryItemSchema = z.object({
  id: z.string(),
  nftId: z.string(),
  userId: z.string().optional(),
  action: z.string(), // e.g., 'mint', 'transfer', 'list', 'buy'
  timestamp: z.date(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
});

export const nftRouter = router({
  getNFTHistory: publicProcedure
    .input(GetNFTHistoryInputSchema)
    .output(z.array(NFTHistoryItemSchema))
    .query(async ({ input }) => {
      try {
        const { nftId, userId } = input;

        let queryConditions = [eq(nftHistory.nftId, nftId)];

        if (userId) {
          queryConditions.push(eq(nftHistory.userId, userId));
        }

        const history = await db.select()
          .from(nftHistory)
          .where(and(...queryConditions))
          .orderBy(nftHistory.timestamp);

        return history.map(item => ({
          ...item,
          // Ensure timestamp is a Date object if Drizzle returns a different type
          timestamp: new Date(item.timestamp),
        }));
      } catch (error) {
        console.error('Error fetching NFT history:', error);
        throw new Error('Failed to retrieve NFT history.');
      }
    }),
});