// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: categorizeExpense

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { expenses, categories } from '../schema'; // Adjust path as needed
import { TRPCError } from '@trpc/server';

export const expenseRouter = router({
  categorizeExpense: publicProcedure
    .input(
      z.object({
        expenseId: z.string().uuid('Invalid expense ID format.'),
        categoryId: z.string().uuid('Invalid category ID format.'),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { expenseId, categoryId } = input;

      // 1. Validate and fetch expense
      const existingExpense = await db.query.expenses.findFirst({
        where: eq(expenses.id, expenseId),
      });

      if (!existingExpense) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Expense with ID ${expenseId} not found.`,
        });
      }

      // 2. Validate and fetch category
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Category with ID ${categoryId} not found.`,
        });
      }

      // 3. Update expense with new category
      try {
        await db
          .update(expenses)
          .set({ categoryId: categoryId, updatedAt: new Date() })
          .where(eq(expenses.id, expenseId));

        return {
          success: true,
          message: `Expense ${expenseId} successfully categorized under ${existingCategory.name}.`,
        };
      } catch (error) {
        console.error('Failed to categorize expense:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to categorize expense due to a database error.',
        });
      }
    }),
});
