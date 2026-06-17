import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import {
  listCourses, getCourse, listLessons, getLesson,
  markProgress, getUserProgress, saveLearningPath, listLearningPaths, logEvent,
} from "../db";

type LearningStep = { step: number; title: string; rationale: string; courseId: number };
export type LearningPath = { summary: string; steps: LearningStep[] };

/**
 * Parse LLM learning-path output defensively. Strips code fences, extracts the
 * first balanced JSON object, validates the expected shape, and always returns
 * a usable path so the UI never crashes on malformed model output.
 */
export function safeParsePath(raw: string, goal: string): LearningPath {
  const fallback: LearningPath = {
    summary: `A starter path toward: ${goal}. (Generated a basic plan because the AI response could not be parsed.)`,
    steps: [
      { step: 1, title: "Build foundations", rationale: "Establish core concepts before advancing.", courseId: 0 },
      { step: 2, title: "Practice with projects", rationale: "Apply knowledge through hands-on work.", courseId: 0 },
      { step: 3, title: "Specialize", rationale: "Go deep on the skills your goal requires.", courseId: 0 },
    ],
  };
  if (!raw || typeof raw !== "string") return fallback;
  let text = raw.trim();
  // Strip markdown code fences if present.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();
  // Extract the first balanced JSON object.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) text = text.slice(start, end + 1);
  try {
    const obj = JSON.parse(text) as Partial<LearningPath>;
    if (obj && typeof obj.summary === "string" && Array.isArray(obj.steps)) {
      const steps = obj.steps
        .filter(s => s && typeof s.title === "string")
        .map((s, i) => ({
          step: typeof s.step === "number" ? s.step : i + 1,
          title: String(s.title),
          rationale: typeof s.rationale === "string" ? s.rationale : "",
          courseId: typeof s.courseId === "number" ? s.courseId : 0,
        }));
      if (steps.length > 0) return { summary: obj.summary, steps };
    }
  } catch {
    // fall through to fallback
  }
  return fallback;
}

export const schoolRouter = router({
  courses: publicProcedure.query(() => listCourses()),

  course: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const course = await getCourse(input.id);
      const lessons = await listLessons(input.id);
      return { course, lessons };
    }),

  lesson: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getLesson(input.id)),

  completeLesson: protectedProcedure
    .input(z.object({ courseId: z.number(), lessonId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await markProgress(ctx.user.id, input.courseId, input.lessonId);
      await logEvent("lesson_completed", "school", 1, ctx.user.id);
      return { success: true };
    }),

  myProgress: protectedProcedure.query(({ ctx }) => getUserProgress(ctx.user.id)),

  generatePath: protectedProcedure
    .input(z.object({ goal: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      const courses = await listCourses();
      const catalog = courses.map(c => `#${c.id} ${c.title} [${c.category}/${c.level}]`).join("\n");
      const res = await invokeLLM({
        messages: [
          { role: "system", content: "You are Sky School's AI advisor. Build a personalized, ordered learning path from the available course catalog to reach the learner's goal. Output strict JSON." },
          { role: "user", content: `GOAL: ${input.goal}\n\nCATALOG:\n${catalog || "(no courses yet — propose generic milestone steps)"}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "learning_path",
            strict: true,
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                steps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      step: { type: "integer" },
                      title: { type: "string" },
                      rationale: { type: "string" },
                      courseId: { type: "integer" },
                    },
                    required: ["step", "title", "rationale", "courseId"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["summary", "steps"],
              additionalProperties: false,
            },
          },
        },
        maxTokens: 1500,
      });
      const content = res.choices?.[0]?.message?.content;
      const json = typeof content === "string" ? content : "";

      // Robustly parse the model output. Models occasionally wrap JSON in
      // code fences or emit trailing prose, so extract the first JSON object
      // and fall back to a safe, well-formed path instead of throwing.
      const parsed = safeParsePath(json, input.goal);
      await saveLearningPath(ctx.user.id, input.goal, JSON.stringify(parsed));
      await logEvent("learning_path_generated", "school", 1, ctx.user.id);
      return { path: parsed };
    }),

  myPaths: protectedProcedure.query(({ ctx }) => listLearningPaths(ctx.user.id)),
});
