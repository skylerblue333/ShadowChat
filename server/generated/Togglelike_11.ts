// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: toggleLike

import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { likes } from '../schema'; // Adjust path as needed

export const toggleLikeProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    itemId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    const { userId, itemId } = input;

    // 1. Check if the like already exists
    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.itemId, itemId)),
    });

    if (existingLike) {
      // 2. If it exists, delete it (unlike)
      await db.delete(likes).where(eq(likes.id, existingLike.id));
      return { liked: false, message: 'Item unliked successfully.' };
    } else {
      // 3. If it doesn't exist, create a new like (like)
      await db.insert(likes).values({ userId, itemId });
      return { liked: true, message: 'Item liked successfully.' };
    }
  });

export const likeRouter = router({
  toggleLike: toggleLikeProcedure,
});
