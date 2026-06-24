import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, Trophy } from "lucide-react";
import { GOLD, SectionLoading, ErrorState } from "./shared";

export function ReputationSection() {
  const utils = trpc.useUtils();
  const me = trpc.hopeIntelligence.reputation.me.useQuery();
  const board = trpc.hopeIntelligence.reputation.leaderboard.useQuery({ limit: 10 });
  const recompute = trpc.hopeIntelligence.reputation.recompute.useMutation({
    onSuccess() {
      toast.success("Reputation recomputed from your latest activity.");
      utils.hopeIntelligence.reputation.me.invalidate();
      utils.hopeIntelligence.reputation.leaderboard.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });

  if (me.isLoading) return <SectionLoading label="Calculating reputation…" />;
  if (me.error) return <ErrorState message={me.error.message} />;

  const r = me.data;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-white">Your Reputation</CardTitle>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80" disabled={recompute.isPending} onClick={() => recompute.mutate()}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${recompute.isPending ? "animate-spin" : ""}`} />
            Recompute
          </Button>
        </CardHeader>
        <CardContent>
          {!r ? (
            <p className="text-sm text-white/40">No score yet. Click Recompute to generate it from your real activity.</p>
          ) : (
            <>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black" style={{ color: GOLD }}>{r.overall}</span>
                <span className="text-white/40 mb-2">/ 100 overall</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {([["Learning", r.learningScore], ["Builder", r.builderScore], ["Teaching", r.teachingScore], ["Community", r.communityScore], ["Trust", r.trustScore]] as const).map(([label, v]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-white/60 mb-1"><span>{label}</span><span className="tabular-nums">{v}</span></div>
                    <Progress value={v} className="h-2" />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Trophy className="h-4 w-4" style={{ color: GOLD }} />Leaderboard</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {board.isLoading ? <SectionLoading /> : board.data && board.data.length > 0 ? board.data.map((u, i) => (
            <div key={u.userId} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-white/50">{i + 1}</span>
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 overflow-hidden">
                  {u.avatar ? <img src={u.avatar} alt="" className="h-full w-full object-cover" /> : (u.name ?? u.username ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm text-white/80">{u.name ?? u.username ?? `User ${u.userId}`}</span>
              </div>
              <Badge style={{ backgroundColor: GOLD, color: "#000" }}>{u.overall}</Badge>
            </div>
          )) : <p className="text-sm text-white/40">No ranked members yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
