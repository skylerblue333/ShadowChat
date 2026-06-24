// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getUserPosts

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup
import { db } from './db'; // Drizzle DB instance
import { posts, users } from './schema'; // Assuming Drizzle schema for users and posts

export const postRouter = router({
  getUserPosts: publicProcedure
    .input(z.object({
      userId: z.number().int().positive({ message: "User ID must be a positive integer." }),
    }))
    .query(async ({ input }) => {
      try {
        // 1. Validate input (handled by Zod)

        // 2. Check if the user exists to provide a more specific error message
        const userExists = await db.select({ id: users.id }).from(users).where(eq(users.id, input.userId));
        if (userExists.length === 0) {
          throw new Error('User not found.');
        }

        // 3. Fetch posts for the given user ID
        const userPosts = await db.select()
          .from(posts)
          .where(eq(posts.userId, input.userId));

        // 4. Return the fetched posts (can be an empty array if user has no posts)
        return userPosts;
      } catch (error) {
        console.error(`Error in getUserPosts for userId ${input.userId}:`, error);
        // 5. Handle and re-throw errors for tRPC client consumption
        throw new Error(`Failed to retrieve posts for user ID ${input.userId}. Please try again later.`);
      }
    }),
});

// Example Drizzle schema (for context, not part of the procedure code itself)
/*

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
*/
