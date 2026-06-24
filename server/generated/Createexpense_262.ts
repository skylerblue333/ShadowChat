// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createExpense
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { expenses } from '../schema';

export const expenseRouter = router({
  createExpense: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      amount: z.number().positive('Amount must be positive'),
      date: z.string().datetime('Invalid date format'),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const newExpense = await db.insert(expenses).values({
          name: input.name,
          amount: input.amount,
          date: new Date(input.date),
          description: input.description,
        }).returning();

        if (!newExpense || newExpense.length === 0) {
          throw new Error('Failed to create expense');
        }

        return { success: true, expense: newExpense[0] };
      } catch (error) {
        console.error('Error creating expense:', error);
        throw new Error('Could not create expense. Please try again.');
      }
    }),
});