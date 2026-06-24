// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: trackBudgetSpending
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming your Drizzle DB instance
import { budgets, transactions } from '../schema'; // Assuming your Drizzle schema

export const budgetRouter = router({
  trackBudgetSpending: publicProcedure
    .input(
      z.object({
        budgetId: z.string().uuid(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ input }) => {
      const { budgetId, startDate, endDate } = input;

      // 1. Fetch budget details
      const budget = await db.query.budgets.findFirst({
        where: eq(budgets.id, budgetId),
      });

      if (!budget) {
        throw new Error('Budget not found');
      }

      // Determine the date range for transactions
      const effectiveStartDate = startDate ? new Date(startDate) : budget.startDate;
      const effectiveEndDate = endDate ? new Date(endDate) : budget.endDate;

      // 2. Aggregate spending for the budget within the specified date range
      const spendingResult = await db
        .select({ totalSpent: sum(transactions.amount) })
        .from(transactions)
        .where(
          and(
            eq(transactions.budgetId, budgetId),
            gte(transactions.date, effectiveStartDate),
            lte(transactions.date, effectiveEndDate)
          )
        );

      const spentAmount = parseFloat(spendingResult[0]?.totalSpent || '0');

      // 3. Calculate remaining amount
      const remainingAmount = budget.amount - spentAmount;

      // 4. Return structured spending data
      return {
        budgetName: budget.name,
        budgetAmount: budget.amount,
        spentAmount: spentAmount,
        remainingAmount: remainingAmount,
        startDate: effectiveStartDate.toISOString(),
        endDate: effectiveEndDate.toISOString(),
      };
    }),
});