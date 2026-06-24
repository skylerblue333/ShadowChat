// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getProposals

import { publicProcedure } from './trpc';
import { z } from 'zod';
import { db } from '../db';
import { proposals } from '../db/schema';

export const getProposals = publicProcedure
  .input(z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ input }) => {
    try {
      const { status, limit, offset } = input;

      let query = db.select().from(proposals);

      if (status) {
        query = query.where(eq(proposals.status, status));
      }

      const result = await query.limit(limit).offset(offset);

      return result;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw new Error('Failed to fetch proposals');
    }
  });
