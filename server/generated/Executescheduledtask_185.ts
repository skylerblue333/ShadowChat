// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: executeScheduledTask
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle client

export const scheduledTaskRouter = router({
  executeScheduledTask: publicProcedure
    .input(z.object({
      id: z.number().int().positive(),
    }))
    .mutation(async ({ input }) => {
      const { id } = input;

      // 1. Find the task
      const task = await db.select().from(scheduledTasks).where(eq(scheduledTasks.id, id)).limit(1);

      if (!task || task.length === 0) {
        throw new Error('Scheduled task not found');
      }

      const existingTask = task[0];

      if (existingTask.executed) {
        throw new Error('Scheduled task already executed');
      }

      // 2. Execute the task (update its status)
      const updatedTask = await db.update(scheduledTasks)
        .set({
          executed: true,
          updatedAt: new Date(),
        })
        .where(eq(scheduledTasks.id, id))
        .returning();

      if (!updatedTask || updatedTask.length === 0) {
        throw new Error('Failed to update scheduled task status');
      }

      // 3. Return the updated task
      return { success: true, task: updatedTask[0] };
    }),
});
