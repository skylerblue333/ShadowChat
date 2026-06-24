// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: leaveCommunity

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc'; // Adjust path as per your project structure
import { db } from '../db'; // Adjust path as per your project structure
import { userToCommunities, communities } from '../schema'; // Adjust path as per your project structure

export const communityRouter = router({
  leaveCommunity: publicProcedure
    .input(z.object({
      communityId: z.string().uuid({ message: 'Invalid community ID format.' }),
      userId: z.string().uuid({ message: 'Invalid user ID format.' }),
    }))
    .mutation(async ({ input }) => {
      const { communityId, userId } = input;

      try {
        // Operation 1: Check if the user is a member of the community
        const existingMembership = await db.query.userToCommunities.findFirst({
          where: and(eq(userToCommunities.userId, userId), eq(userToCommunities.communityId, communityId)),
        });

        if (!existingMembership) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User is not a member of this community.',
          });
        }

        // Operation 2: Delete the user's membership record
        const deleteResult = await db.delete(userToCommunities)
          .where(and(eq(userToCommunities.userId, userId), eq(userToCommunities.communityId, communityId)))
          .returning({ id: userToCommunities.userId });

        if (deleteResult.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to remove user from community membership.',
          });
        }

        // Operation 3: Decrement the community's member count
        const updateCommunity = await db.update(communities)
          .set({ memberCount: db.raw('"member_count" - 1') })
          .where(eq(communities.id, communityId))
          .returning({ id: communities.id, memberCount: communities.memberCount });

        if (updateCommunity.length === 0) {
          // This case should ideally not happen if existingMembership was found,
          // but good for robustness.
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Community not found or failed to update member count.',
          });
        }

        return {
          success: true,
          message: `User ${userId} successfully left community ${communityId}.`,
          communityId: communityId,
          userId: userId,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error leaving community:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while leaving the community.',
        });
      }
    }),
});
