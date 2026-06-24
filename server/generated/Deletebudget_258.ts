// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteBudget
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines publicProcedure and router
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { budgets } from './schema'; // Assuming schema.ts defines your budgets table schema

export const budgetRouter = router({
  deleteBudget: publicProcedure
    .input(z.object({
      id: z.string().uuid('Invalid budget ID format. Must be a UUID.'),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // Check if the budget exists before attempting to delete
        const existingBudget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);

        if (existingBudget.length === 0) {
          throw new Error('Budget not found.');
        }

        // Perform the deletion
        const result = await db.delete(budgets).where(eq(budgets.id, id));

        if (result.rowCount === 0) {
          throw new Error('Failed to delete budget.');
        }

        return { success: true, message: `Budget with ID ${id} deleted successfully.` };
      } catch (error) {
        console.error('Error deleting budget:', error);
        throw new Error(`Failed to delete budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
