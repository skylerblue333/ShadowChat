// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteTask
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { tasks } from '../schema';

export const taskRouter = router({
  deleteTask: publicProcedure
    .input(z.object({
      taskId: z.string().uuid('Invalid task ID format.').describe('The unique identifier of the task to be deleted.'),
    }))
    .mutation(async ({ input }) => {
      const { taskId } = input;

      try {
        // Step 1: Validate input (handled by Zod schema)

        // Step 2: Attempt to delete the task from the database
        const deletedTasks = await db.delete(tasks).where(eq(tasks.id, taskId)).returning({ id: tasks.id }); // Drizzle's returning() for affected rows

        // Step 3: Check if any task was actually deleted
        if (deletedTasks.length === 0) {
          throw new Error(`Task with ID ${taskId} not found or could not be deleted.`);
        }

        // Step 4: Return success response
        return { success: true, message: `Task with ID ${taskId} deleted successfully.` };
      } catch (error) {
        // Step 5: Handle and re-throw errors for tRPC client
        console.error('Error deleting task:', error);
        throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});