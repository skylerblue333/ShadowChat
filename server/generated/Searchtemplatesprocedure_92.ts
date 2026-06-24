// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: searchTemplatesProcedure

import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc setup
import { db } from "./db"; // Assuming Drizzle db instance
import { templates } from "./schema"; // Assuming Drizzle schema for templates

export const searchTemplatesProcedure = publicProcedure
  .input(z.object({
    query: z.string().min(1, "Search query cannot be empty."),
  }))
  .output(z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
  })))
  .query(async ({ input }) => {
    try {
      const results = await db.select().from(templates).where(like(templates.name, `%${input.query}%`));
      return results.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        createdAt: template.createdAt,
      }));
    } catch (error) {
      console.error("Error searching templates:", error);
      throw new Error("Failed to search templates.");
    }
  });

// Example of how this procedure would be integrated into a router
// export const appRouter = router({
//   searchTemplates: searchTemplatesProcedure,
// });
