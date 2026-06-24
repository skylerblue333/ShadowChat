// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteAPIKey
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { apiKeys } from '../db/schema';

export const apiKeyRouter = router({
  deleteAPIKey: publicProcedure
    .input(z.object({
      id: z.string().uuid("Invalid API Key ID format."),
    }))
    .mutation(async ({ input }) => {
      const { id } = input;

      // 1. Database operation: Delete the API key
      const result = await db.delete(apiKeys)
        .where(eq(apiKeys.id, id))
        .returning({ id: apiKeys.id });

      // 2. Check if any API key was deleted
      if (result.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'API Key not found or already deleted.',
        });
      }

      // 3. Return success message
      return {
        success: true,
        message: `API Key with ID ${id} deleted successfully.`,
      };
    }),
});