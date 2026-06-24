// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteTemplate

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle DB instance
import { templates } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const templateRouter = router({
  deleteTemplate: publicProcedure
    .input(z.object({
      id: z.string().uuid('Invalid template ID format'),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // Check if the template exists before attempting to delete
        const existingTemplate = await db.select().from(templates).where(eq(templates.id, id)).limit(1);

        if (existingTemplate.length === 0) {
          throw new Error('Template not found');
        }

        // Perform the deletion
        const result = await db.delete(templates).where(eq(templates.id, id));

        if (result.rowCount === 0) {
          throw new Error('Failed to delete template');
        }

        return { success: true, message: 'Template deleted successfully' };
      } catch (error) {
        console.error('Error deleting template:', error);
        throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
