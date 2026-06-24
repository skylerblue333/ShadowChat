// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getWorkflowHistory
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup in './trpc'
import { db } from './db'; // Assuming Drizzle DB connection in './db'
import { workflowHistory } from './schema'; // Assuming Drizzle schema in './schema'

export const workflowRouter = router({
  getWorkflowHistory: publicProcedure
    .input(z.object({
      workflowId: z.string().uuid('Invalid workflow ID format').nonempty('Workflow ID cannot be empty'),
    }))
    .query(async ({ input }) => {
      try {
        const history = await db.select().from(workflowHistory).where(eq(workflowHistory.workflowId, input.workflowId)).execute();

        if (!history || history.length === 0) {
          throw new Error('Workflow history not found for the given ID.');
        }

        return history;
      } catch (error) {
        console.error('Error fetching workflow history:', error);
        throw new Error(`Failed to retrieve workflow history: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});