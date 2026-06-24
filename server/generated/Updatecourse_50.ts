// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateCourse
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { courses } from './schema';

export const courseRouter = router({
  updateCourse: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...dataToUpdate } = input;

        if (Object.keys(dataToUpdate).length === 0) {
          throw new Error('No fields provided for update.');
        }

        const [updatedCourse] = await db.update(courses)
          .set(dataToUpdate)
          .where(eq(courses.id, id))
          .returning();

        if (!updatedCourse) {
          throw new Error(`Course with ID ${id} not found.`);
        }

        return updatedCourse;
      } catch (error) {
        console.error('Error updating course:', error);
        throw new Error(`Failed to update course: ${error.message}`);
      }
    }),
});