// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getPortfolioValue
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc context setup
import { db } from './db'; // Drizzle DB instance
import { users, portfolio, marketData } from './schema'; // Drizzle schema
import { TRPCError } from '@trpc/server';

export const portfolioRouter = router({
  getPortfolioValue: publicProcedure
    .input(z.object({
      userId: z.string().min(1, { message: 'User ID cannot be empty' }),
    }))
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        // 1. Check if user exists (optional, but good for explicit error handling)
        const userExists = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (userExists.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        // 2. Fetch user's portfolio assets
        const userPortfolio = await db.select().from(portfolio).where(eq(portfolio.userId, userId));

        if (userPortfolio.length === 0) {
          return { portfolioValue: 0 }; // Return 0 if no assets in portfolio
        }

        const assetIds = userPortfolio.map(asset => asset.assetId);

        // 3. Fetch current market prices for all assets in the portfolio
        const marketPrices = await db.select().from(marketData).where(inArray(marketData.assetId, assetIds));

        const marketPriceMap = new Map(marketPrices.map(data => [data.assetId, data.currentPrice]));

        // 4. Calculate total portfolio value
        let totalPortfolioValue = 0;
        for (const asset of userPortfolio) {
          const currentPrice = marketPriceMap.get(asset.assetId);
          if (currentPrice !== undefined) {
            totalPortfolioValue += asset.quantity * currentPrice;
          } else {
            // Log a warning or handle assets with missing market data
            console.warn(`Market data missing for assetId: ${asset.assetId}`);
          }
        }

        return { portfolioValue: totalPortfolioValue };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // Re-throw tRPC errors
        }
        console.error('Database error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve portfolio value.',
        });
      }
    }),
});
