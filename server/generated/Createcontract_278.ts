// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createContract
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { contracts } from './schema'; // Assuming schema.ts defines your Drizzle schema

// Input schema for createContract procedure
const createContractInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  amount: z.number().positive("Amount must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  startDate: z.string().datetime("Start date must be a valid ISO 8601 date string"),
  endDate: z.string().datetime("End date must be a valid ISO 8601 date string"),
  status: z.enum(['active', 'pending', 'completed', 'cancelled'], "Invalid contract status"),
});

// Output schema for createContract procedure
const createContractOutput = z.object({
  id: z.string(),
  clientId: z.string(),
  amount: z.string(), // Drizzle returns numeric as string
  currency: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const contractRouter = router({
  createContract: publicProcedure
    .input(createContractInput)
    .output(createContractOutput)
    .mutation(async ({ input }) => {
      try {
        // Validate start and end dates
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        if (startDate >= endDate) {
          throw new Error("End date must be after start date");
        }

        const newContract: InferInsertModel<typeof contracts> = {
          id: input.contractId,
          clientId: input.clientId,
          amount: input.amount.toString(), // Drizzle stores numeric as string
          currency: input.currency,
          startDate: startDate,
          endDate: endDate,
          status: input.status,
        };

        const [createdContract] = await db.insert(contracts).values(newContract).returning();

        if (!createdContract) {
          throw new Error("Failed to create contract.");
        }

        return createdContract;
      } catch (error) {
        console.error("Error creating contract:", error);
        throw new Error(`Failed to create contract: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});

export type ContractRouter = typeof contractRouter;