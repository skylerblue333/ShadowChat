// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteBackup
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { backups } from '../schema';
import { TRPCError } from '@trpc/server';

export const backupRouter = router({
  deleteBackup: publicProcedure
    .input(z.object({
      backupId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { backupId } = input;

      // Check if the backup exists before attempting deletion
      const existingBackup = await db.select().from(backups).where(eq(backups.id, backupId)).limit(1);
      if (existingBackup.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Backup not found.',
        });
      }

      // Perform the deletion
      const deletedBackups = await db.delete(backups).where(eq(backups.id, backupId)).returning({ id: backups.id });

      if (deletedBackups.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete backup.',
        });
      }

      return { success: true, deletedId: deletedBackups[0].id, message: 'Backup deleted successfully.' };
    }),
});