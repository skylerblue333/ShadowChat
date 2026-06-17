import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { nftAchievements, achievementBadges } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const achievementsRouter = router({
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    try {
      return await db.select().from(nftAchievements).where(eq(nftAchievements.userId, ctx.user.id));
    } catch {
      return [];
    }
  }),

  getAllBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    try {
      return await db.select().from(achievementBadges);
    } catch {
      return [];
    }
  }),

  claimReward: protectedProcedure
    .input(z.object({ achievementId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, reward: "100 SKY444" };
    }),
});
