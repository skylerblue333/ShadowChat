/**
 * CreatorIntelligence — Phase 9 Creator Intelligence Layer
 * AI-powered creator analytics, content optimization, revenue intelligence
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, TrendingUp, BarChart2, Lightbulb, DollarSign, Eye } from "lucide-react";

const AI_INSIGHTS = [
  { type: "Revenue", insight: "Your Tuesday posts earn 3.2x more than other days", action: "Schedule premium content on Tuesdays", impact: "high" },
  { type: "Engagement", insight: "Short-form content (< 60s) gets 4x more shares", action: "Create more reels and clips", impact: "high" },
  { type: "Audience", insight: "Your audience is most active 7–9 PM EST", action: "Post during peak hours", impact: "medium" },
  { type: "Monetization", insight: "Subscribers who tip once tip again 78% of the time", action: "Add tip prompts after valuable content", impact: "high" },
  { type: "Growth", insight: "Creators who respond to comments grow 2.1x faster", action: "Enable auto-reply for top comments", impact: "medium" },
];

export default function CreatorIntelligence() {
  const [tab, setTab] = useState<"insights" | "forecast" | "optimize">("insights");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Creator Intelligence
          </h1>
          <p className="text-xs text-muted-foreground">AI-powered creator insights — Phase 9</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue Score", value: "87/100", icon: DollarSign, color: "text-green-400" },
            { label: "Reach Score", value: "72/100", icon: Eye, color: "text-blue-400" },
            { label: "Growth Rate", value: "+24%", icon: TrendingUp, color: "text-pink-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["insights", "forecast", "optimize"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "insights" && (
          <div className="space-y-3">
            {AI_INSIGHTS.map((ins, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="text-xs font-medium text-yellow-400">{ins.type}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ins.impact === "high" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>{ins.impact} impact</span>
                </div>
                <p className="text-sm text-foreground mb-2">{ins.insight}</p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <span>→</span>
                  <span>{ins.action}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "forecast" && (
          <div className="space-y-3">
            <div className="card p-4">
              <h4 className="font-semibold text-sm mb-3">30-Day Revenue Forecast</h4>
              <div className="space-y-2">
                {[
                  { label: "Conservative", value: "$1,240", color: "bg-blue-400" },
                  { label: "Expected", value: "$2,180", color: "bg-green-400" },
                  { label: "Optimistic", value: "$3,450", color: "bg-yellow-400" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">{f.label}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${f.color} rounded-full`} style={{ width: f.label === "Conservative" ? "36%" : f.label === "Expected" ? "63%" : "100%" }} />
                    </div>
                    <span className="text-xs font-medium w-16 text-right">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">Based on your last 90 days of activity, audience growth rate, and platform trends.</p>
            </div>
          </div>
        )}

        {tab === "optimize" && (
          <div className="space-y-3">
            {[
              { title: "Enable AI Auto-Reply", desc: "Save 2hrs/day, boost engagement 40%", status: "available" },
              { title: "Schedule Content Batching", desc: "Post at peak times automatically", status: "available" },
              { title: "Tip Prompt Optimization", desc: "AI-timed tip prompts after high-value content", status: "beta" },
              { title: "Audience Segment Targeting", desc: "Personalize content per audience segment", status: "coming" },
            ].map(o => (
              <div key={o.title} className="card p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{o.title}</div>
                  <div className="text-xs text-muted-foreground">{o.desc}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${o.status === "available" ? "bg-green-500/20 text-green-400" : o.status === "beta" ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
