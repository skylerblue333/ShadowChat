// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBannedUsers
import { publicProcedure, router } from '../trpc';
import { db } from '../../db';
import { users } from '../../db/schema';
import { z } from 'zod';

export const getBannedUsersProcedure = publicProcedure
  .output(z.array(z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    isBanned: z.boolean(),
  })))
  .query(async () => {
    try {
      const bannedUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        isBanned: users.isBanned,
      })
        .from(users)
        .where(eq(users.isBanned, true));

      return bannedUsers;
    } catch (error) {
      console.error("Failed to fetch banned users:", error);
      throw new Error("Could not retrieve banned users due to a server error.");
    }
  });