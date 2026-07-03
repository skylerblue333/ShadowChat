import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle, Plus, Shield, Activity, Coins, FileText, ChevronRight, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "#a855f7";
    case "passed": return "#4ade80";
    case "failed": return "#f87171";
    case "pending": return "#facc15";
    default: return "#94a3b8";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active": return <Activity className="w-3 h-3" />;
    case "passed": return <CheckCircle className="w-3 h-3" />;
    case "failed": return <XCircle className="w-3 h-3" />;
    default: return <AlertCircle className="w-3 h-3" />;
  }
}

function timeLeft(deadline: number | string) {
  const d = typeof deadline === "string" ? new Date(deadline).getTime() : deadline;
  const diff = d - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export default function Governance() {
  
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "community", votingPeriodDays: 7 });

  const { data: proposals, isLoading, refetch } = trpc.governance.proposals.useQuery(
    filter === "all" ? undefined : { status: filter }
  );
  const { data: govStats } = trpc.governance.stats.useQuery();
  const { data: treasury } = trpc.governance.treasury.useQuery();

  const createMutation = trpc.governance.create.useMutation({
    onSuccess: () => { toast.success("Proposal submitted!"); setShowCreate(false); setForm({ title: "", description: "", category: "community", votingPeriodDays: 7 }); refetch(); },
    onError: () => toast.error("Failed to create proposal"),
  });

  const voteMutation = trpc.governance.vote.useMutation({
    onSuccess: () => { toast.success("Vote cast!"); refetch(); },
    onError: () => toast.error("Failed to cast vote"),
  });

  const filtered = proposals || [];

  const stats = [
    { label: "Active Proposals", value: govStats?.activeProposals ?? filtered.filter((p: any) => p.status === "active").length, icon: Vote, color: "text-purple-400" },
    { label: "Total Voters", value: govStats?.uniqueVoters ?? 0, icon: Users, color: "text-cyan-400" },
    { label: "Treasury", value: govStats ? `${Number(govStats.treasuryBalance || 0).toLocaleString()} SKY` : "—", icon: Coins, color: "text-yellow-400" },
    { label: "Proposals Passed", value: govStats?.passedProposals ?? filtered.filter((p: any) => p.status === "passed").length, icon: CheckCircle, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Genesis Vote #001 Banner */}
        <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 via-green-500/5 to-yellow-500/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-black text-sm">Genesis Vote #001</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold">PASSED</span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">100% Participation</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">Approved SKY4444 + DOGE + TRUMP as official SKYCOIN4444 ecosystem tokens</p>
              </div>
            </div>
            <div className="sm:ml-auto flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-slate-500">Result</p>
                <p className="text-green-400 font-bold">APPROVED</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">Tokens Added</p>
                <p className="text-white font-bold">⚡ DOGE 🐕 TRUMP 🇺🇸</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">Date</p>
                <p className="text-slate-300 font-semibold">June 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Governance
            </h1>
            <p className="text-slate-500 text-sm mt-1">Shape the future of SKYCOIN4444 — vote on proposals, submit ideas, govern the protocol</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" /> New Proposal
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {["all", "active", "passed", "failed", "pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Proposals */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-400/50" />
            </div>
            <p className="text-slate-500 text-sm">No proposals yet.</p>
            {isAuthenticated && (
              <Button onClick={() => setShowCreate(true)} className="mt-4 bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
                <Plus className="w-4 h-4 mr-2" /> Submit First Proposal
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((proposal: any) => {
              const total = (proposal.votesFor || 0) + (proposal.votesAgainst || 0) + (proposal.abstain || 0) || 1;
              const forPct = Math.round(((proposal.votesFor || 0) / total) * 100);
              const againstPct = Math.round(((proposal.votesAgainst || 0) / total) * 100);
              const quorumPct = Math.min((total / (proposal.quorum || 10000000)) * 100, 100);
              return (
                <Card key={proposal.id} className="bg-[#0e0a1a]/90 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer" onClick={() => setSelectedProposal(proposal)}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge style={{ background: getStatusColor(proposal.status) + "20", color: getStatusColor(proposal.status), border: `1px solid ${getStatusColor(proposal.status)}40` }}
                            className="text-xs flex items-center gap-1">
                            {getStatusIcon(proposal.status)} {proposal.status}
                          </Badge>
                          {proposal.category && <Badge variant="outline" className="text-xs border-white/10 text-slate-400">{proposal.category}</Badge>}
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{proposal.title}</h3>
                        <p className="text-slate-500 text-xs line-clamp-2">{proposal.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" /> {timeLeft(proposal.deadline || proposal.endsAt)}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">{total.toLocaleString()} votes</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 w-8">{forPct}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" style={{ width: `${forPct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">For</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400 w-8">{againstPct}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all" style={{ width: `${againstPct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">Against</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-8 text-right">{quorumPct.toFixed(0)}%</span>
                        <Progress value={quorumPct} className="flex-1 h-1 bg-white/5" />
                        <span className="text-xs text-slate-500">Quorum</span>
                      </div>
                    </div>
                    {isAuthenticated && proposal.status === "active" && (
                      <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
                        <Button size="sm" onClick={() => voteMutation.mutate({ proposalId: String(proposal.id), choice: "for" })}
                          className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-xs h-8">
                          <ThumbsUp className="w-3 h-3 mr-1" /> For
                        </Button>
                        <Button size="sm" onClick={() => voteMutation.mutate({ proposalId: String(proposal.id), choice: "against" })}
                          className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs h-8">
                          <ThumbsDown className="w-3 h-3 mr-1" /> Against
                        </Button>
                        <Button size="sm" onClick={() => voteMutation.mutate({ proposalId: String(proposal.id), choice: "abstain" })}
                          className="flex-1 bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 text-xs h-8">
                          <Minus className="w-3 h-3 mr-1" /> Abstain
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Proposal Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#0e0a1a] border border-purple-500/20 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" /> New Governance Proposal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Proposal title (min 5 chars)"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Description *</label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe your proposal in detail (min 20 chars)"
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0e0a1a] border-white/10">
                    {["protocol", "treasury", "community", "emergency"].map(c => (
                      <SelectItem key={c} value={c} className="text-white capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Voting Period (days)</label>
                <Select value={String(form.votingPeriodDays)} onValueChange={v => setForm(f => ({ ...f, votingPeriodDays: Number(v) }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0e0a1a] border-white/10">
                    {[1, 3, 5, 7, 14, 30].map(d => (
                      <SelectItem key={d} value={String(d)} className="text-white">{d} days</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 border-white/10 text-slate-400">Cancel</Button>
              <Button onClick={() => createMutation.mutate(form as any)} disabled={createMutation.isPending || form.title.length < 5 || form.description.length < 20}
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold">
                {createMutation.isPending ? "Submitting..." : "Submit Proposal"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
