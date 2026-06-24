// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getOrganizationMembers
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { organizationMembers, organizations } from '../schema';

export const organizationRouter = router({
  getOrganizationMembers: publicProcedure
    .input(z.object({
      organizationId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const members = await db.select()
          .from(organizationMembers)
          .where(eq(organizationMembers.organizationId, input.organizationId))
          .execute();

        if (!members || members.length === 0) {
          throw new Error('No members found for this organization.');
        }

        return members;
      } catch (error) {
        console.error('Error fetching organization members:', error);
        throw new Error('Failed to retrieve organization members.');
      }
    }),
});