// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateOAuthApp
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts is in the same directory or a known path
import { db } from './db'; // Assuming db.ts is in the same directory or a known path
import { TRPCError } from '@trpc/server';

// 1. Drizzle Schema for OAuthApp
export const oauthApps = pgTable('oauth_apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  clientId: text('client_id').notNull().unique(),
  clientSecret: text('client_secret').notNull(),
  redirectUris: text('redirect_uris').array().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type OAuthApp = InferSelectModel<typeof oauthApps>;
export type NewOAuthApp = InferInsertModel<typeof oauthApps>;

// 2. Zod Schema for Input Validation
const updateOAuthAppInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  redirectUris: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
});

// 3. tRPC Procedure Implementation
export const oauthAppRouter = router({
  updateOAuthApp: publicProcedure
    .input(updateOAuthAppInput)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if the OAuth app exists
        const existingApp = await db.select().from(oauthApps).where(eq(oauthApps.id, id)).limit(1);
        if (existingApp.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'OAuth application not found.',
          });
        }

        // Perform the update operation
        const [updatedApp] = await db.update(oauthApps)
          .set({
            ...updateData,
            updatedAt: new Date(), // Manually update updatedAt for consistency
          })
          .where(eq(oauthApps.id, id))
          .returning();

        if (!updatedApp) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update OAuth application.',
          });
        }

        return updatedApp;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating OAuth application:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred.',
          cause: error,
        });
      }
    }),
});

// Placeholder for trpc.ts and db.ts to make the file self-contained for now
// In a real project, these would be separate files.

// trpc.ts content (simplified for this example)
// import { initTRPC } from '@trpc/server';
// export const t = initTRPC.create();
// export const router = t.router;
// export const publicProcedure = t.procedure;

// db.ts content (simplified for this example)
// import { Pool } from 'pg';
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
