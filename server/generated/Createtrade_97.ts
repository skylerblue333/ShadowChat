// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createTrade
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { trades } from './schema'; // Assuming schema.ts defines your Drizzle schema
import { TRPCError } from '@trpc/server';

// Input schema for createTrade procedure
const createTradeInput = z.object({
  userId: z.string().uuid(),
  stockSymbol: z.string().min(1).max(10),
  tradeType: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const tradeRouter = router({
  createTrade: publicProcedure
    .input(createTradeInput)
    .mutation(async ({ input }) => {
      try {
        const newTrade = await db.insert(trades).values({
          userId: input.userId,
          stockSymbol: input.stockSymbol,
          tradeType: input.tradeType,
          quantity: input.quantity,
          price: input.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTrade || newTrade.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create trade.',
          });
        }

        return newTrade[0];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error creating trade:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred.',
          cause: error,
        });
      }
    }),
});