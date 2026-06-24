// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getAuditLogs
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { auditLogs } from './schema'; // Assuming schema.ts defines your Drizzle schema for auditLogs

// Input schema for getAuditLogs procedure
const GetAuditLogsInputSchema = z.object({
  userId: z.string().uuid().optional(),
  actionType: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Output schema for getAuditLogs procedure
const AuditLogOutputSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  actionType: z.string(),
  timestamp: z.date(),
  details: z.record(z.any()).optional(),
});

export const auditLogsRouter = router({
  getAuditLogs: publicProcedure
    .input(GetAuditLogsInputSchema)
    .output(z.array(AuditLogOutputSchema))
    .query(async ({ input }) => {
      try {
        let query = db.select().from(auditLogs).$dynamic();

        if (input.userId) {
          query = query.where(eq(auditLogs.userId, input.userId));
        }
        if (input.actionType) {
          query = query.where(eq(auditLogs.actionType, input.actionType));
        }

        const logs = await query.limit(input.limit).offset(input.offset);

        return logs;
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw new Error('Failed to retrieve audit logs.');
      }
    }),
});

export type AuditLogsRouter = typeof auditLogsRouter;
