import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const phase25NotificationsRouter = router({
  subscribeNotifications: protectedProcedure.input(z.object({ channels: z.array(z.string()) })).query(async ({ input }) => ({
    subscribed: input.channels,
    active: true,
  })),
  sendNotification: protectedProcedure.input(z.object({ userId: z.string(), message: z.string() })).mutation(async ({ input }) => ({
    success: true,
    notificationId: `notif_${Date.now()}`,
  })),
  getNotificationHistory: protectedProcedure.query(async () => ({
    notifications: Array.from({ length: 20 }, (_, i) => ({
      id: `notif_${i}`,
      message: `Notification ${i}`,
      read: i % 2 === 0,
      timestamp: new Date(),
    })),
  })),
});
