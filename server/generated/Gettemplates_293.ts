// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTemplates

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path to your Drizzle DB instance
import { templates } from '../schema'; // Adjust path to your Drizzle schema

export const templateRouter = router({
  getTemplates: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const { search, limit, offset } = input || {};

        let query = db.select().from(templates).$dynamic();

        if (search) {
          query = query.where(like(templates.name, `%${search}%`));
        }

        const result = await query.limit(limit).offset(offset);

        if (!result) {
          throw new Error('Failed to retrieve templates.');
        }

        return result;
      } catch (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Could not fetch templates. Please try again later.');
      }
    }),
});
