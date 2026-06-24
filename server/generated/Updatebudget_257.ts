// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateBudget
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { budgets } from '../db/schema';

const updateBudgetInput = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().optional(),
  userId: z.string().uuid(),
});

export const budgetRouter = router({
  updateBudget: publicProcedure
    .input(updateBudgetInput)
    .mutation(async ({ input }) => {
      try {
        const existingBudget = await db.select().from(budgets).where(eq(budgets.id, input.id)).limit(1);

        if (existingBudget.length === 0 || existingBudget[0].userId !== input.userId) {
          throw new Error('Budget not found or unauthorized');
        }

        const updatedBudgets = await db.update(budgets)
          .set({
            amount: input.amount,
            currency: input.currency,
            updatedAt: new Date(),
          })
          .where(eq(budgets.id, input.id))
          .returning();

        if (updatedBudgets.length === 0) {
          throw new Error('Failed to update budget');
        }

        return {
          success: true,
          budget: updatedBudgets[0],
          message: 'Budget updated successfully',
        };
      } catch (error: any) {
        console.error('Error updating budget:', error);
        throw new Error(`Failed to update budget: ${error.message}`);
      }
    }),
});