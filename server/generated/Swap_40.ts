// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: swap
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { accounts, transactions } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const swapRouter = router({
  swap: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
      fromCurrency: z.string().min(3).max(3), // e.g., 'BTC', 'ETH'
      toCurrency: z.string().min(3).max(3),
      amount: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      const { userId, fromCurrency, toCurrency, amount } = input;

      // 1. Validate input currencies and amount (already done by Zod)

      // 2. Fetch user accounts for both currencies
      const fromAccount = await db.select().from(accounts).where(eq(accounts.userId, userId) && eq(accounts.currency, fromCurrency)).limit(1);
      const toAccount = await db.select().from(accounts).where(eq(accounts.userId, userId) && eq(accounts.currency, toCurrency)).limit(1);

      if (!fromAccount[0] || fromAccount[0].balance < amount) {
        throw new Error(`Insufficient balance in ${fromCurrency} account.`);
      }
      if (!toAccount[0]) {
        // Create toAccount if it doesn't exist
        await db.insert(accounts).values({ userId, currency: toCurrency, balance: 0 });
        // Re-fetch toAccount after creation
        const newToAccount = await db.select().from(accounts).where(eq(accounts.userId, userId) && eq(accounts.currency, toCurrency)).limit(1);
        if (!newToAccount[0]) {
          throw new Error(`Failed to create ${toCurrency} account.`);
        }
        toAccount[0] = newToAccount[0];
      }

      // 3. Simulate exchange rate (for demonstration purposes)
      const exchangeRate = 1.5; // 1 unit of fromCurrency = 1.5 units of toCurrency
      const receivedAmount = amount * exchangeRate;

      // 4. Perform the swap within a transaction
      await db.transaction(async (tx) => {
        // Deduct from fromAccount
        await tx.update(accounts)
          .set({ balance: fromAccount[0].balance - amount })
          .where(eq(accounts.id, fromAccount[0].id));

        // Add to toAccount
        await tx.update(accounts)
          .set({ balance: toAccount[0].balance + receivedAmount })
          .where(eq(accounts.id, toAccount[0].id));

        // Record the transaction
        await tx.insert(transactions).values({
          userId,
          fromAccountId: fromAccount[0].id,
          toAccountId: toAccount[0].id,
          fromAmount: amount,
          toAmount: receivedAmount,
          transactionType: 'swap',
          status: 'completed',
        });
      });

      return { success: true, message: 'Swap completed successfully.' };
    }),
});
