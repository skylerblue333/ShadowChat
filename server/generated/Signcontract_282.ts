// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: signContract
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { users, contracts } from './schema'; // Assuming schema.ts defines your Drizzle schemas

// Input Validation
export const signContractInput = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  contractContent: z.string().min(1, 'Contract content cannot be empty'),
});

// Output Type
export type SignContractOutput = {
  success: boolean;
  contractId?: number;
  message: string;
};

export const contractRouter = router({
  signContract: publicProcedure
    .input(signContractInput)
    .mutation(async ({ input }): Promise<SignContractOutput> => {
      try {
        const { userId, contractContent } = input;

        // 1. User Existence Check
        const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (existingUser.length === 0) {
          return { success: false, message: 'User not found.' };
        }

        // 2. Contract Creation
        const newContract = await db.insert(contracts).values({
          userId,
          contractContent,
          isSigned: true,
        }).returning({ id: contracts.id });

        if (newContract.length === 0) {
          return { success: false, message: 'Failed to create contract.' };
        }

        return { success: true, contractId: newContract[0].id, message: 'Contract signed successfully.' };
      } catch (error) {
        console.error("Error signing contract:", error);
        return { success: false, message: 'An unexpected error occurred.' };
      }
    }),
});

// Example of how to integrate this into a root router (for context, not part of the procedure itself)
// import { contractRouter } from './contractRouter';
// export const appRouter = router({
//   contract: contractRouter,
//   // ... other routers
// });
// export type AppRouter = typeof appRouter;