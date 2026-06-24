// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateInvoice
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { invoices } from "../db/schema";

export const updateInvoiceProcedure = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      customerId: z.string().uuid().optional(),
      amount: z.number().positive().optional(),
      status: z.enum(["pending", "paid", "overdue"]).optional(),
      dueDate: z.string().datetime().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { id, ...updateData } = input;

      const [updatedInvoice] = await db
        .update(invoices)
        .set(updateData)
        .where(eq(invoices.id, id))
        .returning();

      if (!updatedInvoice) {
        throw new Error("Invoice not found or could not be updated.");
      }

      return {
        success: true,
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      };
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw new Error("Failed to update invoice.");
    }
  });

export const invoiceRouter = router({
  updateInvoice: updateInvoiceProcedure,
});