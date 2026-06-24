// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMilestones

import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { milestones } from '../schema';

export const getMilestonesProcedure = publicProcedure
  .input(z.object({
    skycoinId: z.string().min(1, { message: 'Skycoin ID cannot be empty' }),
  }))
  .query(async ({ input }) => {
    try {
      const result = await db.select().from(milestones).where(eq(milestones.skycoinId, input.skycoinId));

      if (!result || result.length === 0) {
        throw new Error('No milestones found for the provided Skycoin ID');
      }

      return result;
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw new Error('Failed to retrieve milestones');
    }
  });

export const appRouter = router({
  getMilestones: getMilestonesProcedure,
});

export type AppRouter = typeof appRouter;
