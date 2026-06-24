// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCodeSnippets
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { db } from "./db";
import { codeSnippets } from "./schema";

export const getCodeSnippets = publicProcedure
  .input(
    z.object({
      language: z.string().optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input }) => {
    try {
      const { language, limit, offset } = input;

      const whereClause = language ? eq(codeSnippets.language, language) : isNotNull(codeSnippets.language);

      const snippets = await db
        .select({
          id: codeSnippets.id,
          title: codeSnippets.title,
          language: codeSnippets.language,
          code: codeSnippets.code,
          createdAt: codeSnippets.createdAt,
        })
        .from(codeSnippets)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      return snippets;
    } catch (error) {
      console.error("Error fetching code snippets:", error);
      // In a production environment, you might want to return a more generic error message
      throw new Error("Failed to retrieve code snippets.");
    }
  });

export const appRouter = router({
  getCodeSnippets: getCodeSnippets,
});

export type AppRouter = typeof appRouter;
