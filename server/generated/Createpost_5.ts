// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createPost
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC instance
import { db } from "./db"; // Assuming db.ts exports your Drizzle ORM instance
import { posts } from "./schema"; // Assuming schema.ts defines your Drizzle schema for posts

export const postRouter = router({
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title cannot be empty"),
        content: z.string().min(1, "Content cannot be empty"),
        authorId: z.string().uuid("Invalid author ID format"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newPost = await db.insert(posts).values({
          title: input.title,
          content: input.content,
          authorId: input.authorId,
        }).returning();

        if (!newPost || newPost.length === 0) {
          throw new Error("Failed to create post.");
        }

        return { success: true, post: newPost[0] };
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Could not create post.");
      }
    }),
});
