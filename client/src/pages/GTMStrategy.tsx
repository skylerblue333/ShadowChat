/**
 * GTMStrategy — Go-To-Market Strategy & Revenue Model
 * Growth channels, revenue streams, unit economics, scaling plan
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Target, DollarSign, TrendingUp, Users, Megaphone, BarChart2 } from "lucide-react";

const REVENUE_STREAMS = [
  { name: "Action Fees", desc: "2.5% on every payment/transaction executed via chat", model: "Transaction", arr: "$420K", pct: 38 },
  { name: "Creator Subscriptions", desc: "Creators pay $29–$299/mo for premium tools + analytics", model: "SaaS", arr: "$280K", pct: 25 },
  { name: "AI Credits", desc: "Pay-per-use AI calls beyond free tier (100 free/mo)", model: "Usage", arr: "$190K", pct: 17 },
  { name: "Marketplace Commissions", desc: "10% on all marketplace transactions", model: "Commission", arr: "$140K", pct: 13 },
  { name: "Token/Staking Revenue", desc: "Protocol fees from SKY444 staking and swaps", model: "Protocol", arr: "$80K", pct: 7 },
];

const GROWTH_CHANNELS = [
  { channel: "Creator Referrals", cac: "$8", ltv: "$340", ratio: "42x", priority: "high" },
  { channel: "Viral Share Cards", cac: "$2", ltv: "$180", ratio: "90x", priority: "high" },
  { channel: "X/Twitter Organic", cac: "$12", ltv: "$220", ratio: "18x", priority: "high" },
  { channel: "Product Hunt Launch", cac: "$0", ltv: "$150", ratio: "∞", priority: "medium" },
  { channel: "Dev Community (GitHub)", cac: "$15", ltv: "$480", ratio: "32x", priority: "medium" },
  { channel: "Paid Social", cac: "$45", ltv: "$220", ratio: "4.9x", priority: "low" },
];

const MILESTONES = [
  { target: "100 users", metric: "Validate action loop works", timeline: "Month 1" },
  { target: "$1K MRR", metric: "First paying creators", timeline: "Month 2" },
  { target: "1K users", metric: "Viral loop confirmed", timeline: "Month 3" },
  { target: "$10K MRR", metric: "10 power creators", timeline: "Month 6" },
  { target: "10K users", metric: "Network effects kicking in", timeline: "Month 9" },
  { target: "$100K MRR", metric: "Series A ready", timeline: "Month 18" },
];

export default function GTMStrategy() {
  const [tab, setTab] = useState<"revenue" | "channels" | "milestones">("revenue");
  const totalARR = REVENUE_STREAMS.reduce((s, r) => s + parseInt(r.arr.replace(/[$K]/g, "")) * 1000, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            GTM Strategy
          </h1>
          <p className="text-xs text-muted-foreground">Go-to-market & revenue model</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-bold text-green-400">${(totalARR / 1000).toFixed(0)}K ARR</div>
          <div className="text-xs text-muted-foreground">Projected Year 1</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="card p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
          <h3 className="font-bold text-sm mb-1">Core Thesis</h3>
          <p className="text-sm text-foreground">"Every conversation should produce a real outcome — payment, match, task, or earning."</p>
          <p className="text-xs text-muted-foreground mt-1">We monetize execution, not attention.</p>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["revenue", "channels", "milestones"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "revenue" && (
          <div className="space-y-3">
            {REVENUE_STREAMS.map(r => (
              <div key={r.name} className="card p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400 text-sm">{r.arr}</div>
                    <div className="text-xs text-muted-foreground">{r.model}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${r.pct}%`, opacity: 0.7 }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "channels" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Ranked by LTV:CAC ratio — focus on highest ratio first.</p>
            {GROWTH_CHANNELS.map(c => (
              <div key={c.channel} className="card p-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.channel}</div>
                  <div className="text-xs text-muted-foreground">CAC: {c.cac} · LTV: {c.ltv}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-sm">{c.ratio}</div>
                  <span className={`text-xs ${c.priority === "high" ? "text-green-400" : c.priority === "medium" ? "text-yellow-400" : "text-muted-foreground"}`}>{c.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "milestones" && (
          <div className="space-y-2">
            {MILESTONES.map((m, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{m.target}</div>
                  <div className="text-xs text-muted-foreground">{m.metric}</div>
                </div>
                <span className="text-xs text-muted-foreground">{m.timeline}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
