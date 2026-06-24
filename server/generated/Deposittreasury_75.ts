// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: depositTreasury
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { treasury, transactions } from '../schema'; // Drizzle schema

const depositTreasuryInput = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

export const treasuryRouter = router({
  depositTreasury: publicProcedure
    .input(depositTreasuryInput)
    .mutation(async ({ input }) => {
      const { amount, description } = input;

      try {
        const result = await db.transaction(async (tx) => {
          // 1. Fetch current treasury balance
          const currentTreasury = await tx.select().from(treasury).where(eq(treasury.currency, 'SKYCOIN4444')).limit(1);
          let currentBalance = parseFloat(currentTreasury[0]?.balance || '0');

          // If no treasury entry exists, create one
          if (currentTreasury.length === 0) {
            await tx.insert(treasury).values({
              currency: 'SKYCOIN4444',
              balance: amount.toString(),
            });
            currentBalance = amount; // Set balance to initial deposit
          } else {
            // 2. Update treasury balance
            const newBalance = currentBalance + amount;
            await tx.update(treasury)
              .set({ balance: newBalance.toString() })
              .where(eq(treasury.currency, 'SKYCOIN4444'));
            currentBalance = newBalance;
          }

          // 3. Log the transaction
          await tx.insert(transactions).values({
            type: 'deposit',
            amount: amount.toString(),
            currency: 'SKYCOIN4444',
            description: description || 'Treasury deposit',
          });

          return { success: true, newBalance: currentBalance, message: 'Treasury deposit successful' };
        });
        return result;
      } catch (error) {
        console.error('Failed to deposit to treasury:', error);
        throw new Error('Failed to deposit to treasury. Please try again.');
      }
    }),
});
