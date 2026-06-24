// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getModerationCases
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { z } from 'zod';
import { moderationCases, moderationStatusEnum } from './schema';

// Input Schema
export const GetModerationCasesInputSchema = z.object({
  limit: z.number().min(1).max(100).default(10).optional(),
  offset: z.number().min(0).default(0).optional(),
  status: moderationStatusEnum.optional(),
  reportedByUserId: z.string().optional(),
  search: z.string().optional(),
});

// Output Schema
export const ModerationCaseSchema = z.object({
  id: z.string(),
  status: moderationStatusEnum,
  reportedByUserId: z.string(),
  reportedContent: z.string(),
  reason: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetModerationCasesOutputSchema = z.object({
  cases: z.array(ModerationCaseSchema),
  totalCount: z.number(),
});

export const moderationRouter = router({
  getModerationCases: publicProcedure
    .input(GetModerationCasesInputSchema)
    .output(GetModerationCasesOutputSchema)
    .query(async ({ input, ctx }) => {
      // Operation 1: Authorization check (placeholder)
      if (!ctx.session?.user?.id) {
        throw new Error("Unauthorized: User not logged in.");
      }
      // Operation 2: Role-based access control (placeholder)
      if (!ctx.session.user.roles.includes("moderator")) {
        throw new Error("Forbidden: User does not have moderator role.");
      }
      try {
        const { limit = 10, offset = 0, status, reportedByUserId, search } = input;

        const whereConditions = [];
        if (status) {
          whereConditions.push(eq(moderationCases.status, status));
        }
        if (reportedByUserId) {
          whereConditions.push(eq(moderationCases.reportedByUserId, reportedByUserId));
        }
        if (search) {
          whereConditions.push(like(moderationCases.reportedContent, `%${search}%`));
        }

        const cases = await db.query.moderationCases.findMany({
          where: and(...whereConditions),
          limit,
          offset,
          orderBy: (moderationCases, ({ desc }) => [desc(moderationCases.createdAt)]),
        });

        const totalCountResult = await db.select({ count: count() }).from(moderationCases).where(and(...whereConditions));
        const totalCount = totalCountResult[0].count;

        return {
          cases,
          totalCount,
        };
      } catch (error) {
        console.error('Error fetching moderation cases:', error);
        throw new Error('Failed to fetch moderation cases.');
      }
    }),
});
