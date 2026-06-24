// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: revokeOAuthToken
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { oauthTokens } from '../schema';

export const revokeOAuthTokenProcedure = publicProcedure
  .input(z.object({
    token: z.string().min(1, "Token cannot be empty"),
  }))
  .mutation(async ({ input }) => {
    try {
      const { token } = input;

      // 1. Find the token
      const existingToken = await db.select().from(oauthTokens).where(eq(oauthTokens.token, token)).limit(1);

      if (!existingToken || existingToken.length === 0) {
        throw new Error("OAuth token not found.");
      }

      // 2. Check if already revoked
      if (existingToken[0].revokedAt) {
        return { success: true, message: "OAuth token already revoked." };
      }

      // 3. Revoke the token by updating revokedAt timestamp
      await db.update(oauthTokens)
        .set({ revokedAt: new Date() })
        .where(eq(oauthTokens.token, token));

      return { success: true, message: "OAuth token revoked successfully." };
    } catch (error) {
      console.error("Failed to revoke OAuth token:", error);
      throw new Error("Failed to revoke OAuth token.");
    }
  });

export const oauthRouter = router({
  revokeOAuthToken: revokeOAuthTokenProcedure,
});