// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: joinCommunity
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { communityMembers, communities } from './schema';

export const communityRouter = router({
  joinCommunity: publicProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { communityId, userId } = input;

      // Check if community exists
      const communityExists = await db.select().from(communities).where(eq(communities.id, communityId)).limit(1);
      if (communityExists.length === 0) {
        throw new Error('Community not found');
      }

      // Check if user is already a member
      const existingMembership = await db.select().from(communityMembers).where(and(eq(communityMembers.communityId, communityId), eq(communityMembers.userId, userId))).limit(1);
      if (existingMembership.length > 0) {
        throw new Error('User is already a member of this community');
      }

      // Add user to the community
      await db.insert(communityMembers).values({ communityId, userId });

      return { success: true, message: 'Successfully joined community' };
    }),
});
