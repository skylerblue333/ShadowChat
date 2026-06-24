// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: addTeamMember
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { teamMembers } from '../db/schema';

// Input schema for adding a team member
const addTeamMemberInput = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member', 'viewer']), // Example roles
  teamId: z.string().uuid('Invalid team ID'), // Assuming UUID for teamId
});

export const teamRouter = router({
  addTeamMember: publicProcedure
    .input(addTeamMemberInput)
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled automatically by .input(addTeamMemberInput))

        // 2. Check for existing team member with the same email in the team (optional but good practice)
        const existingMember = await db.select().from(teamMembers)
          .where(and(eq(teamMembers.email, input.email), eq(teamMembers.teamId, input.teamId)));

        if (existingMember.length > 0) {
          throw new Error('A team member with this email already exists in this team.');
        }

        // 3. Insert new team member into the database
        const [newTeamMember] = await db.insert(teamMembers).values({
          id: crypto.randomUUID(), // Generate a new UUID for the team member
          name: input.name,
          email: input.email,
          role: input.role,
          teamId: input.teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTeamMember) {
          throw new Error('Failed to add team member to the database.');
        }

        // 4. Return success response with the newly created team member
        return {
          success: true,
          message: 'Team member added successfully.',
          teamMember: newTeamMember,
        };
      } catch (error) {
        console.error('Error adding team member:', error);
        // 5. Handle and re-throw errors for tRPC client to catch
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.');
      }
    }),
});
