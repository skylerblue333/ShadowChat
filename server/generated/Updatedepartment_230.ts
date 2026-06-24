// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: updateDepartment
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { departments } from './schema';

export const departmentRouter = router({
  updateDepartment: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, 'Department name cannot be empty'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, name } = input;

        const existingDepartment = await db.select().from(departments).where(eq(departments.id, id)).execute();

        if (existingDepartment.length === 0) {
          throw new Error('Department not found');
        }

        const updatedDepartment = await db
          .update(departments)
          .set({ name, updatedAt: new Date() })
          .where(eq(departments.id, id))
          .returning();

        if (updatedDepartment.length === 0) {
          throw new Error('Failed to update department');
        }

        return { success: true, department: updatedDepartment[0] };
      } catch (error) {
        console.error('Error updating department:', error);
        throw new Error(`Failed to update department: ${error.message}`);
      }
    }),
});
