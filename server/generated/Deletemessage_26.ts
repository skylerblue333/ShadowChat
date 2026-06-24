// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteMessage
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { messages } from './schema'; // Assuming schema.ts defines your Drizzle schema for messages

export const messageRouter = router({
  deleteMessage: publicProcedure
    .input(z.object({
      id: z.string().uuid('Invalid message ID format. Must be a UUID.'),
    }))
    .mutation(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod schema)

        // 2. Perform database operation: Delete the message
        const result = await db.delete(messages).where(eq(messages.id, input.id)).returning({ id: messages.id });

        // 3. Error handling: Check if message was actually deleted
        if (result.length === 0) {
          throw new Error('Message not found or already deleted.');
        }

        // 4. Return type: Indicate successful deletion
        return { success: true, message: `Message with ID ${input.id} deleted successfully.` };
      } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
