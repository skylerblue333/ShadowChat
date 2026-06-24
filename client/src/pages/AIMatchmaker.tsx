/**
 * AIMatchmaker — Phase 43 Dating System
 * "Why this match?" — compatibility analysis, behavior prediction, relationship suggestions
 */
import { useState } from "react";
import { Brain, Heart, TrendingUp, Shield, MessageCircle, Zap, Star, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const COMPATIBILITY_DIMENSIONS = [
  { label: "Communication Style", score: 91, desc: "Both prefer direct, meaningful conversations over small talk." },
  { label: "Lifestyle Alignment", score: 84, desc: "Similar activity levels and social preferences." },
  { label: "Values Match", score: 88, desc: "Shared emphasis on authenticity and growth." },
  { label: "Interest Overlap", score: 76, desc: "3 strong shared interests: crypto, tech, travel." },
  { label: "Relationship Goals", score: 95, desc: "Both seeking long-term meaningful connection." },
  { label: "Energy Compatibility", score: 82, desc: "Complementary introvert/extrovert balance." },
];

const BEHAVIOR_PREDICTIONS = [
  { prediction: "High conversation depth", confidence: 94, icon: MessageCircle, color: "text-blue-400" },
  { prediction: "Low conflict probability", confidence: 87, icon: Shield, color: "text-green-400" },
  { prediction: "Strong long-term retention", confidence: 79, icon: TrendingUp, color: "text-purple-400" },
  { prediction: "Fast initial connection", confidence: 91, icon: Zap, color: "text-yellow-400" },
];

const MATCH_SUGGESTIONS = [
  {
    name: "Alex Rivera",
    age: 26,
    overallScore: 94,
    topReason: "Crypto + nightlife alignment",
    aiNote: "Your highest match. Strong shared identity in Web3 culture.",
    badge: "Top Pick",
    badgeColor: "bg-pink-500",
  },
  {
    name: "Jordan Kim",
    age: 29,
    overallScore: 88,
    topReason: "Intellectual depth + AI interests",
    aiNote: "Complementary expertise. High potential for stimulating conversations.",
    badge: "Intellectual Match",
    badgeColor: "bg-purple-500",
  },
  {
    name: "Sam Chen",
    age: 24,
    overallScore: 82,
    topReason: "Entrepreneurial energy",
    aiNote: "Shared startup mindset. Good for networking and casual connection.",
    badge: "Energy Match",
    badgeColor: "bg-blue-500",
  },
];

export default function AIMatchmaker() {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeMatch, setActiveMatch] = useState(0);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      toast.success("AI analysis complete — 3 new insights found!");
    }, 2000);
  };

  const match = MATCH_SUGGESTIONS[activeMatch];

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Matchmaker</h1>
            <p className="text-xs text-muted-foreground">Compatibility intelligence engine</p>
          </div>
        </div>
      </div>

      {/* Top match selector */}
      <div className="card p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Analyzing match with</h2>
          <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={handleAnalyze} disabled={analyzing}>
            <RefreshCw className={`w-3 h-3 ${analyzing ? "animate-spin" : ""}`} />
            {analyzing ? "Analyzing..." : "Re-analyze"}
          </Button>
        </div>
        <div className="flex gap-2">
          {MATCH_SUGGESTIONS.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMatch(idx)}
              className={`flex-1 p-2 rounded-lg border text-center transition-all ${activeMatch === idx ? "border-pink-500 bg-pink-500/10" : "border-border hover:border-pink-500/50"}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white mx-auto mb-1">
                {m.name[0]}
              </div>
              <div className="text-xs font-medium">{m.name.split(" ")[0]}</div>
              <div className="text-xs text-green-400">{m.overallScore}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Match summary */}
      <div className="card p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {match.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{match.name}, {match.age}</h3>
              <Badge className={`${match.badgeColor} text-white text-xs`}>{match.badge}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{match.aiNote}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{match.overallScore}%</div>
            <div className="text-xs text-muted-foreground">overall</div>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2">
          <Brain className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>Top reason: {match.topReason}</span>
        </div>
      </div>

      {/* Compatibility dimensions */}
      <div className="card p-4">
        <h2 className="font-semibold text-sm mb-3">Compatibility Breakdown</h2>
        <div className="space-y-3">
          {COMPATIBILITY_DIMENSIONS.map(dim => (
            <div key={dim.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{dim.label}</span>
                <span className={`text-xs font-bold ${dim.score >= 90 ? "text-green-400" : dim.score >= 80 ? "text-blue-400" : "text-yellow-400"}`}>
                  {dim.score}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${dim.score >= 90 ? "bg-green-500" : dim.score >= 80 ? "bg-blue-500" : "bg-yellow-500"}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{dim.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior predictions */}
      <div className="card p-4">
        <h2 className="font-semibold text-sm mb-3">Behavior Predictions</h2>
        <div className="grid grid-cols-2 gap-2">
          {BEHAVIOR_PREDICTIONS.map(pred => {
            const PredIcon = pred.icon;
            return (
              <div key={pred.prediction} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <PredIcon className={`w-4 h-4 ${pred.color} mb-1.5`} />
                <div className="text-xs font-medium">{pred.prediction}</div>
                <div className="text-xs text-muted-foreground">{pred.confidence}% confidence</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relationship suggestions */}
      <div className="card p-4">
        <h2 className="font-semibold text-sm mb-3">AI Relationship Suggestions</h2>
        <div className="space-y-2">
          {[
            "Start with shared interest in crypto — ask about their favorite DeFi protocol.",
            "Avoid surface-level small talk — both of you prefer depth.",
            "Suggest a virtual coffee chat within the first 3 messages.",
            "Share your creative side early — it's a strong compatibility signal.",
          ].map((suggestion, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <Star className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 gap-2">
          <Heart className="w-4 h-4" />
          Like {match.name.split(" ")[0]}
        </Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={() => toast("Opening chat...")}>
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      </div>

      {/* Premium upsell */}
      <div className="card p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 flex items-center gap-3">
        <div className="text-2xl">👑</div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Unlock Full AI Analysis</div>
          <div className="text-xs text-muted-foreground">Deep personality profiling + relationship roadmap</div>
        </div>
        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-black shrink-0" onClick={() => toast("Redirecting to Premium...")}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
