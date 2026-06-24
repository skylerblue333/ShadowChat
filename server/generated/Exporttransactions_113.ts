// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: exportTransactions
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../../db';
import { transactions } from '../../db/schema';

export const transactionsRouter = router({
  exportTransactions: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      type: z.enum(["credit", "debit"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        const { userId, startDate, endDate, type } = input;

        const whereConditions = [];
        if (userId) {
          whereConditions.push(eq(transactions.userId, userId));
        }
        if (startDate) {
          whereConditions.push(gte(transactions.timestamp, new Date(startDate)));
        }
        if (endDate) {
          whereConditions.push(lte(transactions.timestamp, new Date(endDate)));
        }
        if (type) {
          whereConditions.push(eq(transactions.type, type));
        }

        const result = await db.select().from(transactions)
          .where(and(...whereConditions));

        if (!result || result.length === 0) {
          // Consider throwing a specific tRPC error if no transactions are found
          // For now, returning an empty array is acceptable for an export function
          return { success: true, data: [], message: "No transactions found matching the criteria." };
        }

        return { success: true, data: result, message: "Transactions exported successfully." };
      } catch (error) {
        console.error("Error exporting transactions:", error);
        // In a real application, you might want to throw a TRPCError with a specific code
        throw new Error("Failed to export transactions.");
      }
    }),
});
