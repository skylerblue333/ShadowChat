// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: completeMilestone
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { milestones } from '../schema';

export const milestoneRouter = router({
  completeMilestone: publicProcedure
    .input(z.object({
      milestoneId: z.string().uuid(),
      projectId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { milestoneId, projectId } = input;

      try {
        const updatedMilestones = await db.update(milestones)
          .set({
            status: 'completed',
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(milestones.id, milestoneId))
          .returning();

        if (updatedMilestones.length === 0) {
          throw new Error('Milestone not found or already completed.');
        }

        return { success: true, milestone: updatedMilestones[0] };
      } catch (error) {
        console.error('Error completing milestone:', error);
        throw new Error('Failed to complete milestone.');
      }
    }),
});