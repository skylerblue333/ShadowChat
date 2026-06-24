// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: stopMining
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { miningProcesses } from './schema'; // Assuming schema.ts defines your Drizzle schema

const stopMiningInput = z.object({
  processId: z.string().uuid(),
});

const stopMiningOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const miningRouter = router({
  stopMining: publicProcedure
    .input(stopMiningInput)
    .output(stopMiningOutput)
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod automatically)

        // 2. Perform database operation to stop mining process
        const result = await db.update(miningProcesses)
          .set({ status: 'stopped', stoppedAt: new Date() })
          .where(eq(miningProcesses.id, input.processId))
          .returning({ id: miningProcesses.id });

        // 3. Check if any process was updated
        if (result.length === 0) {
          return { success: false, message: 'Mining process not found or already stopped.' };
        }

        // 4. Return success
        return { success: true, message: `Mining process ${input.processId} stopped successfully.` };
      } catch (error) {
        // 5. Handle potential database or other errors
        console.error('Error stopping mining process:', error);
        throw new Error('Failed to stop mining process.');
      }
    }),
});