// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: scheduleBackup
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db instance is available
import { backups } from './schema'; // Assuming a Drizzle schema for backups

export const appRouter = router({
  scheduleBackup: publicProcedure
    .input(z.object({
      userId: z.string(),
      backupType: z.enum(['full', 'incremental']),
      schedule: z.string().datetime(),
    }))
    .mutation(async ({ input }) => {
      try {
        const newBackup = await db.insert(backups).values({
          userId: input.userId,
          backupType: input.backupType,
          schedule: new Date(input.schedule),
          status: 'scheduled',
          createdAt: new Date(),
        }).returning();

        return { success: true, backup: newBackup[0] };
      } catch (error) {
        console.error('Error scheduling backup:', error);
        throw new Error('Failed to schedule backup');
      }
    }),
});

export type AppRouter = typeof appRouter;