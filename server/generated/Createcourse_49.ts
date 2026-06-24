// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createCourse
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { courses } from "../db/schema";

export const courseRouter = router({
  createCourse: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        instructorId: z.string().uuid("Invalid instructor ID"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newCourse = await db.insert(courses).values({
          title: input.title,
          description: input.description,
          instructorId: input.instructorId,
        }).returning();

        if (!newCourse || newCourse.length === 0) {
          throw new Error("Failed to create course.");
        }

        return { success: true, course: newCourse[0] };
      } catch (error) {
        console.error("Error creating course:", error);
        throw new Error("Could not create course. Please try again.");
      }
    }),
});