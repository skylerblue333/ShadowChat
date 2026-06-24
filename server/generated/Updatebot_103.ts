// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateBot
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc setup file
import { db } from './db'; // Assuming Drizzle DB connection file
import { bots } from './schema'; // Assuming Drizzle schema file for bots table

export const updateBotProcedure = publicProcedure
  .input(z.object({
    id: z.string().uuid('Invalid bot ID format.'),
    name: z.string().min(3, 'Bot name must be at least 3 characters long.').max(100, 'Bot name cannot exceed 100 characters.').optional(),
    description: z.string().max(500, 'Bot description cannot exceed 500 characters.').optional(),
    status: z.enum(['active', 'inactive', 'maintenance'], { message: 'Invalid bot status.' }).optional(),
  }))
  .mutation(async ({ input }) => {
    try {
      const { id, ...updateData } = input;

      if (Object.keys(updateData).length === 0) {
        return { success: false, message: 'No update data provided.' };
      }

      const [updatedBot] = await db.update(bots)
        .set(updateData)
        .where(eq(bots.id, id))
        .returning();

      if (!updatedBot) {
        return { success: false, message: `Bot with ID ${id} not found.` };
      }

      return { success: true, message: 'Bot updated successfully.', bot: updatedBot };
    } catch (error) {
      console.error('Error updating bot:', error);
      return { success: false, message: 'Failed to update bot due to an internal server error.' };
    }
  });

export const appRouter = router({
  updateBot: updateBotProcedure,
});

export type AppRouter = typeof appRouter;
