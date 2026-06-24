// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: enableFeatureFlag

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { featureFlags } from '../schema'; // Adjust path as needed

export const featureFlagRouter = router({
  enableFeatureFlag: publicProcedure
    .input(z.object({
      flagName: z.string().min(1, 'Feature flag name cannot be empty'),
      isEnabled: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const { flagName, isEnabled } = input;

      try {
        const existingFlag = await db.select().from(featureFlags).where(eq(featureFlags.name, flagName)).limit(1);

        if (existingFlag.length > 0) {
          // Update existing flag
          await db.update(featureFlags)
            .set({ isEnabled, updatedAt: new Date() })
            .where(eq(featureFlags.name, flagName));
          return { success: true, message: `Feature flag '${flagName}' updated to ${isEnabled}.` };
        } else {
          // Insert new flag
          await db.insert(featureFlags).values({
            name: flagName,
            isEnabled: isEnabled,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return { success: true, message: `Feature flag '${flagName}' created and set to ${isEnabled}.` };
        }
      } catch (error) {
        console.error('Error enabling/disabling feature flag:', error);
        throw new Error('Failed to enable/disable feature flag.');
      }
    }),
});
