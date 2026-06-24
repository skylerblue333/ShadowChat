// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createWebhook
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { webhooks } from '../db/schema'; // Assuming Drizzle schema for webhooks table

const createWebhookInput = z.object({
  url: z.string().url("Invalid URL format"),
  event: z.string().min(1, "Event cannot be empty"),
  // Potentially add a userId or other identifying fields
});

export const webhookRouter = router({
  createWebhook: publicProcedure
    .input(createWebhookInput)
    .mutation(async ({ input }) => {
      try {
        // 1. Input validation is handled by Zod schema automatically

        // 2. Insert the new webhook into the database using Drizzle ORM
        const [newWebhook] = await db.insert(webhooks).values({
          url: input.url,
          event: input.event,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning(); // Drizzle returns the inserted row

        // 3. Check if the insertion was successful and data was returned
        if (!newWebhook) {
          throw new Error("Failed to create webhook: No data returned from database.");
        }

        // 4. Return the newly created webhook details
        return {
          success: true,
          message: "Webhook created successfully",
          webhook: newWebhook,
        };
      } catch (error: any) {
        console.error("Error creating webhook:", error);
        // 5. Handle and re-throw the error for tRPC client
        throw new Error(`Failed to create webhook: ${error.message || "An unknown error occurred"}`);
      }
    }),
});