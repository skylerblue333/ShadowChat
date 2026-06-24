// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getQuotes
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { quotes } from './schema';

// Define the input schema for the getQuotes procedure
const GetQuotesInput = z.object({
  author: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
});

// Define the output schema for a single quote
const QuoteOutput = z.object({
  id: z.number(),
  quoteText: z.string(),
  author: z.string(),
});

// Define the output schema for the getQuotes procedure
const GetQuotesOutput = z.array(QuoteOutput);

export const quotesRouter = router({
  getQuotes: publicProcedure
    .input(GetQuotesInput)
    .output(GetQuotesOutput)
    .query(async ({ input }) => {
      try {
        let query = db.select().from(quotes);

        if (input.author) {
          query = query.where(eq(quotes.author, input.author));
        }

        const result = await query.limit(input.limit).offset(input.offset);

        if (!result || result.length === 0) {
          // Optionally, throw a specific error if no quotes are found
          // throw new TRPCError({ code: 'NOT_FOUND', message: 'No quotes found.' });
          return []; // Return an empty array if no quotes are found
        }

        return result;
      } catch (error) {
        console.error('Error fetching quotes:', error);
        throw new Error('Failed to fetch quotes.');
      }
    }),
});