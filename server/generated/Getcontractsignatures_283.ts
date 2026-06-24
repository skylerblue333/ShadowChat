// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getContractSignatures
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { contractSignatures } from './db/schema';
import { TRPCError } from '@trpc/server';

// Input Schema
export const getContractSignaturesInput = z.object({
  contractId: z.string().uuid('Invalid contract ID format. Must be a UUID.'),
});

// Output Schema
export const signatureSchema = z.object({
  id: z.string().uuid(),
  contractId: z.string().uuid(),
  signerAddress: z.string(),
  signatureData: z.string(),
  timestamp: z.date(),
});

export const getContractSignaturesOutput = z.array(signatureSchema);

export const contractSignaturesRouter = router({
  getContractSignatures: publicProcedure
    .input(getContractSignaturesInput)
    .output(getContractSignaturesOutput)
    .query(async ({ input }) => {
      try {
        const signatures = await db
          .select()
          .from(contractSignatures)
          .where(eq(contractSignatures.contractId, input.contractId));

        if (!signatures || signatures.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No signatures found for contract ID: ${input.contractId}`,
          });
        }

        // Ensure the returned data conforms to the output schema
        // Drizzle typically returns plain objects, so we might need to convert timestamp if it's not a Date object
        const validatedSignatures = signatures.map(sig => ({
          ...sig,
          timestamp: new Date(sig.timestamp), // Ensure timestamp is a Date object
        }));

        return validatedSignatures;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Database query failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve contract signatures.',
          cause: error,
        });
      }
    }),
});
