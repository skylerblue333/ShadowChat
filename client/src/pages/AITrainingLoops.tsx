/**
 * AITrainingLoops — Phase 9 AI Training & Feedback Economy
 * Model improvement loops, training data economy, AI performance tracking
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, RefreshCw, Database, TrendingUp, Zap, Activity } from "lucide-react";

const TRAINING_LOOPS = [
  { name: "Intent Parser", accuracy: 94.2, samples: "1.2M", lastTrain: "2h ago", trend: "+1.8%" },
  { name: "Action Router", accuracy: 97.8, samples: "890K", lastTrain: "4h ago", trend: "+0.4%" },
  { name: "Fraud Detector", accuracy: 99.1, samples: "340K", lastTrain: "1h ago", trend: "+0.2%" },
  { name: "Feed Ranker", accuracy: 88.6, samples: "4.1M", lastTrain: "6h ago", trend: "+2.1%" },
  { name: "Content Moderator", accuracy: 96.4, samples: "2.8M", lastTrain: "3h ago", trend: "+0.9%" },
];

export default function AITrainingLoops() {
  const [tab, setTab] = useState<"models" | "economy" | "pipeline">("models");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            AI Training Loops
          </h1>
          <p className="text-xs text-muted-foreground">Continuous model improvement — Phase 9</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total Samples", value: "9.3M", icon: Database, color: "text-blue-400" },
            { label: "Avg Accuracy", value: "95.2%", icon: Activity, color: "text-green-400" },
            { label: "Train Cycles", value: "1,842", icon: RefreshCw, color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["models", "economy", "pipeline"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "models" && (
          <div className="space-y-3">
            {TRAINING_LOOPS.map(m => (
              <div key={m.name} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="text-xs text-green-400">{m.trend}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${m.accuracy}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold w-12 text-right">{m.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{m.samples} samples</span>
                  <span>Last trained {m.lastTrain}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "economy" && (
          <div className="space-y-3">
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">Data Economy</h4>
              <p className="text-xs text-muted-foreground">Users who contribute quality interaction data earn SKY tokens. Better data = better AI = better platform for everyone.</p>
            </div>
            {[
              { action: "Completing an action", reward: "+2 SKY" },
              { action: "Rating AI response", reward: "+1 SKY" },
              { action: "Flagging bad content", reward: "+3 SKY" },
              { action: "Verified transaction", reward: "+5 SKY" },
            ].map(r => (
              <div key={r.action} className="card p-3 flex items-center justify-between">
                <span className="text-sm">{r.action}</span>
                <span className="text-sm font-bold text-green-400">{r.reward}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "pipeline" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Continuous training pipeline — every interaction improves the system.</p>
            {[
              { step: "1. Collect", desc: "User interactions captured in real-time", status: "active" },
              { step: "2. Label", desc: "AI + human labeling for quality signals", status: "active" },
              { step: "3. Train", desc: "Incremental model updates every 4 hours", status: "active" },
              { step: "4. Validate", desc: "A/B testing against production model", status: "active" },
              { step: "5. Deploy", desc: "Gradual rollout with monitoring", status: "active" },
            ].map(p => (
              <div key={p.step} className="card p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <div>
                  <div className="font-medium text-sm">{p.step}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
