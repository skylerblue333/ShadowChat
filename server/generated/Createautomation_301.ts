// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createAutomation
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { automations } from '../schema';

export const automationRouter = router({
  createAutomation: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Automation name cannot be empty'),
      description: z.string().optional(),
      trigger: z.string().min(1, 'Trigger cannot be empty'),
      action: z.string().min(1, 'Action cannot be empty'),
      userId: z.string().uuid('Invalid user ID format'),
    }))
    .mutation(async ({ input }) => {
      try {
        const newAutomation = await db.insert(automations).values({
          name: input.name,
          description: input.description,
          trigger: input.trigger,
          action: input.action,
          userId: input.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newAutomation || newAutomation.length === 0) {
          throw new Error('Failed to create automation.');
        }

        return { success: true, automation: newAutomation[0] };
      } catch (error) {
        console.error('Error creating automation:', error);
        throw new Error(`Could not create automation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
