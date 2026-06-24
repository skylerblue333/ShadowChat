// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTasks
import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { tasks } from './schema';

export const taskRouter = router({
  getTasks: publicProcedure
    .input(z.object({
      completed: z.boolean().optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      try {
        const { db } = ctx;
        const { completed, limit, offset } = input || {};

        let query = db.select().from(tasks);

        if (completed !== undefined) {
          query = query.where(eq(tasks.completed, completed));
        }

        if (limit !== undefined) {
          query = query.limit(limit);
        }

        if (offset !== undefined) {
          query = query.offset(offset);
        }

        const result = await query;

        return result;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks.");
      }
    }),
});