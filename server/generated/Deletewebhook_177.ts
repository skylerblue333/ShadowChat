// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteWebhook
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance

// Input schema for deleteWebhook procedure
export const deleteWebhookSchema = z.object({
  id: z.string().uuid("Invalid webhook ID format."),
});

// Output type for deleteWebhook procedure
interface DeleteWebhookResponse {
  success: boolean;
  message: string;
  deletedId?: string;
}

export const webhookRouter = router({
  deleteWebhook: publicProcedure
    .input(deleteWebhookSchema)
    .mutation(async ({ input }): Promise<DeleteWebhookResponse> => {
      const { id } = input;

      try {
        const deletedWebhooks = await db.delete(webhooks)
          .where(eq(webhooks.id, id))
          .returning({ id: webhooks.id });

        if (deletedWebhooks.length === 0) {
          return {
            success: false,
            message: `Webhook with ID ${id} not found.`,
          };
        }

        return {
          success: true,
          message: `Webhook with ID ${id} deleted successfully.`,
          deletedId: deletedWebhooks[0].id,
        };
      } catch (error) {
        console.error("Error deleting webhook:", error);
        return {
          success: false,
          message: "An unexpected error occurred while deleting the webhook.",
        };
      }
    }),
});

// Example usage (for demonstration, not part of the procedure itself)
// const caller = appRouter.createCaller({});
// const result = await caller.deleteWebhook({ id: 'some-uuid' });
