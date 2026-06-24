// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTrendingTopics
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { topics } from '../schema';

export const trendingTopicsRouter = router({
  getTrendingTopics: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10).optional(),
        offset: z.number().min(0).default(0).optional(),
      }).optional()
    )
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          popularity: z.number(),
          updatedAt: z.date(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        const limit = input?.limit ?? 10;
        const offset = input?.offset ?? 0;

        const trendingTopics = await db.select()
          .from(topics)
          .orderBy(desc(topics.popularity), desc(topics.updatedAt))
          .limit(limit)
          .offset(offset);

        return trendingTopics;
      } catch (error) {
        console.error("Error fetching trending topics:", error);
        throw new Error("Failed to fetch trending topics.");
      }
    }),
});