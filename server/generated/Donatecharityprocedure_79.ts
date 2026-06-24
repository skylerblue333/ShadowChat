// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: donateCharityProcedure
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle ORM instance
import { charities, donations } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const donateCharityProcedure = publicProcedure
  .input(
    z.object({
      charityId: z.string().uuid(),
      amount: z.number().positive(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({ input }) => {
    const { charityId, amount, userId } = input;

    // 1. Validate charity existence
    const targetCharity = await db.select().from(charities).where(eq(charities.id, charityId)).limit(1);

    if (targetCharity.length === 0) {
      throw new Error('Charity not found');
    }

    // 2. Record the donation and update charity total in a transaction
    await db.transaction(async (tx) => {
      // Insert donation record
      await tx.insert(donations).values({
        id: crypto.randomUUID(), // Generate a new UUID for the donation
        charityId,
        userId,
        amount,
        donatedAt: new Date(),
      });

      // Update charity's total received donations
      await tx.update(charities)
        .set({ totalDonations: targetCharity[0].totalDonations + amount })
        .where(eq(charities.id, charityId));
    });

    return { success: true, message: `Successfully donated ${amount} to charity ${charityId}` };
  });

export const appRouter = router({
  donateCharity: donateCharityProcedure,
});

export type AppRouter = typeof appRouter;
