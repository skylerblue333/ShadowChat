import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, Briefcase, Users } from "lucide-react";
import { GOLD, SectionLoading, ErrorState, EmptyState } from "./shared";

export function OpportunitiesSection() {
  const utils = trpc.useUtils();
  const matches = trpc.hopeIntelligence.opportunities.myMatches.useQuery({ limit: 30 });
  const network = trpc.hopeIntelligence.opportunities.network.useQuery({ limit: 10 });
  const refresh = trpc.hopeIntelligence.opportunities.refresh.useMutation({
    onSuccess(d) {
      toast.success(`Re-scored ${d.scored} opportunities with HOPE AI.`);
      utils.hopeIntelligence.opportunities.myMatches.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });
  const setStatus = trpc.hopeIntelligence.opportunities.setStatus.useMutation({
    onSuccess() { utils.hopeIntelligence.opportunities.myMatches.invalidate(); },
    onError(e) { toast.error(e.message); },
  });

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-white"><Briefcase className="h-4 w-4" style={{ color: GOLD }} />AI-Matched Opportunities</CardTitle>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80" disabled={refresh.isPending} onClick={() => refresh.mutate({})}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refresh.isPending ? "animate-spin" : ""}`} />
            Refresh Matches
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {matches.isLoading ? <SectionLoading /> : matches.error ? <ErrorState message={matches.error.message} /> :
            !matches.data || matches.data.length === 0 ? (
              <EmptyState title="No matches yet" hint="Click Refresh Matches to have HOPE AI rank open opportunities against your profile." />
            ) : matches.data.map((m) => (
              <div key={m.id} className="rounded-lg border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white/90">{m.opportunity?.title ?? "Opportunity"}</span>
                  <Badge style={{ backgroundColor: GOLD, color: "#000" }}>{m.score}</Badge>
                </div>
                {m.opportunity?.description && <p className="text-xs text-white/50 mt-1 line-clamp-2">{m.opportunity.description}</p>}
                <p className="text-xs text-white/40 mt-1 italic">{m.reasoning}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-500/40 text-emerald-300" disabled={m.status === "saved"} onClick={() => setStatus.mutate({ opportunityId: m.opportunityId, status: "saved" })}>
                    {m.status === "saved" ? "Saved" : "Interested"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-white/40" disabled={m.status === "dismissed"} onClick={() => setStatus.mutate({ opportunityId: m.opportunityId, status: "dismissed" })}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Users className="h-4 w-4" style={{ color: GOLD }} />Pro-Network Suggestions</CardTitle></CardHeader>
        <CardContent>
          {network.isLoading ? <SectionLoading /> : !network.data || network.data.length === 0 ? (
            <EmptyState title="No suggestions yet" hint="These appear as your follow graph grows (friends-of-friends ranked by mutual ties + reputation)." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {network.data.map((n) => (
                <div key={n.userId} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 overflow-hidden">
                      {n.avatar ? <img src={n.avatar} alt="" className="h-full w-full object-cover" /> : (n.name ?? n.username ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm text-white/80">{n.name ?? n.username ?? `User ${n.userId}`}</div>
                      <div className="text-xs text-white/40">{n.mutualCount} mutual{n.reputation != null ? ` · rep ${n.reputation}` : ""}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
