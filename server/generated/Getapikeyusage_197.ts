// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getAPIKeyUsage
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { apiKeys, apiKeyUsage } from './schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Input Schema
const GetAPIKeyUsageInputSchema = z.object({
  apiKey: z.string().uuid('Invalid API Key format').min(1, 'API Key cannot be empty'),
});

// Output Schema
const APIKeyUsageOutputSchema = z.object({
  apiKey: z.string(),
  totalRequests: z.number().int().nonnegative(),
  lastUsed: z.date().nullable(),
});

export const apiKeyRouter = router({
  getAPIKeyUsage: publicProcedure
    .input(GetAPIKeyUsageInputSchema)
    .output(APIKeyUsageOutputSchema)
    .query(async ({ input }) => {
      // Operation 1: Validate Input (handled by Zod)

      // Operation 2: Query database for API key ID
      const apiKeyRecord = await db.select().from(apiKeys).where(eq(apiKeys.key, input.apiKey)).limit(1);

      // Operation 3: Handle API Key Not Found
      if (!apiKeyRecord || apiKeyRecord.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'API Key not found.',
        });
      }

      const apiKeyId = apiKeyRecord[0].id;

      // Operation 4: Query usage data
      const usageRecord = await db.select()
        .from(apiKeyUsage)
        .where(eq(apiKeyUsage.apiKeyId, apiKeyId))
        .limit(1);

      // Operation 5: Aggregate/Format Data
      let totalRequests = 0;
      let lastUsed: Date | null = null;

      if (usageRecord && usageRecord.length > 0) {
        totalRequests = usageRecord[0].requestCount;
        lastUsed = usageRecord[0].lastUsed;
      }

      // Operation 6: Return Result
      return {
        apiKey: input.apiKey,
        totalRequests,
        lastUsed,
      };
    }),
});
