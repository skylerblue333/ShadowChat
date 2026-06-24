// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBackupLogs
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle DB instance is in './db'
import { backupLogs } from './schema'; // Assuming Drizzle schema is in './schema'

const getBackupLogsInput = z.object({
  userId: z.string().uuid(),
  limit: z.number().int().positive().optional().default(10),
  offset: z.number().int().nonnegative().optional().default(0),
});

const getBackupLogsOutput = z.array(
  z.object({
    id: z.string().uuid(),
    timestamp: z.date(),
    logMessage: z.string(),
    userId: z.string().uuid(),
  })
);

export const backupLogsRouter = router({
  getBackupLogs: publicProcedure
    .input(getBackupLogsInput)
    .output(getBackupLogsOutput)
    .query(async ({ input }) => {
      try {
        const logs = await db.select()
          .from(backupLogs)
          .where(eq(backupLogs.userId, input.userId))
          .limit(input.limit)
          .offset(input.offset);

        if (!logs) {
          throw new Error('No backup logs found for this user.');
        }

        return logs;
      } catch (error) {
        console.error('Error fetching backup logs:', error);
        throw new Error('Failed to retrieve backup logs.');
      }
    }),
});