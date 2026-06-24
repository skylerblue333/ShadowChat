// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateTask
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { db } from "./db";
import { tasks } from "./schema";

export const updateTaskProcedure = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { id, ...updateData } = input;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No update data provided.");
      }

      const result = await db
        .update(tasks)
        .set(updateData)
        .where(eq(tasks.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Task with ID ${id} not found.`);
      }

      return result[0];
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task.");
    }
  });

export const appRouter = router({
  updateTask: updateTaskProcedure,
});

export type AppRouter = typeof appRouter;
