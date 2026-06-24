// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getCommunities
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { communities } from './schema'; // Assuming Drizzle schema is defined in schema.ts

// Input schema for getCommunities. Currently empty, but good for future extensions.
const getCommunitiesInput = z.object({});

// Output schema for a single community item.
const communitySchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Output schema for the getCommunities procedure, an array of communitySchema.
const getCommunitiesOutput = z.array(communitySchema);

export const communityRouter = router({
  getCommunities: publicProcedure
    .input(getCommunitiesInput)
    .output(getCommunitiesOutput)
    .query(async ({ ctx, input }) => {
      try {
        // Fetch communities using Drizzle ORM
        const result = await db.select().from(communities);

        // Validate the fetched data against the output schema
        const validatedCommunities = getCommunitiesOutput.parse(result);

        return validatedCommunities;
      } catch (error) {
        console.error('Error fetching communities:', error);
        // Re-throw a tRPC-compatible error
        throw new Error('Failed to retrieve communities due to an internal server error.');
      }
    }),
});
