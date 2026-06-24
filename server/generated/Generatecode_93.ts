// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: generateCode
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { codes } from '../schema';

// Helper function to generate a random alphanumeric code
const generateRandomCode = (length: number = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateCodeProcedure = publicProcedure
  .input(z.object({
    userId: z.string().uuid('Invalid user ID format'),
    // Optional: specify code length, default to 8
    length: z.number().int().min(4).max(16).optional(),
  }))
  .output(z.object({
    success: z.boolean(),
    code: z.string(),
    message: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const { userId, length = 8 } = input;

    let generatedCode: string;
    let isUnique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    // Operation 1: Generate a unique code (retry if not unique)
    while (!isUnique && attempts < MAX_ATTEMPTS) {
      generatedCode = generateRandomCode(length);
      const existingCode = await db.select().from(codes).where(eq(codes.code, generatedCode)).limit(1);
      if (existingCode.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      // Operation 2: Handle failure to generate unique code
      throw new Error('Failed to generate a unique code after multiple attempts.');
    }

    try {
      // Operation 3: Insert the new code into the database
      await db.insert(codes).values({
        userId: userId,
        code: generatedCode!,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      });

      // Operation 4: Return success with the generated code
      return {
        success: true,
        code: generatedCode!,
        message: 'Code generated successfully.',
      };
    } catch (error) {
      console.error('Database insertion failed:', error);
      // Operation 5: Handle database insertion error
      throw new Error('Failed to store the generated code.');
    }
  });

// This is the router procedure for SKYCOIN4444 generateCode
export const skycoin4444Router = router({
  generateCode: generateCodeProcedure,
});
