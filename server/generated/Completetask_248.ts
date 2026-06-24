// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: completeTask
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db'; // Assuming your Drizzle DB instance
import { tasks, users } from '../schema'; // Assuming your Drizzle schema

const completeTaskInput = z.object({
  taskId: z.string().uuid(),
  userId: z.string().uuid(), // Assuming user ID for authorization/ownership check
});

export const skycoin4444Router = router({
  completeTask: publicProcedure
    .input(completeTaskInput)
    .mutation(async ({ input }) => {
      const { taskId, userId } = input;

      // 1. Validate task existence and ownership
      const existingTask = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

      if (!existingTask || existingTask.length === 0) {
        throw new Error('Task not found.');
      }

      const task = existingTask[0];

      // Basic authorization check (e.g., only owner can complete)
      if (task.assignedToId !== userId) {
        throw new Error('Unauthorized: You do not own this task.');
      }

      if (task.status === 'completed') {
        return { message: 'Task is already completed.', taskId: task.id };
      }

      // 2. Update task status in the database
      const [updatedTask] = await db.update(tasks)
        .set({
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error('Failed to complete task.');
      }

      // 3. Log the completion (optional, could be a separate service call)
      console.log(`Task ${taskId} completed by user ${userId}`);

      // 4. Return success response
      return {
        message: 'Task completed successfully.',
        taskId: updatedTask.id,
        status: updatedTask.status,
        completedAt: updatedTask.completedAt,
      };
    }),
});

// Example Drizzle Schema (for context, not part of the procedure code itself)
/*

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // e.g., 'pending', 'in-progress', 'completed'
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});
*/