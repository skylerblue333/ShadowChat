// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getExpenseReports
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// 1. Define Drizzle Schema (assuming these tables exist in your database)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const expenseReports = pgTable('expense_reports', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  amount: numeric('amount').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  description: text('description'),
});

// 2. Initialize tRPC with context (assuming 'db' is available in context)
type Context = { db: any; userId?: number; }; // 'any' for simplicity, ideally type Drizzle client
const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;

// Assuming an authenticated procedure for user-specific data
const authedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return opts.next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// 3. Define the getExpenseReports procedure
export const getExpenseReports = authedProcedure
  .input(
    z.object({
      userId: z.number().int().positive().optional(), // Optional for admin, required for regular user
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    }).refine(data => {
      // If userId is not provided, ensure the context userId is present
      if (!data.userId && !t.context._def.transformer.opts.ctx.userId) {
        return false; // Or handle this case based on your auth logic
      }
      return true;
    }, { message: 'User ID is required if not authenticated in context' })
  )
  .query(async ({ ctx, input }) => {
    const targetUserId = input.userId || ctx.userId;

    if (!targetUserId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User ID is missing' });
    }

    try {
      let query = ctx.db.select().from(expenseReports).where(eq(expenseReports.userId, targetUserId));

      if (input.startDate && input.endDate) {
        query = query.where(and(gte(expenseReports.date, new Date(input.startDate)), lte(expenseReports.date, new Date(input.endDate))));
      } else if (input.startDate) {
        query = query.where(gte(expenseReports.date, new Date(input.startDate)));
      } else if (input.endDate) {
        query = query.where(lte(expenseReports.date, new Date(input.endDate)));
      }

      const reports = await query;

      if (!reports || reports.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No expense reports found for this user.' });
      }

      return reports;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch expense reports.' });
    }
  });

// 4. Export as a router procedure
export const appRouter = router({
  getExpenseReports: getExpenseReports,
});

export type AppRouter = typeof appRouter;
