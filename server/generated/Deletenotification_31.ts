// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteNotification

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc context setup
import { db } from '../db'; // Assuming Drizzle DB instance
import { notifications } from '../schema'; // Assuming Drizzle schema

export const notificationRouter = router({
  deleteNotification: publicProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid notification ID format."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // 1. Database operation: Delete the notification
      const deletedNotifications = await db
        .delete(notifications)
        .where(eq(notifications.id, id))
        .returning({ id: notifications.id });

      // 2. Error handling: Check if notification was actually deleted
      if (deletedNotifications.length === 0) {
        throw new Error("Notification not found or already deleted.");
      }

      // 3. Return type: Success message with the ID of the deleted notification
      return {
        success: true,
        deletedId: deletedNotifications[0].id,
        message: "Notification deleted successfully.",
      };
    }),
});
