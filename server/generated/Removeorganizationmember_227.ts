// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removeOrganizationMember
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { organizationMembers } from '../schema';

export const organizationRouter = router({
  removeOrganizationMember: publicProcedure
    .input(z.object({
      organizationId: z.string().uuid(),
      memberId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { organizationId, memberId } = input;

      // 1. Validate input (handled by zod schema)

      // 2. Check if the organization member exists
      const existingMember = await db.select().from(organizationMembers)
        .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.memberId, memberId)))
        .limit(1);

      if (existingMember.length === 0) {
        throw new Error('Organization member not found.');
      }

      // 3. Remove the organization member from the database
      const result = await db.delete(organizationMembers)
        .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.memberId, memberId)));

      if (result.rowCount === 0) {
        throw new Error('Failed to remove organization member.');
      }

      return { success: true, message: 'Organization member removed successfully.' };
    }),
});