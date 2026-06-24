/**
 * RetentionEngine — Phase 17 Retention + Engagement + Network Effects
 * Daily core loop, sticky features, viral sharing, retention metrics
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, TrendingUp, Share2, Bell, Users, Zap, Target, BarChart2 } from "lucide-react";

const RETENTION_METRICS = [
  { label: "Day 1 Retention", value: "68%", target: "70%", trend: "+3%", color: "text-green-400" },
  { label: "Day 7 Retention", value: "42%", target: "45%", trend: "+5%", color: "text-blue-400" },
  { label: "Day 30 Retention", value: "28%", target: "30%", trend: "+2%", color: "text-purple-400" },
  { label: "Actions/User/Day", value: "4.2", target: "5.0", trend: "+0.8", color: "text-yellow-400" },
  { label: "Revenue/Active User", value: "$3.40", target: "$5.00", trend: "+$0.60", color: "text-pink-400" },
  { label: "Repeat AI Usage", value: "74%", target: "80%", trend: "+4%", color: "text-cyan-400" },
];

const STICKY_FEATURES = [
  {
    name: "Conversation Memory",
    desc: "AI remembers past actions — chat history becomes your personal context OS",
    status: "live",
    impact: "high",
  },
  {
    name: "Action History Feed",
    desc: "Users see everything they've done: payments, matches, tasks, earnings",
    status: "live",
    impact: "high",
  },
  {
    name: "Instant Reward Feedback",
    desc: '"You earned $X" · "Action completed" · "Match found" — dopamine loop',
    status: "live",
    impact: "high",
  },
  {
    name: "Personalized AI Suggestions",
    desc: "AI adapts tone and action suggestions per user behavior over time",
    status: "live",
    impact: "medium",
  },
  {
    name: "Viral Share Cards",
    desc: '"I just made $20 using chat" — shareable result cards for organic growth',
    status: "beta",
    impact: "high",
  },
];

export default function RetentionEngine() {
  const [tab, setTab] = useState<"loop" | "metrics" | "sticky" | "viral">("loop");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-400" />
            Retention Engine
          </h1>
          <p className="text-xs text-muted-foreground">Habit loop & network effects — Phase 17</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 overflow-x-auto">
          {(["loop", "metrics", "sticky", "viral"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "loop" ? "Daily Loop" : t === "sticky" ? "Sticky Features" : t}
            </button>
          ))}
        </div>

        {tab === "loop" && (
          <div className="space-y-3">
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <h4 className="font-bold text-sm mb-3">Daily Core Loop</h4>
              <div className="space-y-2">
                {[
                  { step: "1", label: "User opens chat", icon: "💬" },
                  { step: "2", label: "AI suggests action", icon: "🤖" },
                  { step: "3", label: "User completes action", icon: "⚡" },
                  { step: "4", label: "User earns / saves time / gets result", icon: "💰" },
                  { step: "5", label: "User returns tomorrow", icon: "🔄" },
                ].map((s, i, arr) => (
                  <div key={s.step}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{s.step}</div>
                      <span className="text-sm">{s.icon} {s.label}</span>
                    </div>
                    {i < arr.length - 1 && <div className="ml-3.5 w-px h-3 bg-border/50 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <h4 className="font-semibold text-sm mb-2">Why users return</h4>
              <div className="space-y-2">
                {[
                  "They earn money inside the platform",
                  "Actions complete faster than any alternative",
                  "AI reduces daily effort significantly",
                  "Conversations produce real outcomes",
                ].map(r => (
                  <div key={r} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "metrics" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">YC-relevant retention metrics tracked in real-time.</p>
            {RETENTION_METRICS.map(m => (
              <div key={m.label} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                  <span className={`text-xs ${m.color}`}>{m.trend} vs last week</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className={`text-2xl font-bold ${m.color}`}>{m.value}</span>
                  <span className="text-xs text-muted-foreground mb-1">target: {m.target}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sticky" && (
          <div className="space-y-3">
            {STICKY_FEATURES.map(f => (
              <div key={f.name} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm">{f.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${f.status === "live" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{f.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${f.impact === "high" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{f.impact}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "viral" && (
          <div className="space-y-3">
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">Viral Loop</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>User chats → AI helps → Action completes → User shares result → New users join → Repeat</div>
              </div>
            </div>
            {[
              { trigger: "Payment completed", shareText: '"I just made $20 using chat on ShadowChat"', channel: "X/Twitter" },
              { trigger: "Task completed by AI", shareText: '"AI completed my logo brief in 30 seconds"', channel: "LinkedIn" },
              { trigger: "Match found", shareText: '"Found a perfect collaborator instantly"', channel: "Instagram" },
              { trigger: "Staking reward", shareText: '"Earning 15% APY on my SKY tokens"', channel: "Telegram" },
            ].map((v, i) => (
              <div key={i} className="card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium">{v.trigger}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{v.channel}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">"{v.shareText}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
