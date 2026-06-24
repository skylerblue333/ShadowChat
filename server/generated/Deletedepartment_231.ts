// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: deleteDepartment
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../../db";
import { departments } from "../../db/schema";

export const departmentRouter = router({
  deleteDepartment: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await db.delete(departments).where(eq(departments.id, input.id)).returning();

        if (result.length === 0) {
          throw new Error("Department not found or could not be deleted.");
        }

        return { success: true, message: "Department deleted successfully." };
      } catch (error) {
        console.error("Error deleting department:", error);
        throw new Error("Failed to delete department.");
      }
    }),
});
