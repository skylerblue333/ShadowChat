// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createPermission
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { permissions } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const createPermissionSchema = z.object({
  name: z.string().min(1, 'Permission name cannot be empty'),
});

export const permissionRouter = router({
  createPermission: publicProcedure
    .input(createPermissionSchema)
    .mutation(async ({ input }) => {
      try {
        const newPermission = await db.insert(permissions).values({
          name: input.name,
        }).returning();

        if (!newPermission || newPermission.length === 0) {
          throw new Error('Failed to create permission');
        }

        return { success: true, permission: newPermission[0] };
      } catch (error) {
        console.error('Error creating permission:', error);
        throw new Error(`Could not create permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
