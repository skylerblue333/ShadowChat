// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createTeam
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle DB instance
import { teams } from './schema'; // Assuming schema.ts defines your Drizzle schema for teams

const createTeamInputSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50, 'Team name must not exceed 50 characters'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional(),
  ownerId: z.string().uuid('Invalid owner ID format'), // Assuming ownerId is a UUID
});

export const teamRouter = router({
  createTeam: publicProcedure
    .input(createTeamInputSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if a team with the same name already exists
        const existingTeam = await db.select().from(teams).where(eq(teams.name, input.name)).execute();

        if (existingTeam.length > 0) {
          throw new Error('A team with this name already exists.');
        }

        const [newTeam] = await db.insert(teams).values({
          name: input.name,
          description: input.description,
          ownerId: input.ownerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newTeam) {
          throw new Error('Failed to create team.');
        }

        return newTeam;
      } catch (error) {
        console.error('Error creating team:', error);
        throw new Error(`Failed to create team: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});

export type TeamRouter = typeof teamRouter;