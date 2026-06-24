// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateTemplate
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { templates } from '../db/schema';

// Input schema for updating a template
const updateTemplateInput = z.object({
  id: z.string().uuid({ message: 'Invalid template ID format.' }),
  name: z.string().min(1, 'Template name cannot be empty.').max(255, 'Template name is too long.').optional(),
  content: z.string().min(1, 'Template content cannot be empty.').optional(),
});

// Output schema for the updateTemplate procedure
const updateTemplateOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  template: z.object({
    id: z.string().uuid(),
    name: z.string(),
    content: z.string(),
    updatedAt: z.date(),
  }).optional(),
});

export const templateRouter = router({
  updateTemplate: publicProcedure
    .input(updateTemplateInput)
    .output(updateTemplateOutput)
    .mutation(async ({ input }) => {
      const { id, name, content } = input;

      if (!name && !content) {
        return { success: false, message: 'At least one field (name or content) must be provided for update.' };
      }

      try {
        const [updatedTemplate] = await db.update(templates)
          .set({
            name: name,
            content: content,
            updatedAt: new Date(),
          })
          .where(eq(templates.id, id))
          .returning();

        if (!updatedTemplate) {
          return { success: false, message: `Template with ID ${id} not found.` };
        }

        return { success: true, message: 'Template updated successfully.', template: updatedTemplate };
      } catch (error) {
        console.error('Failed to update template:', error);
        return { success: false, message: 'An unexpected error occurred during template update.' };
      }
    }),
});