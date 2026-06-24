// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteCharity
import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Adjust path as needed
import { db } from "../db"; // Adjust path as needed
import { charities } from "../db/schema"; // Adjust path as needed

export const charityRouter = router({
  deleteCharity: publicProcedure
    .input(z.object({
      id: z.string().uuid("Invalid charity ID format."),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // 1. Validate input (handled by Zod schema)

      // 2. Check if charity exists before attempting deletion
      const existingCharity = await db.query.charities.findFirst({
        where: eq(charities.id, id),
      });

      if (!existingCharity) {
        throw new Error("Charity not found.");
      }

      // 3. Perform deletion
      const result = await db.delete(charities)
        .where(eq(charities.id, id))
        .returning({ id: charities.id });

      // 4. Handle deletion result
      if (result.length === 0) {
        throw new Error("Failed to delete charity.");
      }

      // 5. Return success confirmation
      return { success: true, deletedId: result[0].id, message: "Charity deleted successfully." };
    }),
});
