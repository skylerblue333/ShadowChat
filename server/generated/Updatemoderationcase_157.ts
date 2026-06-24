// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateModerationCase
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC instance
import { db } from "./db"; // Assuming db.ts exports your Drizzle client
import { moderationCases, UpdateModerationCaseInput, ModerationCaseOutput } from "./moderationSchema";
import { TRPCError } from "@trpc/server";

export const moderationRouter = router({
  updateModerationCase: publicProcedure
    .input(UpdateModerationCaseInput)
    .output(ModerationCaseOutput)
    .mutation(async ({ input }) => {
      const { caseId, ...updateData } = input;

      const [updatedCase] = await db.update(moderationCases)
        .set({
          ...updateData,
          updatedAt: new Date(),
          ...(updateData.status === 'resolved' && { reviewedAt: new Date() }),
        })
        .where(eq(moderationCases.caseId, caseId))
        .returning();

      if (!updatedCase) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Moderation case with ID ${caseId} not found.`,
        });
      }

      return ModerationCaseOutput.parse(updatedCase);
    }),
});

export type ModerationRouter = typeof moderationRouter;