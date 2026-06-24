// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createGroup
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Adjust path as per your project structure
import { db } from './db'; // Adjust path as per your project structure
import { groups } from './schema'; // Adjust path as per your project structure
import { TRPCError } from '@trpc/server';

// Input schema for createGroup procedure
const createGroupInput = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters long').max(50, 'Group name cannot exceed 50 characters'),
  creatorId: z.string().uuid('Invalid creator ID format'), // Assuming creatorId is a UUID
});

// Output schema for createGroup procedure
const createGroupOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  group: z.object({
    id: z.number(),
    name: z.string(),
    creatorId: z.string().uuid(),
    createdAt: z.date(),
  }).optional(),
});

export const groupRouter = router({
  createGroup: publicProcedure
    .input(createGroupInput)
    .output(createGroupOutput) // Define output schema
    .mutation(async ({ input }) => {
      try {
        // 1. Input validation (handled by Zod automatically by tRPC)
        const { name, creatorId } = input;

        // 2. Check for existing group with the same name (optional, but good practice)
        const existingGroup = await db.select().from(groups).where(groups.name === name).execute();
        if (existingGroup.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Group with this name already exists.',
          });
        }

        // 3. Database operation: Insert new group
        const [newGroup] = await db.insert(groups).values({
          name,
          creatorId,
        }).returning();

        if (!newGroup) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create group in database.',
          });
        }

        // 4. Return success response
        return {
          success: true,
          message: 'Group created successfully',
          group: newGroup,
        };
      } catch (error) {
        // 5. Error handling
        if (error instanceof TRPCError) {
          throw error; // Re-throw tRPC errors directly
        } else {
          console.error('Unexpected error creating group:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
          });
        }
      }
    }),
});
