// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getProjects
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { projects } from "../../../db/schema";

export const projectRouter = router({
  getProjects: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.db.query.projects.findMany({
        limit: limit + 1,
        where: cursor ? eq(projects.id, cursor) : undefined,
        orderBy: projects.id,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const lastItem = items.pop();
        nextCursor = lastItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});