// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createDepartment
import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc.ts defines your tRPC instance
import { db } from './db'; // Assuming db.ts exports your Drizzle client
import { departments } from './schema'; // Assuming schema.ts defines your Drizzle schema

export const departmentRouter = router({
  createDepartment: publicProcedure
    .input(z.object({
      name: z.string().min(3, 'Department name must be at least 3 characters long'),
    }))
    .mutation(async ({ input }) => {
      try {
        const newDepartment = await db.insert(departments).values({
          name: input.name,
        }).returning();

        if (!newDepartment || newDepartment.length === 0) {
          throw new Error('Failed to create department');
        }

        return { success: true, department: newDepartment[0] };
      } catch (error) {
        console.error('Error creating department:', error);
        throw new Error(`Could not create department: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
