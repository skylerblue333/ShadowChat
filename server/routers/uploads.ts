import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

// Accepts base64-encoded file content from the client and stores the bytes in S3.
// Returns the served /manus-storage/ url + key for persistence in business rows.
export const uploadsRouter = router({
  upload: protectedProcedure
    .input(z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      dataBase64: z.string().min(1),
      folder: z.enum(["course", "product", "charity"]).default("product"),
    }))
    .mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(input.dataBase64, "base64");
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `${input.folder}/${ctx.user.id}-${safeName}`;
      const { key: storedKey, url } = await storagePut(key, buffer, input.contentType);
      return { key: storedKey, url };
    }),
});
