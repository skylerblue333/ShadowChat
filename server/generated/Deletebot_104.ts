// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteBot

// This file defines the tRPC procedure for deleting a bot.
// It includes input validation, database interaction using Drizzle ORM,
// and comprehensive error handling for production readiness.

import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { bots } from './schema';

export const botRouter = router({
  deleteBot: publicProcedure
    .input(z.object({
      // Validate that the input 'id' is a UUID string.
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Attempt to delete the bot from the database where the ID matches.
        // The .returning() method ensures that the deleted record is returned.
        const result = await db.delete(bots).where(eq(bots.id, input.id)).returning();

        // Check if any bot was actually deleted.
        if (result.length === 0) {
          // If no bot was found with the given ID, throw an error.
          throw new Error('Bot not found or already deleted.');
        }

        // Return a success message if the bot was deleted successfully.
        return { success: true, message: `Bot with ID ${input.id} deleted successfully.` };
      } catch (error: any) {
        // Log the error for debugging purposes.
        console.error('Error deleting bot:', error);
        // Re-throw a new error with a user-friendly message.
        throw new Error(`Failed to delete bot: ${error.message}`);
      }
    }),
});
