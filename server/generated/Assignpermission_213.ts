// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: assignPermission
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle db instance
import { userPermissions } from '../db/schema'; // Assuming Drizzle schema

export const assignPermission = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid('Invalid user ID format. Must be a UUID.'),
      permissionId: z.string().uuid('Invalid permission ID format. Must be a UUID.'),
      action: z.enum(['add', 'remove']).default('add'), // Optional action
    })
  )
  .mutation(async ({ input }) => {
    const { userId, permissionId, action } = input;

    try {
      if (action === 'add') {
        // Operation 1: Check if permission already exists for the user
        const existingPermission = await db.query.userPermissions.findFirst({
          where: and(eq(userPermissions.userId, userId), eq(userPermissions.permissionId, permissionId)),
        });

        if (existingPermission) {
          return { message: 'Permission already assigned' };
        }

        // Operation 2: Add the permission
        await db.insert(userPermissions).values({
          userId,
          permissionId,
        });
        return { message: 'Permission assigned successfully' };
      } else { // action === 'remove'
        // Operation 3: Remove the permission
        const result = await db.delete(userPermissions).where(
          and(eq(userPermissions.userId, userId), eq(userPermissions.permissionId, permissionId))
        ).returning();

        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Permission not found for this user.',
          });
        }
        return { message: 'Permission removed successfully' };
      }
    } catch (error) {
      console.error('Error assigning/removing permission:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process permission request.',
      });
    }
  });
