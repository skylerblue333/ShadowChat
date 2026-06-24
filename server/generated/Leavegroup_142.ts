// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: leaveGroup
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db'; // Assuming db is your Drizzle instance
import { userGroups, groups } from '../schema'; // Assuming your Drizzle schema

export const groupRouter = router({
  leaveGroup: publicProcedure
    .input(z.object({
      groupId: z.string().uuid('Invalid group ID format'),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Authenticate user (assuming ctx.userId is available from middleware)
      const userId = ctx.userId; // Or ctx.session.user.id, depending on auth setup
      if (!userId) {
        throw new Error('Unauthorized: User not logged in.');
      }

      const { groupId } = input;

      // 2. Check if the group exists
      const existingGroup = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
      if (existingGroup.length === 0) {
        throw new Error('Group not found.');
      }

      // 3. Check if the user is a member of the group
      const membership = await db.select().from(userGroups)
        .where(and(eq(userGroups.userId, userId), eq(userGroups.groupId, groupId)))
        .limit(1);

      if (membership.length === 0) {
        throw new Error('User is not a member of this group.');
      }

      // 4. Remove the user from the group
      await db.delete(userGroups)
        .where(and(eq(userGroups.userId, userId), eq(userGroups.groupId, groupId)));

      return { success: true, message: 'Successfully left the group.' };
    }),
});