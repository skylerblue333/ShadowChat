// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: buyMarketplaceItem
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { marketplaceItems, users } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const buyMarketplaceItemProcedure = publicProcedure
  .input(z.object({
    itemId: z.string().uuid(),
    userId: z.string().uuid(),
    quantity: z.number().int().positive(),
  }))
  .mutation(async ({ input }) => {
    const { itemId, userId, quantity } = input;

    // 1. Validate item existence and availability
    const item = await db.select().from(marketplaceItems).where(eq(marketplaceItems.id, itemId)).limit(1);

    if (!item || item.length === 0) {
      throw new Error('Marketplace item not found.');
    }

    const availableItem = item[0];

    if (availableItem.stock < quantity) {
      throw new Error('Not enough stock available for this item.');
    }

    // 2. Validate user existence and sufficient balance
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user || user.length === 0) {
      throw new Error('User not found.');
    }

    const buyer = user[0];
    const totalPrice = availableItem.price * quantity;

    if (buyer.balance < totalPrice) {
      throw new Error('Insufficient balance to purchase this item.');
    }

    // 3. Perform the purchase transaction
    await db.transaction(async (tx) => {
      // Deduct balance from user
      await tx.update(users)
        .set({ balance: buyer.balance - totalPrice })
        .where(eq(users.id, userId));

      // Decrease item stock
      await tx.update(marketplaceItems)
        .set({ stock: availableItem.stock - quantity })
        .where(eq(marketplaceItems.id, itemId));

      // TODO: Add a record of the purchase to a 'purchases' table
      // For example:
      // await tx.insert(purchases).values({ itemId, userId, quantity, totalPrice, purchaseDate: new Date() });
    });

    return { success: true, message: `Successfully purchased ${quantity} of ${availableItem.name}.` };
  });

export const appRouter = router({
  buyMarketplaceItem: buyMarketplaceItemProcedure,
});

export type AppRouter = typeof appRouter;
