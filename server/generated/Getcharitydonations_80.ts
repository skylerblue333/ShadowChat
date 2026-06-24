// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCharityDonations
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { charityDonations } from './schema'; // Assuming schema.ts defines your Drizzle schema

// Input schema for getCharityDonations procedure
const GetCharityDonationsInput = z.object({
  charityId: z.string().uuid('Invalid charity ID format. Must be a UUID.'),
  limit: z.number().int().positive().max(100).optional().default(10),
  offset: z.number().int().min(0).optional().default(0),
});

// Output schema for getCharityDonations procedure
const CharityDonationOutput = z.object({
  id: z.string().uuid(),
  charityId: z.string().uuid(),
  donorId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  timestamp: z.date(),
});

export const charityRouter = router({
  getCharityDonations: publicProcedure
    .input(GetCharityDonationsInput)
    .output(z.array(CharityDonationOutput))
    .query(async ({ input }) => {
      try {
        const { charityId, limit, offset } = input;

        const donations = await db
          .select()
          .from(charityDonations)
          .where(eq(charityDonations.charityId, charityId))
          .limit(limit)
          .offset(offset)
          .orderBy(desc(charityDonations.timestamp));

        if (!donations || donations.length === 0) {
          // Optionally throw a specific error or return an empty array
          // For this case, returning an empty array is often more user-friendly
          return [];
        }

        // Ensure the timestamp is a Date object for the output schema
        const formattedDonations = donations.map(donation => ({
          ...donation,
          timestamp: new Date(donation.timestamp),
        }));

        return formattedDonations;
      } catch (error) {
        console.error('Error fetching charity donations:', error);
        // In a real application, you might want to throw a more specific tRPC error
        throw new Error('Failed to retrieve charity donations.');
      }
    }),
});

// Example Drizzle schema definition (for context, not part of the procedure itself)
/*

export const charityDonations = pgTable('charity_donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  charityId: uuid('charity_id').notNull(),
  donorId: uuid('donor_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(), // e.g., 'USD', 'EUR'
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
*/