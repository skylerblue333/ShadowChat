// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: playGame
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../../db';
import { games } from '../../db/schema/games';

export const playGameProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    action: z.enum(['rock', 'paper', 'scissors']),
  }))
  .mutation(async ({ input }) => {
    const { userId, action } = input;

    // 1. Simulate game logic (e.g., random opponent move)
    const moves = ['rock', 'paper', 'scissors'];
    const opponentAction = moves[Math.floor(Math.random() * moves.length)];

    let result: 'win' | 'lose' | 'draw';
    let scoreChange = 0;

    if (action === opponentAction) {
      result = 'draw';
    } else if (
      (action === 'rock' && opponentAction === 'scissors') ||
      (action === 'paper' && opponentAction === 'rock') ||
      (action === 'scissors' && opponentAction === 'paper')
    ) {
      result = 'win';
      scoreChange = 10;
    } else {
      result = 'lose';
      scoreChange = -5;
    }

    // 2. Retrieve or create user's game record
    let userGame = await db.select().from(games).where(eq(games.userId, userId)).limit(1);
    let currentScore = 0;

    if (userGame.length > 0) {
      currentScore = userGame[0].score;
      // 3. Update existing game record
      await db.update(games)
        .set({ score: currentScore + scoreChange, updatedAt: new Date() })
        .where(eq(games.userId, userId));
    } else {
      // 3. Create new game record
      await db.insert(games).values({
        userId: userId,
        score: scoreChange,
      });
    }

    // 4. Fetch updated score
    const updatedGame = await db.select().from(games).where(eq(games.userId, userId)).limit(1);
    const newScore = updatedGame[0].score;

    return {
      message: `You played ${action}, opponent played ${opponentAction}. You ${result}!`, 
      yourMove: action,
      opponentMove: opponentAction,
      result: result,
      scoreChange: scoreChange,
      newScore: newScore,
    };
  });

export const gameRouter = router({
  playGame: playGameProcedure,
});
