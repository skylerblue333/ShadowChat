// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateGame

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { games } from '../schema';

const updateGameInput = z.object({
  id: z.string().uuid({ message: 'Invalid game ID format.' }),
  name: z.string().min(1, { message: 'Game name cannot be empty.' }).optional(),
  genre: z.string().min(1, { message: 'Game genre cannot be empty.' }).optional(),
  status: z.enum(['active', 'inactive', 'pending'], { message: 'Invalid game status.' }).optional(),
});

export const gameRouter = router({
  updateGame: publicProcedure
    .input(updateGameInput)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      // Operation 1: Check if there's any data to update
      if (Object.keys(updateData).length === 0) {
        throw new Error('No update data provided.');
      }

      // Operation 2: Perform the update operation in the database
      const [updatedGame] = await db.update(games)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(games.id, id))
        .returning();

      // Operation 3: Check if the game was found and updated
      if (!updatedGame) {
        throw new Error(`Game with ID ${id} not found.`);
      }

      return updatedGame;
    }),
});
