// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTradeHistory
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming db is your Drizzle instance
import { trades } from '../schema'; // Assuming schema.ts defines your Drizzle schema
import { TRPCError } from '@trpc/server';

// 1. Input Validation Schema
const GetTradeHistoryInputSchema = z.object({
  userId: z.string().uuid('Invalid user ID format. Must be a UUID.'),
  limit: z.number().int().positive('Limit must be a positive integer.').default(10),
  offset: z.number().int().nonnegative('Offset must be a non-negative integer.').default(0),
  currencyPair: z.string().optional(),
});

// 2. Output Type (matches conceptual schema from design_notes.md)
interface TradeHistoryItem {
  id: string;
  userId: string;
  currencyPair: string;
  amount: number;
  price: number;
  type: 'BUY' | 'SELL';
  timestamp: Date;
}

export const tradeRouter = router({
  getTradeHistory: publicProcedure
    .input(GetTradeHistoryInputSchema)
    .output(z.array(z.object({
      id: z.string(),
      userId: z.string(),
      currencyPair: z.string(),
      amount: z.number(),
      price: z.number(),
      type: z.enum(['BUY', 'SELL']),
      timestamp: z.date(),
    })))
    .query(async ({ input }) => {
      const { userId, limit, offset, currencyPair } = input;

      try {
        const tradeRecords = await db.select()
          .from(trades)
          .where(
            and(
              eq(trades.userId, userId),
              currencyPair ? eq(trades.currencyPair, currencyPair) : undefined
            )
          )
          .limit(limit)
          .offset(offset)
          .orderBy(asc(trades.timestamp)); // Order by timestamp ascending

        // Map Drizzle results to the desired output interface
        const result: TradeHistoryItem[] = tradeRecords.map(trade => ({
          id: trade.id,
          userId: trade.userId,
          currencyPair: trade.currencyPair,
          amount: trade.amount,
          price: trade.price,
          type: trade.type as 'BUY' | 'SELL', // Type assertion based on schema enum
          timestamp: trade.timestamp,
        }));

        return result;
      } catch (error) {
        console.error('Database error fetching trade history:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve trade history.',
          cause: error,
        });
      }
    }),
});
