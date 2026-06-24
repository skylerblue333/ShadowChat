// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removeDepartmentMember
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup
import { db } from './db'; // Assuming Drizzle DB client setup
import { departmentMembers, departments } from './schema'; // Assuming Drizzle schema

const removeDepartmentMemberInput = z.object({
  departmentId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export const departmentRouter = router({
  removeDepartmentMember: publicProcedure
    .input(removeDepartmentMemberInput)
    .mutation(async ({ input }) => {
      const { departmentId, memberId } = input;

      try {
        // 1. Check if department exists (optional, but good for robust error handling)
        const departmentExists = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
        if (departmentExists.length === 0) {
          throw new Error('Department not found');
        }

        // 2. Check if member is part of the department
        const memberInDepartment = await db.select().from(departmentMembers).where(and(eq(departmentMembers.departmentId, departmentId), eq(departmentMembers.memberId, memberId))).limit(1);
        if (memberInDepartment.length === 0) {
          throw new Error('Member not found in this department');
        }

        // 3. Perform the deletion
        const result = await db.delete(departmentMembers).where(and(eq(departmentMembers.departmentId, departmentId), eq(departmentMembers.memberId, memberId)));

        if (result.rowCount === 0) {
          // This case might be caught by the memberInDepartment check, but good to have as a fallback
          throw new Error('Failed to remove department member, possibly already removed or not found.');
        }

        return { success: true, message: 'Department member removed successfully', memberId };
      } catch (error) {
        console.error('Error removing department member:', error);
        throw new Error(`Failed to remove department member: ${error.message}`);
      }
    }),
});