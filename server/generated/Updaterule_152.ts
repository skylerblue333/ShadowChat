// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateRule
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle DB connection is in './db'
import { rules } from './schema'; // Assuming Drizzle schema for rules is in './schema'

const updateRuleInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const ruleRouter = router({
  updateRule: publicProcedure
    .input(updateRuleInput)
    .mutation(async ({ input }) => {
      try {
        const { id, ...dataToUpdate } = input;

        if (Object.keys(dataToUpdate).length === 0) {
          throw new Error('No data provided for update.');
        }

        const [updatedRule] = await db.update(rules)
          .set(dataToUpdate)
          .where(eq(rules.id, id))
          .returning();

        if (!updatedRule) {
          throw new Error(`Rule with ID ${id} not found.`);
        }

        return { success: true, rule: updatedRule };
      } catch (error) {
        console.error('Error updating rule:', error);
        throw new Error(`Failed to update rule: ${error.message}`);
      }
    }),
});

export type RuleRouter = typeof ruleRouter;
