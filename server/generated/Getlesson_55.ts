// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getLesson

import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { db } from "./db";
import { lessons } from "./schema";

export const lessonRouter = router({
  getLesson: publicProcedure
    .input(z.object({
      lessonId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const lesson = await db.select().from(lessons).where(eq(lessons.id, input.lessonId)).limit(1);

        if (!lesson || lesson.length === 0) {
          throw new Error("Lesson not found");
        }

        return lesson[0];
      } catch (error) {
        console.error("Error fetching lesson:", error);
        throw new Error("Failed to retrieve lesson");
      }
    }),
});
