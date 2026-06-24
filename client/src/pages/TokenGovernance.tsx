/**
 * TokenGovernance — Phase 11 Token Governance & DAO
 * Proposals, voting, treasury, governance parameters
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Vote, FileText, DollarSign, Users, CheckCircle, Clock, XCircle } from "lucide-react";

const PROPOSALS = [
  { id: "SIP-042", title: "Increase staking rewards to 18% APY", status: "active", votes: { for: 1240, against: 340 }, ends: "3 days" },
  { id: "SIP-041", title: "Add ETH/SKY liquidity pool", status: "passed", votes: { for: 2100, against: 180 }, ends: "Ended" },
  { id: "SIP-040", title: "Reduce platform fee from 2.5% to 2%", status: "active", votes: { for: 890, against: 720 }, ends: "5 days" },
  { id: "SIP-039", title: "Launch creator grant program", status: "passed", votes: { for: 3200, against: 210 }, ends: "Ended" },
  { id: "SIP-038", title: "Burn 5% of treasury monthly", status: "failed", votes: { for: 420, against: 1800 }, ends: "Ended" },
];

export default function TokenGovernance() {
  const [tab, setTab] = useState<"proposals" | "treasury" | "params">("proposals");

  const getStatusIcon = (status: string) => {
    if (status === "active") return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
    if (status === "passed") return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
    return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Vote className="w-5 h-5 text-blue-400" />
            Token Governance
          </h1>
          <p className="text-xs text-muted-foreground">DAO & on-chain governance — Phase 11</p>
        </div>
        <button className="ml-auto text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
          + Propose
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active Props", value: "2", icon: FileText, color: "text-yellow-400" },
            { label: "Total Voters", value: "8.4K", icon: Users, color: "text-blue-400" },
            { label: "Treasury", value: "$2.1M", icon: DollarSign, color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["proposals", "treasury", "params"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "params" ? "Parameters" : t}
            </button>
          ))}
        </div>

        {tab === "proposals" && (
          <div className="space-y-3">
            {PROPOSALS.map(p => {
              const total = p.votes.for + p.votes.against;
              const forPct = Math.round((p.votes.for / total) * 100);
              return (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs font-mono text-primary">{p.id}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      {getStatusIcon(p.status)}
                      <span className={`text-xs capitalize ${p.status === "active" ? "text-yellow-400" : p.status === "passed" ? "text-green-400" : "text-red-400"}`}>{p.status}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-3">{p.title}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>For: {p.votes.for.toLocaleString()}</span>
                      <span>Against: {p.votes.against.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${forPct}%` }} />
                    </div>
                  </div>
                  {p.status === "active" && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">Vote For</button>
                      <button className="flex-1 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Vote Against</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "treasury" && (
          <div className="space-y-3">
            {[
              { asset: "SKY444", amount: "12,400,000", value: "$1.24M", pct: 59 },
              { asset: "ETH", amount: "420", value: "$630K", pct: 30 },
              { asset: "USDC", amount: "230,000", value: "$230K", pct: 11 },
            ].map(a => (
              <div key={a.asset} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{a.asset}</span>
                  <span className="font-bold text-green-400">{a.value}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${a.pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{a.pct}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{a.amount} tokens</div>
              </div>
            ))}
          </div>
        )}

        {tab === "params" && (
          <div className="space-y-2">
            {[
              { param: "Quorum threshold", value: "10% of supply" },
              { param: "Voting period", value: "7 days" },
              { param: "Proposal threshold", value: "10,000 SKY" },
              { param: "Execution delay", value: "48 hours" },
              { param: "Platform fee", value: "2.5%" },
              { param: "Staking APY", value: "15%" },
            ].map(p => (
              <div key={p.param} className="card p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{p.param}</span>
                <span className="text-sm font-medium font-mono">{p.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
