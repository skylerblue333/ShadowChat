// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateMilestone
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { milestones } from './schema'; // Assuming schema.ts defines your Drizzle schema for milestones

export const milestoneRouter = router({
  updateMilestone: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      dueDate: z.string().datetime().optional(),
      status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...dataToUpdate } = input;

        const result = await db.update(milestones)
          .set(dataToUpdate)
          .where(eq(milestones.id, id))
          .returning();

        if (result.length === 0) {
          throw new Error('Milestone not found or no changes made.');
        }

        return result[0];
      } catch (error) {
        console.error('Error updating milestone:', error);
        throw new Error('Failed to update milestone.');
      }
    }),
});
