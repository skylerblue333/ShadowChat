// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getWebhookLogs
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { webhookLogs } from '../schema';

export const webhookLogsRouter = router({
  getWebhookLogs: publicProcedure
    .input(
      z.object({
        webhookId: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const { webhookId, limit, offset } = input;

      try {
        let query = db.select().from(webhookLogs).$dynamic();

        if (webhookId) {
          query = query.where(eq(webhookLogs.webhookId, webhookId));
        }

        const logs = await query.limit(limit).offset(offset);

        const totalCountResult = await db
          .select({
            count: sql<number>`count(*)`
          })
          .from(webhookLogs)
          .where(webhookId ? eq(webhookLogs.webhookId, webhookId) : undefined);

        const totalCount = totalCountResult[0]?.count || 0;

        return {
          logs,
          totalCount,
          limit,
          offset,
        };
      } catch (error) {
        console.error('Failed to fetch webhook logs:', error);
        throw new Error('Failed to retrieve webhook logs. Please try again later.');
      }
    }),
});
