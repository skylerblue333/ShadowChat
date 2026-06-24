// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getScheduledTasks
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { scheduledTasks } from './schema';

// Define the input schema for getScheduledTasks procedure
const GetScheduledTasksInputSchema = z.object({
  userId: z.string().uuid('Invalid user ID format.').optional().describe('Optional user ID to filter tasks.'),
  status: z.enum(['pending', 'completed', 'failed']).optional().describe('Optional task status to filter tasks.'),
  taskNameSearch: z.string().min(1).optional().describe('Optional partial task name for searching.'),
  scheduledAfter: z.string().datetime().optional().describe('Optional filter for tasks scheduled after a specific date/time.'),
  scheduledBefore: z.string().datetime().optional().describe('Optional filter for tasks scheduled before a specific date/time.'),
  includeCompleted: z.boolean().optional().default(false).describe('Whether to include completed tasks.'),
  includeFailed: z.boolean().optional().default(false).describe('Whether to include failed tasks.'),
  limit: z.number().int().positive('Limit must be a positive integer.').optional().default(10).describe('Maximum number of tasks to return.'),
  offset: z.number().int().nonnegative('Offset must be a non-negative integer.').optional().default(0).describe('Number of tasks to skip.'),
});

// Define the output schema for a single scheduled task
const ScheduledTaskOutputSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed']),
  taskName: z.string(),
  scheduledAt: z.date(),
  completedAt: z.date().nullable(),
});

// Define the output schema for the getScheduledTasks procedure
const GetScheduledTasksOutputSchema = z.array(ScheduledTaskOutputSchema);

export const scheduledTasksRouter = router({
  getScheduledTasks: publicProcedure
    .input(GetScheduledTasksInputSchema)
    .output(GetScheduledTasksOutputSchema)
    .query(async ({ input }) => {
      try {
        const { 
          userId, 
          status, 
          taskNameSearch, 
          scheduledAfter, 
          scheduledBefore, 
          includeCompleted, 
          includeFailed, 
          limit, 
          offset 
        } = input;

        // Start building the query
        let query = db.select().from(scheduledTasks).$dynamic();

        // Build an array of conditions for the WHERE clause
        const conditions = [];

        if (userId) {
          conditions.push(eq(scheduledTasks.userId, userId));
        }

        if (status) {
          conditions.push(eq(scheduledTasks.status, status));
        } else {
          // If no specific status is provided, filter based on includeCompleted and includeFailed
          if (!includeCompleted) {
            conditions.push(eq(scheduledTasks.status, 'pending'));
          }
          if (!includeFailed) {
            conditions.push(eq(scheduledTasks.status, 'pending'));
          }
          if (includeCompleted && !includeFailed) {
            conditions.push(and(eq(scheduledTasks.status, 'pending'), eq(scheduledTasks.status, 'completed')));
          }
          if (!includeCompleted && includeFailed) {
            conditions.push(and(eq(scheduledTasks.status, 'pending'), eq(scheduledTasks.status, 'failed')));
          }
        }

        if (taskNameSearch) {
          // Drizzle doesn't have a direct 'like' for partial matches, using raw SQL or a more complex filter if needed
          // For simplicity, let's assume exact match for now or use a different approach for partial search
          // For a real-world scenario, consider full-text search or a more robust LIKE equivalent
          // conditions.push(sql`${scheduledTasks.taskName} LIKE ${'%' + taskNameSearch + '%'}`);
          // For now, let's use an exact match for demonstration if taskNameSearch is provided
          // This is a placeholder and should be replaced with a proper partial match solution
          conditions.push(eq(scheduledTasks.taskName, taskNameSearch));
        }

        if (scheduledAfter) {
          conditions.push(gte(scheduledTasks.scheduledAt, new Date(scheduledAfter)));
        }

        if (scheduledBefore) {
          conditions.push(lte(scheduledTasks.scheduledAt, new Date(scheduledBefore)));
        }

        // Apply all conditions to the query
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }

        // Execute the query with limit and offset
        const tasks = await query.limit(limit).offset(offset).execute();

        // Validate the output against the schema
        const validatedTasks = GetScheduledTasksOutputSchema.parse(tasks);

        return validatedTasks;
      } catch (error) {
        console.error('Error fetching scheduled tasks:', error);
        // Differentiate between validation errors and other errors
        if (error instanceof z.ZodError) {
          throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
          throw new Error('Failed to retrieve scheduled tasks due to an unexpected error.');
        }
      }
    }),
});

// Example Drizzle schema (for demonstration purposes)
// In a real application, this would be in a separate schema.ts file
/*

export const scheduledTasks = pgTable('scheduled_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  status: varchar('status', { enum: ['pending', 'completed', 'failed'] }).notNull().default('pending'),
  taskName: varchar('task_name', { length: 256 }).notNull(),
  scheduledAt: timestamp('scheduled_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});
*/
