// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: rotateAPIKey

import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod'; // For input validation
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { apiKeys, apiKeysRotationLogs } from './schema'; // Assuming schema.ts defines your Drizzle schema for apiKeys

// Helper function to generate a new API key (replace with a more robust method in production)
const generateNewApiKey = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const apiKeyRouter = router({
  rotateAPIKey: publicProcedure
    .input(z.object({
      userId: z.string().uuid(), // Validate userId as a UUID
      oldApiKey: z.string().min(1), // Validate oldApiKey is a non-empty string
    }))
    .mutation(async ({ input }) => {
      const { userId, oldApiKey } = input;

      // 1. Verify the old API key belongs to the user
      const existingKey = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).limit(1);

      if (!existingKey || existingKey[0].key !== oldApiKey) {
        throw new Error('Invalid userId or old API key.');
      }

      // 2. Generate a new API key
      const newApiKey = generateNewApiKey();

      // 3. Update the API key in the database
      await db.update(apiKeys)
        .set({ key: newApiKey, updatedAt: new Date() })
        .where(eq(apiKeys.userId, userId));

      // 4. Log the API key rotation event (additional database operation)
      await db.insert(apiKeysRotationLogs).values({ userId, oldApiKey, newApiKey, rotatedAt: new Date() });

      // 5. Return the new API key
      return { success: true, newApiKey };
    }),
});

export type ApiKeyRouter = typeof apiKeyRouter;
