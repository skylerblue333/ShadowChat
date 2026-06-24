// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMiningStats
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError, z } from 'zod';
import { db } from './db'; // Assuming a db connection

// Drizzle schema definition for mining statistics
export const miningStats = pgTable('mining_stats', {
  id: serial('id').primaryKey(),
  coinId: text('coin_id').notNull(),
  hashRate: doublePrecision('hash_rate').notNull(),
  difficulty: doublePrecision('difficulty').notNull(),
  blockHeight: integer('block_height').notNull(),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});

export type MiningStat = InferSelectModel<typeof miningStats>;

// Placeholder for tRPC context and router setup
// In a real application, these would be defined in a separate file (e.g., trpc.ts)
interface Context {
  db: typeof db;
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const publicProcedure = t.procedure;
export const router = t.router;

// Input schema for getMiningStats (optional coinId for flexibility)
const GetMiningStatsInputSchema = z.object({
  coinId: z.string().optional(),
});

// Output schema for getMiningStats
const GetMiningStatsOutputSchema = z.object({
  coinId: z.string(),
  hashRate: z.number(),
  difficulty: z.number(),
  blockHeight: z.number(),
  lastUpdated: z.date(),
});

export const miningRouter = router({
  getMiningStats: publicProcedure
    .input(GetMiningStatsInputSchema)
    .output(GetMiningStatsOutputSchema.nullable())
    .query(async ({ ctx, input }) => {
      try {
        // 1. Validate input (handled by Zod)
        const targetCoinId = input.coinId || 'SKYCOIN4444';

        // 2. Database query using Drizzle ORM
        const stats = await ctx.db.query.miningStats.findFirst({
          where: eq(miningStats.coinId, targetCoinId),
          orderBy: (miningStats, { desc }) => [desc(miningStats.lastUpdated)],
        });

        // 3. Handle case where no stats are found
        if (!stats) {
          console.warn(`No mining stats found for coinId: ${targetCoinId}`);
          return null; // Or throw a specific error if preferred
        }

        // 4. Return the fetched data, ensuring it matches the output schema
        return {
          coinId: stats.coinId,
          hashRate: stats.hashRate,
          difficulty: stats.difficulty,
          blockHeight: stats.blockHeight,
          lastUpdated: stats.lastUpdated,
        };
      } catch (error) {
        // 5. Centralized error handling
        console.error('Error fetching mining stats:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve mining statistics.',
          cause: error,
        });
      }
    }),
});
