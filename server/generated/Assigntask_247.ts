// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: assignTask

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../../db';
import { tasks, users } from '../../db/schema';

export const assignTaskProcedure = publicProcedure
  .input(z.object({
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    dueDate: z.string().datetime().optional(),
  }))
  .mutation(async ({ input }) => {
    const { taskId, userId, dueDate } = input;

    // 1. Validate if task and user exist
    const existingTask = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    if (existingTask.length === 0) {
      throw new Error('Task not found');
    }

    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      throw new Error('User not found');
    }

    // 2. Assign the task to the user
    try {
      await db.update(tasks)
        .set({
          assignedTo: userId,
          dueDate: dueDate ? new Date(dueDate) : null,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId));

      return { success: true, message: `Task ${taskId} assigned to user ${userId}` };
    } catch (error) {
      console.error('Error assigning task:', error);
      throw new Error('Failed to assign task');
    }
  });

export const assignTaskRouter = router({
  assignTask: assignTaskProcedure,
});
