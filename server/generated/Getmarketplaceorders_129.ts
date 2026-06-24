// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMarketplaceOrders

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { marketplaceOrders, users, products } from '../schema'; // Adjust path as needed

// 1. Input Validation Schema
const GetMarketplaceOrdersInput = z.object({
  userId: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

// 2. Output Type
export type MarketplaceOrder = typeof marketplaceOrders.$inferSelect & {
  user?: typeof users.$inferSelect;
  product?: typeof products.$inferSelect;
};

export const marketplaceRouter = router({
  getMarketplaceOrders: publicProcedure
    .input(GetMarketplaceOrdersInput)
    .query(async ({ input }) => {
      try {
        const { userId, status, limit, offset } = input;

        const conditions = [];
        if (userId) {
          conditions.push(eq(marketplaceOrders.userId, userId));
        }
        if (status) {
          conditions.push(eq(marketplaceOrders.status, status));
        }

        const orders = await db.query.marketplaceOrders.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          limit,
          offset,
          with: {
            user: true,
            product: true,
          },
        });

        if (!orders || orders.length === 0) {
          // Consider throwing a specific error or returning an empty array based on requirements
          return [];
        }

        return orders as MarketplaceOrder[];
      } catch (error) {
        console.error('Error fetching marketplace orders:', error);
        throw new Error('Failed to fetch marketplace orders.');
      }
    }),
});

export type MarketplaceRouter = typeof marketplaceRouter;
