// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTransactionHistory
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { transactions } from '../db/schema';
import { TRPCError } from '@trpc/server';

// Input schema for getTransactionHistory
const GetTransactionHistoryInput = z.object({
  userId: z.string().uuid('Invalid user ID format. Must be a UUID.').nonempty('User ID cannot be empty.'),
  currency: z.string().min(3, 'Currency must be at least 3 characters.').max(5, 'Currency cannot exceed 5 characters.').optional(),
  limit: z.number().int('Limit must be an integer.').min(1, 'Limit must be at least 1.').max(100, 'Limit cannot exceed 100.').default(10),
  offset: z.number().int('Offset must be an integer.').min(0, 'Offset cannot be negative.').default(0),
});

// Output schema for getTransactionHistory
const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().finite(),
  type: z.enum(['deposit', 'withdrawal', 'transfer', 'fee']), // Added 'fee' as a common transaction type
  date: z.date(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']), // Added 'cancelled' as a common status
  currency: z.string(),
  description: z.string().optional(), // Added description for more context
});

const GetTransactionHistoryOutput = z.array(TransactionSchema);

export const skycoin4444Router = router({
  getTransactionHistory: publicProcedure
    .input(GetTransactionHistoryInput)
    .output(GetTransactionHistoryOutput)
    .query(async ({ input }) => {
      try {
        const { userId, currency, limit, offset } = input;

        const whereConditions = [eq(transactions.userId, userId)];
        if (currency) {
          whereConditions.push(eq(transactions.currency, currency));
        }

        const result = await db.query.transactions.findMany({
          where: and(...whereConditions),
          limit,
          offset,
          orderBy: [desc(transactions.date)],
        });

        // Ensure the result conforms to the output schema
        const validatedResult = GetTransactionHistoryOutput.parse(result);

        return validatedResult;
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
        if (error instanceof z.ZodError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid output data format from database.',
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while fetching transaction history.',
          cause: error,
        });
      }
    }),
});
