// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removeRole

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup file

const removeRoleInput = z.object({
  id: z.string().uuid(),
});

const removeRoleOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  roleId: z.string().uuid().optional(),
});

export const roleRouter = router({
  removeRole: publicProcedure
    .input(removeRoleInput)
    .output(removeRoleOutput)
    .mutation(async ({ input }) => {
      const { id } = input;

      try {
        const result = await db.delete(roles).where(eq(roles.id, id)).returning({ id: roles.id });

        if (result.length === 0) {
          return {
            success: false,
            message: `Role with ID ${id} not found.`, 
          };
        }

        return {
          success: true,
          message: `Role with ID ${id} removed successfully.`, 
          roleId: result[0].id,
        };
      } catch (error) {
        console.error('Error removing role:', error);
        return {
          success: false,
          message: 'Failed to remove role due to an internal server error.',
        };
      }
    }),
});
