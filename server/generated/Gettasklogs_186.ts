// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTaskLogs
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from './db';
import { taskLogs } from './schema';

const t = initTRPC.create();

export const appRouter = t.router({
  getTaskLogs: t.procedure
    .input(z.object({
      taskId: z.string().min(1, "Task ID cannot be empty"),
    }))
    .query(async ({ input }) => {
      try {
        const logs = await db.select().from(taskLogs).where(eq(taskLogs.taskId, input.taskId));
        if (!logs || logs.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No logs found for task ID: ${input.taskId}`,
          });
        }
        return logs;
      } catch (error) {
        console.error("Error fetching task logs:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve task logs.',
          cause: error,
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
