// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteProject
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM database instance
import { projects } from './schema'; // Assuming schema.ts defines your Drizzle schema

const deleteProjectInput = z.object({
  projectId: z.string().uuid(),
});

// Define the output schema for the deleteProject procedure
const deleteProjectOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const projectRouter = router({
  deleteProject: publicProcedure
    .input(deleteProjectInput)
    .output(deleteProjectOutput)
    .mutation(async ({ input }) => {
      try {
        const deletedProjects = await db.delete(projects).where(eq(projects.id, input.projectId)).returning();

        if (deletedProjects.length === 0) {
          return { success: false, message: 'Project not found.' };
        }

        return { success: true, message: 'Project deleted successfully.' };
      } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, message: 'Failed to delete project.' };
      }
    }),
});