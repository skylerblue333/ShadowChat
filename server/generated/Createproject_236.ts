// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createProject

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { projects } from './schema'; // Assuming schema.ts defines your Drizzle schema

const createProjectInput = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['active', 'inactive', 'completed', 'pending']).default('pending'),
  ownerId: z.string().uuid("Invalid owner ID format"),
});

export const projectRouter = router({
  createProject: publicProcedure
    .input(createProjectInput)
    .mutation(async ({ input }) => {
      try {
        const newProject = await db.insert(projects).values({
          name: input.name,
          description: input.description,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          status: input.status,
          ownerId: input.ownerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newProject || newProject.length === 0) {
          throw new Error("Failed to create project: No data returned.");
        }

        return { success: true, project: newProject[0], message: "Project created successfully" };
      } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});

export type ProjectRouter = typeof projectRouter;
