// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCryptoPrices
import { publicProcedure, router } from './trpc';
import { getCryptoPricesInput, cryptoPrices } from './crypto_schema';
import { db } from './db';
import { z } from 'zod';

// Define a more detailed output schema for better type safety and clarity
const cryptoPriceOutputSchema = z.object({
  symbol: z.string(),
  price: z.string(), // Prices are often handled as strings to avoid floating point issues
  lastUpdated: z.date(),
});

export const cryptoRouter = router({
  getCryptoPrices: publicProcedure
    .input(getCryptoPricesInput)
    .output(cryptoPriceOutputSchema) // Add output validation
    .query(async ({ input, ctx }) => {
      console.log(`Fetching crypto price for symbol: ${input.symbol}`);
      try {
        // Simulate a more complex query, e.g., joining with another table or more conditions
        const result = await db.select()
          .from(cryptoPrices)
          .where(eq(cryptoPrices.symbol, input.symbol))
          .limit(1);

        if (result.length === 0) {
          console.warn(`Crypto price not found for symbol: ${input.symbol}`);
          throw new Error('Crypto price not found');
        }

        const cryptoData = result[0];

        // Simulate some data transformation or additional logic
        const formattedPrice = parseFloat(cryptoData.price).toFixed(2);
        const lastUpdatedDate = new Date(cryptoData.lastUpdated);

        console.log(`Successfully fetched price for ${input.symbol}: ${formattedPrice}`);

        return {
          symbol: cryptoData.symbol,
          price: formattedPrice,
          lastUpdated: lastUpdatedDate,
        };
      } catch (error) {
        console.error(`Error in getCryptoPrices for ${input.symbol}:`, error);
        // Re-throw a more user-friendly error or a specific tRPC error
        throw new Error(`Failed to retrieve crypto price for ${input.symbol}. Please try again later.`);
      }
    }),
});
