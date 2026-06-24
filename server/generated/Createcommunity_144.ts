// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createCommunity
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { communities } from "../db/schema";

export const communityRouter = router({
  createCommunity: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, "Community name must be at least 3 characters long"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [newCommunity] = await db.insert(communities).values({
          name: input.name,
          description: input.description,
        }).returning();

        if (!newCommunity) {
          throw new Error("Failed to create community.");
        }

        return {
          success: true,
          message: "Community created successfully",
          community: newCommunity,
        };
      } catch (error) {
        console.error("Error creating community:", error);
        throw new Error("Could not create community. Please try again.");
      }
    }),
});
