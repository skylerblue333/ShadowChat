// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: removeProjectMember
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { projectMembers } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const projectRouter = router({
  removeProjectMember: publicProcedure
    .input(z.object({
      projectId: z.string().uuid(),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { projectId, userId } = input;

      // 1. Validate input (handled by Zod)

      // 2. Check if the project member exists
      const existingMember = await db.select().from(projectMembers).where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId))).limit(1);

      if (existingMember.length === 0) {
        throw new Error('Project member not found.');
      }

      // 3. Remove the project member from the database
      const result = await db.delete(projectMembers).where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));

      // 4. Error handling for database operation
      if (result.rowCount === 0) {
        throw new Error('Failed to remove project member.');
      }

      return { success: true, message: 'Project member removed successfully.' };
    }),
});

// Helper types for Drizzle and tRPC (assuming these are defined elsewhere)
// type ProjectMember = typeof projectMembers.$inferSelect;
// type NewProjectMember = typeof projectMembers.$inferInsert;
