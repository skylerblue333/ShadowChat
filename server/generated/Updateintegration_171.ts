// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateIntegration
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { integrations } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const integrationRouter = router({
  updateIntegration: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      apiKey: z.string().min(1).optional(),
      // Add other fields that can be updated
    }))
    .mutation(async ({ input }) => {
      const { id, name, apiKey } = input;

      try {
        const [updatedIntegration] = await db.update(integrations)
          .set({
            ...(name && { name }),
            ...(apiKey && { apiKey }),
            updatedAt: new Date(),
          })
          .where(eq(integrations.id, id))
          .returning();

        if (!updatedIntegration) {
          throw new Error('Integration not found or no changes made.');
        }

        return {
          success: true,
          message: 'Integration updated successfully',
          integration: updatedIntegration,
        };
      } catch (error) {
        console.error('Error updating integration:', error);
        throw new Error(`Failed to update integration: ${error.message}`);
      }
    }),
});
