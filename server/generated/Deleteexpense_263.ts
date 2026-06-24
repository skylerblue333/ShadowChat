// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteExpense
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc context setup
import { expenses } from '../db/schema'; // Assuming schema import

export const expenseRouter = router({
  deleteExpense: publicProcedure
    .input(z.object({
      id: z.number().int().positive(), // Validate that ID is a positive integer
    }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // 1. Database operation: Attempt to delete the expense by ID
        const deletedExpenses = await db.delete(expenses)
          .where(eq(expenses.id, id))
          .returning({ id: expenses.id });

        // 2. Validation/Error Handling: Check if any expense was actually deleted
        if (deletedExpenses.length === 0) {
          throw new Error(`Expense with ID ${id} not found or already deleted.`);
        }

        // 3. Return success message
        return { success: true, message: `Expense with ID ${id} deleted successfully.` };
      } catch (error: any) {
        // 4. Centralized error logging and re-throwing for tRPC client handling
        console.error('Failed to delete expense:', error);
        throw new Error(`Failed to delete expense: ${error.message || 'Unknown error'}`);
      }
    }),
});