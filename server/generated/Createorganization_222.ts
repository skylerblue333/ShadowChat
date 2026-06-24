// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createOrganization

import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db'; // Assuming db is your Drizzle instance
import { organizations } from './schema'; // Assuming organizations table schema

export const organizationRouter = router({
  createOrganization: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, "Organization name must be at least 3 characters long"),
        slug: z.string().min(3, "Slug must be at least 3 characters long").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Operation 1: Check if an organization with the same slug already exists
        const existingOrganization = await db.select().from(organizations).where(eq(organizations.slug, input.slug)).limit(1);

        if (existingOrganization.length > 0) {
          throw new Error("Organization with this slug already exists.");
        }

        // Operation 2: Insert the new organization into the database
        const [newOrganization] = await db.insert(organizations).values({
          name: input.name,
          slug: input.slug,
          description: input.description,
        }).returning();

        if (!newOrganization) {
          throw new Error("Failed to create organization.");
        }

        // Operation 3: Return the newly created organization
        return { success: true, organization: newOrganization };
      } catch (error) {
        console.error("Error creating organization:", error);
        throw new Error(`Failed to create organization: ${error.message}`);
      }
    }),
});
