// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCommunityMembers
import { z } from 'zod';
import { publicProcedure, router } from '../trpc'; // Adjust path as needed
import { db } from '../db'; // Adjust path as needed
import { users, communities, communityMembers } from '../schema'; // Adjust path as needed
import { TRPCError } from '@trpc/server';

export const getCommunityMembersProcedure = publicProcedure
  .input(
    z.object({
      communityId: z.string().uuid('Invalid community ID format. Must be a UUID.').nonempty('Community ID cannot be empty.'),
      limit: z.number().min(1, 'Limit must be at least 1.').max(100, 'Limit cannot exceed 100.').default(10),
      offset: z.number().min(0, 'Offset cannot be negative.').default(0),
      search: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { communityId, limit, offset, search } = input;

      // Check if the community exists
      const communityExists = await db.select().from(communities).where(eq(communities.id, communityId)).limit(1);
      if (communityExists.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Community with ID ${communityId} not found.`,
        });
      }

      const membersQuery = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          joinedAt: communityMembers.joinedAt,
        })
        .from(communityMembers)
        .innerJoin(users, eq(communityMembers.userId, users.id))
        .where(eq(communityMembers.communityId, communityId));

      if (search) {
        membersQuery.where(
          and(
            eq(communityMembers.communityId, communityId),
            or(
              like(users.name, `%${search}%`),
              like(users.email, `%${search}%`)
            )
          )
        );
      }

      const communityMembersList = await membersQuery.limit(limit).offset(offset);

      return communityMembersList;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error fetching community members:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch community members due to an unexpected error.',
      });
    }
  });

export const communityRouter = router({
  getCommunityMembers: getCommunityMembersProcedure,
});

export type CommunityRouter = typeof communityRouter;
