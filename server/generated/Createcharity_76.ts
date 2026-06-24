// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createCharity
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { createCharityInput, createCharityOutput, charities } from './charity_schema';
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { TRPCError } from '@trpc/server';

export const charityRouter = router({
  createCharity: publicProcedure
    .input(createCharityInput)
    .output(createCharityOutput)
    .mutation(async ({ input }) => {
      try {
        // Check for existing charity with the same name or wallet address
        const existingCharity = await db.select().from(charities).where(eq(charities.name, input.name)).limit(1);
        if (existingCharity.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Charity with this name already exists.',
          });
        }

        const existingWallet = await db.select().from(charities).where(eq(charities.walletAddress, input.walletAddress)).limit(1);
        if (existingWallet.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Charity with this wallet address already exists.',
          });
        }

        const [newCharity] = await db.insert(charities).values({
          name: input.name,
          description: input.description,
          walletAddress: input.walletAddress,
        }).returning();

        if (!newCharity) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create charity.',
          });
        }

        return { charity: newCharity };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error creating charity:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred.',
        });
      }
    }),
});

export type CharityRouter = typeof charityRouter;
