// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: followUserProcedure
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { users, follows } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const followUserProcedure = publicProcedure
  .input(z.object({
    followerId: z.string().uuid(),
    followingId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    const { followerId, followingId } = input;

    // Operation 1: Validate input and prevent self-following
    if (followerId === followingId) {
      throw new Error('Users cannot follow themselves.');
    }

    // Operation 2: Check if both users exist
    const [follower, following] = await Promise.all([
      db.select().from(users).where(eq(users.id, followerId)).limit(1),
      db.select().from(users).where(eq(users.id, followingId)).limit(1),
    ]);

    if (!follower || follower.length === 0) {
      throw new Error('Follower user not found.');
    }
    if (!following || following.length === 0) {
      throw new Error('Following user not found.');
    }

    // Operation 3: Check if the follow relationship already exists
    const existingFollow = await db.select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);

    if (existingFollow && existingFollow.length > 0) {
      throw new Error('User already following this user.');
    }

    // Operation 4: Insert the new follow relationship
    const newFollow = await db.insert(follows).values({
      followerId,
      followingId,
      createdAt: new Date(),
    }).returning();

    if (!newFollow || newFollow.length === 0) {
      throw new Error('Failed to establish follow relationship.');
    }

    return { message: 'User followed successfully', follow: newFollow[0] };
  });

// Example of how to integrate this into a tRPC router (assuming you have one)
// export const appRouter = router({
//   // ... other procedures
//   followUser: followUserProcedure,
// });
