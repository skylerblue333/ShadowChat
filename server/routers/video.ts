import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { videoContent, videoComments } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const videoRouter = router({
  // List videos by category
  listVideos: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      if (input.category) {
        return await db
          .select()
          .from(videoContent)
          .where(eq(videoContent.category, input.category))
          .orderBy(desc(videoContent.createdAt))
          .limit(input.limit);
      }
      return await db
        .select()
        .from(videoContent)
        .orderBy(desc(videoContent.createdAt))
        .limit(input.limit);
    }),

  // Get video details
  getVideo: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const video = await db
        .select()
        .from(videoContent)
        .where(eq(videoContent.id, input.id))
        .then((r: any[]) => r[0]);
      return video || null;
    }),

  // Upload video (user-generated)
  uploadVideo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        videoUrl: z.string(),
        videoKey: z.string(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
        category: z.string(),
        duration: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(videoContent).values([
        {
          userId: ctx.user!.id,
          title: input.title,
          description: input.description,
          videoUrl: input.videoUrl,
          videoKey: input.videoKey,
          thumbnailUrl: input.thumbnailUrl,
          thumbnailKey: input.thumbnailKey,
          category: input.category,
          duration: input.duration,
          isLive: false,
        },
      ]);
      return { success: true };
    }),

  // Increment view count
  incrementViews: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const video = await db
        .select()
        .from(videoContent)
        .where(eq(videoContent.id, input.videoId))
        .then((r: any[]) => r[0]);
      if (!video) return { success: false };
      await db
        .update(videoContent)
        .set({ views: video.views + 1 })
        .where(eq(videoContent.id, input.videoId));
      return { success: true };
    }),

  // Like/unlike video
  toggleLike: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const video = await db
        .select()
        .from(videoContent)
        .where(eq(videoContent.id, input.videoId))
        .then((r: any[]) => r[0]);
      if (!video) return { success: false };
      await db
        .update(videoContent)
        .set({ likes: video.likes + 1 })
        .where(eq(videoContent.id, input.videoId));
      return { success: true, likes: video.likes + 1 };
    }),

  // Add comment
  addComment: protectedProcedure
    .input(z.object({ videoId: z.number(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(videoComments).values([
        {
          videoId: input.videoId,
          userId: ctx.user!.id,
          content: input.content,
        },
      ]);
      return { success: true };
    }),

  // Get comments
  getComments: publicProcedure
    .input(z.object({ videoId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(videoComments)
        .where(eq(videoComments.videoId, input.videoId))
        .orderBy(desc(videoComments.createdAt))
        .limit(input.limit);
    }),

  // Get trending videos
  getTrending: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(videoContent)
        .orderBy(desc(videoContent.views))
        .limit(input.limit);
    }),
});
