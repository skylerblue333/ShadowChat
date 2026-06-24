// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getOAuthTokens
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Adjust path as per your project structure
import { db } from './db'; // Adjust path as per your project structure
import { oauthTokens } from './db/schema'; // Adjust path as per your project structure
import { TRPCError } from '@trpc/server';

// Input schema for validation using Zod
const GetOAuthTokensInput = z.object({
  userId: z.string().uuid({ message: 'Invalid user ID format.' }),
});

// Output schema for the procedure, defining the structure of returned OAuth tokens
const OAuthTokenOutput = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  expiresAt: z.date(),
  // Ensure all relevant fields from your oauthTokens schema are included here
});

export const oauthRouter = router({
  getOAuthTokens: publicProcedure
    .input(GetOAuthTokensInput)
    .output(z.array(OAuthTokenOutput))
    .query(async ({ input }) => {
      try {
        const { userId } = input;

        // Fetch OAuth tokens from the database using Drizzle ORM
        const tokens = await db.select().from(oauthTokens).where(eq(oauthTokens.userId, userId));

        if (!tokens || tokens.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No OAuth tokens found for this user.',
          });
        }

        // Map the database results to the defined output schema
        return tokens.map(token => ({
          id: token.id,
          userId: token.userId,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: token.expiresAt,
          // Map other fields as necessary, ensuring type compatibility
        }));
      } catch (error) {
        console.error('Error fetching OAuth tokens:', error);
        // Handle Drizzle-specific errors or re-throw as a generic TRPCError
        if (error instanceof TRPCError) {
          throw error; // Re-throw already formatted tRPC errors
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve OAuth tokens due to an internal server error.',
          cause: error, // Include the original error for debugging
        });
      }
    }),
});
