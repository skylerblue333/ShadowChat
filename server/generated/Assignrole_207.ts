// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: assignRole
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { users, userRoles, roles } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const assignRoleProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      roleId: z.string().uuid(),
    })
  )
  .mutation(async ({ input }) => {
    const { userId, roleId } = input;

    // 1. Validate if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      throw new Error('User not found');
    }

    // 2. Validate if role exists
    const existingRole = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (existingRole.length === 0) {
      throw new Error('Role not found');
    }

    // 3. Check if user already has the role
    const existingUserRole = await db.select().from(userRoles).where(eq(userRoles.userId, userId) && eq(userRoles.roleId, roleId)).limit(1);
    if (existingUserRole.length > 0) {
      throw new Error('User already has this role');
    }

    // 4. Assign the role to the user
    await db.insert(userRoles).values({ userId, roleId });

    return { success: true, message: 'Role assigned successfully' };
  });

export const appRouter = router({
  assignRole: assignRoleProcedure,
});

export type AppRouter = typeof appRouter;
