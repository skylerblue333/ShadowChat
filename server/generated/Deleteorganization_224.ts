// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteOrganization
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { organizations } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const organizationRouter = router({
  deleteOrganization: publicProcedure
    .input(z.object({
      organizationId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { organizationId } = input;

      // 1. Validate input (handled by Zod schema)

      // 2. Check if the organization exists before attempting to delete
      const existingOrganization = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);

      if (existingOrganization.length === 0) {
        throw new Error(`Organization with ID ${organizationId} not found.`);
      }

      // 3. Perform the deletion
      const result = await db.delete(organizations).where(eq(organizations.id, organizationId));

      // 4. Return success or handle deletion failure
      if (result.rowCount === 0) {
        throw new Error(`Failed to delete organization with ID ${organizationId}.`);
      }

      return { success: true, message: `Organization ${organizationId} deleted successfully.` };
    }),
});
