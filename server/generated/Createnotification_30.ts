// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createNotification
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { notifications } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const createNotificationProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().min(1, { message: "User ID cannot be empty" }),
      message: z.string().min(1, { message: "Notification message cannot be empty" }),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const newNotification = await db.insert(notifications).values({
        userId: input.userId,
        message: input.message,
      }).returning();

      if (!newNotification || newNotification.length === 0) {
        throw new Error("Failed to create notification.");
      }

      return {
        success: true,
        notification: newNotification[0],
        message: "Notification created successfully.",
      };
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error(`Could not create notification: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

export const appRouter = router({
  createNotification: createNotificationProcedure,
});

export type AppRouter = typeof appRouter;
