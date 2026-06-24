// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getEventAttendees
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc instance is defined here
import { TRPCError } from '@trpc/server';
import { attendees } from './db/schema'; // Drizzle schema definitions

// Input Schema
export const getEventAttendeesInput = z.object({
  eventId: z.string().uuid({ message: 'Invalid event ID format' }),
});

// Output Schema
export const attendeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const getEventAttendeesOutput = z.array(attendeeSchema);

// tRPC Procedure
export const getEventAttendeesProcedure = publicProcedure
  .input(getEventAttendeesInput)
  .output(getEventAttendeesOutput) // Optional: for explicit output validation
  .query(async ({ input }) => {
    try {
      const { eventId } = input;
      const eventAttendees = await db.select({
        id: attendees.id,
        name: attendees.name,
        email: attendees.email,
      })
      .from(attendees)
      .where(eq(attendees.eventId, eventId));

      return eventAttendees; // Returns an empty array if no attendees found
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch event attendees.',
      });
    }
  });

// Export as a router procedure
export const eventRouter = router({
  getEventAttendees: getEventAttendeesProcedure,
});
