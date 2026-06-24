// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getGroupsProcedure

import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { groups } from '../schema';

export const getGroupsProcedure = publicProcedure
  .input(z.object({
    groupId: z.string().optional(),
  }))
  .query(async ({ input }) => {
    try {
      if (input.groupId) {
        const result = await db.select().from(groups).where(eq(groups.id, input.groupId)).execute();
        if (result.length === 0) {
          throw new Error('Group not found');
        }
        return result[0];
      } else {
        const allGroups = await db.select().from(groups).execute();
        return allGroups;
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups');
    }
  });

export const appRouter = router({
  getGroups: getGroupsProcedure,
});

export type AppRouter = typeof appRouter;
