// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: addOrganizationMember
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts is in the same directory
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { organizationMembers, organizations, users, userRoles } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const addOrganizationMember = publicProcedure
  .input(
    z.object({
      organizationId: z.string().uuid("Invalid organization ID format."),
      userId: z.string().uuid("Invalid user ID format."),
      role: userRoles.enumValues.includes('admin') ? z.enum(userRoles.enumValues) : z.enum(['member', 'admin']), // Adjust based on actual enum values
    })
  )
  .mutation(async ({ input }) => {
    const { organizationId, userId, role } = input;

    // 1. Input Validation (handled by Zod)

    // Check if organization and user exist
    const existingOrganization = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
    if (existingOrganization.length === 0) {
      throw new Error("Organization not found.");
    }

    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      throw new Error("User not found.");
    }

    // 2. Check existing membership
    const existingMembership = await db.select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId)))
      .limit(1);

    if (existingMembership.length > 0) {
      // Member already exists, return existing member ID
      return {
        success: true,
        message: "User is already a member of this organization.",
        memberId: existingMembership[0].id,
      };
    }

    // 3. Add member (if not exists)
    const [newMember] = await db.insert(organizationMembers).values({
      organizationId,
      userId,
      role,
    }).returning();

    if (!newMember) {
      throw new Error("Failed to add organization member.");
    }

    // 4. Return result
    return {
      success: true,
      message: "Organization member added successfully.",
      memberId: newMember.id,
    };
  });

export const organizationRouter = router({
  addOrganizationMember: addOrganizationMember,
});