// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCourses
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { courses } from './schema';

export const courseRouter = router({
  getCourses: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      try {
        const { limit, offset } = input;
        const result = await db.select().from(courses).limit(limit).offset(offset);

        if (!result) {
          throw new Error('No courses found');
        }

        return {
          courses: result,
          count: result.length,
        };
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw new Error('Failed to fetch courses');
      }
    }),
});

export type CourseRouter = typeof courseRouter;