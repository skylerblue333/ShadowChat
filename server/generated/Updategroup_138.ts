// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateGroup
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { db } from "../db";
import { groups } from "../db/schema";

export const updateGroup = publicProcedure
  .input(
    z.object({
      groupId: z.string().uuid(),
      name: z.string().min(1).max(255),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const [updatedGroup] = await db
        .update(groups)
        .set({ name: input.name, updatedAt: new Date() })
        .where(eq(groups.id, input.groupId))
        .returning();

      if (!updatedGroup) {
        throw new Error("Group not found or could not be updated.");
      }

      return {
        success: true,
        message: "Group updated successfully",
        group: updatedGroup,
      };
    } catch (error) {
      console.error("Error updating group:", error);
      throw new Error("Failed to update group.");
    }
  });
