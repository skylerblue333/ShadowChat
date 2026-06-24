// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: disableFeatureFlag

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { db } from "../../db";
import { featureFlags } from "../../db/schema";

export const featureFlagRouter = router({
  disableFeatureFlag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Feature flag name cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await db
          .update(featureFlags)
          .set({ enabled: false, updatedAt: new Date() })
          .where(eq(featureFlags.name, input.name));

        if (result.rowsAffected === 0) {
          throw new Error("Feature flag not found or already disabled");
        }

        return { success: true, message: `Feature flag \'${input.name}\' disabled successfully.` };
      } catch (error) {
        console.error("Error disabling feature flag:", error);
        throw new Error("Failed to disable feature flag");
      }
    }),
});
