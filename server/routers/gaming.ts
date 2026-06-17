import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { recordGameSession, getLeaderboard, getUserGameStats, addDonation, getCampaign, markMilestoneNotified, logEvent } from "../db";
import { notifyOwner } from "../_core/notification";

const GAMES = ["blackjack", "roulette", "tictactoe", "dice", "snake"] as const;

export const gamingRouter = router({
  recordSession: protectedProcedure
    .input(z.object({
      game: z.enum(GAMES),
      score: z.number().int(),
      result: z.string().max(32).optional(),
      charityDonation: z.number().min(0).default(0),
      campaignId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await recordGameSession({
        userId: ctx.user.id,
        game: input.game,
        score: input.score,
        result: input.result ?? null,
        charityDonation: input.charityDonation,
      });
      await logEvent("game_played", "gaming", input.score, ctx.user.id);

      // Route the in-game charity donation to a real campaign if provided
      if (input.charityDonation > 0 && input.campaignId) {
        const updated = await addDonation(input.campaignId, input.charityDonation, ctx.user.id, `game:${input.game}`);
        if (updated && !updated.milestoneNotified && updated.goalAmount > 0 && updated.raisedAmount >= updated.goalAmount) {
          await notifyOwner({
            title: "Charity milestone reached",
            content: `Campaign "${updated.title}" hit its goal of ${updated.goalAmount} (raised ${updated.raisedAmount}).`,
          });
          await markMilestoneNotified(updated.id);
        }
      }
      return { success: true };
    }),

  leaderboard: publicProcedure
    .input(z.object({ game: z.enum(GAMES).optional() }).optional())
    .query(({ input }) => getLeaderboard(input?.game)),

  myStats: protectedProcedure.query(({ ctx }) => getUserGameStats(ctx.user.id)),
});
