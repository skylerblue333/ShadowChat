// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteTemplate
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { templates } from "../db/schema";

export const templateRouter = router({
  deleteTemplate: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by zod schema)

        // 2. Perform deletion operation
        const result = await db.delete(templates).where(eq(templates.id, input.id));

        // 3. Check if any template was actually deleted
        if (result.rowsAffected === 0) {
          throw new Error("Template not found or already deleted.");
        }

        // 4. Return success message
        return { success: true, message: "Template deleted successfully." };
      } catch (error) {
        // 5. Handle errors
        console.error("Error deleting template:", error);
        throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
