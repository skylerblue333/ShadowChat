// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: addComment
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { comments } from "../db/schema";
import { TRPCError } from "@trpc/server";

export const addCommentProcedure = publicProcedure
  .input(
    z.object({
      text: z.string().min(1, "Comment cannot be empty"),
      userId: z.string(),
      postId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      // 1. Validate input (handled by Zod schema)

      // 2. Insert the new comment into the database
      const [newComment] = await db.insert(comments).values({
        text: input.text,
        userId: input.userId,
        postId: input.postId,
      }).returning();

      if (!newComment) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add comment.",
        });
      }

      // 3. Return the newly created comment
      return {
        success: true,
        comment: newComment,
        message: "Comment added successfully",
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      });
    }
  });

// Example of how this procedure would be included in a router:
// export const appRouter = router({
//   addComment: addCommentProcedure,
// });
