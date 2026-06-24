// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateAPIKey
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines publicProcedure and router
import { db } from './db'; // Assuming db.ts exports the Drizzle database instance
import { apiKeys } from './schema'; // Assuming schema.ts defines the apiKeys table

// Define the input schema for updating an API key
const updateAPIKeyInput = z.object({
  apiKeyId: z.string().uuid(), // Assuming API key IDs are UUIDs
  newKeyValue: z.string().min(32).max(64), // Example: API key value length
});

export const apiKeyRouter = router({
  updateAPIKey: publicProcedure
    .input(updateAPIKeyInput)
    .mutation(async ({ input }) => {
      try {
        const { apiKeyId, newKeyValue } = input;

        // Check if the API key exists before attempting to update
        const existingKey = await db.select().from(apiKeys).where(eq(apiKeys.id, apiKeyId)).limit(1);

        if (existingKey.length === 0) {
          throw new Error('API Key not found.');
        }

        // Update the API key in the database
        const result = await db.update(apiKeys)
          .set({ keyValue: newKeyValue, updatedAt: new Date() })
          .where(eq(apiKeys.id, apiKeyId))
          .returning({ id: apiKeys.id });

        if (result.length === 0) {
          throw new Error('Failed to update API Key.');
        }

        return { success: true, message: 'API Key updated successfully.', updatedApiKeyId: result[0].id };
      } catch (error) {
        console.error('Error updating API Key:', error);
        throw new Error(`Failed to update API Key: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});