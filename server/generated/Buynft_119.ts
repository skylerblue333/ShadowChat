// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: buyNFT
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle DB connection is in './db'
import { nfts, users, transactions } from './schema'; // Assuming Drizzle schema is in './schema'
import { randomUUID } from 'node:crypto';

export const nftRouter = router({
  buyNFT: publicProcedure
    .input(z.object({
      nftId: z.string().uuid(),
      buyerId: z.string().uuid(),
      price: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      const { nftId, buyerId, price } = input;

      return await db.transaction(async (tx) => {
        // 1. Check if NFT exists and is available
        const nft = await tx.query.nfts.findFirst({
          where: eq(nfts.id, nftId),
        });

        if (!nft) {
          throw new Error('NFT not found');
        }

        if (nft.ownerId === buyerId) {
          throw new Error('You already own this NFT');
        }

        if (nft.isSold) {
          throw new Error('NFT already sold');
        }

        // 2. Check buyer's balance
        const buyer = await tx.query.users.findFirst({
          where: eq(users.id, buyerId),
        });

        if (!buyer || buyer.balance < price) {
          throw new Error('Insufficient funds or buyer not found');
        }

        // 3. Update NFT ownership and status
        await tx.update(nfts)
          .set({ ownerId: buyerId, isSold: true })
          .where(eq(nfts.id, nftId));

        // 4. Deduct price from buyer's balance
        await tx.update(users)
          .set({ balance: buyer.balance - price })
          .where(eq(users.id, buyerId));

        // 5. Record transaction
        await tx.insert(transactions).values({
          id: randomUUID(),
          nftId,
          buyerId,
          sellerId: nft.ownerId, // The previous owner is the seller
          price,
          transactionDate: new Date(),
        });

        return { success: true, message: 'NFT purchased successfully' };
      });
    }),
});