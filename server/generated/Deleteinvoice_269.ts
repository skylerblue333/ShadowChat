// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteInvoice

// Path: src/server/routers/invoice.ts (example path)
import { publicProcedure, router } from '../trpc'; // Assuming trpc setup
import { z } from 'zod'; // For input validation
import { db } from '../db'; // Drizzle DB instance
import { invoices } from '../schema'; // Drizzle schema for invoices table

export const invoiceRouter = router({
  deleteInvoice: publicProcedure
    .input(z.object({
      invoiceId: z.string().uuid({ message: "Invalid invoice ID format." }), // Input validation
    }))
    .mutation(async ({ input }) => {
      try {
        // Operation 1: Input validation (handled by Zod schema)

        // Operation 2: Database deletion
        const result = await db.delete(invoices)
          .where(eq(invoices.id, input.invoiceId))
          .returning({ id: invoices.id }); // Return deleted ID for confirmation

        // Operation 3: Check if deletion was successful
        if (result.length === 0) {
          throw new Error('Invoice not found or already deleted.');
        }

        // Operation 4: Return success
        return { success: true, deletedInvoiceId: result[0].id };

      } catch (error) {
        // Operation 5: Error handling
        console.error('Error deleting invoice:', error);
        throw new Error(`Failed to delete invoice: ${error.message}`);
      }
    }),
});
