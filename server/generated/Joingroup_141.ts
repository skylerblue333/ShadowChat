// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: joinGroup
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { groups, usersToGroups } from '../schema';

export const groupRouter = router({
  joinGroup: publicProcedure
    .input(z.object({
      groupId: z.string().uuid(),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;

      // Operation 1: Check if the group exists
      const existingGroup = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
      if (existingGroup.length === 0) {
        throw new Error('Group not found');
      }

      // Operation 2: Check if the user is already in the group
      const existingMembership = await db.select().from(usersToGroups).where(and(eq(usersToGroups.groupId, groupId), eq(usersToGroups.userId, userId))).limit(1);
      if (existingMembership.length > 0) {
        throw new Error('User is already a member of this group');
      }

      // Operation 3: Add user to the group
      await db.insert(usersToGroups).values({ groupId, userId });

      return { success: true, message: 'Successfully joined group' };
    }),
});
