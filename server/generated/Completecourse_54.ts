// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: completeCourse

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { enrollments } from '../schema'; // Adjust path as needed

export const courseRouter = router({
  completeCourse: publicProcedure
    .input(z.object({
      userId: z.number().int().positive(),
      courseId: z.number().int().positive(),
    }))
    .mutation(async ({ input }) => {
      const { userId, courseId } = input;

      // 1. Validate if the enrollment exists and is not already completed
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)),
      });

      if (!existingEnrollment) {
        throw new Error('Enrollment not found for this user and course.');
      }

      if (existingEnrollment.completed) {
        return { message: 'Course already marked as completed.', enrollment: existingEnrollment };
      }

      // 2. Update the enrollment status to completed
      const [updatedEnrollment] = await db.update(enrollments)
        .set({
          completed: true,
          completedAt: new Date(),
        })
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
        .returning();

      if (!updatedEnrollment) {
        throw new Error('Failed to complete course. Please try again.');
      }

      // 3. Return the updated enrollment details
      return {
        message: 'Course marked as completed successfully!',
        enrollment: updatedEnrollment,
      };
    }),
});
