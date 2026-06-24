// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteMilestone
// src/server/routers/milestone.ts (example path)
import { z } from 'zod'; // Import Zod for input validation
import { publicProcedure, router } from '../trpc'; // Assuming tRPC context and procedures are set up
import { db } from '../db'; // Assuming Drizzle DB instance is exported from here
import { milestones } from '../db/schema'; // Assuming Drizzle schema for milestones table

// Define the input schema for deleting a milestone
const deleteMilestoneInputSchema = z.object({
  id: z.string().uuid('Invalid milestone ID format. Must be a UUID.'),
});

export const milestoneRouter = router({
  deleteMilestone: publicProcedure
    .input(deleteMilestoneInputSchema)
    .mutation(async ({ input }) => {
      try {
        // 1. Input validation is handled automatically by Zod via .input(deleteMilestoneInputSchema)
        const { id } = input;

        // 2. Perform the deletion operation in the database
        const deletedMilestones = await db
          .delete(milestones)
          .where(eq(milestones.id, id))
          .returning({ id: milestones.id }); // Return the ID of the deleted milestone

        // 3. Check if any milestone was actually deleted
        if (deletedMilestones.length === 0) {
          // If no rows were affected, the milestone was not found
          throw new Error(`Milestone with ID '${id}' not found or already deleted.`);
        }

        // 4. Return a success response
        return { success: true, message: `Milestone with ID '${id}' deleted successfully.` };
      } catch (error) {
        // 5. Log the error for debugging purposes
        console.error('Error deleting milestone:', error);

        // 6. Re-throw a user-friendly error message
        throw new Error(`Failed to delete milestone: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
      }
    }),
});