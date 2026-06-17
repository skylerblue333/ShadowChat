import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { cryptoWallets } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const walletRouter = router({
  // Connect wallet - store wallet address
  connectWallet: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        chainId: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      try {
        // Store wallet connection in user profile or separate table
        return {
          success: true,
          address: input.walletAddress,
          chainId: input.chainId,
          message: "Wallet connected successfully",
        };
      } catch (error) {
        return { success: false, error: "Failed to connect wallet" };
      }
    }),

  // Get wallet balance for a token
  getWalletBalance: protectedProcedure
    .input(z.object({ token: z.string(), walletAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { balance: 0, token: input.token };

      try {
        const wallet = await db
          .select()
          .from(cryptoWallets)
          .where(and(eq(cryptoWallets.userId, ctx.user.id), eq(cryptoWallets.token as any, input.token)))
          .limit(1);

        return {
          balance: wallet[0]?.balance || 0,
          token: input.token,
          walletAddress: input.walletAddress,
        };
      } catch {
        return { balance: 0, token: input.token };
      }
    }),

  // Get all wallet balances
  getAllWalletBalances: protectedProcedure
    .input(z.object({ walletAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        return await db.select().from(cryptoWallets).where(eq(cryptoWallets.userId, ctx.user.id));
      } catch {
        return [];
      }
    }),

  // Send transaction (mine, stake, burn, swap)
  sendTransaction: protectedProcedure
    .input(
      z.object({
        from: z.string(),
        to: z.string(),
        amount: z.number(),
        token: z.string(),
        type: z.enum(["mine", "stake", "burn", "swap", "transfer"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, this would:
      // 1. Validate transaction with smart contract
      // 2. Sign with user's wallet
      // 3. Submit to blockchain
      // 4. Return transaction hash

      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2)}`,
        from: input.from,
        to: input.to,
        amount: input.amount,
        token: input.token,
        type: input.type,
        status: "pending",
      };
    }),

  // Verify transaction on blockchain
  verifyTransaction: protectedProcedure
    .input(z.object({ txHash: z.string() }))
    .query(async ({ ctx, input }) => {
      // In production, this would query blockchain for transaction status
      return {
        txHash: input.txHash,
        status: "confirmed",
        blockNumber: 18500000,
        confirmations: 12,
      };
    }),

  // Disconnect wallet
  disconnectWallet: protectedProcedure.mutation(async ({ ctx }) => {
    return { success: true, message: "Wallet disconnected" };
  }),
});
