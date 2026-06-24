// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: createAuditLog

import { z } from 'zod';
import { publicProcedure, router } from './trpc'; // Assuming trpc context setup
import { v4 as uuidv4 } from 'uuid';

// Drizzle Schema for Audit Logs (example, should be in ./schema.ts)
// export const auditLogs = pgTable('audit_logs', {
//   id: text('id').primaryKey().$defaultFn(() => uuidv4()),
//   userId: text('user_id').notNull(),
//   action: text('action').notNull(),
//   entityType: text('entity_type').notNull(),
//   entityId: text('entity_id').notNull(),
//   details: jsonb('details'),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });

const createAuditLogInputSchema = z.object({
  userId: z.string().uuid("Invalid user ID format."),
  action: z.string().min(1, "Action cannot be empty."),
  entityType: z.string().min(1, "Entity type cannot be empty."),
  entityId: z.string().min(1, "Entity ID cannot be empty."),
  details: z.record(z.any()).optional(),
});

export const auditLogRouter = router({
  createAuditLog: publicProcedure
    .input(createAuditLogInputSchema)
    .mutation(async ({ input }) => {
      try {
        // 1. Input validation is handled by Zod schema

        // 2. Database insertion
        const [newAuditLog] = await db.insert(auditLogs).values({
          id: uuidv4(),
          userId: input.userId,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          details: input.details,
        }).returning({ id: auditLogs.id });

        if (!newAuditLog) {
          throw new Error("Failed to create audit log entry.");
        }

        // 3. Return success
        return {
          success: true,
          message: "Audit log entry created successfully.",
          auditLogId: newAuditLog.id,
        };
      } catch (error) {
        // 4. Error handling
        console.error("Error creating audit log:", error);
        throw new Error(`Failed to create audit log: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});

export type AuditLogRouter = typeof auditLogRouter;