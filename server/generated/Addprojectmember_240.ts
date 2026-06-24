// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: addProjectMember

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { projects, users, projectMembers } from '../schema'; // Adjust path as needed

const addProjectMemberInput = z.object({
  projectId: z.string().uuid('Invalid project ID format.'),
  userId: z.string().uuid('Invalid user ID format.'),
  role: z.enum(['member', 'admin', 'viewer']).default('member'),
});

const addProjectMemberOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  memberId: z.string().uuid().optional(),
});

export const projectRouter = router({
  addProjectMember: publicProcedure
    .input(addProjectMemberInput)
    .output(addProjectMemberOutput)
    .mutation(async ({ input }) => {
      const { projectId, userId, role } = input;

      // 1. Check if project exists
      const projectExists = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (projectExists.length === 0) {
        return { success: false, message: 'Project not found.' };
      }

      // 2. Check if user exists
      const userExists = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userExists.length === 0) {
        return { success: false, message: 'User not found.' };
      }

      // 3. Check if user is already a member of the project
      const existingMember = await db.select().from(projectMembers)
        .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
        .limit(1);

      if (existingMember.length > 0) {
        return { success: false, message: 'User is already a member of this project.' };
      }

      // 4. Add the user as a project member
      try {
        const [newMember] = await db.insert(projectMembers).values({
          projectId,
          userId,
          role,
        }).returning();

        if (newMember) {
          return { success: true, message: 'Project member added successfully.', memberId: newMember.userId };
        } else {
          return { success: false, message: 'Failed to add project member.' };
        }
      } catch (error) {
        console.error('Database error adding project member:', error);
        return { success: false, message: 'An unexpected error occurred while adding the project member.' };
      }
    }),
});
