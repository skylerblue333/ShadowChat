// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getAnalyticsDashboard
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db'; // Assuming your Drizzle instance is exported as 'db'
import { users, transactions, analyticsEvents } from '../schema'; // Assuming your Drizzle schema is in '../schema'

export const analyticsRouter = router({
  getAnalyticsDashboard: publicProcedure
    .input(z.object({
      timeRange: z.enum(['day', 'week', 'month', 'all']).default('month'),
    }))
    .output(z.object({
      totalUsers: z.number(),
      totalTransactions: z.number(),
      totalTransactionAmount: z.string(), // Drizzle returns decimal as string
      recentEvents: z.array(z.object({
        eventName: z.string(),
        userId: z.number().nullable(),
        createdAt: z.date(),
      })),
    }))
    .query(async ({ input }) => {
      try {
        const { timeRange } = input;
        const now = new Date();
        let startDate: Date | undefined;

        switch (timeRange) {
          case 'day':
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'all':
          default:
            startDate = undefined;
        }

        // Fetch total users
        const totalUsersResult = await db.select({ count: count(users.id) }).from(users);
        const totalUsers = totalUsersResult[0].count;

        // Fetch total transactions and sum of amounts
        const totalTransactionsResult = await db.select({
          count: count(transactions.id),
          totalAmount: sum(transactions.amount),
        }).from(transactions);
        const totalTransactions = totalTransactionsResult[0].count;
        const totalTransactionAmount = totalTransactionsResult[0].totalAmount || '0.00';

        // Fetch recent analytics events
        let recentEventsQuery = db.select({
          eventName: analyticsEvents.eventName,
          userId: analyticsEvents.userId,
          createdAt: analyticsEvents.createdAt,
        }).from(analyticsEvents);

        if (startDate) {
          recentEventsQuery = recentEventsQuery.where(gte(analyticsEvents.createdAt, startDate));
        }

        const recentEvents = await recentEventsQuery.orderBy(desc(analyticsEvents.createdAt)).limit(10);

        return {
          totalUsers,
          totalTransactions,
          totalTransactionAmount,
          recentEvents,
        };
      } catch (error) {
        console.error('Error fetching analytics dashboard data:', error);
        throw new Error('Failed to fetch analytics dashboard data.');
      }
    }),
});
