import { describe, expect, it, vi } from "vitest";

// school.ts imports db + llm at module load; stub them so the unit under test
// (the pure safeParsePath function) can be imported in isolation.
vi.mock("./db", () => ({
  listCourses: vi.fn(), getCourse: vi.fn(), listLessons: vi.fn(), getLesson: vi.fn(),
  markProgress: vi.fn(), getUserProgress: vi.fn(), saveLearningPath: vi.fn(),
  listLearningPaths: vi.fn(), logEvent: vi.fn(),
}));
vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn() }));

import { safeParsePath } from "./routers/school";

describe("school.safeParsePath", () => {
  it("parses clean JSON", () => {
    const raw = JSON.stringify({
      summary: "Path to mastery",
      steps: [{ step: 1, title: "Intro", rationale: "start", courseId: 3 }],
    });
    const out = safeParsePath(raw, "learn AI");
    expect(out.summary).toBe("Path to mastery");
    expect(out.steps[0].courseId).toBe(3);
  });

  it("extracts JSON wrapped in code fences and prose", () => {
    const raw = "Here is your plan:\n```json\n{\"summary\":\"X\",\"steps\":[{\"step\":1,\"title\":\"A\",\"rationale\":\"r\",\"courseId\":1}]}\n```\nGood luck!";
    const out = safeParsePath(raw, "goal");
    expect(out.summary).toBe("X");
    expect(out.steps).toHaveLength(1);
  });

  it("falls back to a safe path on malformed JSON instead of throwing", () => {
    const out = safeParsePath("totally not json {{{", "become a data scientist");
    expect(out.steps.length).toBeGreaterThan(0);
    expect(out.summary).toContain("data scientist");
  });

  it("falls back on empty input", () => {
    const out = safeParsePath("", "goal");
    expect(out.steps.length).toBe(3);
  });
});
