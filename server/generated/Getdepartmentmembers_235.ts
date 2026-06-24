// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getDepartmentMembers
import { publicProcedure, router } from './trpc'; // Assuming trpc setup
import { z } from 'zod';
import { db } from './db'; // Assuming db instance is available
import { users, departments } from './schema'; // Assuming Drizzle schema is available
import { TRPCError } from '@trpc/server';

// Input Schema
export const GetDepartmentMembersInput = z.object({
  departmentId: z.string().uuid('Invalid department ID format. Must be a UUID.'),
});

// Output Schema
export const DepartmentMemberOutput = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const GetDepartmentMembersOutput = z.array(DepartmentMemberOutput);

export const departmentRouter = router({
  getDepartmentMembers: publicProcedure
    .input(GetDepartmentMembersInput)
    .output(GetDepartmentMembersOutput)
    .query(async ({ input }) => {
      try {
        // 1. Check if department exists
        const departmentExists = await db.select({ id: departments.id })
          .from(departments)
          .where(eq(departments.id, input.departmentId))
          .limit(1);

        if (departmentExists.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Department not found.',
          });
        }

        // 2. Fetch members
        const members = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.departmentId, input.departmentId));

        // 3. Return members
        return members;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // Re-throw tRPC errors directly
        } else {
          console.error('Database error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
          });
        }
      }
    }),
});

export type GetDepartmentMembersOutput = z.infer<typeof GetDepartmentMembersOutput>;
export type GetDepartmentMembersInput = z.infer<typeof GetDepartmentMembersInput>;
