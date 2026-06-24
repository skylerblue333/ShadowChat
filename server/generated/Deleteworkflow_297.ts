// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteWorkflow
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { workflows } from '../db/schema';

export const workflowRouter = router({
  deleteWorkflow: publicProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid workflow ID format."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real application, you would typically check user authorization here.
        // For example, ensure ctx.user.id matches workflows.userId.
        // const userId = ctx.user?.id; // Assuming ctx.user exists and has an id

        const result = await db.delete(workflows)
          .where(eq(workflows.id, input.id))
          .returning({ id: workflows.id });

        if (result.length === 0) {
          // If no rows were deleted, it means the workflow didn't exist or wasn't accessible.
          throw new Error("Workflow not found or unauthorized to delete.");
        }

        return { success: true, deletedId: result[0].id };
      } catch (error) {
        console.error("Error deleting workflow:", error);
        // In a production environment, consider using tRPC's built-in error handling
        // or custom error classes for more granular error messages.
        throw new Error(`Failed to delete workflow: ${error.message}`);
      }
    }),
});