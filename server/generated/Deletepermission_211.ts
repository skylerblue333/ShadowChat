// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deletePermission

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts is in the same directory
import { db } from './db'; // Assuming db.ts exports a Drizzle instance
import { permissions } from './schema'; // Assuming schema.ts defines the permissions table

const deletePermissionInput = z.object({
  id: z.string().uuid({ message: "Invalid permission ID format." }),
});

const deletePermissionOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const permissionRouter = router({
  deletePermission: publicProcedure
    .input(deletePermissionInput)
    .output(deletePermissionOutput)
    .mutation(async ({ input }) => {
      try {
        const result = await db.delete(permissions)
          .where(eq(permissions.id, input.id))
          .returning({ id: permissions.id });

        if (result.length === 0) {
          return { success: false, message: "Permission not found or already deleted." };
        }

        return { success: true, message: "Permission deleted successfully." };
      } catch (error) {
        console.error("Error deleting permission:", error);
        return { success: false, message: "Failed to delete permission due to an internal error." };
      }
    }),
});

export type PermissionRouter = typeof permissionRouter;
