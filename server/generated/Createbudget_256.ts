// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createBudget
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup

const createBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name cannot be empty'),
  amount: z.number().positive('Amount must be a positive number'),
  startDate: z.string().datetime('Start date must be a valid date string'),
  endDate: z.string().datetime('End date must be a valid date string').optional(),
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export const budgetRouter = router({
  createBudget: publicProcedure
    .input(createBudgetSchema)
    .mutation(async ({ input }) => {
      try {
        const newBudget = await db.insert(budgets).values({
          name: input.name,
          amount: input.amount.toString(), // Drizzle numeric type often expects string
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          userId: input.userId,
        }).returning();

        if (!newBudget || newBudget.length === 0) {
          throw new Error('Failed to create budget.');
        }

        return {
          success: true,
          budget: newBudget[0],
          message: 'Budget created successfully.',
        };
      } catch (error) {
        console.error('Error creating budget:', error);
        throw new Error(`Failed to create budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});