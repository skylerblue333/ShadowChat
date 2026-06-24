// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: rebalancePortfolio

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Drizzle DB instance
import { portfolios, assets, users } from '../db/schema'; // Drizzle schema

// Input schema for rebalancePortfolio
const RebalancePortfolioInput = z.object({
  userId: z.string().uuid(),
  targetAllocations: z.record(z.string(), z.number().min(0).max(1)), // e.g., { 'AAPL': 0.5, 'GOOG': 0.5 }
});

// Output schema for rebalancePortfolio
const RebalancePortfolioOutput = z.object({
  message: z.string(),
  updatedPortfolio: z.array(z.object({
    assetId: z.string(),
    quantity: z.number(),
    allocation: z.number(),
  })),
});

export const portfolioRouter = router({
  rebalancePortfolio: publicProcedure
    .input(RebalancePortfolioInput)
    .output(RebalancePortfolioOutput)
    .mutation(async ({ input }) => {
      const { userId, targetAllocations } = input;

      // Operation 1: Validate input (handled by Zod) and fetch user
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) {
        throw new Error('User not found');
      }

      // Operation 2: Fetch current portfolio
      const currentPortfolio = await db.select().from(portfolios).where(eq(portfolios.userId, userId));

      // Operation 3: Fetch current asset prices for rebalancing calculation
      const assetPrices = await db.select().from(assets);
      const priceMap = new Map(assetPrices.map(a => [a.id, a.currentPrice]));

      // Simple rebalancing logic: Calculate target portfolio value and new quantities
      let totalPortfolioValue = 0;
      for (const item of currentPortfolio) {
        const price = priceMap.get(item.assetId);
        if (price === undefined) {
          throw new Error(`Price not found for asset ${item.assetId}`);
        }
        totalPortfolioValue += item.quantity * price;
      }

      const newPortfolioState: { assetId: string; quantity: number; allocation: number }[] = [];
      const updates = [];

      for (const [assetId, targetAllocation] of Object.entries(targetAllocations)) {
        const price = priceMap.get(assetId);
        if (price === undefined) {
          throw new Error(`Price not found for asset ${assetId}`);
        }
        const targetValue = totalPortfolioValue * targetAllocation;
        const targetQuantity = targetValue / price;

        newPortfolioState.push({
          assetId,
          quantity: targetQuantity,
          allocation: targetAllocation,
        });

        // Operation 4: Prepare database updates for each asset
        updates.push(
          db.insert(portfolios)
            .values({ userId, assetId, quantity: targetQuantity })
            .onConflictDoUpdate({
              target: [portfolios.userId, portfolios.assetId],
              set: { quantity: targetQuantity },
            })
        );
      }

      // Operation 5: Execute all updates in a transaction
      await db.transaction(async (tx) => {
        await Promise.all(updates);
      });

      // Operation 6: Return updated portfolio
      return {
        message: 'Portfolio rebalanced successfully',
        updatedPortfolio: newPortfolioState,
      };
    }),
});
