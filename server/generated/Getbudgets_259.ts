// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBudgets
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod'; // For input validation
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { budgets } from './schema'; // Assuming schema.ts defines your Drizzle schema for budgets

export const budgetRouter = router({
  getBudgets: publicProcedure
    .input(z.object({
      userId: z.string().uuid('Invalid user ID format').optional(),
      budgetId: z.string().uuid('Invalid budget ID format').optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = db.select().from(budgets);

        if (input.userId) {
          query = query.where(eq(budgets.userId, input.userId));
        }

        if (input.budgetId) {
          query = query.where(eq(budgets.id, input.budgetId));
        }

        const result = await query;

        if (!result || result.length === 0) {
          // Consider throwing a specific tRPC error if no budgets are found
          // For now, returning an empty array or a specific message
          return { success: true, budgets: [] };
        }

        return { success: true, budgets: result };
      } catch (error) {
        console.error('Error fetching budgets:', error);
        // In a real application, you might want to throw a tRPC error here
        // throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch budgets' });
        return { success: false, message: 'Failed to fetch budgets' };
      }
    }),
});