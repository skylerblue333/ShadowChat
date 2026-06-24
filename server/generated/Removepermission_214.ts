// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removePermission
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { permissions } from '../db/schema'; // Assuming a 'permissions' table in Drizzle schema

// Input schema for removing a permission
const removePermissionInput = z.object({
  permissionId: z.string().uuid({ message: "Invalid permission ID format." }),
});

// Output schema for the procedure
const removePermissionOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const skycoin4444Router = router({
  removePermission: publicProcedure
    .input(removePermissionInput)
    .output(removePermissionOutput) // Define output schema for better typing
    .mutation(async ({ input }) => {
      const { permissionId } = input;

      // Logic Step 1: Attempt to delete the permission from the database.
      // This is a single database operation.
      const deletedPermissions = await db.delete(permissions)
        .where(eq(permissions.id, permissionId))
        .returning({ id: permissions.id }); // Return the ID of the deleted record.

      // Logic Step 2: Check if any permission was actually deleted.
      // This acts as validation and error handling.
      if (deletedPermissions.length === 0) {
        // If no permission was found with the given ID, throw an error.
        throw new Error(`Permission with ID ${permissionId} not found or already removed.`);
      }

      // Logic Step 3: Return success message if deletion was successful.
      return { success: true, message: `Permission ${permissionId} removed successfully.` };
    }),
});