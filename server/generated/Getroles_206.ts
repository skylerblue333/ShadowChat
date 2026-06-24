// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getRoles
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { roles } from '../schema';

export const skycoin4444Router = router({
  getRoles: publicProcedure
    .input(z.object({
      roleId: z.string().optional(),
    }))
    .output(z.array(z.object({
      id: z.string(),
      name: z.string(),
    })))
    .query(async ({ input }) => {
      try {
        let result;
        if (input.roleId) {
          result = await db.select().from(roles).where(eq(roles.id, input.roleId));
        } else {
          result = await db.select().from(roles);
        }

        if (!result || result.length === 0) {
          throw new Error('No roles found.');
        }

        return result;
      } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Failed to retrieve roles.');
      }
    }),
});