// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateCharityProcedure
import { z } from 'zod';
import { publicProcedure } from '../trpc';
import { db } from '../db';
import { charities } from '../schema';

export const updateCharityProcedure = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      website: z.string().url().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, name, description, website } = input;

    try {
      const [updatedCharity] = await db
        .update(charities)
        .set({
          name,
          description,
          website,
          updatedAt: new Date(),
        })
        .where(eq(charities.id, id))
        .returning();

      if (!updatedCharity) {
        throw new Error('Charity not found or no changes made.');
      }

      return updatedCharity;
    } catch (error) {
      console.error('Error updating charity:', error);
      throw new Error('Failed to update charity.');
    }
  });
