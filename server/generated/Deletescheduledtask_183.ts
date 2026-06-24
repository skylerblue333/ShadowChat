// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteScheduledTask

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { scheduledTasks } from '../db/schema'; // Adjust path as needed

const deleteScheduledTaskInput = z.object({
  taskId: z.string().uuid({ message: "Invalid task ID format." }),
});

const deleteScheduledTaskOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  deletedTaskId: z.string().uuid().optional(),
});

export const scheduledTaskRouter = router({
  deleteScheduledTask: publicProcedure
    .input(deleteScheduledTaskInput)
    .output(deleteScheduledTaskOutput)
    .mutation(async ({ input }) => {
      try {
        const { taskId } = input;

        // 1. Database operation: Delete the task
        const result = await db.delete(scheduledTasks)
          .where(eq(scheduledTasks.id, taskId))
          .returning({ id: scheduledTasks.id });

        // 2. Check if any task was actually deleted
        if (result.length === 0) {
          return {
            success: false,
            message: `Scheduled task with ID ${taskId} not found.`,
          };
        }

        // 3. Return success response
        return {
          success: true,
          message: `Scheduled task with ID ${taskId} deleted successfully.`,
          deletedTaskId: result[0].id,
        };
      } catch (error) {
        // 4. Handle database or unexpected errors
        console.error("Error deleting scheduled task:", error);
        return {
          success: false,
          message: "Failed to delete scheduled task due to an internal server error.",
        };
      }
    }),
});
