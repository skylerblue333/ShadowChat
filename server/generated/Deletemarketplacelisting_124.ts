// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteMarketplaceListing
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { marketplaceListings } from "../db/schema";

export const marketplaceRouter = router({
  deleteMarketplaceListing: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid({ message: "Invalid listing ID format." }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Input validation is handled by Zod schema.

      // 2. Verify listing existence and ownership/permissions.
      const listing = await db.query.marketplaceListings.findFirst({
        where: eq(marketplaceListings.id, input.id),
        columns: { id: true, userId: true }, // Select only necessary columns
      });

      if (!listing) {
        throw new Error("Marketplace listing not found.");
      }

      // Assuming `ctx.user.id` is available for the authenticated user
      // and `ctx.user.isAdmin` for administrative privileges.
      if (listing.userId !== ctx.user.id && !ctx.user.isAdmin) {
        throw new Error("Unauthorized: You do not own this listing, and are not an admin.");
      }

      // 3. Perform the deletion operation.
      const deleteResult = await db
        .delete(marketplaceListings)
        .where(eq(marketplaceListings.id, input.id))
        .returning({ id: marketplaceListings.id }); // Return the ID of the deleted item

      if (deleteResult.length === 0) {
        // This case should ideally be caught by the existence check, but acts as a safeguard.
        throw new Error("Failed to delete marketplace listing, it might have been removed already.");
      }

      // 4. Return success response.
      return { success: true, deletedId: deleteResult[0].id, message: "Marketplace listing deleted successfully." };
    }),
});