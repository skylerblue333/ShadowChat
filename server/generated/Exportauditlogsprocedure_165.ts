// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: exportAuditLogsProcedure
import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { auditLogs } from "../db/schema";

export const exportAuditLogsProcedure = protectedProcedure
  .input(
    z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
  )
  .output(z.array(z.object({
    id: z.number(),
    timestamp: z.string().datetime(),
    userId: z.string(),
    action: z.string(),
    details: z.string().nullable(),
  })))
  .query(async ({ ctx, input }) => {
    try {
      const { startDate, endDate } = input;

      let whereClause = [];

      if (startDate) {
        whereClause.push(gte(auditLogs.timestamp, new Date(startDate)));
      }
      if (endDate) {
        whereClause.push(lte(auditLogs.timestamp, new Date(endDate)));
      }

      const logs = await ctx.db.query.auditLogs.findMany({
        where: whereClause.length > 0 ? and(...whereClause) : undefined,
        orderBy: [auditLogs.timestamp],
      });

      return logs.map(log => ({
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        userId: log.userId,
        action: log.action,
        details: log.details,
      }));
    } catch (error) {
      console.error("Failed to export audit logs:", error);
      throw new Error("Failed to export audit logs.");
    }
  });
