import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  listProposals, getProposal, hasVoted, castVote,
  getStakingPower, listUserStaking, setStaking, setProposalStatus, logEvent,
} from "../db";
import { notifyOwner } from "../_core/notification";

export const governanceRouter = router({
  proposals: publicProcedure
    .input(z.object({ ecosystem: z.enum(["DODGE", "TRUMP"]).optional() }).optional())
    .query(({ input }) => listProposals(input?.ecosystem)),

  proposal: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getProposal(input.id)),

  myStaking: protectedProcedure.query(({ ctx }) => listUserStaking(ctx.user.id)),

  stake: protectedProcedure
    .input(z.object({ ecosystem: z.enum(["DODGE", "TRUMP", "SKY444"]), amount: z.number().min(0) }))
    .mutation(async ({ input, ctx }) => {
      await setStaking(ctx.user.id, input.ecosystem, input.amount);
      await logEvent("stake_updated", "governance", input.amount, ctx.user.id);
      return { success: true };
    }),

  vote: protectedProcedure
    .input(z.object({ proposalId: z.number(), choice: z.enum(["for", "against"]) }))
    .mutation(async ({ input, ctx }) => {
      const already = await hasVoted(ctx.user.id, input.proposalId);
      if (already) return { success: false, message: "You have already voted on this proposal." };

      const proposal = await getProposal(input.proposalId);
      if (!proposal) return { success: false, message: "Proposal not found." };

      // Voting power = staking in that ecosystem (min 1)
      const eco = proposal.ecosystem as "DODGE" | "TRUMP";
      const stake = await getStakingPower(ctx.user.id, eco);
      const power = Math.max(1, Math.floor(stake));

      await castVote(ctx.user.id, input.proposalId, input.choice, power);
      await logEvent("vote_cast", "governance", power, ctx.user.id);

      // Auto-resolve and alert owner if proposal ended
      const refreshed = await getProposal(input.proposalId);
      if (refreshed && refreshed.endsAt && new Date(refreshed.endsAt).getTime() < Date.now() && refreshed.status === "active") {
        const passed = refreshed.votesFor > refreshed.votesAgainst;
        await setProposalStatus(refreshed.id, passed ? "passed" : "rejected");
        await notifyOwner({
          title: "Governance proposal result",
          content: `Proposal "${refreshed.title}" (${refreshed.ecosystem}) ${passed ? "PASSED" : "REJECTED"} — For: ${refreshed.votesFor}, Against: ${refreshed.votesAgainst}.`,
        });
      }
      return { success: true, power };
    }),
});
