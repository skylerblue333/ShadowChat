// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteGame
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { db } from "./db";
import { games } from "./schema";

export const gameRouter = router({
  deleteGame: publicProcedure
    .input(z.object({
      gameId: z.string().uuid("Invalid game ID format."),
    }))
    .mutation(async ({ input }) => {
      try {
        const { gameId } = input;

        // 1. Check if the game exists
        const existingGame = await db.select().from(games).where(eq(games.id, gameId)).limit(1);

        if (existingGame.length === 0) {
          throw new Error("Game not found.");
        }

        // 2. Perform the deletion
        const result = await db.delete(games).where(eq(games.id, gameId));

        if (result.rowCount === 0) {
          throw new Error("Failed to delete game.");
        }

        // 3. Return success message
        return { success: true, message: `Game with ID ${gameId} deleted successfully.` };
      } catch (error) {
        console.error("Error deleting game:", error);
        throw new Error(`Failed to delete game: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});