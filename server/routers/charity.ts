import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { listCampaigns, addDonation, markMilestoneNotified, totalDonated, logEvent } from "../db";
import { notifyOwner } from "../_core/notification";

export const charityRouter = router({
  campaigns: publicProcedure.query(() => listCampaigns()),

  totalDonated: publicProcedure.query(() => totalDonated()),

  donate: protectedProcedure
    .input(z.object({ campaignId: z.number(), amount: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      const updated = await addDonation(input.campaignId, input.amount, ctx.user.id, "direct");
      await logEvent("donation", "charity", input.amount, ctx.user.id);
      if (updated && !updated.milestoneNotified && updated.goalAmount > 0 && updated.raisedAmount >= updated.goalAmount) {
        await notifyOwner({
          title: "Charity milestone reached",
          content: `Campaign "${updated.title}" reached its goal of ${updated.goalAmount} (raised ${updated.raisedAmount}).`,
        });
        await markMilestoneNotified(updated.id);
      }
      return { success: true, campaign: updated };
    }),
});
