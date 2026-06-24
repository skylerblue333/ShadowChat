// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteTeam

import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { teams } from '../schema';

export const teamRouter = router({
  deleteTeam: publicProcedure
    .input(z.object({
      teamId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { teamId } = input;

        // Check if the team exists before attempting to delete
        const existingTeam = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

        if (existingTeam.length === 0) {
          throw new Error('Team not found');
        }

        // Perform the deletion
        await db.delete(teams).where(eq(teams.id, teamId));

        return { success: true, message: `Team with ID ${teamId} deleted successfully.` };
      } catch (error) {
        console.error('Error deleting team:', error);
        throw new Error('Failed to delete team.');
      }
    }),
});
