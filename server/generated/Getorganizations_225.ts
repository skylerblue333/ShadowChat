// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getOrganizations
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { organizations } from './schema';
import { z } from 'zod';

export const getOrganizationsProcedure = publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).optional(),
    offset: z.number().min(0).optional(),
  }).optional())
  .query(async ({ input }) => {
    try {
      const limit = input?.limit ?? 10;
      const offset = input?.offset ?? 0;

      const result = await db.select().from(organizations).limit(limit).offset(offset);

      if (!result) {
        throw new Error('Organizations not found');
      }

      return result;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw new Error('Failed to fetch organizations');
    }
  });

export const appRouter = router({
  getOrganizations: getOrganizationsProcedure,
});

export type AppRouter = typeof appRouter;
