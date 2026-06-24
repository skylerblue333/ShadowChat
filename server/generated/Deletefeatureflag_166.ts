// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteFeatureFlag
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup

export const featureFlagRouter = router({
  deleteFeatureFlag: publicProcedure
    .input(z.object({
      id: z.string().uuid('Invalid UUID format for feature flag ID'),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // 1. Check if the feature flag exists
        const existingFlag = await db.select().from(featureFlags).where(eq(featureFlags.id, id)).limit(1);
        if (existingFlag.length === 0) {
          throw new Error('Feature flag not found.');
        }

        // 2. Perform the deletion
        const result = await db.delete(featureFlags).where(eq(featureFlags.id, id));

        // 3. Return success or details of deletion
        if (result.rowCount > 0) {
          return { success: true, message: `Feature flag with ID ${id} deleted successfully.` };
        } else {
          // This case should ideally be caught by the existingFlag check, but as a fallback
          throw new Error('Failed to delete feature flag, it might not exist or an unexpected error occurred.');
        }
      } catch (error) {
        console.error('Error deleting feature flag:', error);
        throw new Error(`Failed to delete feature flag: ${error.message}`);
      }
    }),
});
