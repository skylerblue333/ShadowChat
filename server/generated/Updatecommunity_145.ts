// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateCommunity
import { z } from 'zod';
import { publicProcedure } from './trpc'; // Assuming trpc.ts defines publicProcedure
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { communities } from './schema'; // Assuming schema.ts defines your communities table schema
import { TRPCError } from '@trpc/server';

const updateCommunityInput = z.object({
  communityId: z.string().uuid('Invalid community ID format. Must be a UUID.'),
  name: z.string().min(3, 'Community name must be at least 3 characters long.').max(100, 'Community name cannot exceed 100 characters.').optional(),
  description: z.string().max(500, 'Community description cannot exceed 500 characters.').optional(),
  isPublic: z.boolean().optional(),
});

export const updateCommunity = publicProcedure
  .input(updateCommunityInput)
  .mutation(async ({ input }) => {
    const { communityId, ...updateData } = input;

    if (Object.keys(updateData).length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No update data provided.',
      });
    }

    try {
      // Check if community exists
      const existingCommunity = await db.select().from(communities).where(eq(communities.id, communityId)).limit(1);

      if (existingCommunity.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Community with ID ${communityId} not found.`,
        });
      }

      const [updatedCommunity] = await db.update(communities)
        .set(updateData)
        .where(eq(communities.id, communityId))
        .returning();

      if (!updatedCommunity) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update community.',
        });
      }

      return {
        success: true,
        message: 'Community updated successfully.',
        community: updatedCommunity,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error updating community:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while updating the community.',
      });
    }
  });
