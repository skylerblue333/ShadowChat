// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTemplates

import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { templates } from '../schema';

export const templatesRouter = router({
  getTemplates: publicProcedure
    .input(z.object({
      userId: z.string().uuid().optional(),
      templateId: z.string().uuid().optional(),
    }))
    .query(async ({ input }) => {
      try {
        if (input.templateId) {
          const template = await db.select().from(templates).where(eq(templates.id, input.templateId)).limit(1);
          if (!template.length) {
            throw new Error('Template not found');
          }
          return template[0];
        }

        if (input.userId) {
          const userTemplates = await db.select().from(templates).where(eq(templates.userId, input.userId));
          return userTemplates;
        }

        const allTemplates = await db.select().from(templates);
        return allTemplates;

      } catch (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
      }
    }),
});

export type TemplatesRouter = typeof templatesRouter;
