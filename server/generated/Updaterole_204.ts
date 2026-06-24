// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateRole
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { users, userRoles } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const userRouter = router({
  updateRole: publicProcedure
    .input(z.object({
      userId: z.number().int().positive(),
      newRole: z.enum(userRoles.enumValues),
    }))
    .mutation(async ({ input }) => {
      const { userId, newRole } = input;

      // 1. Validate input (handled by Zod schema)

      // 2. Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      if (existingUser.length === 0) {
        throw new Error('User not found.');
      }

      // 3. Update user role
      const [updatedUser] = await db.update(users)
        .set({ role: newRole })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('Failed to update user role.');
      }

      // 4. Return the updated user (or a subset of its data)
      return { success: true, user: updatedUser };
    }),
});

// Example of how to integrate this into a root router (e.g., in trpc.ts or app.ts)
// export const appRouter = router({
//   user: userRouter,
//   // ... other routers
// });
// export type AppRouter = typeof appRouter;
