// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: searchUsers
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { db } from "./db"; // Assuming db instance is available

export const userRouter = router({
  searchUsers: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query cannot be empty"),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          email: z.string().email(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        const searchResults = await db
          .select()
          .from(users)
          .where(ilike(users.name, `%${input.query}%`));

        if (!searchResults || searchResults.length === 0) {
          // Optionally throw a specific error if no users are found
          // For this example, we'll return an empty array as per output schema
          return [];
        }

        return searchResults;
      } catch (error) {
        console.error("Error searching users:", error);
        throw new Error("Failed to search users");
      }
    }),
});

// Placeholder for trpc.ts and db.ts for context
// In a real application, these would be separate files.

// trpc.ts (simplified for this example)
// export const router = t.router;
// export const publicProcedure = t.procedure;

// db.ts (simplified for this example)
// import { Pool } from 'pg';
// const pool = new Pool({ connectionString: 'YOUR_DATABASE_URL' });
