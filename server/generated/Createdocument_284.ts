// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createDocument
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { documents } from "../schema";

export const documentRouter = router({
  createDocument: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title cannot be empty"),
        content: z.string().optional(),
        authorId: z.string().uuid("Invalid author ID format"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Operation 1: Insert document into the database
        const [newDocument] = await db
          .insert(documents)
          .values({
            title: input.title,
            content: input.content,
            authorId: input.authorId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        if (!newDocument) {
          // Operation 2: Handle insertion failure
          throw new Error("Failed to create document.");
        }

        // Operation 3: Return the newly created document
        return {
          success: true,
          document: newDocument,
          message: "Document created successfully.",
        };
      } catch (error) {
        console.error("Error creating document:", error);
        // Operation 4: Handle any other errors during the process
        throw new Error(`Failed to create document: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
