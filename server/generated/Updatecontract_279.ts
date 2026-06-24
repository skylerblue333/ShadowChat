// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateContract
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { db } from '../../db';
import { contracts } from '../../db/schema';

export const contractRouter = router({
  updateContract: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        status: z.enum(['active', 'inactive', 'pending']).optional(),
        // Add other fields that can be updated
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      try {
        const [updatedContract] = await db
          .update(contracts)
          .set(updateData)
          .where(eq(contracts.id, id))
          .returning();

        if (!updatedContract) {
          throw new Error('Contract not found or not authorized to update.');
        }

        return updatedContract;
      } catch (error) {
        console.error('Error updating contract:', error);
        throw new Error('Failed to update contract.');
      }
    }),
});
