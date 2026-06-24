// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteEvent
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '../db';
import { events } from '../schema';

export const eventRouter = router({
  deleteEvent: publicProcedure
    .input(z.object({
      id: z.string().uuid(), // Assuming event IDs are UUIDs
    }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        // Operation 1: Check if the event exists before attempting to delete
        const existingEvent = await db.select().from(events).where(eq(events.id, id)).limit(1);

        if (existingEvent.length === 0) {
          throw new Error('Event not found.');
        }

        // Operation 2: Perform the deletion
        const result = await db.delete(events).where(eq(events.id, id));

        if (result.rowCount === 0) {
          // This case might be rare if existingEvent check passed, but good for robustness
          throw new Error('Failed to delete event.');
        }

        return { success: true, message: `Event with ID ${id} deleted successfully.` };
      } catch (error: any) {
        console.error('Error deleting event:', error);
        throw new Error(`Could not delete event: ${error.message}`);
      }
    }),
});