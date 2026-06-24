// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTeamMembers
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { users, teams, teamMembers, getTeamMembersInput, getTeamMembersOutput } from './schema';

export const teamRouter = router({
  getTeamMembers: publicProcedure
    .input(getTeamMembersInput)
    .output(getTeamMembersOutput)
    .query(async ({ input }) => {
      try {
        const { teamId } = input;

        // Check if the team exists
        const teamExists = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
        if (teamExists.length === 0) {
          throw new Error('Team not found');
        }

        const members = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: teamMembers.role,
          })
          .from(teamMembers)
          .innerJoin(users, eq(teamMembers.userId, users.id))
          .where(eq(teamMembers.teamId, teamId));

        if (members.length === 0) {
          // Optionally, return an empty array or throw an error if no members are found
          // For this example, we'll return an empty array as it's a valid scenario
          return [];
        }

        return members;
      } catch (error) {
        console.error('Error fetching team members:', error);
        throw new Error('Failed to retrieve team members.');
      }
    }),
});

// Example of how to integrate this into a root router (for context, not part of the procedure itself)
// import { teamRouter } from './getTeamMembers';
// export const appRouter = router({
//   team: teamRouter,
// });
// export type AppRouter = typeof appRouter;
