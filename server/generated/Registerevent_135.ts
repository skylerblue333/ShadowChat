// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: registerEvent
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { z } from 'zod';
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { events } from './schema'; // Assuming schema.ts exports your Drizzle schema
import { RegisterEventInput, registerEventInput } from './validation'; // Assuming validation.ts exports your Zod schema

export const eventRouter = router({
  registerEvent: publicProcedure
    .input(registerEventInput)
    .mutation(async ({ input }) => {
      try {
        const newEvent = await db.insert(events).values({
          name: input.name,
          description: input.description,
          date: new Date(input.date),
          location: input.location,
          organizerId: input.organizerId,
        }).returning();

        if (!newEvent || newEvent.length === 0) {
          throw new Error('Failed to register event: No data returned.');
        }

        return { success: true, event: newEvent[0] };
      } catch (error) {
        console.error('Error registering event:', error);
        throw new Error(`Failed to register event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});

// Example of how to integrate this into a root router (for context, not part of the procedure itself)
// import { eventRouter } from './eventRouter';
// export const appRouter = router({
//   events: eventRouter,
// });
// export type AppRouter = typeof appRouter;
