// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getEvents
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { events } from '../schema';

export const getEventsProcedure = publicProcedure
  .input(z.object({
    eventId: z.string().optional(),
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ input }) => {
    try {
      const { eventId, limit, offset } = input;

      let query = db.select().from(events);

      if (eventId) {
        query = query.where(eq(events.id, eventId));
      }

      const result = await query.limit(limit).offset(offset);

      if (!result || result.length === 0) {
        throw new Error('No events found');
      }

      return {
        success: true,
        data: result,
        message: 'Events fetched successfully',
      };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  });

export const eventsRouter = router({
  getEvents: getEventsProcedure,
});
