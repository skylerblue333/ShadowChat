// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteContract

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { contracts } from '../schema'; // Adjust path as needed
import { TRPCError } from '@trpc/server';

const deleteContractInput = z.object({
  contractId: z.string().uuid('Invalid contract ID format. Must be a UUID.'),
});

export const contractRouter = router({
  deleteContract: publicProcedure
    .input(deleteContractInput)
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod schema)

        // 2. Perform deletion operation
        const result = await db.delete(contracts)
          .where(eq(contracts.contractId, input.contractId))
          .returning({ id: contracts.id });

        // 3. Check if a contract was actually deleted
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Contract with ID ${input.contractId} not found.`,
          });
        }

        // 4. Return success message or deleted ID
        return { success: true, deletedContractId: input.contractId };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // Re-throw tRPC errors directly
        }
        console.error('Failed to delete contract:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred during contract deletion.',
          cause: error,
        });
      }
    }),
});
