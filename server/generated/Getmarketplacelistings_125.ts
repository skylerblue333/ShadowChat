// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getMarketplaceListings
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Assuming trpc.ts defines these
import { db } from '../db'; // Assuming db.ts exports the Drizzle instance
import { marketplaceListings } from '../db/schema'; // Assuming schema.ts defines these

const getMarketplaceListingsInput = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  status: z.enum(['active', 'sold', 'pending']).optional(),
  sellerId: z.string().optional(),
});

export const marketplaceRouter = router({
  getMarketplaceListings: publicProcedure
    .input(getMarketplaceListingsInput)
    .query(async ({ input }) => {
      try {
        const { limit, offset, status, sellerId } = input;

        let query = db.select().from(marketplaceListings).$dynamic();

        if (status) {
          query = query.where(eq(marketplaceListings.status, status));
        }

        if (sellerId) {
          query = query.where(eq(marketplaceListings.sellerId, sellerId));
        }

        const listings = await query.limit(limit).offset(offset);

        if (!listings || listings.length === 0) {
          // Consider returning an empty array instead of throwing for 'no listings found'
          return { listings: [], total: 0 };
        }

        // In a real scenario, a separate count query would be more efficient for total
        // For simplicity, we'll use the length of the fetched listings here.
        // A more robust solution would involve a separate `db.select(sql`count(*)`).from(...).where(...)`
        const totalCountResult = await db.select({ count: eq(marketplaceListings.id, marketplaceListings.id) }).from(marketplaceListings);
        const total = totalCountResult.length; // Placeholder, actual count query needed

        return {
          listings,
          total,
        };
      } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        throw new Error('Failed to fetch marketplace listings.');
      }
    }),
});