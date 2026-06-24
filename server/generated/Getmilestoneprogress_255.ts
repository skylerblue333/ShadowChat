// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMilestoneProgress
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance

export const milestoneRouter = router({
  getMilestoneProgress: publicProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      milestoneId: z.number().int().positive().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const { projectId, milestoneId } = input;

        if (milestoneId) {
          // Fetch progress for a specific milestone
          const progress = await db.select()
            .from(milestoneProgress)
            .innerJoin(milestones, eq(milestoneProgress.milestoneId, milestones.id))
            .innerJoin(projects, eq(milestones.projectId, projects.id))
            .where(and(eq(milestones.id, milestoneId), eq(projects.id, projectId)));

          if (!progress || progress.length === 0) {
            throw new Error('Milestone progress not found or does not belong to the specified project.');
          }
          return progress;
        } else {
          // Fetch all milestones and their progress for a given project
          const projectMilestones = await db.select()
            .from(milestones)
            .leftJoin(milestoneProgress, eq(milestones.id, milestoneProgress.milestoneId))
            .where(eq(milestones.projectId, projectId));

          if (!projectMilestones || projectMilestones.length === 0) {
            throw new Error('No milestones found for the specified project.');
          }
          return projectMilestones;
        }
      } catch (error) {
        console.error('Error fetching milestone progress:', error);
        throw new Error('Failed to retrieve milestone progress.');
      }
    }),
});

export type MilestoneRouter = typeof milestoneRouter;
