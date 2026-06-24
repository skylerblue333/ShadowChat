// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateAutomation

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { automations } from '../schema'; // Adjust path as needed

export const updateAutomationProcedure = publicProcedure
  .input(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive', 'paused']).optional(),
    // Add other fields that can be updated
  }))
  .mutation(async ({ input }) => {
    try {
      const { id, ...dataToUpdate } = input;

      if (Object.keys(dataToUpdate).length === 0) {
        throw new Error('No fields provided for update.');
      }

      const result = await db.update(automations)
        .set(dataToUpdate)
        .where(eq(automations.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Automation with ID ${id} not found.`);
      }

      return { success: true, automation: result[0] };
    } catch (error) {
      console.error('Error updating automation:', error);
      throw new Error(`Failed to update automation: ${error.message}`);
    }
  });

export const automationRouter = router({
  updateAutomation: updateAutomationProcedure,
});
