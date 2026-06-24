// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCertificates
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines these
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle instance
import { certificates } from './schema'; // Assuming schema.ts defines your certificates table
import { TRPCError } from '@trpc/server';

export const certificateRouter = router({
  getCertificates: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          issueDate: z.date(),
          expiryDate: z.date(),
          status: z.string(),
          userId: z.string(),
        })
      )
    )
    .query(async ({ input }) => {
      try {
        const { userId, status, limit, offset } = input;

        const whereConditions = [];
        if (userId) {
          whereConditions.push(eq(certificates.userId, userId));
        }
        if (status) {
          whereConditions.push(eq(certificates.status, status));
        }

        const result = await db
          .select({
            id: certificates.id,
            name: certificates.name,
            issueDate: certificates.issueDate,
            expiryDate: certificates.expiryDate,
            status: certificates.status,
            userId: certificates.userId,
          })
          .from(certificates)
          .where(and(...whereConditions))
          .limit(limit)
          .offset(offset);

        return result;
      } catch (error) {
        console.error('Error fetching certificates:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch certificates.',
        });
      }
    }),
});
