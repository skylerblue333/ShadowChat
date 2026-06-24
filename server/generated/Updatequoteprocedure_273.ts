// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateQuoteProcedure
import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Adjust path as needed
import { db } from "../db"; // Adjust path as needed
import { quotes } from "../db/schema"; // Adjust path as needed
import { TRPCError } from "@trpc/server";

export const updateQuoteProcedure = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      text: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { id, text, author } = input;

    // 1. Validate input (handled by Zod schema)

    // 2. Check if the quote exists
    const existingQuote = await ctx.db.query.quotes.findFirst({
      where: eq(quotes.id, id),
    });

    if (!existingQuote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Quote with ID ${id} not found.`,
      });
    }

    // 3. Prepare update data
    const updateData: { text?: string; author?: string; updatedAt?: Date } = {};
    if (text) {
      updateData.text = text;
    }
    if (author) {
      updateData.author = author;
    }
    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length === 1 && !text && !author) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No fields provided for update.",
        });
    }

    // 4. Update the quote in the database
    const [updatedQuote] = await ctx.db
      .update(quotes)
      .set(updateData)
      .where(eq(quotes.id, id))
      .returning();

    if (!updatedQuote) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update quote.",
      });
    }

    // 5. Return the updated quote
    return updatedQuote;
  });

// Example of how this procedure would be integrated into a router
// export const appRouter = router({
//   quote: router({
//     update: updateQuoteProcedure,
//   }),
// });