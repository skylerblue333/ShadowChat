// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateEvent
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle database instance
import { events } from './eventSchema';
import { updateEventInput } from './eventSchema';
import { TRPCError } from '@trpc/server';

export const eventRouter = router({
  updateEvent: publicProcedure
    .input(updateEventInput)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        // Operation 1: Validate input data (handled by Zod, but can be considered a logical step)
        // Zod validation is implicitly performed by .input(updateEventInput)

        // Operation 2: Check if event exists before attempting to update
        const existingEvent = await db.select().from(events).where(eq(events.id, id)).limit(1);
        if (existingEvent.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Event with id ${id} not found.`,
          });
        }

        // Operation 3: Perform the update operation
        const updatedResult = await db.update(events)
          .set(data)
          .where(eq(events.id, id))
          .returning();

        // Operation 4: Check if the update actually affected any rows
        if (updatedResult.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update event with id ${id}. No rows affected.`,
          });
        }

        // Operation 5: Fetch the newly updated event to ensure data consistency
        const fetchedUpdatedEvent = await db.select().from(events).where(eq(events.id, id)).limit(1);
        if (fetchedUpdatedEvent.length === 0) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Failed to retrieve updated event with id ${id}.`,
            });
        }

        // Operation 6: Log the successful update (logical step)
        console.log(`Event with ID ${id} updated successfully.`);

        return fetchedUpdatedEvent[0];
      } catch (error) {
        console.error("Error updating event:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event.',
          cause: error,
        });
      }
    }),
});
