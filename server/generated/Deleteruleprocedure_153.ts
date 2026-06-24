// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteRuleProcedure
import { z } from 'zod';
import { publicProcedure } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { rules } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const deleteRuleProcedure = publicProcedure
  .input(z.object({
    ruleId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    try {
      const { ruleId } = input;

      // Check if the rule exists before attempting to delete
      const existingRule = await db.select().from(rules).where(eq(rules.id, ruleId)).limit(1);

      if (existingRule.length === 0) {
        throw new Error('Rule not found');
      }

      // Perform the deletion
      await db.delete(rules).where(eq(rules.id, ruleId));

      return { success: true, message: `Rule with ID ${ruleId} deleted successfully.` };
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw new Error(`Failed to delete rule: ${error.message}`);
    }
  });
