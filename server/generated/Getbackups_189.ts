// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBackups
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming db instance is available
import { backups } from '../schema'; // Assuming a Drizzle schema for backups

export const getBackupsProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid().optional(), // Optional userId to filter backups
    limit: z.number().int().min(1).max(100).default(10),
    offset: z.number().int().min(0).default(0),
  }))
  .output(z.array(z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    backupName: z.string(),
    createdAt: z.date(),
    data: z.string().nullable(), // Assuming data is stored as a string (e.g., JSON stringified)
  })))
  .query(async ({ input }) => {
    try {
      let query = db.select().from(backups);

      if (input.userId) {
        query = query.where(eq(backups.userId, input.userId));
      }

      const result = await query.limit(input.limit).offset(input.offset);

      return result;
    } catch (error) {
      console.error('Error fetching backups:', error);
      throw new Error('Failed to retrieve backups.');
    }
  });

export const backupRouter = router({
  getBackups: getBackupsProcedure,
});
