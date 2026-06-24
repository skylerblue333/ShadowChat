// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getLessons
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { lessons } from '../db/schema'; // Adjust path as needed

const getLessonsInput = z.object({
  lessonId: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

const getLessonsOutput = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export const lessonRouter = router({
  getLessons: publicProcedure
    .input(getLessonsInput)
    .output(getLessonsOutput)
    .query(async ({ input }) => {
      try {
        const { lessonId, limit, offset } = input;

        let query = db.select().from(lessons).$dynamic();

        if (lessonId) {
          query = query.where(eq(lessons.id, lessonId));
        }

        const result = await query.limit(limit).offset(offset);

        if (result.length === 0 && lessonId) {
          throw new Error('Lesson not found');
        }

        return result;
      } catch (error) {
        console.error('Error fetching lessons:', error);
        throw new Error('Failed to fetch lessons');
      }
    }),
});

export type LessonRouter = typeof lessonRouter;