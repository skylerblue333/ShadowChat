// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: searchNFTs
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { nfts, users } from '../schema'; // Adjust path as needed

export const nftRouter = router({
  searchNFTs: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, 'Search query cannot be empty').optional(),
        ownerId: z.string().uuid('Invalid owner ID format').optional(),
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          description: z.string().nullable(),
          ownerId: z.string().uuid().nullable(),
          tokenId: z.string(),
          imageUrl: z.string().nullable(),
          createdAt: z.date(),
          ownerName: z.string().nullable(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        const { query, ownerId, limit, offset } = input;

        const whereConditions = [];

        if (query) {
          whereConditions.push(
            or(
              ilike(nfts.name, `%${query}%`),
              ilike(nfts.description, `%${query}%`)
            )
          );
        }

        if (ownerId) {
          whereConditions.push(eq(nfts.ownerId, ownerId));
        }

        const result = await db
          .select({
            id: nfts.id,
            name: nfts.name,
            description: nfts.description,
            ownerId: nfts.ownerId,
            tokenId: nfts.tokenId,
            imageUrl: nfts.imageUrl,
            createdAt: nfts.createdAt,
            ownerName: users.name,
          })
          .from(nfts)
          .leftJoin(users, eq(nfts.ownerId, users.id))
          .where(and(...whereConditions))
          .limit(limit)
          .offset(offset);

        return result;
      } catch (error) {
        console.error('Failed to search NFTs:', error);
        throw new Error('Could not retrieve NFTs. Please try again later.');
      }
    }),
});
