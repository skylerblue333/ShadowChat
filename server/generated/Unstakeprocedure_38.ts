// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: unstakeProcedure
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { staking, users } from './schema'; // Assuming you have these Drizzle schemas

export const unstakeProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      amount: z.number().positive(),
    })
  )
  .mutation(async ({ input }) => {
    const { userId, amount } = input;

    // 1. Validate user and staking record
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || user.length === 0) {
      throw new Error('User not found.');
    }

    const stakingRecord = await db.select().from(staking).where(eq(staking.userId, userId)).limit(1);
    if (!stakingRecord || stakingRecord.length === 0) {
      throw new Error('Staking record not found for this user.');
    }

    const currentStakedAmount = stakingRecord[0].amount;

    // 2. Check if unstake amount is valid
    if (amount > currentStakedAmount) {
      throw new Error('Unstake amount exceeds current staked amount.');
    }

    // 3. Perform unstake operation (update staking record and user balance)
    const newStakedAmount = currentStakedAmount - amount;

    await db.update(staking)
      .set({ amount: newStakedAmount })
      .where(eq(staking.userId, userId));

    // Assuming a 'balance' field in the users table to return funds
    await db.update(users)
      .set({ balance: user[0].balance + amount })
      .where(eq(users.id, userId));

    return { success: true, message: `Successfully unstaked ${amount} for user ${userId}. New staked amount: ${newStakedAmount}` };
  });

export const appRouter = router({
  unstake: unstakeProcedure,
});

export type AppRouter = typeof appRouter;
