// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getWebhooks
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { webhooks } from '../schema';

export const webhookRouter = router({
  getWebhooks: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const { userId } = input;

        const userWebhooks = await db.select().from(webhooks).where(eq(webhooks.userId, userId));

        if (!userWebhooks || userWebhooks.length === 0) {
          return { success: true, message: 'No webhooks found for this user.', data: [] };
        }

        return { success: true, message: 'Webhooks retrieved successfully.', data: userWebhooks };
      } catch (error) {
        console.error('Error fetching webhooks:', error);
        return { success: false, message: 'Failed to retrieve webhooks.', error: (error as Error).message };
      }
    }),
});