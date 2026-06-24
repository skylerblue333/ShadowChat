// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getPortfolio

import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { users, accounts, transactions } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const portfolioRouter = router({
  getPortfolio: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        // 1. Validate user existence
        const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
        if (!user || user.length === 0) {
          throw new Error('User not found');
        }

        // 2. Fetch accounts for the user
        const userAccounts = await db.select().from(accounts).where(eq(accounts.userId, input.userId));

        if (userAccounts.length === 0) {
          return { userId: input.userId, totalBalance: 0, accounts: [] };
        }

        // 3. Calculate total balance and transactions for each account
        let totalPortfolioBalance = 0;
        const accountsWithDetails = await Promise.all(userAccounts.map(async (account) => {
          const accountTransactions = await db.select().from(transactions).where(eq(transactions.accountId, account.id));

          const balanceResult = await db.select({ total: sum(transactions.amount) })
                                        .from(transactions)
                                        .where(eq(transactions.accountId, account.id));
          const currentBalance = balanceResult[0]?.total ? parseFloat(balanceResult[0].total) : 0;
          totalPortfolioBalance += currentBalance;

          return {
            ...account,
            currentBalance,
            transactions: accountTransactions,
          };
        }));

        return {
          userId: input.userId,
          totalBalance: totalPortfolioBalance,
          accounts: accountsWithDetails,
        };
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw new Error('Failed to retrieve portfolio');
      }
    }),
});
