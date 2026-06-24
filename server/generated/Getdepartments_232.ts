// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getDepartments
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db instance is exported from ./db
import { departments } from './schema'; // Assuming departments schema is exported from ./schema

export const departmentRouter = router({
  getDepartments: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      offset: z.number().min(0).nullish(),
    }).nullish())
    .query(async ({ input }) => {
      try {
        const limit = input?.limit ?? 10;
        const offset = input?.offset ?? 0;

        const result = await db.select().from(departments).limit(limit).offset(offset);

        if (!result) {
          throw new Error('Departments not found');
        }

        return result;
      } catch (error) {
        console.error('Error fetching departments:', error);
        throw new Error('Failed to fetch departments');
      }
    }),
});
