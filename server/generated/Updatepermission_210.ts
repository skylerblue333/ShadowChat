// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updatePermission

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in ./trpc
import { db } from './db'; // Assuming Drizzle DB instance is in ./db
import { permissions } from './schema'; // Assuming Drizzle schema for permissions table
import { TRPCError } from '@trpc/server';

const updatePermissionInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(5).max(500).optional(),
  canRead: z.boolean().optional(),
  canWrite: z.boolean().optional(),
});

export const permissionRouter = router({
  updatePermission: publicProcedure
    .input(updatePermissionInput)
    .mutation(async ({ input }) => {
      const { id, ...dataToUpdate } = input;

      if (Object.keys(dataToUpdate).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No fields provided for update.',
        });
      }

      const [updatedPermission] = await db.update(permissions)
        .set({
          ...dataToUpdate,
          updatedAt: new Date(),
        })
        .where(eq(permissions.id, id))
        .returning();

      if (!updatedPermission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Permission with ID ${id} not found.`,
        });
      }

      return {
        message: 'Permission updated successfully',
        permission: updatedPermission,
      };
    }),
});

// Example of how to integrate this into a root router:
// import { permissionRouter } from './permissionRouter';
// export const appRouter = router({
//   permissions: permissionRouter,
// });
