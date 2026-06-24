// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMessages
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod'; // For input validation
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { messages } from './schema'; // Assuming schema.ts defines your Drizzle schema
import { TRPCError } from '@trpc/server';

export const messageRouter = router({
  getMessages: publicProcedure
    .input(z.object({
      senderId: z.string().uuid(),
      receiverId: z.string().uuid(),
    }))
    .output(z.array(z.object({
      id: z.string().uuid(),
      senderId: z.string().uuid(),
      receiverId: z.string().uuid(),
      content: z.string(),
      createdAt: z.date(),
    })))
    .query(async ({ input }) => {
      try {
        const { senderId, receiverId } = input;

        const result = await db.select().from(messages).where(
          or(
            and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)),
            and(eq(messages.senderId, receiverId), eq(messages.receiverId, senderId))
          )
        ).orderBy(messages.createdAt);

        return result;
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch messages.',
          cause: error,
        });
      }
    }),
});

export type MessageRouter = typeof messageRouter;
