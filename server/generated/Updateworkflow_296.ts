// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateWorkflow
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { workflows } from './schema';

// Input schema for updateWorkflow
const updateWorkflowInput = z.object({
  id: z.string().uuid('Invalid workflow ID format. Must be a UUID.'),
  name: z.string().min(1, 'Workflow name cannot be empty.').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft'], { message: 'Invalid status. Must be active, inactive, or draft.' }).optional(),
  // Add other fields that can be updated as needed
});

export const workflowRouter = router({
  updateWorkflow: publicProcedure
    .input(updateWorkflowInput)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        if (Object.keys(updateData).length === 0) {
          return { success: false, message: 'No update data provided.' };
        }

        const result = await db.update(workflows)
          .set(updateData)
          .where(eq(workflows.id, id))
          .returning({ id: workflows.id });

        if (result.length === 0) {
          return { success: false, message: `Workflow with ID ${id} not found.` };
        }

        return { success: true, workflowId: result[0].id, message: 'Workflow updated successfully.' };
      } catch (error) {
        console.error('Error updating workflow:', error);
        if (error instanceof z.ZodError) {
          return { success: false, message: `Validation error: ${error.errors.map(e => e.message).join(', ')}` };
        }
        return { success: false, message: 'An unexpected error occurred during workflow update.' };
      }
    }),
});
