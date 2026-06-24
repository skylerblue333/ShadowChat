// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTaskHistory
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { taskHistory } from './taskHistorySchema';

export const taskHistoryRouter = router({
  getTaskHistory: publicProcedure
    .input(z.object({
      taskId: z.string().uuid('Invalid task ID format'),
    }))
    .output(z.array(z.object({
      id: z.number(),
      taskId: z.string().uuid(),
      action: z.string(),
      timestamp: z.date(),
      details: z.string().nullable(),
    })))
    .query(async ({ input }) => {
      try {
        const history = await db
          .select()
          .from(taskHistory)
          .where(eq(taskHistory.taskId, input.taskId));

        if (!history || history.length === 0) {
          return [];
        }

        return history;
      } catch (error) {
        console.error('Error fetching task history:', error);
        throw new Error('Failed to retrieve task history.');
      }
    }),
});