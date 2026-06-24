// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: shareDocumentProcedure
import { z } from "zod";
import { publicProcedure, router } from "../trpc"; // Adjust path as needed
import { db } from "../db"; // Adjust path as needed
import { documents, documentShares, users } from "../db/schema"; // Adjust path as needed

export const shareDocumentProcedure = publicProcedure
  .input(
    z.object({
      documentId: z.string().uuid(),
      recipientEmail: z.string().email(),
      permissionLevel: z.enum(["read", "edit"]), // Define allowed permission levels
      currentUserId: z.string().uuid(), // Assuming current user ID is passed for authorization
    })
  )
  .mutation(async ({ input }) => {
    const { documentId, recipientEmail, permissionLevel, currentUserId } = input;

    // 1. Validate document existence and ownership
    const documentToShare = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.ownerId, currentUserId)))
      .limit(1);

    if (documentToShare.length === 0) {
      throw new Error("Document not found or you do not have permission to share it.");
    }

    // 2. Find recipient user
    const recipientUser = await db
      .select()
      .from(users)
      .where(eq(users.email, recipientEmail))
      .limit(1);

    if (recipientUser.length === 0) {
      throw new Error("Recipient user not found.");
    }

    const recipientUserId = recipientUser[0].id;

    // Prevent sharing with self
    if (recipientUserId === currentUserId) {
      throw new Error("Cannot share a document with yourself.");
    }

    // 3. Check if already shared and update, or insert new share record
    const existingShare = await db
      .select()
      .from(documentShares)
      .where(and(eq(documentShares.documentId, documentId), eq(documentShares.sharedWithUserId, recipientUserId)))
      .limit(1);

    if (existingShare.length > 0) {
      // Update existing share
      await db
        .update(documentShares)
        .set({ permissionLevel, updatedAt: new Date() })
        .where(and(eq(documentShares.documentId, documentId), eq(documentShares.sharedWithUserId, recipientUserId)));
    } else {
      // Insert new share
      await db.insert(documentShares).values({
        documentId,
        sharedWithUserId: recipientUserId,
        permissionLevel,
        sharedByUserId: currentUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 4. Return success message
    return { success: true, message: `Document shared with ${recipientEmail} with ${permissionLevel} permissions.` };
  });

// Example of how to include this in a router (assuming you have a base router)
// export const appRouter = router({
//   // ... other procedures
//   shareDocument: shareDocumentProcedure,
// });
