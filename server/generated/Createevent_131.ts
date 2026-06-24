// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createEvent

import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { events } from "../schema";

export const eventRouter = router({
  createEvent: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Event name cannot be empty"),
        description: z.string().optional(),
        date: z.string().datetime("Invalid date format").transform((str) => new Date(str)),
        location: z.string().min(1, "Location cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [newEvent] = await db.insert(events).values({
          name: input.name,
          description: input.description,
          date: input.date,
          location: input.location,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newEvent) {
          throw new Error("Failed to create event.");
        }

        return { success: true, event: newEvent };
      } catch (error) {
        console.error("Error creating event:", error);
        throw new Error("Could not create event. Please try again.");
      }
    }),
});
