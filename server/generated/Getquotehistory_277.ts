// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getQuoteHistory

import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { quoteHistory } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const getQuoteHistoryProcedure = publicProcedure
  .input(z.object({
    symbol: z.string().min(1, 'Symbol cannot be empty'),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }))
  .query(async ({ input }) => {
    try {
      const { symbol, startDate, endDate } = input;

      let query = db.select().from(quoteHistory).where(eq(quoteHistory.symbol, symbol));

      if (startDate && endDate) {
        query = db.select().from(quoteHistory).where(and(eq(quoteHistory.symbol, symbol), quoteHistory.timestamp.gte(startDate), quoteHistory.timestamp.lte(endDate)));
      } else if (startDate) {
        query = db.select().from(quoteHistory).where(and(eq(quoteHistory.symbol, symbol), quoteHistory.timestamp.gte(startDate)));
      } else if (endDate) {
        query = db.select().from(quoteHistory).where(and(eq(quoteHistory.symbol, symbol), quoteHistory.timestamp.lte(endDate)));
      }

      const history = await query;

      if (!history || history.length === 0) {
        throw new Error('No quote history found for the given symbol and date range.');
      }

      return history;
    } catch (error) {
      console.error('Error fetching quote history:', error);
      throw new Error('Failed to retrieve quote history.');
    }
  });

export const appRouter = router({
  getQuoteHistory: getQuoteHistoryProcedure,
});

export type AppRouter = typeof appRouter;
