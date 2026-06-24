// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getFeatureFlags
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { featureFlags } from '../schema';

// Define the input schema for getFeatureFlags
const GetFeatureFlagsInputSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
}).optional();

// Define the output schema for getFeatureFlags
const FeatureFlagOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  enabled: z.boolean(),
  description: z.string().nullable(),
});

export const featureFlagRouter = router({
  getFeatureFlags: publicProcedure
    .input(GetFeatureFlagsInputSchema)
    .output(z.array(FeatureFlagOutputSchema))
    .query(async ({ input }) => {
      try {
        // 1. Input validation (handled by Zod automatically)

        let query = db.select().from(featureFlags);

        // 2. Apply filters based on input
        if (input?.name) {
          query = query.where(eq(featureFlags.name, input.name));
        }
        if (input?.enabled !== undefined) {
          query = query.where(eq(featureFlags.enabled, input.enabled));
        }

        // 3. Execute database query
        const flags = await query;

        // 4. Return results
        return flags;
      } catch (error) {
        console.error("Failed to fetch feature flags:", error);
        throw new Error("Failed to retrieve feature flags.");
      }
    }),
});