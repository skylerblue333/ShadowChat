import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

interface LifeDimension {
  key: string;
  label: string;
  icon: string;
  score: number;
  trend: "up" | "down" | "stable";
  color: string;
  description: string;
}

function DimensionCard({ dim }: { dim: LifeDimension }) {
  const trendIcon = dim.trend === "up" ? "▲" : dim.trend === "down" ? "▼" : "●";
  const trendColor =
    dim.trend === "up" ? "text-emerald-400" : dim.trend === "down" ? "text-red-400" : "text-yellow-400";

  return (
    <Card className="bg-black/60 border-white/10 hover:border-yellow-500/40 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dim.icon}</span>
            <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              {dim.label}
            </span>
          </div>
          <span className={`text-xs font-bold ${trendColor}`}>{trendIcon}</span>
        </div>
        <div className="text-4xl font-black text-white font-mono mb-2">{dim.score}</div>
        <Progress value={dim.score} className="h-1.5 mb-2" />
        <p className="text-xs text-white/40">{dim.description}</p>
      </CardContent>
    </Card>
  );
}

export default function LifeCommand() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "actions" | "history">("overview");

  const { data: twin } = trpc.hopeIntelligence.twin.get.useQuery();
  const { data: today } = trpc.hopeIntelligence.missionControl.today.useQuery();
  const { data: reputation } = trpc.hopeIntelligence.reputation.me.useQuery();
  const { data: myProfile } = trpc.enterprise.behavior.myProfile.useQuery();

  // Compute life dimensions from real data
  const repScore = reputation?.overall ?? 0;
  const xp = (user as Record<string, unknown>)?.xp as number ?? 0;
  const level = (user as Record<string, unknown>)?.level as number ?? 1;
  const missionsDone = today?.activeMissions?.length ?? 0;
  const archetype = myProfile?.archetype ?? "Explorer";

  const dimensions: LifeDimension[] = [
    {
      key: "wealth",
      label: "Wealth",
      icon: "💰",
      score: Math.min(100, Math.round(repScore * 0.3 + xp * 0.01)),
      trend: "up",
      color: "text-yellow-400",
      description: "Token holdings, staking rewards, and economic activity",
    },
    {
      key: "knowledge",
      label: "Knowledge",
      icon: "🧠",
      score: Math.min(100, Math.round(level * 5 + (today?.learning?.length ?? 0) * 10)),
      trend: "up",
      color: "text-blue-400",
      description: "Courses completed, skills acquired, and learning streaks",
    },
    {
      key: "influence",
      label: "Influence",
      icon: "⚡",
      score: Math.min(100, Math.round(repScore * 0.4)),
      trend: "stable",
      color: "text-purple-400",
      description: "Governance votes, community impact, and reputation rank",
    },
    {
      key: "purpose",
      label: "Purpose",
      icon: "🎯",
      score: Math.min(100, Math.round(missionsDone * 15 + 40)),
      trend: "up",
      color: "text-emerald-400",
      description: "Mission completion, goals achieved, and contribution score",
    },
    {
      key: "productivity",
      label: "Productivity",
      icon: "⚙️",
      score: Math.min(100, Math.round(xp * 0.05 + missionsDone * 10 + 30)),
      trend: "up",
      color: "text-orange-400",
      description: "Daily tasks, agent deployments, and build activity",
    },
    {
      key: "connection",
      label: "Connection",
      icon: "🌐",
      score: Math.min(100, Math.round(repScore * 0.2 + 35)),
      trend: "stable",
      color: "text-pink-400",
      description: "Community engagement, ShadowChat activity, and network growth",
    },
  ];

  const lifeScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

  const getLifeRank = (score: number) => {
    if (score >= 90) return { rank: "LEGENDARY", color: "text-yellow-400" };
    if (score >= 75) return { rank: "ELITE", color: "text-purple-400" };
    if (score >= 60) return { rank: "ADVANCED", color: "text-blue-400" };
    if (score >= 40) return { rank: "RISING", color: "text-emerald-400" };
    return { rank: "INITIATE", color: "text-white/60" };
  };

  const { rank, color: rankColor } = getLifeRank(lifeScore);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-500/20 bg-gradient-to-r from-black via-yellow-950/10 to-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                LIFE COMMAND
              </h1>
              <p className="text-sm text-yellow-500/60 mt-1">
                Your personal operating system — {archetype} archetype
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 uppercase tracking-widest">Life Score</div>
              <div className="text-5xl font-black text-white font-mono">{lifeScore}</div>
              <Badge className={`${rankColor} bg-transparent border border-current text-xs mt-1`}>
                {rank}
              </Badge>
            </div>
          </div>

          {/* Life Score Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>INITIATE</span>
              <span>RISING</span>
              <span>ADVANCED</span>
              <span>ELITE</span>
              <span>LEGENDARY</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 rounded-full transition-all duration-1000"
                style={{ width: `${lifeScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["overview", "actions", "history"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className={
                activeTab === tab
                  ? "bg-yellow-500 text-black font-bold"
                  : "border-white/20 text-white/60 hover:text-white"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* 6 Dimensions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dimensions.map((dim) => (
                <DimensionCard key={dim.key} dim={dim} />
              ))}
            </div>

            {/* Digital Twin Summary */}
            {twin && (
              <Card className="bg-black/60 border-yellow-500/20">
                <CardHeader>
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                DIGITAL TWIN — {user?.name ?? "Your AI Self"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-white/40 mb-1">Personality</div>
                      <div className="text-white font-semibold">{(twin as Record<string, unknown>).personality as string ?? "Adaptive"}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-white/40 mb-1">Primary Goal</div>
                      <div className="text-white font-semibold">{(twin as Record<string, unknown>).primaryGoal as string ?? "Growth"}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-white/40 mb-1">Memory Depth</div>
                      <div className="text-white font-semibold">{(twin as Record<string, unknown>).memoryDepth as number ?? twin.goals?.length ?? 0} memories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Today's Priority Actions */}
            <Card className="bg-black/60 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                  TODAY'S PRIORITY ACTIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {today?.suggestions?.slice(0, 5).map((suggestion: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-white/80">{suggestion}</span>
                    <Badge className="ml-auto bg-yellow-500/10 text-yellow-400 text-xs border-0 shrink-0">
                      +XP
                    </Badge>
                  </div>
                )) ?? (
                  <div className="text-center py-6 text-white/30">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-sm">Complete your first mission to unlock AI suggestions</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "actions" && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "📚", label: "Start a Course", desc: "Boost Knowledge score", href: "/sky-school", color: "blue" },
              { icon: "🗳️", label: "Vote on Proposal", desc: "Boost Influence score", href: "/governance", color: "purple" },
              { icon: "🚀", label: "Launch Mission", desc: "Boost Purpose score", href: "/mission-control", color: "emerald" },
              { icon: "💎", label: "Stake SKY444", desc: "Boost Wealth score", href: "/staking", color: "yellow" },
              { icon: "🤝", label: "Join Community", desc: "Boost Connection score", href: "/community", color: "pink" },
              { icon: "🏗️", label: "Build a Project", desc: "Boost Productivity score", href: "/venture-studio", color: "orange" },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/40 hover:bg-white/10 transition-all text-left"
                onClick={() => window.location.href = action.href}
              >
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <div className="font-semibold text-white">{action.label}</div>
                  <div className="text-xs text-white/40">{action.desc}</div>
                </div>
                <span className="ml-auto text-white/20">→</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                LIFE HISTORY — THE HISTORY OF YOU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-yellow-500/20" />
                <div className="space-y-4 pl-10">
                  {[
                    { date: "Today", event: "Life Command activated", icon: "⚡", type: "milestone" },
                    { date: "This week", event: "Joined MANIUS ecosystem", icon: "🌟", type: "join" },
                    { date: "Level " + level, event: `Reached level ${level}`, icon: "🏆", type: "level" },
                    { date: "Reputation", event: `Earned ${repScore} reputation points`, icon: "⭐", type: "rep" },
                  ].map((item, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs">
                        {item.icon}
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex-1">
                        <div className="text-xs text-yellow-500/60 mb-1">{item.date}</div>
                        <div className="text-sm text-white">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
