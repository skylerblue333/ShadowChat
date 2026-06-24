// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: syncIntegration

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM db instance
import { integrations } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const syncIntegrationProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    integrationId: z.string().uuid(),
    data: z.record(z.string(), z.any()), // Flexible data payload
  }))
  .mutation(async ({ input }) => {
    try {
      // 1. Validate input (handled by Zod schema)

      const { userId, integrationId, data } = input;

      // 2. Perform database operation: Upsert integration data
      const result = await db.insert(integrations)
        .values({
          id: integrationId,
          userId: userId,
          data: data,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: integrations.id,
          set: {
            data: data,
            updatedAt: new Date(),
          },
        })
        .returning();

      if (!result || result.length === 0) {
        throw new Error('Failed to sync integration data.');
      }

      // 3. Return success message or updated integration data
      return { success: true, message: 'Integration synced successfully.', integration: result[0] };
    } catch (error) {
      console.error('Error syncing integration:', error);
      // 4. Handle errors
      throw new Error(`Failed to sync integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

export const appRouter = router({
  syncIntegration: syncIntegrationProcedure,
});

export type AppRouter = typeof appRouter;
