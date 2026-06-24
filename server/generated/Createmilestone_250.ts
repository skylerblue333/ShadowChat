// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createMilestone
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { milestones } from '../schema';

export const createMilestoneInput = z.object({
  name: z.string().min(1, 'Milestone name cannot be empty'),
  description: z.string().optional(),
  dueDate: z.string().datetime('Invalid date format'),
  projectId: z.string().uuid('Invalid project ID format'),
});

export const milestoneRouter = router({
  createMilestone: publicProcedure
    .input(createMilestoneInput)
    .mutation(async ({ input }) => {
      try {
        const newMilestone = await db.insert(milestones).values({
          name: input.name,
          description: input.description,
          dueDate: new Date(input.dueDate),
          projectId: input.projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newMilestone || newMilestone.length === 0) {
          throw new Error('Failed to create milestone');
        }

        return newMilestone[0];
      } catch (error) {
        console.error('Error creating milestone:', error);
        throw new Error('Could not create milestone. Please try again.');
      }
    }),
});
