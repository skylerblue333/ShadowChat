// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createScheduledTask
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { scheduledTasks } from '../db/schema'; // Adjust path as needed, assuming a schema file

const createScheduledTaskInput = z.object({
  name: z.string().min(1, 'Task name cannot be empty'),
  description: z.string().optional(),
  schedule: z.string().min(1, 'Schedule cannot be empty'), // e.g., cron string
  payload: z.record(z.any()).optional(), // JSON payload for the task
  isActive: z.boolean().default(true),
});

export const scheduledTaskRouter = router({
  createScheduledTask: publicProcedure
    .input(createScheduledTaskInput)
    .mutation(async ({ input }) => {
      try {
        const [newTask] = await db.insert(scheduledTasks).values({
          name: input.name,
          description: input.description,
          schedule: input.schedule,
          payload: input.payload,
          isActive: input.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTask) {
          throw new Error('Failed to create scheduled task.');
        }

        return { success: true, task: newTask };
      } catch (error) {
        console.error('Error creating scheduled task:', error);
        throw new Error('Could not create scheduled task.');
      }
    }),
});
