// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createNFT
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { nfts, users } from './schema';

const createNFTInput = z.object({
  name: z.string().min(1).max(256),
  description: z.string().max(1024).optional(),
  imageUrl: z.string().url(),
  contractAddress: z.string().min(1),
  tokenId: z.string().min(1),
  walletAddress: z.string().min(1), // Assuming wallet address is provided for owner identification
});

export const nftRouter = router({
  createNFT: publicProcedure
    .input(createNFTInput)
    .mutation(async ({ input }) => {
      const { name, description, imageUrl, contractAddress, tokenId, walletAddress } = input;

      // Operation 1: Find or create user based on walletAddress
      let user = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
      let userId;

      if (user.length === 0) {
        // User not found, create a new one
        const newUser = await db.insert(users).values({ walletAddress }).returning({ id: users.id });
        userId = newUser[0].id;
      } else {
        userId = user[0].id;
      }

      // Operation 2: Insert the new NFT into the database
      const newNFT = await db.insert(nfts).values({
        name,
        description,
        imageUrl,
        ownerId: userId,
        contractAddress,
        tokenId,
      }).returning();

      // Operation 3: Return the created NFT
      return newNFT[0];
    }),
});

export type NFTInput = z.infer<typeof createNFTInput>;
