import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";

export const phase26MobileRouter = router({
  getMobileConfig: publicProcedure.query(async () => ({
    version: "1.0.0",
    minVersion: "1.0.0",
    updateRequired: false,
    features: { trading: true, gaming: true, social: true },
  })),
  getOfflineData: publicProcedure.query(async () => ({
    data: { courses: [], games: [], prices: [] },
    lastSync: new Date(),
  })),
  syncData: publicProcedure.input(z.object({ lastSync: z.date() })).mutation(async ({ input }) => ({
    synced: true,
    newData: { count: 100 },
  })),
});
