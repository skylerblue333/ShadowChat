// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getSwapHistory
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming db context is available
import { swapHistory } from '../schema'; // Assuming Drizzle schema for swapHistory

export const swapRouter = router({
  getSwapHistory: publicProcedure
    .input(z.object({
      userId: z.string().uuid('Invalid user ID format. Must be a UUID.'),
      limit: z.number().int().positive('Limit must be a positive integer.').optional(),
      offset: z.number().int().min(0, 'Offset cannot be negative.').optional(),
    }))
    .output(z.array(z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      fromCurrency: z.string(),
      toCurrency: z.string(),
      fromAmount: z.number(),
      toAmount: z.number(),
      swapRate: z.number(),
      timestamp: z.date(),
      status: z.enum(['completed', 'pending', 'failed']),
    })))
    .query(async ({ input }) => {
      try {
        const { userId, limit, offset } = input;

        const history = await db.select()
          .from(swapHistory)
          .where(eq(swapHistory.userId, userId))
          .limit(limit || 10)
          .offset(offset || 0);

        if (!history || history.length === 0) {
          // Optionally, throw a specific error or return an empty array
          // For this example, returning an empty array if no history is found
          return [];
        }

        return history;
      } catch (error) {
        console.error('Error fetching swap history:', error);
        throw new Error('Failed to retrieve swap history.');
      }
    }),
});

export type SwapRouter = typeof swapRouter;