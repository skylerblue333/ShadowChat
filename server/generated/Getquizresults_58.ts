// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getQuizResults
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup

export const quizRouter = router({
  getQuizResults: publicProcedure
    .input(z.object({
      quizId: z.number().int().positive(),
      userId: z.string().optional(),
    }))
    .output(z.array(z.object({
      id: z.number(),
      quizId: z.number(),
      userId: z.string(),
      score: z.number(),
      submissionDate: z.date(),
    })))
    .query(async ({ input }) => {
      const { quizId, userId } = input;

      // Operation 1: Check if the quiz exists
      const quizExists = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      if (quizExists.length === 0) {
        throw new Error('Quiz not found'); // Or use a tRPC specific error
      }

      // Operation 2: Build query conditions
      const conditions = [eq(quizResults.quizId, quizId)];
      if (userId) {
        conditions.push(eq(quizResults.userId, userId));
      }

      // Operation 3: Fetch quiz results from the database
      const results = await db.select().from(quizResults).where(and(...conditions));

      // Operation 4: Return the results
      return results;
    }),
});