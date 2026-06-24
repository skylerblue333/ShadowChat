// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getOAuthApps
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { oauthApps } from './oauth_schema';

export const getOAuthApps = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
  }))
  .query(async ({ input }) => {
    try {
      const apps = await db.select().from(oauthApps).where(eq(oauthApps.userId, input.userId));

      if (!apps) {
        throw new Error('No OAuth applications found for this user.');
      }

      return apps;
    } catch (error) {
      console.error('Error fetching OAuth applications:', error);
      throw new Error('Failed to retrieve OAuth applications.');
    }
  });

// Example of how this procedure might be integrated into a router
// export const appRouter = router({
//   getOAuthApps: getOAuthApps,
// });
