// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateTeam
import { z } from 'zod';
import { publicProcedure } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts defines your Drizzle DB connection
import { teams } from './schema'; // Assuming schema.ts defines your Drizzle schema

const updateTeamInput = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).optional(),
});

export const updateTeam = publicProcedure
  .input(updateTeamInput)
  .mutation(async ({ input }) => {
    const { teamId, name, description } = input;

    try {
      const [updatedTeam] = await db.update(teams)
        .set({
          name,
          description,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, teamId))
        .returning();

      if (!updatedTeam) {
        throw new Error('Team not found or not updated');
      }

      return {
        success: true,
        message: 'Team updated successfully',
        team: updatedTeam,
      };
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }
  });
