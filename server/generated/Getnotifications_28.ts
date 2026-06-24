// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getNotifications
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { notifications } from './schema'; // Assuming schema.ts defines your Drizzle schema for notifications

export const notificationRouter = router({
  getNotifications: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
      limit: z.number().int().positive().default(10),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ input }) => {
      try {
        const { userId, limit, offset } = input;

        // Simulate a database query using Drizzle ORM
        const userNotifications = await db.select()
          .from(notifications)
          .where(eq(notifications.userId, userId))
          .limit(limit)
          .offset(offset);

        if (!userNotifications) {
          throw new Error('Notifications not found for this user.');
        }

        return {
          success: true,
          notifications: userNotifications,
          message: 'Notifications fetched successfully.',
        };
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications.');
      }
    }),
});