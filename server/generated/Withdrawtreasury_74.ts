// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: withdrawTreasury
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc setup in a local file

// Input schema for the withdrawTreasury procedure
const withdrawTreasuryInput = z.object({
  amount: z.number().positive("Amount must be positive"),
  recipientAddress: z.string().min(1, "Recipient address cannot be empty"),
});

// Output schema for the withdrawTreasury procedure
const withdrawTreasuryOutput = z.object({
  message: z.string(),
  transactionId: z.string(),
  newTreasuryBalance: z.number(),
});

export const treasuryRouter = router({
  withdrawTreasury: publicProcedure
    .input(withdrawTreasuryInput)
    .output(withdrawTreasuryOutput)
    .mutation(async ({ input }) => {
      const { amount, recipientAddress } = input;

      // Start a transaction to ensure atomicity
      return await db.transaction(async (tx) => {
        // 1. Fetch current treasury balance
        const currentTreasury = await tx.select().from(treasury).where(eq(treasury.id, 1)).limit(1);

        if (!currentTreasury || currentTreasury.length === 0) {
          throw new Error("Treasury not found.");
        }

        const currentBalance = currentTreasury[0].balance;

        // 2. Validate if sufficient funds are available
        if (currentBalance < amount) {
          throw new Error("Insufficient funds in treasury.");
        }

        const newBalance = currentBalance - amount;

        // 3. Update treasury balance
        await tx.update(treasury).set({ balance: newBalance }).where(eq(treasury.id, 1));

        // 4. Record the withdrawal transaction
        const [newTransaction] = await tx.insert(transactions).values({
          amount: amount,
          recipientAddress: recipientAddress,
          type: "withdrawal",
          timestamp: new Date(),
        }).returning({ id: transactions.id });

        if (!newTransaction) {
          throw new Error("Failed to record transaction.");
        }

        return {
          message: `Successfully withdrew ${amount} from treasury.`,
          transactionId: newTransaction.id.toString(),
          newTreasuryBalance: newBalance,
        };
      });
    }),
});