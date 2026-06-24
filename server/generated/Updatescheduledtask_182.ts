// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateScheduledTask
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { scheduledTasks } from './schema';

export const updateScheduledTaskProcedure = publicProcedure
  .input(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    cronSchedule: z.string().optional(),
    enabled: z.boolean().optional(),
  }))
  .mutation(async ({ input }) => {
    const { id, ...updateData } = input;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No update data provided.');
    }

    try {
      const result = await db.update(scheduledTasks)
        .set(updateData)
        .where(eq(scheduledTasks.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Scheduled task with ID ${id} not found.`);
      }

      return result[0];
    } catch (error) {
      console.error('Error updating scheduled task:', error);
      throw new Error('Failed to update scheduled task.');
    }
  });

export const appRouter = router({
  updateScheduledTask: updateScheduledTaskProcedure,
});

export type AppRouter = typeof appRouter;
