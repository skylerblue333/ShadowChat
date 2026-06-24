// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateWebhook
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup in ./trpc
import { db } from './db'; // Assuming Drizzle DB setup in ./db
import { webhooks } from './schema'; // Assuming Drizzle schema for webhooks in ./schema

const updateWebhookInput = z.object({
  id: z.string().uuid(),
  url: z.string().url().optional(),
  event: z.string().optional(),
  secret: z.string().optional(),
  active: z.boolean().optional(),
});

export const webhookRouter = router({
  updateWebhook: publicProcedure
    .input(updateWebhookInput)
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod schema)

        // 2. Check if webhook exists
        const existingWebhook = await db.select().from(webhooks).where(eq(webhooks.id, input.id)).limit(1);
        if (existingWebhook.length === 0) {
          throw new Error('Webhook not found.');
        }

        // 3. Prepare update data
        const updateData: Record<string, any> = {};
        if (input.url) updateData.url = input.url;
        if (input.event) updateData.event = input.event;
        if (input.secret) updateData.secret = input.secret;
        if (input.active !== undefined) updateData.active = input.active;

        if (Object.keys(updateData).length === 0) {
          return { success: true, message: 'No updates provided.', webhook: existingWebhook[0] };
        }

        // 4. Perform update operation
        const [updatedWebhook] = await db.update(webhooks)
          .set(updateData)
          .where(eq(webhooks.id, input.id))
          .returning();

        if (!updatedWebhook) {
          throw new Error('Failed to update webhook.');
        }

        // 5. Return updated webhook
        return { success: true, message: 'Webhook updated successfully.', webhook: updatedWebhook };
      } catch (error: any) {
        // 6. Handle errors
        throw new Error(`Failed to update webhook: ${error.message}`);
      }
    }),
});
