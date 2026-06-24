// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBots
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc context setup
import { bots } from '../schema'; // Assuming Drizzle schema for bots

export const botRouter = router({
  getBots: publicProcedure
    .input(
      z.object({
        status: z.enum(['active', 'inactive', 'pending']).optional(),
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
      }).optional()
    )
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          status: z.enum(['active', 'inactive', 'pending']),
          createdAt: z.date(),
          isActive: z.boolean(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        let query = db.select().from(bots);

        if (input?.status) {
          query = query.where(eq(bots.status, input.status));
        }

        const result = await query.limit(input?.limit ?? 10).offset(input?.offset ?? 0);

        return result;
      } catch (error) {
        console.error("Failed to fetch bots:", error);
        throw new Error("Failed to retrieve bots due to an internal server error.");
      }
    }),
});