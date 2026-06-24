// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteGroup

import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Adjust path as needed
import { db } from "../db"; // Adjust path as needed
import { groups } from "../db/schema"; // Adjust path as needed

export const groupRouter = router({
  deleteGroup: publicProcedure
    .input(z.object({
      groupId: z.string().uuid("Invalid group ID format."),
    }))
    .mutation(async ({ input }) => {
      try {
        // 1. Check if the group exists
        const existingGroup = await db.select().from(groups).where(eq(groups.id, input.groupId)).limit(1);

        if (existingGroup.length === 0) {
          throw new Error("Group not found.");
        }

        // 2. Delete the group
        const result = await db.delete(groups).where(eq(groups.id, input.groupId));

        if (result.rowCount === 0) {
          throw new Error("Failed to delete group.");
        }

        return { success: true, message: `Group with ID ${input.groupId} deleted successfully.` };
      } catch (error) {
        console.error("Error deleting group:", error);
        throw new Error(`Failed to delete group: ${error.message}`);
      }
    }),
});
