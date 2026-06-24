// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteQuote
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC instance
import { db } from "./db"; // Assuming db.ts exports your Drizzle client
import { quotes } from "./schema"; // Assuming schema.ts defines your Drizzle schema

export const quoteRouter = router({
  deleteQuote: publicProcedure
    .input(z.object({
      id: z.string().uuid("Invalid quote ID format."),
    }))
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod schema)

        // 2. Perform database operation: Delete the quote
        const deletedQuotes = await db.delete(quotes)
          .where(eq(quotes.id, input.id))
          .returning({ id: quotes.id });

        // 3. Error handling: Check if a quote was actually deleted
        if (deletedQuotes.length === 0) {
          throw new Error("Quote not found or already deleted.");
        }

        // 4. Return success
        return { success: true, deletedId: deletedQuotes[0].id };
      } catch (error) {
        console.error("Error deleting quote:", error);
        throw new Error(`Failed to delete quote: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
