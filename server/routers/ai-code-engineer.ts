import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";

export const aiCodeEngineerRouter = router({
  // Autonomous code generation based on requirements
  generateCode: publicProcedure
    .input(z.object({
      requirement: z.string(),
      language: z.string().default("typescript"),
      context: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert ${input.language} code generator. Generate clean, production-ready code that follows best practices. Return ONLY the code, no explanations.`,
            },
            {
              role: "user",
              content: `Generate ${input.language} code for: ${input.requirement}${input.context ? `\n\nContext: ${input.context}` : ""}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        return {
          code: content,
          language: input.language,
          timestamp: new Date(),
        };
      } catch (error) {
        return { error: "Code generation failed", code: "" };
      }
    }),

  // AI learns from code patterns and improves
  analyzeAndImprove: publicProcedure
    .input(z.object({
      code: z.string(),
      language: z.string().default("typescript"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert code reviewer and optimizer. Analyze the provided code and suggest improvements for: performance, readability, security, and best practices. Return a JSON object with: {improvements: [], optimizedCode: "", score: 0-100}`,
            },
            {
              role: "user",
              content: `Analyze and improve this ${input.language} code:\n\n${input.code}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        try {
          return JSON.parse(content);
        } catch {
          return { improvements: [content], optimizedCode: input.code, score: 50 };
        }
      } catch (error) {
        return { error: "Analysis failed", improvements: [], optimizedCode: input.code, score: 0 };
      }
    }),

  // AI teaches coding concepts
  teachCoding: publicProcedure
    .input(z.object({
      concept: z.string(),
      level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert coding tutor. Explain the concept clearly with examples. Format: {explanation: "", examples: [], tips: [], resources: []}`,
            },
            {
              role: "user",
              content: `Teach me about "${input.concept}" at ${input.level} level with practical examples.`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        try {
          return JSON.parse(content);
        } catch {
          return { explanation: content, examples: [], tips: [], resources: [] };
        }
      } catch (error) {
        return { error: "Teaching failed", explanation: "", examples: [], tips: [], resources: [] };
      }
    }),

  // AI debugs code and finds issues
  debugCode: publicProcedure
    .input(z.object({
      code: z.string(),
      error: z.string().optional(),
      language: z.string().default("typescript"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert debugger. Find bugs, explain them, and provide fixes. Return JSON: {bugs: [{line: number, issue: string, fix: string}], fixedCode: ""}`,
            },
            {
              role: "user",
              content: `Debug this ${input.language} code${input.error ? ` (Error: ${input.error})` : ""}:\n\n${input.code}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        try {
          return JSON.parse(content);
        } catch {
          return { bugs: [{ line: 0, issue: content, fix: "Review the code manually" }], fixedCode: input.code };
        }
      } catch (error) {
        return { error: "Debugging failed", bugs: [], fixedCode: input.code };
      }
    }),

  // AI generates tests for code
  generateTests: publicProcedure
    .input(z.object({
      code: z.string(),
      framework: z.string().default("vitest"),
      language: z.string().default("typescript"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert test writer. Generate comprehensive unit tests using ${input.framework}. Return ONLY the test code, no explanations.`,
            },
            {
              role: "user",
              content: `Generate ${input.framework} tests for this ${input.language} code:\n\n${input.code}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        return {
          tests: content,
          framework: input.framework,
          language: input.language,
        };
      } catch (error) {
        return { error: "Test generation failed", tests: "" };
      }
    }),

  // AI refactors code for better architecture
  refactorCode: publicProcedure
    .input(z.object({
      code: z.string(),
      pattern: z.string().optional(),
      language: z.string().default("typescript"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert architect. Refactor code for better design patterns, readability, and maintainability${input.pattern ? ` using ${input.pattern}` : ""}. Return ONLY refactored code.`,
            },
            {
              role: "user",
              content: `Refactor this ${input.language} code:\n\n${input.code}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        return {
          refactoredCode: content,
          improvements: ["Better structure", "Improved readability", "Enhanced maintainability"],
          language: input.language,
        };
      } catch (error) {
        return { error: "Refactoring failed", refactoredCode: input.code };
      }
    }),

  // AI generates documentation
  generateDocs: publicProcedure
    .input(z.object({
      code: z.string(),
      style: z.enum(["jsdoc", "markdown", "html"]).default("markdown"),
      language: z.string().default("typescript"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Generate comprehensive ${input.style} documentation for the provided code. Include function descriptions, parameters, return types, and usage examples.`,
            },
            {
              role: "user",
              content: `Generate ${input.style} documentation for this ${input.language} code:\n\n${input.code}`,
            },
          ],
        });
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : String(response.choices[0].message.content);
        return {
          documentation: content,
          style: input.style,
          language: input.language,
        };
      } catch (error) {
        return { error: "Documentation generation failed", documentation: "" };
      }
    }),
});
