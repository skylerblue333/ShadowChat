// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: stopBot
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { bots } from "../schema";

export const stopBotProcedure = publicProcedure
  .input(z.object({
    botId: z.string().uuid(),
    userId: z.string().uuid(),
  }))
  .output(z.object({
    success: z.boolean(),
    message: z.string(),
  }))
  .mutation(async ({ input }) => {
    const { botId, userId } = input;

    // 1. Validate bot ownership
    const existingBot = await db.select().from(bots).where(eq(bots.id, botId)).limit(1);

    if (!existingBot || existingBot[0].userId !== userId) {
      throw new Error("Bot not found or unauthorized.");
    }

    // 2. Update bot status to stopped
    await db.update(bots).set({ status: "stopped", updatedAt: new Date() }).where(eq(bots.id, botId));

    // 3. Log the action (simulated)
    console.log(`Bot ${botId} stopped by user ${userId}`);

    return {
      success: true,
      message: `Bot ${botId} has been successfully stopped.`, 
    };
  });

export const botRouter = router({
  stopBot: stopBotProcedure,
});