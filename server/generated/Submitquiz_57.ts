// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: submitQuiz
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc setup
import { db } from "./db"; // Assuming Drizzle db instance
import { users, quizzes, questions, quizSubmissions, submissionAnswers } from "./schema"; // Assuming Drizzle schema

export const quizRouter = router({
  submitQuiz: publicProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        quizId: z.number().int().positive(),
        answers: z.array(
          z.object({
            questionId: z.number().int().positive(),
            selectedOptionId: z.number().int().positive(),
          })
        ).min(1),
      })
    )
    .output(
      z.object({
        submissionId: z.number().int().positive(),
        score: z.number().int().min(0),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, quizId, answers } = input;

      // 1. Validate User and Quiz existence
      const userExists = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userExists.length === 0) {
        throw new Error("User not found.");
      }

      const quizExists = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      if (quizExists.length === 0) {
        throw new Error("Quiz not found.");
      }

      // 2. Calculate score and prepare submission answers
      let score = 0;
      const correctAnswersMap = new Map<number, number>();

      // Fetch all questions for the quiz to determine correct answers
      const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, quizId));
      quizQuestions.forEach(q => {
        if (q.correctOptionId) {
          correctAnswersMap.set(q.id, q.correctOptionId);
        }
      });

      const submissionAnswersToInsert = answers.map(answer => {
        if (correctAnswersMap.has(answer.questionId) && correctAnswersMap.get(answer.questionId) === answer.selectedOptionId) {
          score++;
        }
        return {
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
        };
      });

      // 3. Create Quiz Submission
      const [newSubmission] = await db.insert(quizSubmissions).values({
        userId,
        quizId,
        score,
      }).returning({ id: quizSubmissions.id });

      if (!newSubmission) {
        throw new Error("Failed to create quiz submission.");
      }

      // 4. Insert Submission Answers
      await db.insert(submissionAnswers).values(
        submissionAnswersToInsert.map(ans => ({ ...ans, submissionId: newSubmission.id }))
      );

      return {
        submissionId: newSubmission.id,
        score,
        message: "Quiz submitted successfully!",
      };
    }),
});
