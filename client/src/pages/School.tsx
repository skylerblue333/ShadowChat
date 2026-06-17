import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";
import { Card, IconTile } from "@/components/ui/sk";
import { GraduationCap, BookOpen, CheckCircle2, Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function School() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: courses, isLoading } = trpc.school.courses.useQuery();
  const { data: progress } = trpc.school.myProgress.useQuery(undefined, { enabled: isAuthenticated });

  const [openCourse, setOpenCourse] = useState<number | null>(null);
  const [goal, setGoal] = useState("");
  const [path, setPath] = useState<any>(null);

  const generatePath = trpc.school.generatePath.useMutation();
  const completeLesson = trpc.school.completeLesson.useMutation({
    onSuccess: () => { utils.school.myProgress.invalidate(); toast.success("Lesson completed"); },
  });

  const completedIds = useMemo(() => new Set((progress ?? []).filter(p => p.completed).map(p => p.lessonId)), [progress]);

  async function makePath() {
    if (!goal.trim()) return;
    try {
      const res = await generatePath.mutateAsync({ goal });
      setPath(res.path);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate path");
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={GraduationCap} accent="purple" />
        <div>
          <h1 className="font-extrabold text-3xl">Sky School</h1>
          <p className="text-muted-foreground text-sm">AI-powered learning — courses, lessons & personalized paths.</p>
        </div>
      </div>

      {/* AI Learning Path */}
      <Card className="p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-bold text-xl">AI Personalized Learning Path</h2>
        </div>
        {isAuthenticated ? (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Become a smart contract engineer" className="bg-input border-border" />
              <button onClick={makePath} disabled={generatePath.isPending || !goal.trim()} className="sk-gradient px-6 py-2.5 rounded-full font-bold disabled:opacity-50 flex items-center justify-center whitespace-nowrap">
                {generatePath.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Building…</> : "Generate Path"}
              </button>
            </div>
            {path && (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-muted-foreground">{path.summary}</p>
                {path.steps?.map((s: any) => (
                  <div key={s.step} className="flex gap-3 bg-secondary/50 rounded-lg p-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--neon-purple)]/25 text-[var(--neon-purple)] flex items-center justify-center font-bold text-sm">{s.step}</div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-muted-foreground">{s.rationale}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <button onClick={() => (window.location.href = getLoginUrl())} className="px-5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary transition-colors">
            Connect to generate your path
          </button>
        )}
      </Card>

      {/* Catalog */}
      <h2 className="font-bold text-2xl mb-4">Course Catalog</h2>
      {isLoading && <div className="text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {courses && courses.length === 0 && <p className="text-muted-foreground">No courses yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses?.map(c => (
          <Card key={c.id} className="p-5 flex flex-col" hover>
            <div className="text-xs uppercase tracking-wider text-[var(--neon-cyan)] mb-1">{c.category} · {c.level}</div>
            <h3 className="font-bold text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground flex-1 mt-1">{c.description}</p>
            <button className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-border bg-secondary/40 hover:bg-secondary text-sm font-medium transition-colors" onClick={() => setOpenCourse(c.id)}>
              <BookOpen className="w-4 h-4" /> {c.lessonCount} lessons
            </button>
          </Card>
        ))}
      </div>

      {openCourse !== null && (
        <CourseModal courseId={openCourse} onClose={() => setOpenCourse(null)} completedIds={completedIds}
          onComplete={(courseId, lessonId) => completeLesson.mutate({ courseId, lessonId })}
          authed={isAuthenticated} />
      )}
    </div>
  );
}

function CourseModal({ courseId, onClose, completedIds, onComplete, authed }: {
  courseId: number; onClose: () => void; completedIds: Set<number>;
  onComplete: (courseId: number, lessonId: number) => void; authed: boolean;
}) {
  const { data } = trpc.school.course.useQuery({ id: courseId });
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const lesson = data?.lessons.find(l => l.id === activeLesson) ?? data?.lessons[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="sk-card w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-2xl">{data?.course?.title}</h2>
            <p className="text-sm text-muted-foreground">{data?.course?.description}</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {data?.lessons.map(l => (
            <button key={l.id} onClick={() => setActiveLesson(l.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${lesson?.id === l.id ? "bg-secondary text-[var(--neon-cyan)]" : "bg-card border border-border text-muted-foreground"}`}>
              {completedIds.has(l.id) && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--neon-green)]" />}
              {l.title}
            </button>
          ))}
        </div>
        {lesson && (
          <div className="bg-secondary/40 rounded-lg p-4">
            <div className="prose prose-invert max-w-none text-sm"><Streamdown>{lesson.content ?? ""}</Streamdown></div>
            {authed && (
              <button className="mt-4 sk-gradient px-5 py-2.5 rounded-full font-bold text-sm disabled:opacity-50"
                disabled={completedIds.has(lesson.id)}
                onClick={() => onComplete(courseId, lesson.id)}>
                {completedIds.has(lesson.id) ? "Completed" : "Mark complete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
