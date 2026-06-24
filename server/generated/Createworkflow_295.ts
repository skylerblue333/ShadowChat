// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createWorkflow
import { z } from "zod";
import { publicProcedure, router } from "./trpc"; // Assuming trpc.ts defines your tRPC setup
import { db } from "./db"; // Assuming db.ts defines your Drizzle client
import { workflows } from "./schema"; // Assuming schema.ts defines your Drizzle schema

export const createWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name cannot be empty"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]).default("draft"),
});

export const workflowRouter = router({
  createWorkflow: publicProcedure
    .input(createWorkflowSchema)
    .mutation(async ({ input }) => {
      try {
        const newWorkflow = await db.insert(workflows).values({
          name: input.name,
          description: input.description,
          status: input.status,
        }).returning();

        if (!newWorkflow || newWorkflow.length === 0) {
          throw new Error("Failed to create workflow.");
        }

        return { success: true, workflow: newWorkflow[0], message: "Workflow created successfully." };
      } catch (error) {
        console.error("Error creating workflow:", error);
        throw new Error("Internal server error: Failed to create workflow.");
      }
    }),
});
