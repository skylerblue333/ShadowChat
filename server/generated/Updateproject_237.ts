// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateProject
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { projects } from '../schema';

export const projectRouter = router({
  updateProject: publicProcedure
    .input(
      z.object({
        id: z.string().uuid({ message: "Invalid project ID format." }),
        name: z.string().min(1, { message: "Project name cannot be empty." }).optional(),
        description: z.string().optional(),
        status: z.enum(['active', 'inactive', 'completed', 'pending'], { message: "Invalid project status." }).optional(),
        // Add other updatable fields here with appropriate validation
      })
      .refine(data => Object.keys(data).some(key => key !== 'id'), {
        message: "At least one field other than 'id' must be provided for update.",
        path: ['name', 'description', 'status'], // Point to relevant fields for better error context
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        // Ensure there's actual data to update (already handled by .refine, but good for clarity)
        if (Object.keys(updateData).length === 0) {
          throw new Error("No valid fields provided for update."); // Should ideally not be reached due to refine
        }

        const result = await db.update(projects)
          .set(updateData)
          .where(eq(projects.id, id))
          .returning();

        if (result.length === 0) {
          // If no rows were affected, the project with the given ID was not found
          throw new Error(`Project with ID ${id} not found or no changes were made.`);
        }

        return result[0]; // Return the first (and only) updated project
      } catch (error) {
        console.error("Error updating project:", error);
        // Re-throw a more user-friendly error or a tRPC-specific error
        throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
      }
    }),
});