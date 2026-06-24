// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getGroupMembers
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { groupMembers, users } from '../db/schema';

export const groupMembersRouter = router({
  getGroupMembers: publicProcedure
    .input(z.object({
      groupId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const members = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, input.groupId))
        .innerJoin(users, eq(groupMembers.userId, users.id));

        if (!members || members.length === 0) {
          throw new Error('No members found for this group.');
        }

        return {
          success: true,
          members,
        };
      } catch (error) {
        console.error('Error fetching group members:', error);
        throw new Error('Failed to retrieve group members.');
      }
    }),
});
