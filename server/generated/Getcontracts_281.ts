// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getContracts

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { contracts } from './schema'; // Assuming schema.ts defines your Drizzle schema for contracts

// Input schema for getContracts procedure
const GetContractsInputSchema = z.object({
  userId: z.string().uuid().optional(), // Optional userId to filter contracts
  status: z.enum(['active', 'inactive', 'pending']).optional(), // Optional status filter
});

// Output schema for a single contract
const ContractOutputSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  status: z.enum(['active', 'inactive', 'pending']),
  amount: z.number().positive(),
  currency: z.string().length(3),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Output schema for the getContracts procedure (array of contracts)
const GetContractsOutputSchema = z.array(ContractOutputSchema);

export const contractRouter = router({
  getContracts: publicProcedure
    .input(GetContractsInputSchema)
    .output(GetContractsOutputSchema)
    .query(async ({ input }) => {
      try {
        let query = db.select().from(contracts);

        if (input.userId) {
          query = query.where(eq(contracts.userId, input.userId));
        }

        if (input.status) {
          query = query.where(eq(contracts.status, input.status));
        }

        const result = await query;

        // Type validation and transformation using Zod
        const validatedContracts = GetContractsOutputSchema.parse(result);

        return validatedContracts;
      } catch (error) {
        console.error('Error fetching contracts:', error);
        // In a real application, you might want to throw a tRPC-specific error
        throw new Error('Failed to retrieve contracts.');
      }
    }),
});

export type ContractRouter = typeof contractRouter;
