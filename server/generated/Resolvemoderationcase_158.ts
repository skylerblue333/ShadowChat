// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: resolveModerationCase
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { moderationCases, moderationLogs } from './schema'; // Assuming schema.ts defines your Drizzle schema

const resolveModerationCaseInput = z.object({
  caseId: z.string().uuid('Invalid case ID format. Must be a UUID.'),
  moderatorId: z.string().uuid('Invalid moderator ID format. Must be a UUID.'),
  resolutionAction: z.enum(['approve', 'reject', 'warn', 'ban'], { invalid_type_error: 'Invalid resolution action.' }),
  resolutionNotes: z.string().optional(),
});

export const moderationRouter = router({
  resolveModerationCase: publicProcedure
    .input(resolveModerationCaseInput)
    .mutation(async ({ input }) => {
      try {
        const { caseId, moderatorId, resolutionAction, resolutionNotes } = input;

        // 1. Fetch the moderation case
        const existingCase = await db.select().from(moderationCases).where(eq(moderationCases.id, caseId)).limit(1);

        if (!existingCase || existingCase.length === 0) {
          throw new Error('Moderation case not found.');
        }

        // 2. Update the moderation case
        const [updatedCase] = await db.update(moderationCases)
          .set({
            status: 'resolved',
            resolvedBy: moderatorId,
            resolutionAction: resolutionAction,
            resolutionNotes: resolutionNotes,
            updatedAt: new Date(),
          })
          .where(eq(moderationCases.id, caseId))
          .returning();

        if (!updatedCase) {
          throw new Error('Failed to update moderation case.');
        }

        // 3. Log the moderation action
        await db.insert(moderationLogs).values({
          caseId: updatedCase.id,
          moderatorId: moderatorId,
          action: resolutionAction,
          notes: resolutionNotes,
          timestamp: new Date(),
        });

        return {
          success: true,
          message: `Moderation case ${caseId} resolved successfully as ${resolutionAction}.`,
          resolvedCaseId: updatedCase.id,
        };
      } catch (error: any) {
        console.error('Error resolving moderation case:', error);
        throw new Error(`Failed to resolve moderation case: ${error.message}`);
      }
    }),
});