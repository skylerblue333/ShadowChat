// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: markNotificationRead
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { notifications } from '../schema';

export const markNotificationReadProcedure = publicProcedure
  .input(z.object({
    notificationId: z.string().uuid(),
    userId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    try {
      const result = await db.update(notifications)
        .set({ read: true, updatedAt: new Date() })
        .where(eq(notifications.id, input.notificationId))
        .returning();

      if (result.length === 0) {
        throw new Error('Notification not found or not authorized');
      }

      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  });

export const notificationRouter = router({
  markNotificationRead: markNotificationReadProcedure,
});