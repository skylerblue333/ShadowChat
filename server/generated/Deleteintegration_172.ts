// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteIntegration
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc.ts defines these
import { db } from '../db'; // Assuming db.ts exports the Drizzle client
import { integrations } from '../db/schema'; // Assuming schema.ts defines the integrations table

const deleteIntegrationInput = z.object({
  id: z.string().uuid(), // Assuming integration IDs are UUIDs
});

export const integrationRouter = router({
  deleteIntegration: publicProcedure
    .input(deleteIntegrationInput)
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // 1. Check if integration exists (optional, but good for specific error messages)
        const existingIntegration = await db.select().from(integrations).where(eq(integrations.id, id)).limit(1);

        if (existingIntegration.length === 0) {
          throw new Error('Integration not found.');
        }

        // 2. Perform the delete operation
        const result = await db.delete(integrations).where(eq(integrations.id, id)).returning({ deletedId: integrations.id });

        if (result.length === 0) {
          // This case should ideally not be reached if existingIntegration check passed,
          // but good for robustness in case of concurrent deletes or other issues.
          throw new Error('Failed to delete integration.');
        }

        // 3. Return success message or deleted ID
        return { success: true, deletedIntegrationId: result[0].deletedId, message: 'Integration deleted successfully.' };
      } catch (error) {
        console.error('Error deleting integration:', error);
        throw new Error(`Failed to delete integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});