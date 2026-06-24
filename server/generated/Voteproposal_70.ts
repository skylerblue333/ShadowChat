// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: voteProposal
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { proposals, votes } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const proposalRouter = router({
  voteProposal: publicProcedure
    .input(z.object({
      proposalId: z.string().uuid(),
      userId: z.string().uuid(),
      voteType: z.enum(['upvote', 'downvote']),
    }))
    .mutation(async ({ input }) => {
      const { proposalId, userId, voteType } = input;

      // 1. Check if the proposal exists
      const existingProposal = await db.select().from(proposals).where(eq(proposals.id, proposalId)).limit(1);
      if (existingProposal.length === 0) {
        throw new Error('Proposal not found.');
      }

      // 2. Check if the user has already voted on this proposal
      const existingVote = await db.select().from(votes).where(and(eq(votes.proposalId, proposalId), eq(votes.userId, userId))).limit(1);

      if (existingVote.length > 0) {
        // User has already voted, update their vote
        await db.update(votes).set({ voteType: voteType, updatedAt: new Date() }).where(and(eq(votes.proposalId, proposalId), eq(votes.userId, userId)));
        return { message: 'Vote updated successfully.' };
      } else {
        // User has not voted, create a new vote
        await db.insert(votes).values({ proposalId, userId, voteType, createdAt: new Date(), updatedAt: new Date() });
        return { message: 'Vote cast successfully.' };
      }
    }),
});

export type ProposalRouter = typeof proposalRouter;
