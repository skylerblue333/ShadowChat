// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createTemplate
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in ./trpc
import { db } from './db'; // Assuming Drizzle DB instance is in ./db
import { templates } from './schema'; // Assuming Drizzle schema is in ./schema

// Input schema for creating a template
const createTemplateInput = z.object({
  name: z.string().min(1, "Template name cannot be empty").max(255, "Template name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  content: z.string().min(1, "Template content cannot be empty"),
});

// Output schema for a created template
const templateOutput = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const templateRouter = router({
  createTemplate: publicProcedure
    .input(createTemplateInput)
    .output(templateOutput)
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod automatically)

        // 2. Check for existing template with the same name to prevent duplicates
        const existingTemplate = await db.select().from(templates).where(eq(templates.name, input.name)).limit(1);
        if (existingTemplate.length > 0) {
          throw new Error(`Template with name '${input.name}' already exists.`);
        }

        // 3. Insert the new template into the database
        const [newTemplate] = await db.insert(templates).values({
          name: input.name,
          description: input.description,
          content: input.content,
        }).returning();

        if (!newTemplate) {
          throw new Error("Failed to create template.");
        }

        // 4. Return the newly created template
        return newTemplate;
      } catch (error) {
        console.error("Error creating template:", error);
        throw new Error(`Could not create template: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
