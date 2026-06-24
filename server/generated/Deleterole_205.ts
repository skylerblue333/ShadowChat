// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteRole
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed for Drizzle db instance
import { roles } from '../db/schema'; // Adjust path as needed for Drizzle schema

// Define the input schema for the deleteRole procedure
const deleteRoleInputSchema = z.object({
  roleId: z.string().uuid({ message: "Invalid role ID format. Must be a UUID." }),
});

// Define the output schema for the deleteRole procedure
const deleteRoleOutputSchema = z.object({
  success: z.boolean(),
  deletedRoleId: z.string().uuid(),
  message: z.string().optional(),
});

export const roleRouter = router({
  deleteRole: publicProcedure
    .input(deleteRoleInputSchema)
    .output(deleteRoleOutputSchema) // Explicitly define output schema
    .mutation(async ({ input }) => {
      const { roleId } = input;

      try {
        // Operation 1: Validate input (handled by Zod schema)

        // Operation 2: Perform the database delete operation
        const deletedRoles = await db.delete(roles)
          .where(eq(roles.id, roleId))
          .returning({ id: roles.id });

        if (deletedRoles.length === 0) {
          // Operation 3: Handle case where role was not found
          throw new Error(`Role with ID ${roleId} not found or could not be deleted.`);
        }

        // Operation 4: Return success response
        return {
          success: true,
          deletedRoleId: deletedRoles[0].id,
          message: `Role with ID ${roleId} successfully deleted.`,
        };
      } catch (error) {
        // Operation 5: Handle any unexpected errors during the process
        console.error("Error deleting role:", error);
        throw new Error(`Failed to delete role: ${error.message}`);
      }
    }),
});