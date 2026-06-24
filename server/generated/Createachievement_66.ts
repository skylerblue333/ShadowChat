// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createAchievement
import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Adjust path as needed
import { db } from "../db"; // Adjust path as needed
import { achievements } from "../schema"; // Adjust path as needed

export const achievementRouter = router({
  createAchievement: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid("Invalid user ID format."),
        name: z.string().min(1, "Achievement name cannot be empty."),
        description: z.string().min(1, "Achievement description cannot be empty."),
        points: z.number().int().positive("Points must be a positive integer."),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newAchievement = await db.insert(achievements).values({
          userId: input.userId,
          name: input.name,
          description: input.description,
          points: input.points,
        }).returning();

        if (!newAchievement || newAchievement.length === 0) {
          throw new Error("Failed to create achievement.");
        }

        return newAchievement[0];
      } catch (error) {
        console.error("Error creating achievement:", error);
        throw new Error("Could not create achievement. Please try again.");
      }
    }),
});
