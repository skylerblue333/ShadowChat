// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateOrganization
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC instance
import { db } from "./db"; // Assuming db.ts exports your Drizzle ORM instance
import { organizations } from "./schema"; // Assuming schema.ts defines your Drizzle schema

export const organizationRouter = router({
  updateOrganization: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, name, description } = input;

      // 1. Check if organization exists
      const existingOrganization = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
      if (existingOrganization.length === 0) {
        throw new Error("Organization not found.");
      }

      // 2. Prepare update data
      const updateData: { name?: string; description?: string } = {};
      if (name) {
        updateData.name = name;
      }
      if (description) {
        updateData.description = description;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("No update data provided.");
      }

      // 3. Perform update operation
      const [updatedOrganization] = await db.update(organizations)
        .set(updateData)
        .where(eq(organizations.id, id))
        .returning();

      if (!updatedOrganization) {
        throw new Error("Failed to update organization.");
      }

      return { success: true, organization: updatedOrganization };
    }),
});
