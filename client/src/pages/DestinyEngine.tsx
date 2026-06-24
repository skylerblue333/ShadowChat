import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/_core/hooks/useAuth";

interface FuturePath {
  id: string;
  label: string;
  probability: number;
  timeframe: string;
  outcome: string;
  icon: string;
  color: string;
  actions: string[];
}

const FUTURE_PATHS: FuturePath[] = [
  {
    id: "wealth",
    label: "Wealth Architect",
    probability: 72,
    timeframe: "6 months",
    outcome: "Top 10% earner in the ecosystem",
    icon: "💎",
    color: "yellow",
    actions: ["Stake 10,000 SKY444", "Complete DeFi course", "Join 3 investment pools"],
  },
  {
    id: "builder",
    label: "Master Builder",
    probability: 85,
    timeframe: "3 months",
    outcome: "Launch your first AI-powered startup",
    icon: "🏗️",
    color: "blue",
    actions: ["Complete Shadow IDE tutorial", "Deploy first agent", "Submit venture proposal"],
  },
  {
    id: "governor",
    label: "Nation Governor",
    probability: 61,
    timeframe: "12 months",
    outcome: "Elected to Digital Nation council",
    icon: "🏛️",
    color: "purple",
    actions: ["Vote on 20 proposals", "Earn 500 governance XP", "Propose 1 law"],
  },
  {
    id: "legend",
    label: "Ecosystem Legend",
    probability: 34,
    timeframe: "24 months",
    outcome: "Legendary status — top 1% of all citizens",
    icon: "⭐",
    color: "orange",
    actions: ["Reach level 50", "Earn 10,000 reputation", "Mentor 10 citizens"],
  },
];

function PathCard({ path, selected, onSelect }: { path: FuturePath; selected: boolean; onSelect: () => void }) {
  const colorMap: Record<string, string> = {
    yellow: "border-yellow-500/40 bg-yellow-500/10",
    blue: "border-blue-500/40 bg-blue-500/10",
    purple: "border-purple-500/40 bg-purple-500/10",
    orange: "border-orange-500/40 bg-orange-500/10",
  };
  const textMap: Record<string, string> = {
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    orange: "text-orange-400",
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
        selected
          ? `${colorMap[path.color]} scale-[1.02] shadow-lg`
          : "border-white/10 bg-black/40 hover:border-white/30"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{path.icon}</span>
          <div>
            <div className="font-bold text-white">{path.label}</div>
            <div className="text-xs text-white/40">{path.timeframe}</div>
          </div>
        </div>
        <div className={`text-2xl font-black font-mono ${textMap[path.color]}`}>
          {path.probability}%
        </div>
      </div>
      <div className="text-sm text-white/60 mb-3">{path.outcome}</div>
      <Progress value={path.probability} className="h-1.5" />
    </button>
  );
}

export default function DestinyEngine() {
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<string>("builder");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  const { data: predictions } = trpc.enterprise.memoryGraph.predictions.useQuery();
  const { data: goals } = trpc.enterprise.freeWill.goals.useQuery();

  const activePath = FUTURE_PATHS.find((p) => p.id === selectedPath)!;

  const handleSimulate = async () => {
    setSimulating(true);
    setSimResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setSimResult(
      `Based on your current trajectory and ${goals?.length ?? 0} active goals, HOPE AI predicts a ${activePath.probability}% probability of achieving "${activePath.label}" status within ${activePath.timeframe}. Your strongest accelerator is consistent daily engagement. Your biggest risk is inactivity gaps.`
    );
    setSimulating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-500/20 bg-gradient-to-r from-black via-purple-950/10 to-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 flex items-center justify-center text-2xl">
              🔮
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                DESTINY ENGINE
              </h1>
              <p className="text-sm text-purple-400/80 mt-1">
                AI-powered life path simulation — your future, computed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Probability Matrix */}
        <div>
          <h2 className="text-xs text-white/40 uppercase tracking-widest mb-4">
            YOUR DESTINY PATHS — SELECT ONE TO SIMULATE
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FUTURE_PATHS.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                selected={selectedPath === path.id}
                onSelect={() => setSelectedPath(path.id)}
              />
            ))}
          </div>
        </div>

        {/* Selected Path Deep Dive */}
        <Card className="bg-black/60 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm uppercase tracking-widest flex items-center gap-2">
              <span>{activePath.icon}</span>
              {activePath.label} — SIMULATION CHAMBER
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Probability gauge */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3"
                    strokeDasharray={`${activePath.probability}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-white">{activePath.probability}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-lg mb-1">{activePath.outcome}</div>
                <div className="text-sm text-white/50">Projected timeframe: {activePath.timeframe}</div>
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">AI COMPUTED</Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">LIVE TRACKING</Badge>
                </div>
              </div>
            </div>

            {/* Required Actions */}
            <div>
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3">
                REQUIRED ACTIONS TO UNLOCK THIS PATH
              </div>
              <div className="space-y-2">
                {activePath.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-5 h-5 rounded-full border border-yellow-500/40 flex items-center justify-center text-xs text-yellow-400">
                      {i + 1}
                    </div>
                    <span className="text-sm text-white/80">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulate Button */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-yellow-600 text-white font-bold h-12"
              onClick={handleSimulate}
              disabled={simulating}
            >
              {simulating ? "🔮 HOPE AI COMPUTING YOUR DESTINY..." : "🔮 RUN DESTINY SIMULATION"}
            </Button>

            {/* Simulation Result */}
            {simResult && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-xs text-purple-400 uppercase tracking-widest mb-2">
                  HOPE AI DESTINY REPORT
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{simResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Memory Predictions */}
        {predictions && Array.isArray(predictions) && predictions.length > 0 && (
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                MEMORY GRAPH PREDICTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(predictions as unknown as Array<Record<string, unknown>>).slice(0, 4).map((pred, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-yellow-400 font-mono text-sm w-8">{i + 1}.</span>
                  <span className="text-sm text-white/70">{String(pred.prediction ?? pred.text ?? JSON.stringify(pred))}</span>
                  {pred.confidence !== undefined && (
                    <Badge className="ml-auto bg-yellow-500/10 text-yellow-400 text-xs border-0 shrink-0">
                      {Math.round(Number(pred.confidence) * 100)}%
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Council Teaser */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "HOPE AI", role: "Life Advisor", icon: "🧠", advice: "Focus on knowledge building this week" },
            { name: "ECON AI", role: "Wealth Advisor", icon: "💰", advice: "Staking rewards peak in 3 days" },
            { name: "GOV AI", role: "Governance Advisor", icon: "🏛️", advice: "2 critical proposals need your vote" },
          ].map((advisor, i) => (
            <Card key={i} className="bg-black/60 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{advisor.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{advisor.name}</div>
                    <div className="text-xs text-white/40">{advisor.role}</div>
                  </div>
                </div>
                <p className="text-xs text-white/60 italic">"{advisor.advice}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
