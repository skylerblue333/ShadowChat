// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getGames
import { publicProcedure, router } from "../trpc";
import { getGamesInput } from "../schemas";
import { games } from "../../db/schema";
import { db } from "../../db";

export const gamesRouter = router({
  getGames: publicProcedure
    .input(getGamesInput)
    .query(async ({ input }) => {
      try {
        let query = db.select().from(games);

        if (input?.genre) {
          query = query.where(eq(games.genre, input.genre));
        }

        if (input?.name) {
          query = query.where(like(games.name, `%${input.name}%`));
        }

        const result = await query;
        return result;
      } catch (error) {
        console.error("Error fetching games:", error);
        throw new Error("Failed to fetch games");
      }
    }),
});
