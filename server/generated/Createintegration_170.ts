// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createIntegration

import { z } from 'zod';
import { createIntegrationInputSchema } from './inputSchema';
import { publicProcedure, router } from './trpc'; // Adjust path as needed
import { db } from './db'; // Adjust path as needed
import { integrations } from './schema'; // Adjust path as needed

export const createIntegrationProcedure = publicProcedure
  .input(createIntegrationInputSchema)
  .mutation(async ({ input }: { input: z.infer<typeof createIntegrationInputSchema> }) => {
    try {
      const newIntegration = await db.insert(integrations).values({
        name: input.name,
        type: input.type,
        config: input.config || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      if (!newIntegration || newIntegration.length === 0) {
        throw new Error('Failed to create integration');
      }

      return { success: true, integration: newIntegration[0] };
    } catch (error) {
      console.error('Error creating integration:', error);
      throw new Error(`Could not create integration: ${(error as Error).message}`);
    }
  });

export const appRouter = router({
  createIntegration: createIntegrationProcedure,
});

export type AppRouter = typeof appRouter;
