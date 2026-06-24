// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: banUserProcedure
import { z } from "zod";
import { publicProcedure } from "./trpc"; // Assuming trpc.ts defines publicProcedure
import { db } from "./db"; // Assuming db.ts exports your Drizzle client
import { users } from "./schema"; // Assuming schema.ts defines your users table schema

export const banUserProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      reason: z.string().min(1).max(255).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { userId, reason } = input;

    try {
      // 1. Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      if (existingUser.length === 0) {
        throw new Error("User not found.");
      }

      // 2. Ban the user by updating their status
      const result = await db
        .update(users)
        .set({ status: "banned", banReason: reason, updatedAt: new Date() })
        .where(eq(users.id, userId));

      if (result.rowCount === 0) {
        throw new Error("Failed to ban user.");
      }

      // 3. Return success message
      return { success: true, message: `User ${userId} has been banned.` };
    } catch (error) {
      console.error("Error banning user:", error);
      throw new Error(`Failed to ban user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
