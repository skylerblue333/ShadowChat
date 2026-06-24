// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createProposal

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { proposals } from './schema'; // Assuming schema.ts defines your Drizzle schema

const createProposalInput = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  authorId: z.string(),
});

export const proposalRouter = router({
  createProposal: publicProcedure
    .input(createProposalInput)
    .mutation(async ({ input }) => {
      try {
        const newProposal = await db.insert(proposals).values({
          title: input.title,
          description: input.description,
          authorId: input.authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newProposal || newProposal.length === 0) {
          throw new Error('Failed to create proposal.');
        }

        return { success: true, proposal: newProposal[0] };
      } catch (error) {
        console.error('Error creating proposal:', error);
        throw new Error('Could not create proposal. Please try again.');
      }
    }),
});
