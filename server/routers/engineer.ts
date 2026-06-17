import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { logEvent } from "../db";

async function llmText(system: string, user: string, maxTokens = 2000): Promise<string> {
  const res = await invokeLLM({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    maxTokens,
  });
  const content = res.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(c => (c.type === "text" ? c.text : "")).join("\n");
  }
  return "";
}

export const engineerRouter = router({
  generateCode: protectedProcedure
    .input(z.object({ description: z.string().min(1), language: z.string().default("typescript") }))
    .mutation(async ({ input, ctx }) => {
      await logEvent("ai_generate_code", "engineer", 1, ctx.user.id);
      const output = await llmText(
        `You are HopeAI, an elite senior software engineer. Produce clean, production-ready ${input.language} code. Return only the code wrapped in a single fenced code block, followed by a short explanation.`,
        input.description,
        2500,
      );
      return { output };
    }),

  reviewCode: protectedProcedure
    .input(z.object({ code: z.string().min(1), language: z.string().default("typescript") }))
    .mutation(async ({ input, ctx }) => {
      await logEvent("ai_review_code", "engineer", 1, ctx.user.id);
      const output = await llmText(
        `You are HopeAI, a meticulous code reviewer. Analyze the ${input.language} code for quality, performance, maintainability, and bugs. Return a structured markdown review with severity-tagged findings and concrete fixes.`,
        input.code,
        2500,
      );
      return { output };
    }),

  optimizeCode: protectedProcedure
    .input(z.object({ code: z.string().min(1), language: z.string().default("typescript") }))
    .mutation(async ({ input, ctx }) => {
      await logEvent("ai_optimize_code", "engineer", 1, ctx.user.id);
      const output = await llmText(
        `You are HopeAI. Optimize this ${input.language} code for performance and readability. Return the optimized code in a fenced block, then a bullet list explaining each change.`,
        input.code,
        2500,
      );
      return { output };
    }),

  securityAudit: protectedProcedure
    .input(z.object({ code: z.string().min(1), language: z.string().default("typescript") }))
    .mutation(async ({ input, ctx }) => {
      await logEvent("ai_security_audit", "engineer", 1, ctx.user.id);
      const output = await llmText(
        `You are HopeAI, a security auditor. Identify vulnerabilities (OWASP-style) in this ${input.language} code. For each, give severity, description, exploit scenario, and remediation. Return markdown.`,
        input.code,
        2500,
      );
      return { output };
    }),

  debugCode: protectedProcedure
    .input(z.object({ code: z.string().min(1), error: z.string().optional(), language: z.string().default("typescript") }))
    .mutation(async ({ input, ctx }) => {
      await logEvent("ai_debug_code", "engineer", 1, ctx.user.id);
      const output = await llmText(
        `You are HopeAI, a debugging expert. Given the ${input.language} code and the reported error, find the root cause, explain it, and provide a corrected version in a fenced block.`,
        `CODE:\n${input.code}\n\nERROR:\n${input.error ?? "No explicit error provided. Find latent bugs."}`,
        2500,
      );
      return { output };
    }),
});
