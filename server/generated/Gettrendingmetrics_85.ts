// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTrendingMetrics
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup in a file named trpc.ts

// Drizzle Schema Definition (for demonstration, normally in a separate schema.ts file)
export const trendingMetrics = pgTable('trending_metrics', {
  id: serial('id').primaryKey(),
  coinId: text('coin_id').notNull(), // e.g., 'SKYCOIN4444'
  metricName: text('metric_name').notNull(), // e.g., 'volume', 'marketCap', 'sentimentScore'
  value: numeric('value').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Input validation schema
const getTrendingMetricsInput = z.object({
  coinId: z.string().min(1, "Coin ID cannot be empty"),
  limit: z.number().int().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").default(10),
});

// Output type schema
const getTrendingMetricsOutput = z.array(
  z.object({
    metricName: z.string(),
    value: z.string(), // Drizzle's numeric type often returns string
    timestamp: z.date(),
  })
);

export const trendingRouter = router({
  getTrendingMetrics: publicProcedure
    .input(getTrendingMetricsInput)
    .output(getTrendingMetricsOutput)
    .query(async ({ input }) => {
      try {
        // Database operation: Fetch trending metrics for the given coinId
        const metrics = await db.select({
          metricName: trendingMetrics.metricName,
          value: trendingMetrics.value,
          timestamp: trendingMetrics.timestamp,
        })
        .from(trendingMetrics)
        .where(eq(trendingMetrics.coinId, input.coinId))
        .orderBy(desc(trendingMetrics.timestamp))
        .limit(input.limit);

        // Logic step: Check if any metrics were found
        if (metrics.length === 0) {
          // This could be a specific tRPC error or a custom one
          throw new Error(`No trending metrics found for coin ID: ${input.coinId}`);
        }

        return metrics;
      } catch (error) {
        console.error('Error fetching trending metrics:', error);
        // Re-throw a more generic error for the client
        throw new Error('Failed to retrieve trending metrics due to an internal server error.');
      }
    }),
});
