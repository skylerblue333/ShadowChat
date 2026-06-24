// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: enrollCourse
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { users, courses, enrollments } from '../db/schema';

export const enrollCourse = publicProcedure
  .input(z.object({
    userId: z.string().uuid('Invalid user ID format. Must be a UUID.'),
    courseId: z.string().uuid('Invalid course ID format. Must be a UUID.'),
  }))
  .mutation(async ({ input }) => {
    const { userId, courseId } = input;

    // 1. Check if the user exists
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      throw new Error('User not found.');
    }

    // 2. Check if the course exists
    const existingCourse = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (existingCourse.length === 0) {
      throw new Error('Course not found.');
    }

    // 3. Check if the user is already enrolled in the course
    const existingEnrollment = await db.select().from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .limit(1);

    if (existingEnrollment.length > 0) {
      throw new Error('User is already enrolled in this course.');
    }

    // 4. Create the enrollment record
    await db.insert(enrollments).values({
      userId: userId,
      courseId: courseId,
      enrollmentDate: new Date(),
    });

    return { message: 'Enrollment successful.', userId, courseId };
  });

export const courseRouter = router({
  enrollCourse: enrollCourse,
});