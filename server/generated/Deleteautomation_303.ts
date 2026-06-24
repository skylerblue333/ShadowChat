// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteAutomation
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { automations } from '../schema';

export const automationRouter = router({
  deleteAutomation: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await db.delete(automations)
          .where(and(eq(automations.id, input.id), eq(automations.userId, input.userId)))
          .returning({ deletedId: automations.id });

        if (result.length === 0) {
          throw new Error('Automation not found or not authorized to delete.');
        }

        return { success: true, deletedId: result[0].deletedId };
      } catch (error) {
        console.error('Error deleting automation:', error);
        throw new Error('Failed to delete automation.');
      }
    }),
});