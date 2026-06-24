// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: sellMarketplaceItem
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup is in './trpc'
import { db } from './db'; // Assuming Drizzle DB instance is in './db'
import { marketplaceItems, users } from './schema'; // Assuming Drizzle schema is in './schema'

// Define the input schema for the sellMarketplaceItem procedure
const SellMarketplaceItemInput = z.object({
  itemId: z.string().uuid(),
  sellerId: z.string().uuid(),
});

// Define the output schema for the sellMarketplaceItem procedure
const SellMarketplaceItemOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  item: z.object({
    id: z.string().uuid(),
    name: z.string(),
    ownerId: z.string().uuid(),
    isSold: z.boolean(),
  }).optional(),
});

export const marketplaceRouter = router({
  sellMarketplaceItem: publicProcedure
    .input(SellMarketplaceItemInput)
    .output(SellMarketplaceItemOutput)
    .mutation(async ({ input }) => {
      const { itemId, sellerId } = input;

      // 1. Find the item in the database
      const item = await db.select().from(marketplaceItems).where(eq(marketplaceItems.id, itemId)).limit(1);

      if (!item || item.length === 0) {
        return { success: false, message: 'Marketplace item not found.' };
      }

      const existingItem = item[0];

      // 2. Validate if the seller owns the item
      if (existingItem.ownerId !== sellerId) {
        return { success: false, message: 'You do not own this item.' };
      }

      // 3. Check if the item is already sold
      if (existingItem.isSold) {
        return { success: false, message: 'This item has already been sold.' };
      }

      // 4. Update the item status to sold
      const [updatedItem] = await db.update(marketplaceItems)
        .set({ isSold: true })
        .where(eq(marketplaceItems.id, itemId))
        .returning();

      if (!updatedItem) {
        return { success: false, message: 'Failed to update item status.' };
      }

      // 5. Return success response with the updated item
      return {
        success: true,
        message: 'Marketplace item successfully marked as sold.',
        item: {
          id: updatedItem.id,
          name: updatedItem.name,
          ownerId: updatedItem.ownerId,
          isSold: updatedItem.isSold,
        },
      };
    }),
});
