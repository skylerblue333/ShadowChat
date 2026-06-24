// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getBudgetReports
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import { budgetReports } from './schema';

// Input validation schema for getBudgetReports
const getBudgetReportsInput = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format." }),
  startDate: z.string().datetime({ message: "Invalid start date format." }).optional(),
  endDate: z.string().datetime({ message: "Invalid end date format." }).optional(),
});

// Output schema for getBudgetReports
const getBudgetReportsOutput = z.array(z.object({
  id: z.number(),
  userId: z.string().uuid(),
  reportName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalBudget: z.number(),
  actualSpend: z.number(),
  createdAt: z.string(), // Changed to z.string() to match the mapped output
}));

export const budgetReportsRouter = router({
  getBudgetReports: publicProcedure
    .input(getBudgetReportsInput)
    .output(getBudgetReportsOutput)
    .query(async ({ input }) => {
      try {
        const { userId, startDate, endDate } = input;

        const conditions = [eq(budgetReports.userId, userId)];

        if (startDate) {
          conditions.push(gte(budgetReports.startDate, new Date(startDate).toISOString().split('T')[0]));
        }
        if (endDate) {
          conditions.push(lte(budgetReports.endDate, new Date(endDate).toISOString().split('T')[0]));
        }

        const reports = await db.select().from(budgetReports).where(and(...conditions));

        if (!reports || reports.length === 0) {
          // Consider throwing a specific tRPC error or returning an empty array based on desired behavior
          // For now, returning an empty array as per output schema
          return [];
        }

        // Map Drizzle results to match the output schema, especially for date types
        return reports.map(report => ({
          ...report,
          startDate: report.startDate.toISOString().split('T')[0], // Format date to string YYYY-MM-DD
          endDate: report.endDate.toISOString().split('T')[0],   // Format date to string YYYY-MM-DD
          createdAt: report.createdAt ? report.createdAt.toISOString() : new Date().toISOString(), // Ensure createdAt is string
        }));

      } catch (error) {
        console.error("Error fetching budget reports:", error);
        // In a real application, you might want to throw a tRPC error with a specific code
        throw new Error("Failed to fetch budget reports.");
      }
    }),
});
