// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getProjectMembers
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { projectMembers, users } from './schema';

export const projectMembersRouter = router({
  getProjectMembers: publicProcedure
    .input(z.object({
      projectId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      try {
        const members = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(projectMembers)
        .innerJoin(users, eq(projectMembers.userId, users.id))
        .where(eq(projectMembers.projectId, input.projectId));

        if (!members || members.length === 0) {
          throw new Error('No members found for this project.');
        }

        return members;
      } catch (error) {
        console.error('Error fetching project members:', error);
        throw new Error('Failed to retrieve project members.');
      }
    }),
});
