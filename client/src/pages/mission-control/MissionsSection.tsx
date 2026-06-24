import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Loader2, ChevronDown } from "lucide-react";
import { GOLD, SectionLoading, ErrorState, EmptyState } from "./shared";

const CATEGORIES = ["skill", "language", "startup", "career", "fitness", "custom"] as const;

function MissionCard({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const detail = trpc.hopeIntelligence.missions.get.useQuery({ id }, { enabled: open });
  const toggle = trpc.hopeIntelligence.missions.toggleStep.useMutation({
    onSuccess() {
      utils.hopeIntelligence.missions.get.invalidate({ id });
      utils.hopeIntelligence.missions.list.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });
  const list = trpc.hopeIntelligence.missions.list.useQuery();
  const m = list.data?.find((x) => x.id === id);
  if (!m) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <button className="w-full flex items-center justify-between px-4 py-3 text-left" onClick={() => setOpen((o) => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/90 truncate">{m.title}</span>
            <Badge variant="outline" className="border-white/20 text-white/50 text-[10px]">{m.category}</Badge>
            {m.status === "completed" && <Badge style={{ backgroundColor: GOLD, color: "#000" }} className="text-[10px]">Done</Badge>}
          </div>
          <Progress value={m.progress} className="h-1.5 mt-2" />
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 ml-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/10 pt-3">
          {detail.isLoading ? <SectionLoading /> : detail.data ? (
            <ul className="space-y-2">
              {detail.data.steps.map((s) => (
                <li key={s.id} className="flex items-start gap-2">
                  <Checkbox checked={s.done} onCheckedChange={(v) => toggle.mutate({ missionId: id, stepId: s.id, done: !!v })} className="mt-0.5" />
                  <div>
                    <span className={`text-sm ${s.done ? "text-white/40 line-through" : "text-white/80"}`}>{s.title}</span>
                    {s.detail && <p className="text-xs text-white/40">{s.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function MissionsSection() {
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("skill");
  const list = trpc.hopeIntelligence.missions.list.useQuery();
  const create = trpc.hopeIntelligence.missions.create.useMutation({
    onSuccess() {
      toast.success("Mission created — HOPE AI generated your step plan.");
      setTitle("");
      utils.hopeIntelligence.missions.list.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-white">Start a Mission</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Learn React Native and ship an app" className="bg-white/5 border-white/10 text-white" />
            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
              <SelectTrigger className="w-full sm:w-44 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button style={{ backgroundColor: GOLD, color: "#000" }} disabled={create.isPending || title.trim().length < 4} onClick={() => create.mutate({ title: title.trim(), category })}>
              {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-1">Create</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {list.isLoading ? <SectionLoading /> : list.error ? <ErrorState message={list.error.message} /> :
        !list.data || list.data.length === 0 ? (
          <EmptyState title="No missions yet" hint="Create one above and HOPE AI will break it into actionable steps." />
        ) : (
          <div className="space-y-3">
            {list.data.map((m) => <MissionCard key={m.id} id={m.id} />)}
          </div>
        )}
    </div>
  );
}
