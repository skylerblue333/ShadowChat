// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTrades
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your t and publicProcedure
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { trades, users } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const tradeRouter = router({
  getTrades: publicProcedure
    .input(z.object({
      userId: z.string().uuid().optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .output(z.array(z.object({
      id: z.string().uuid(),
      amount: z.number(),
      price: z.number(),
      timestamp: z.date(),
      buyerId: z.string().uuid(),
      sellerId: z.string().uuid(),
    })))
    .query(async ({ input }) => {
      try {
        const { userId, limit, offset } = input;

        let query = db.select().from(trades).limit(limit).offset(offset);

        if (userId) {
          query = query.where(eq(trades.buyerId, userId)); // Example: filter by buyerId
        }

        const result = await query;

        if (!result || result.length === 0) {
          // Handle case where no trades are found
          return [];
        }

        return result.map(trade => ({
          id: trade.id,
          amount: trade.amount,
          price: trade.price,
          timestamp: trade.timestamp,
          buyerId: trade.buyerId,
          sellerId: trade.sellerId,
        }));
      } catch (error) {
        console.error('Error fetching trades:', error);
        throw new Error('Failed to fetch trades.');
      }
    }),
});

export type TradeRouter = typeof tradeRouter;
