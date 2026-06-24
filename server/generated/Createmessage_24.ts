// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createMessage
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC instance
import { db } from "./db"; // Assuming db.ts exports your Drizzle database instance
import { messages } from "./schema"; // Assuming schema.ts defines your Drizzle schema

export const messageRouter = router({
  createMessage: publicProcedure
    .input(z.object({
      senderId: z.string().uuid(),
      recipientId: z.string().uuid(),
      content: z.string().min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      try {
        const newMessage = await db.insert(messages).values({
          id: crypto.randomUUID(), // Generate a UUID for the message ID
          senderId: input.senderId,
          recipientId: input.recipientId,
          content: input.content,
          createdAt: new Date(),
        }).returning();

        if (!newMessage || newMessage.length === 0) {
          throw new Error("Failed to create message.");
        }

        return newMessage[0];
      } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Could not create message.");
      }
    }),
});
