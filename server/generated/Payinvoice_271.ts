// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: payInvoice
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { users, invoices, transactions } from "../db/schema";

export const payInvoice = publicProcedure
  .input(
    z.object({
      invoiceId: z.number().int().positive(),
      userId: z.number().int().positive(),
    })
  )
  .mutation(async ({ input }) => {
    const { invoiceId, userId } = input;

    return await db.transaction(async (tx) => {
      // 1. Fetch invoice and user
      const invoice = await tx.query.invoices.findFirst({
        where: eq(invoices.id, invoiceId),
      });

      if (!invoice) {
        throw new Error("Invoice not found.");
      }

      if (invoice.isPaid) {
        throw new Error("Invoice already paid.");
      }

      if (invoice.userId !== userId) {
        throw new Error("Invoice does not belong to the user.");
      }

      const user = await tx.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // 2. Check if user has sufficient balance
      const invoiceAmount = parseFloat(invoice.amount as string);
      const userBalance = parseFloat(user.balance as string);

      if (userBalance < invoiceAmount) {
        throw new Error("Insufficient balance.");
      }

      // 3. Update user balance
      const newBalance = userBalance - invoiceAmount;
      await tx.update(users)
        .set({ balance: newBalance.toFixed(2) })
        .where(eq(users.id, userId));

      // 4. Mark invoice as paid
      await tx.update(invoices)
        .set({ isPaid: true })
        .where(eq(invoices.id, invoiceId));

      // 5. Record transaction
      await tx.insert(transactions).values({
        userId: userId,
        invoiceId: invoiceId,
        amount: invoiceAmount.toFixed(2),
      });

      return { success: true, message: "Invoice paid successfully." };
    });
  });
