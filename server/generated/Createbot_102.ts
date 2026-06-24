// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createBot
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { bots } from './schema'; // Assuming schema.ts defines your Drizzle schema for bots
import { TRPCError } from '@trpc/server';

export const createBotProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().min(1, "Bot name cannot be empty"),
      description: z.string().optional(),
      config: z.record(z.any()).optional(), // Flexible configuration object
    })
  )
  .mutation(async ({ input }) => {
    try {
      const newBot = await db.insert(bots).values({
        name: input.name,
        description: input.description,
        config: input.config || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      if (!newBot || newBot.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create bot: No data returned.',
        });
      }

      return { success: true, bot: newBot[0] };
    } catch (error) {
      console.error("Error creating bot:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while creating the bot.',
      });
    }
  });

export const botRouter = router({
  createBot: createBotProcedure,
});
