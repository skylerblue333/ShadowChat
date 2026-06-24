// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removeTeamMember
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db'; // Assuming db is your Drizzle instance
import { teamMembers, users } from './schema'; // Assuming you have these schemas defined

export const teamRouter = router({
  removeTeamMember: publicProcedure
    .input(z.object({
      teamId: z.string().uuid(),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { teamId, userId } = input;

      // 1. Validate if the team member exists in the specified team
      const existingTeamMember = await db.select().from(teamMembers).where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
      ).limit(1);

      if (existingTeamMember.length === 0) {
        throw new Error('Team member not found in this team.');
      }

      // 2. Perform the removal operation
      const result = await db.delete(teamMembers).where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
      );

      // 3. Check if the deletion was successful
      if (result.rowCount === 0) {
        throw new Error('Failed to remove team member.');
      }

      return { success: true, message: 'Team member removed successfully.' };
    }),
});
