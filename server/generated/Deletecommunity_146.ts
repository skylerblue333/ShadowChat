// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteCommunity
import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Assuming trpc setup
import { db } from "../db"; // Assuming Drizzle DB instance
import { communities } from "../db/schema"; // Assuming Drizzle schema for communities table

export const communityRouter = router({
  deleteCommunity: publicProcedure
    .input(
      z.object({
        communityId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { communityId } = input;

        // 1. Check if community exists (optional, but good practice for user feedback)
        const existingCommunity = await db.query.communities.findFirst({
          where: eq(communities.id, communityId),
        });

        if (!existingCommunity) {
          throw new Error("Community not found.");
        }

        // 2. Perform deletion
        const result = await db.delete(communities)
          .where(eq(communities.id, communityId))
          .returning({ id: communities.id });

        if (result.length === 0) {
          throw new Error("Failed to delete community.");
        }

        // 3. Return success message or deleted ID
        return { success: true, deletedId: result[0].id, message: "Community deleted successfully." };
      } catch (error: any) {
        console.error("Error deleting community:", error);
        throw new Error(`Failed to delete community: ${error.message}`);
      }
    }),
});