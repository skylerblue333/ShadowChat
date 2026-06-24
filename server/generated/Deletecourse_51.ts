// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteCourse
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { courses } from '../db/schema'; // Adjust path to your Drizzle schema

export const courseRouter = router({
  deleteCourse: publicProcedure
    .input(z.object({
      courseId: z.string().uuid('Invalid course ID format. Must be a UUID.'),
    }))
    .mutation(async ({ ctx, input }) => {
      const { courseId } = input;

      // 1. Validate input (handled by Zod schema)

      // 2. Perform database operation: Delete the course
      const result = await ctx.db.delete(courses)
        .where(eq(courses.id, courseId))
        .returning({ id: courses.id });

      // 3. Error handling: Check if the course was actually deleted
      if (result.length === 0) {
        throw new Error(`Course with ID ${courseId} not found or could not be deleted.`);
      }

      // 4. Return success message or deleted course ID
      return { success: true, deletedCourseId: result[0].id, message: 'Course deleted successfully.' };
    }),
});