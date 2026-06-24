// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: triggerAutomationProcedure
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup
import { automations } from './schema';

// Input schema for the triggerAutomation procedure
const triggerAutomationInput = z.object({
  automationId: z.string().uuid('Invalid automation ID format.'),
  payload: z.record(z.any()).optional(), // Optional payload for the automation
});

// Output schema for the triggerAutomation procedure
const triggerAutomationOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  automationId: z.string().uuid().optional(),
  triggeredAt: z.date().optional(),
});

export const triggerAutomationProcedure = publicProcedure
  .input(triggerAutomationInput)
  .output(triggerAutomationOutput)
  .mutation(async ({ input }) => {
    const { automationId, payload } = input;

    try {
      // Step 1: Find the automation in the database
      const existingAutomation = await db.select()
        .from(automations)
        .where(eq(automations.id, automationId))
        .limit(1);

      if (existingAutomation.length === 0) {
        return { success: false, message: `Automation with ID ${automationId} not found.` };
      }

      const automation = existingAutomation[0];

      if (!automation.isActive) {
        return { success: false, message: `Automation with ID ${automationId} is not active.` };
      }

      // Step 2: Update the automation's last triggered time and status
      const triggeredAt = new Date();
      await db.update(automations)
        .set({ lastTriggeredAt: triggeredAt, status: 'triggered' })
        .where(eq(automations.id, automationId));

      // Step 3: Optionally process the payload or log it (simplified for this example)
      console.log(`Automation ${automationId} triggered with payload:`, payload);

      return {
        success: true,
        message: `Automation ${automationId} triggered successfully.`,
        automationId,
        triggeredAt,
      };
    } catch (error) {
      console.error('Error triggering automation:', error);
      return { success: false, message: 'Failed to trigger automation due to an internal error.' };
    }
  });