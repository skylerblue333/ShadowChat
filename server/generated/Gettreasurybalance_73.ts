// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTreasuryBalance
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC setup
import { Pool } from 'pg';
import { TRPCError } from '@trpc/server';

// --- Drizzle Schema (simplified for example) ---
export const treasury = pgTable('treasury', {
  id: serial('id').primaryKey(),
  balance: numeric('balance').notNull(),
  currency: text('currency').notNull().default('SKY'),
});

// --- Database Connection (example, replace with your actual setup) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- Output Type Definition ---
interface TreasuryBalanceOutput {
  balance: string;
  currency: string;
}

export const treasuryRouter = router({
  getTreasuryBalance: publicProcedure
    .query(async (): Promise<TreasuryBalanceOutput> => {
      try {
        const treasuryRecord = await db.select().from(treasury).limit(1);

        if (treasuryRecord.length === 0) {
          // If no record is found, return a default balance of '0'
          return {
            balance: '0',
            currency: 'SKY',
          };
        }

        const { balance, currency } = treasuryRecord[0];

        // Basic validation for balance (can be expanded)
        if (isNaN(Number(balance))) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Invalid treasury balance retrieved from database.',
          });
        }

        return {
          balance: balance.toString(), // Ensure balance is a string
          currency: currency || 'SKY', // Default to 'SKY' if currency is null/undefined
        };
      } catch (error) {
        console.error('Error fetching treasury balance:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve treasury balance.',
        });
      }
    }),
});
