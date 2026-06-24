// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getTeams
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your t and publicProcedure
import { db } from './db'; // Assuming db.ts defines your Drizzle db instance
import { teams } from './schema'; // Assuming schema.ts defines your Drizzle schema
import { TRPCError } from '@trpc/server';

export const teamRouter = router({
  getTeams: publicProcedure
    .input(z.object({
      teamId: z.number().optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    }).optional())
    .query(async ({ input }) => {
      try {
        const limit = input?.limit ?? 50;
        const offset = input?.offset ?? 0;
        const teamId = input?.teamId;

        let query = db.select().from(teams);

        if (teamId) {
          query = query.where(eq(teams.id, teamId));
        }

        const result = await query.limit(limit).offset(offset);

        if (!result || result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: teamId ? `Team with ID ${teamId} not found.` : 'No teams found.',
          });
        }

        return result;
      } catch (error) {
        console.error('Error fetching teams:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch teams.',
          cause: error,
        });
      }
    }),
});