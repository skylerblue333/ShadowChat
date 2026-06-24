// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updatePost
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { posts } from './schema'; // Assuming schema.ts defines your Drizzle schema
import { TRPCError } from '@trpc/server';

// Input schema for updating a post
const updatePostInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

// Output schema for a post
const postOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const postRouter = router({
  updatePost: publicProcedure
    .input(updatePostInput)
    .output(postOutput)
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input;

      if (Object.keys(updateFields).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No fields provided for update.',
        });
      }

      const [updatedPost] = await db.update(posts)
        .set({
          ...updateFields,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Post with ID ${id} not found.`,
        });
      }

      return updatedPost;
    }),
});
