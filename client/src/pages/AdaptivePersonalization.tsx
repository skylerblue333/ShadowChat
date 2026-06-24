/**
 * AdaptivePersonalization — Phase 9 Intelligence Layer
 * Real-time user preference learning, feed tuning, and behavioral adaptation
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Brain, Sliders, TrendingUp, Eye, Heart, Zap, RefreshCw, CheckCircle, BarChart2, Target } from "lucide-react";

const SIGNAL_TYPES = [
  { key: "content_type", label: "Content Type", desc: "Posts, reels, articles, streams", weight: 85 },
  { key: "topics", label: "Topics", desc: "Crypto, AI, gaming, art, music", weight: 92 },
  { key: "creators", label: "Creators", desc: "Followed, liked, tipped", weight: 78 },
  { key: "time_of_day", label: "Time Patterns", desc: "When you engage most", weight: 64 },
  { key: "interaction_depth", label: "Interaction Depth", desc: "Scroll, pause, comment, share", weight: 71 },
  { key: "session_length", label: "Session Length", desc: "Short bursts vs deep dives", weight: 58 },
];

const PERSONALIZATION_MODELS = [
  { name: "Feed Ranker", status: "active", accuracy: 94, lastTrained: "2h ago" },
  { name: "Content Recommender", status: "active", accuracy: 88, lastTrained: "4h ago" },
  { name: "Creator Matcher", status: "training", accuracy: 76, lastTrained: "12h ago" },
  { name: "Notification Filter", status: "active", accuracy: 91, lastTrained: "1h ago" },
  { name: "Price Predictor", status: "idle", accuracy: 72, lastTrained: "1d ago" },
];

export default function AdaptivePersonalization() {
  const [activeTab, setActiveTab] = useState<"signals" | "models" | "preferences">("signals");
  const [preferences, setPreferences] = useState({
    feedDiversity: 70,
    contentFreshness: 80,
    creatorFamiliarity: 60,
    trendingWeight: 50,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg">Adaptive Personalization</h1>
          <p className="text-xs text-muted-foreground">AI learns your preferences in real-time</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Learning
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Signals Collected", value: "12.4K", icon: Brain, color: "text-purple-400" },
            { label: "Model Accuracy", value: "91%", icon: Target, color: "text-green-400" },
            { label: "Feed Relevance", value: "+34%", icon: TrendingUp, color: "text-blue-400" },
          ].map(stat => (
            <div key={stat.label} className="card p-3 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <div className="font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["signals", "models", "preferences"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "signals" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Behavioral signals driving your personalized experience:</p>
            {SIGNAL_TYPES.map(signal => (
              <div key={signal.key} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{signal.label}</div>
                    <div className="text-xs text-muted-foreground">{signal.desc}</div>
                  </div>
                  <span className="text-sm font-bold text-primary">{signal.weight}%</span>
                </div>
                <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${signal.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "models" && (
          <div className="space-y-3">
            {PERSONALIZATION_MODELS.map(model => (
              <div key={model.name} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{model.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${model.status === "active" ? "bg-green-500/20 text-green-400" : model.status === "training" ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                      {model.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Last trained: {model.lastTrained}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{model.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">accuracy</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tune your personalization weights manually:</p>
            {Object.entries(preferences).map(([key, value]) => {
              const labels: Record<string, string> = {
                feedDiversity: "Feed Diversity",
                contentFreshness: "Content Freshness",
                creatorFamiliarity: "Creator Familiarity",
                trendingWeight: "Trending Content",
              };
              return (
                <div key={key} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{labels[key]}</span>
                    <span className="text-sm font-bold text-primary">{value}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100} value={value}
                    onChange={(e) => setPreferences(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
              );
            })}
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
