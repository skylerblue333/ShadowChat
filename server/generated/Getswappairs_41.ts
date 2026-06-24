// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getSwapPairs

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { swapPairs, tokens } from '../schema'; // Adjust path as needed

// Input schema for getSwapPairs procedure
const GetSwapPairsInputSchema = z.object({
  tokenASymbol: z.string().optional(),
  tokenBSymbol: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Output schema for a single swap pair
const SwapPairOutputSchema = z.object({
  id: z.number(),
  tokenA: z.object({
    symbol: z.string(),
    address: z.string(),
  }),
  tokenB: z.object({
    symbol: z.string(),
    address: z.string(),
  }),
  poolAddress: z.string(),
  liquidity: z.string(), // Drizzle returns numeric as string
  feeTier: z.string(),   // Drizzle returns numeric as string
});

// Full output schema for the procedure
const GetSwapPairsOutputSchema = z.array(SwapPairOutputSchema);

export const swapRouter = router({
  getSwapPairs: publicProcedure
    .input(GetSwapPairsInputSchema)
    .output(GetSwapPairsOutputSchema)
    .query(async ({ input }) => {
      try {
        const { tokenASymbol, tokenBSymbol, limit, offset } = input;

        // Build dynamic WHERE clause for Drizzle
        const whereConditions = [];

        if (tokenASymbol || tokenBSymbol) {
          const tokenAFilter = tokenASymbol ? eq(tokens.symbol, tokenASymbol) : undefined;
          const tokenBFilter = tokenBSymbol ? eq(tokens.symbol, tokenBSymbol) : undefined;

          if (tokenAFilter && tokenBFilter) {
            // Both tokenA and tokenB specified, match either (tokenA, tokenB) or (tokenB, tokenA)
            whereConditions.push(or(
              and(eq(swapPairs.tokenAId, db.select({ id: tokens.id }).from(tokens).where(tokenAFilter)), eq(swapPairs.tokenBId, db.select({ id: tokens.id }).from(tokens).where(tokenBFilter))),
              and(eq(swapPairs.tokenAId, db.select({ id: tokens.id }).from(tokens).where(tokenBFilter)), eq(swapPairs.tokenBId, db.select({ id: tokens.id }).from(tokens).where(tokenAFilter)))
            ));
          } else if (tokenAFilter) {
            // Only tokenA specified, match if tokenA is either tokenA or tokenB in the pair
            whereConditions.push(or(
              eq(swapPairs.tokenAId, db.select({ id: tokens.id }).from(tokens).where(tokenAFilter)),
              eq(swapPairs.tokenBId, db.select({ id: tokens.id }).from(tokens).where(tokenAFilter))
            ));
          } else if (tokenBFilter) {
            // Only tokenB specified, match if tokenB is either tokenA or tokenB in the pair
            whereConditions.push(or(
              eq(swapPairs.tokenAId, db.select({ id: tokens.id }).from(tokens).where(tokenBFilter)),
              eq(swapPairs.tokenBId, db.select({ id: tokens.id }).from(tokens).where(tokenBFilter))
            ));
          }
        }

        const result = await db.select({
          id: swapPairs.id,
          poolAddress: swapPairs.poolAddress,
          liquidity: swapPairs.liquidity,
          feeTier: swapPairs.feeTier,
          tokenAId: swapPairs.tokenAId,
          tokenBId: swapPairs.tokenBId,
        })
        .from(swapPairs)
        .where(and(...whereConditions))
        .limit(limit)
        .offset(offset);

        // Fetch token details for each pair
        const enrichedResult = await Promise.all(result.map(async (pair) => {
          const [tokenAInfo] = await db.select().from(tokens).where(eq(tokens.id, pair.tokenAId));
          const [tokenBInfo] = await db.select().from(tokens).where(eq(tokens.id, pair.tokenBId));

          if (!tokenAInfo || !tokenBInfo) {
            // This should ideally not happen if referential integrity is maintained
            throw new Error(`Token information missing for pair ID: ${pair.id}`);
          }

          return {
            id: pair.id,
            tokenA: { symbol: tokenAInfo.symbol, address: tokenAInfo.address },
            tokenB: { symbol: tokenBInfo.symbol, address: tokenBInfo.address },
            poolAddress: pair.poolAddress,
            liquidity: pair.liquidity,
            feeTier: pair.feeTier,
          };
        }));

        return enrichedResult;
      } catch (error) {
        console.error("Failed to fetch swap pairs:", error);
        throw new Error("Could not retrieve swap pairs. Please try again later.");
      }
    }),
});
