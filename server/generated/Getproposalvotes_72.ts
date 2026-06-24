// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getProposalVotes
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { votes, proposals } from '../schema'; // Assuming Drizzle schema definitions

// Input schema for getProposalVotes
const GetProposalVotesInput = z.object({
  proposalId: z.string().uuid('Invalid proposal ID format'),
});

// Output schema for getProposalVotes
const VoteOutput = z.object({
  id: z.string(),
  voterId: z.string(),
  choice: z.string(),
  weight: z.number(),
  createdAt: z.date(),
});

const GetProposalVotesOutput = z.array(VoteOutput);

export const proposalRouter = router({
  getProposalVotes: publicProcedure
    .input(GetProposalVotesInput)
    .output(GetProposalVotesOutput)
    .query(async ({ input }) => {
      const { proposalId } = input;

      // 1. Check if the proposal exists (optional, but good for robust error handling)
      const proposalExists = await db.select({ id: proposals.id }).from(proposals).where(eq(proposals.id, proposalId)).limit(1);
      if (proposalExists.length === 0) {
        throw new Error('Proposal not found');
      }

      // 2. Fetch votes for the given proposal ID
      const proposalVotes = await db.select().from(votes).where(eq(votes.proposalId, proposalId));

      // 3. Return the fetched votes, ensuring they conform to the output schema
      return proposalVotes.map(vote => ({
        id: vote.id,
        voterId: vote.voterId,
        choice: vote.choice,
        weight: vote.weight,
        createdAt: vote.createdAt,
      }));
    }),
});