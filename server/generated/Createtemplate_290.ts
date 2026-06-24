// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createTemplate
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { templates } from '../db/schema';

export const templateRouter = router({
  createTemplate: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Template name cannot be empty'),
        description: z.string().optional(),
        content: z.string().min(1, 'Template content cannot be empty'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newTemplate = await db.insert(templates).values({
          name: input.name,
          description: input.description,
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTemplate || newTemplate.length === 0) {
          throw new Error('Failed to create template');
        }

        return newTemplate[0];
      } catch (error) {
        console.error('Error creating template:', error);
        throw new Error('Could not create template');
      }
    }),
});