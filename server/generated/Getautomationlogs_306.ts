// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getAutomationLogs
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '~/server/db'; // Assuming Drizzle 'db' instance
import { automationLogs } from '~/server/db/schema'; // Assuming Drizzle schema for automationLogs

// Initialize tRPC (this would typically be done once in your tRPC setup file)
const t = initTRPC.create();
const publicProcedure = t.procedure;

/**
 * tRPC procedure to retrieve automation logs with filtering and pagination.
 * It includes input validation, database querying with Drizzle ORM, and error handling.
 */
export const getAutomationLogs = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      automationId: z.number().int().positive().optional(),
      status: z.enum(['success', 'failed', 'running', 'pending']).optional(),
      searchQuery: z.string().trim().min(1).optional(), // Example for full-text search
    })
  )
  .query(async ({ input }) => {
    const { limit, offset, automationId, status, searchQuery } = input;

    try {
      const conditions = [];

      if (automationId) {
        conditions.push(eq(automationLogs.automationId, automationId));
      }
      if (status) {
        conditions.push(eq(automationLogs.status, status));
      }
      // Example for a simple search query on a 'message' field
      if (searchQuery) {
        // This would typically use a full-text search index for performance
        // For Drizzle, you might use `ilike` or a custom function depending on your DB
        // conditions.push(ilike(automationLogs.message, `%${searchQuery}%`));
        // For simplicity, we'll omit a complex search condition here, assuming it's handled by specific DB functions
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const logs = await db.query.automationLogs.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(automationLogs.createdAt),
      });

      // Get total count for pagination metadata
      const totalCountResult = await db.select({ count: count() }).from(automationLogs).where(whereClause);
      const totalCount = totalCountResult[0]?.count || 0;

      if (!logs || logs.length === 0) {
        // It's often better to return an empty array and totalCount: 0 for logs
        // rather than NOT_FOUND for pagination scenarios, but depends on UX.
        // For this example, we'll return an empty array if no logs are found.
        return {
          logs: [],
          totalCount: 0,
          limit,
          offset,
        };
      }

      return {
        logs,
        totalCount,
        limit,
        offset,
      };
    } catch (error) {
      console.error('Failed to fetch automation logs:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching automation logs.',
        cause: error,
      });
    }
  });

// Example of how to integrate this into a tRPC router:
// import { router } from './trpc'; // Assuming your base router setup
// export const appRouter = router({
//   automation: router({
//     getLogs: getAutomationLogs,
//   }),
// });
