// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: convertQuoteToInvoice
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { quotes, quoteItems, invoices, invoiceItems } from '../schema';

export const quoteRouter = router({
  convertQuoteToInvoice: publicProcedure
    .input(z.object({
      quoteId: z.string().uuid('Invalid quote ID format.'),
    }))
    .mutation(async ({ input }) => {
      const { quoteId } = input;

      // 1. Fetch the quote
      const existingQuote = await db.query.quotes.findFirst({
        where: eq(quotes.id, quoteId),
        with: { quoteItems: true },
      });

      if (!existingQuote) {
        throw new Error('Quote not found.');
      }

      if (existingQuote.status === 'converted') {
        throw new Error('Quote already converted to an invoice.');
      }

      // 2. Create a new invoice
      const [newInvoice] = await db.insert(invoices).values({
        customerId: existingQuote.customerId,
        quoteId: existingQuote.id,
        totalAmount: existingQuote.totalAmount,
        status: 'draft',
      }).returning();

      if (!newInvoice) {
        throw new Error('Failed to create invoice.');
      }

      // 3. Create invoice items from quote items
      if (existingQuote.quoteItems && existingQuote.quoteItems.length > 0) {
        const newInvoiceItems = existingQuote.quoteItems.map(item => ({
          invoiceId: newInvoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));
        await db.insert(invoiceItems).values(newInvoiceItems);
      }

      // 4. Update the quote status to 'converted'
      await db.update(quotes)
        .set({ status: 'converted', updatedAt: new Date() })
        .where(eq(quotes.id, quoteId));

      return { success: true, invoiceId: newInvoice.id, message: 'Quote successfully converted to invoice.' };
    }),
});