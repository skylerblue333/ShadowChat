// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: addDepartmentMember
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { departments, departmentMembers } from '../schema';
import { TRPCError } from '@trpc/server';

export const departmentRouter = router({
  addDepartmentMember: publicProcedure
    .input(z.object({
      departmentId: z.number().int().positive(),
      memberId: z.string().min(1, 'Member ID cannot be empty'),
      role: z.string().optional().default('member'),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { departmentId, memberId, role } = input;

      // 1. Validate department existence
      const departmentExists = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
      if (departmentExists.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Department not found.',
        });
      }

      // 2. Check if member is already in the department
      const existingMember = await db.select().from(departmentMembers)
        .where(eq(departmentMembers.departmentId, departmentId) && eq(departmentMembers.memberId, memberId))
        .limit(1);

      if (existingMember.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Member already exists in this department.',
        });
      }

      // 3. Add member to department
      const [newMember] = await db.insert(departmentMembers).values({
        departmentId,
        memberId,
        role,
      }).returning();

      if (!newMember) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add department member.',
        });
      }

      return { success: true, member: newMember };
    }),
});