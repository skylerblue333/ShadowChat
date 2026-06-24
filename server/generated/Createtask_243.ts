// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createTask
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { tasks } from './schema'; // Assuming schema.ts defines your Drizzle schema

const createTaskInput = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
});

export const taskRouter = router({
  createTask: publicProcedure
    .input(createTaskInput)
    .mutation(async ({ input }) => {
      try {
        const [newTask] = await db.insert(tasks).values({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          status: input.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTask) {
          throw new Error('Failed to create task');
        }

        return { success: true, task: newTask };
      } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Could not create task');
      }
    }),
});

export type TaskRouter = typeof taskRouter;
