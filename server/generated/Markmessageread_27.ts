// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: markMessageRead
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { messages } from '../db/schema'; // Assuming Drizzle schema for messages

const markMessageReadInput = z.object({
  messageId: z.string().uuid(),
  userId: z.string().uuid(),
});

const markMessageReadOutput = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const messageRouter = router({
  markMessageRead: publicProcedure
    .input(markMessageReadInput)
    .output(markMessageReadOutput)
    .mutation(async ({ input }) => {
      const { messageId, userId } = input;

      try {
        const result = await db
          .update(messages)
          .set({ isRead: true })
          .where(and(eq(messages.id, messageId), eq(messages.userId, userId)))
          .returning({ id: messages.id, isRead: messages.isRead });

        if (result.length === 0) {
          return { success: false, message: 'Message not found or unauthorized.' };
        }

        return { success: true, message: 'Message marked as read.' };
      } catch (error) {
        console.error('Error marking message as read:', error);
        throw new Error('Failed to mark message as read.');
      }
    }),
});