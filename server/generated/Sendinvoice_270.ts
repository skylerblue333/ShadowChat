// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: sendInvoice
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup file
import { db } from './db'; // Assuming Drizzle DB connection
import { invoices, users } from './schema'; // Assuming Drizzle schema definitions

const sendInvoiceInputSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient ID format.'),
  amount: z.number().positive('Amount must be positive.'),
  currency: z.string().min(1, 'Currency is required.').max(10, 'Currency too long.'),
  description: z.string().optional(),
});

export const invoiceRouter = router({
  sendInvoice: publicProcedure
    .input(sendInvoiceInputSchema)
    .mutation(async ({ input }) => {
      const { recipientId, amount, currency, description } = input;

      // Operation 1: Validate recipient existence
      const recipient = await db.select().from(users).where(eq(users.id, recipientId)).limit(1);
      if (recipient.length === 0) {
        throw new Error('Recipient not found.');
      }

      // Operation 2: Insert new invoice record
      const [newInvoice] = await db.insert(invoices).values({
        recipientId,
        amount: amount.toString(), // Drizzle numeric type often expects string
        currency,
        description,
        status: 'pending',
      }).returning({ id: invoices.id });

      if (!newInvoice) {
        throw new Error('Failed to create invoice.');
      }

      // Operation 3: Return success and invoice ID
      return {
        success: true,
        invoiceId: newInvoice.id,
        message: 'Invoice sent successfully.',
      };
    }),
});

export type InvoiceRouter = typeof invoiceRouter;
