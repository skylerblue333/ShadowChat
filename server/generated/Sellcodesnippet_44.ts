// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: sellCodeSnippet

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle DB instance is in './db'
import { codeSnippets, users, transactions } from './schema'; // Assuming Drizzle schema is in './schema'

export const sellCodeSnippetProcedure = publicProcedure
  .input(z.object({
    snippetId: z.string().uuid(),
    sellerId: z.string().uuid(),
    buyerId: z.string().uuid(),
    price: z.number().positive(),
  }))
  .mutation(async ({ input }) => {
    const { snippetId, sellerId, buyerId, price } = input;

    // 1. Validate seller owns the snippet
    const snippet = await db.select().from(codeSnippets).where(and(eq(codeSnippets.id, snippetId), eq(codeSnippets.ownerId, sellerId))).limit(1);

    if (!snippet || snippet.length === 0) {
      throw new Error('Code snippet not found or seller does not own it.');
    }

    // 2. Check if buyer has enough funds (simplified for example)
    const buyer = await db.select().from(users).where(eq(users.id, buyerId)).limit(1);

    if (!buyer || buyer.length === 0) {
      throw new Error('Buyer not found.');
    }

    if (buyer[0].balance < price) {
      throw new Error('Buyer has insufficient funds.');
    }

    // 3. Perform transaction: update snippet owner, update balances, record transaction
    await db.transaction(async (tx) => {
      // Update snippet owner
      await tx.update(codeSnippets).set({ ownerId: buyerId }).where(eq(codeSnippets.id, snippetId));

      // Deduct from buyer and add to seller
      await tx.update(users).set({ balance: buyer[0].balance - price }).where(eq(users.id, buyerId));
      await tx.update(users).set({ balance: seller[0].balance + price }).where(eq(users.id, sellerId)); // Assuming seller balance is also available

      // Record transaction
      await tx.insert(transactions).values({
        id: Math.random().toString(), // Placeholder for UUID generation
        snippetId,
        sellerId,
        buyerId,
        amount: price,
        timestamp: new Date(),
      });
    });

    return { success: true, message: 'Code snippet sold successfully.' };
  });

export const appRouter = router({
  sellCodeSnippet: sellCodeSnippetProcedure,
});

export type AppRouter = typeof appRouter;
