// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createOAuthApp
import { z } from "zod";
import { publicProcedure, router } from "~/server/trpc";
import { db } from "~/server/db";
import { oauthApps } from "~/server/db/schema";
import { generateClientId, generateClientSecret } from "~/server/utils/oauth"; // Assuming these utility functions exist

export const createOAuthAppProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      redirectUris: z.array(z.string().url("Invalid redirect URI")).min(1, "At least one redirect URI is required"),
    })
  )
  .mutation(async ({ input }) => {
    const { name, redirectUris } = input;

    const clientId = generateClientId();
    const clientSecret = generateClientSecret();

    try {
      const [newOAuthApp] = await db.insert(oauthApps).values({
        name,
        clientId,
        clientSecret,
        redirectUris: redirectUris.join(","),
      }).returning();

      if (!newOAuthApp) {
        throw new Error("Failed to create OAuth application.");
      }

      // Return the created app, but omit the clientSecret for security
      const { clientSecret: _, ...appWithoutSecret } = newOAuthApp;

      return appWithoutSecret;
    } catch (error) {
      console.error("Error creating OAuth app:", error);
      throw new Error("Could not create OAuth application. Please try again.");
    }
  });

export const oauthAppRouter = router({
  createOAuthApp: createOAuthAppProcedure,
});
