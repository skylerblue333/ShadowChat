// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getWorkflows
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { workflows, workflowStatusEnum } from '../schema';

export const workflowRouter = router({
  getWorkflows: publicProcedure
    .input(z.object({
      status: workflowStatusEnum.enumValues.length > 0 ? z.enum(workflowStatusEnum.enumValues).optional() : z.string().optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      status: workflowStatusEnum.enumValues.length > 0 ? z.enum(workflowStatusEnum.enumValues) : z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })))
    .query(async ({ input }) => {
      try {
        const { status, limit, offset } = input;

        let query = db.select().from(workflows).limit(limit).offset(offset);

        if (status) {
          query = query.where(eq(workflows.status, status));
        }

        const result = await query;

        return result;
      } catch (error) {
        console.error("Error fetching workflows:", error);
        throw new Error("Failed to fetch workflows.");
      }
    }),
});