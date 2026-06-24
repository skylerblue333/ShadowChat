// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createInvoice

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { invoices } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const invoiceRouter = router({
  createInvoice: publicProcedure
    .input(z.object({
      customerId: z.string().uuid(),
      amount: z.number().positive(),
      currency: z.string().length(3),
      dueDate: z.string().datetime(),
      items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })).min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const newInvoice = await db.insert(invoices).values({
          id: crypto.randomUUID(),
          customerId: input.customerId,
          amount: input.amount,
          currency: input.currency,
          dueDate: new Date(input.dueDate),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        // In a real application, you would also insert invoice items into a separate table here.
        // For simplicity, we'll omit that for this example.

        if (!newInvoice || newInvoice.length === 0) {
          throw new Error('Failed to create invoice.');
        }

        return { success: true, invoice: newInvoice[0] };
      } catch (error) {
        console.error('Error creating invoice:', error);
        throw new Error('Could not create invoice.');
      }
    }),
});

export type InvoiceRouter = typeof invoiceRouter;
