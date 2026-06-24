// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getRulesProcedure
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { rules } from './schema'; // Assuming schema.ts defines your Drizzle schema

const getRulesInput = z.object({
  id: z.string().optional(),
});

const ruleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

const getRulesOutput = z.array(ruleSchema);

export const getRulesProcedure = publicProcedure
  .input(getRulesInput)
  .output(getRulesOutput)
  .query(async ({ input }) => {
    try {
      if (input.id) {
        const result = await db.select().from(rules).where(eq(rules.id, input.id)).limit(1);
        if (result.length === 0) {
          throw new Error('Rule not found');
        }
        return result as z.infer<typeof getRulesOutput>;
      } else {
        const allRules = await db.select().from(rules);
        return allRules as z.infer<typeof getRulesOutput>;
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw new Error('Failed to fetch rules');
    }
  });

// This procedure would typically be added to a root router, e.g.:
// export const appRouter = router({
//   getRules: getRulesProcedure,
// });
