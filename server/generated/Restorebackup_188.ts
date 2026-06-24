// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: restoreBackup
import { publicProcedure, router } from "../trpc";
import { BackupService } from "../services/backup.service";
import { z } from "zod";

export const backupRouter = router({
  restoreBackup: publicProcedure
    .input(z.object({
      backupId: z.string().min(1, "Backup ID is required."),
    }))
    .mutation(async ({ input }) => {
      const backupService = new BackupService();
      return await backupService.restoreBackup(input.backupId);
    }),
});