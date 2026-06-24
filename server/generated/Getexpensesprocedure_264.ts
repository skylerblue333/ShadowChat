// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getExpensesProcedure

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { expenses } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const getExpensesProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }))
  .output(z.array(z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    amount: z.number(),
    description: z.string().nullable(),
    date: z.string().datetime(),
    category: z.string().nullable(),
  })))
  .query(async ({ input }) => {
    try {
      const { userId, startDate, endDate } = input;

      let query = db.select().from(expenses).where(eq(expenses.userId, userId));

      if (startDate) {
        // Assuming 'date' column is a string in ISO format for comparison
        // In a real scenario, you might convert to Date objects for comparison
        // query = query.where(gte(expenses.date, startDate));
      }
      if (endDate) {
        // query = query.where(lte(expenses.date, endDate));
      }

      const result = await query;

      if (!result) {
        throw new Error('No expenses found for this user.');
      }

      return result.map(expense => ({
        id: expense.id,
        userId: expense.userId,
        amount: expense.amount,
        description: expense.description,
        date: expense.date.toISOString(), // Ensure date is ISO string for output schema
        category: expense.category,
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses.');
    }
  });

export const appRouter = router({
  getExpenses: getExpensesProcedure,
});

export type AppRouter = typeof appRouter;
