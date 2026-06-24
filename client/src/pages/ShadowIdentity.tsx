import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Eye, EyeOff, Ghost, User, Users, Globe, Shield, Star,
  TrendingUp, AlertTriangle, Heart, Zap, ChevronRight, Lock, Unlock
} from "lucide-react";

const MODES = [
  {
    id: "shadow",
    label: "Shadow Mode",
    icon: Ghost,
    color: "text-purple-400",
    bg: "bg-purple-950/40 border-purple-700",
    desc: "Fully anonymous. Your shadow_#### ID only. No avatar, no real name.",
  },
  {
    id: "semi",
    label: "Semi Mode",
    icon: EyeOff,
    color: "text-blue-400",
    bg: "bg-blue-950/40 border-blue-700",
    desc: "Display name shown, real identity hidden. Avatar optional.",
  },
  {
    id: "social",
    label: "Social Mode",
    icon: User,
    color: "text-green-400",
    bg: "bg-green-950/40 border-green-700",
    desc: "Display name and avatar visible. Real name hidden unless you reveal.",
  },
  {
    id: "public",
    label: "Public Mode",
    icon: Globe,
    color: "text-yellow-400",
    bg: "bg-yellow-950/40 border-yellow-700",
    desc: "Full identity visible. Real name, avatar, and profile public.",
  },
] as const;

const TIER_COLORS: Record<string, string> = {
  LEGENDARY: "text-yellow-400 border-yellow-400",
  TRUSTED: "text-green-400 border-green-400",
  ESTABLISHED: "text-blue-400 border-blue-400",
  RISING: "text-purple-400 border-purple-400",
  NEW: "text-gray-400 border-gray-400",
  RESTRICTED: "text-red-400 border-red-400",
};

export default function ShadowIdentity() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"identity" | "reputation" | "leaderboard">("identity");

  const { data: identity, refetch: refetchIdentity } = trpc.shadowIdentity.getMyIdentity.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: analysis } = trpc.shadowIdentity.getReputationAnalysis.useQuery(
    undefined,
    { enabled: !!user && activeTab === "reputation" }
  );
  const { data: leaderboard } = trpc.shadowIdentity.getReputationLeaderboard.useQuery(
    undefined,
    { enabled: activeTab === "leaderboard" }
  );

  const setModeMutation = trpc.shadowIdentity.setIdentityMode.useMutation({
    onSuccess: (data) => {
      toast.success(`Switched to ${data.mode} mode`);
      refetchIdentity();
    },
    onError: () => toast.error("Failed to switch mode"),
  });

  const toggleRevealMutation = trpc.shadowIdentity.toggleVerifiedReveal.useMutation({
    onSuccess: (data) => {
      toast.success(data.verifiedReveal ? "Identity revealed to verified users" : "Identity hidden");
      refetchIdentity();
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 p-8 text-center max-w-sm">
          <Ghost className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Shadow Identity</h2>
          <p className="text-gray-400 mb-4">Sign in to manage your anonymous identity</p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-purple-600 hover:bg-purple-700">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 to-black border-b border-purple-800/50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Ghost className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">Shadow Identity</h1>
            {identity && (
              <Badge className={`border ${TIER_COLORS[identity.reputationTier] ?? "text-gray-400 border-gray-400"} bg-transparent text-xs`}>
                {identity.reputationTier}
              </Badge>
            )}
          </div>
          {identity && (
            <p className="text-purple-300 font-mono text-sm">{identity.shadowId}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-4">
        <div className="max-w-4xl mx-auto flex gap-6">
          {(["identity", "reputation", "leaderboard"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* IDENTITY TAB */}
        {activeTab === "identity" && identity && (
          <>
            {/* Current Mode */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Current Identity Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = identity.identityMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setModeMutation.mutate({ mode: mode.id })}
                      disabled={setModeMutation.isPending}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                        isActive ? mode.bg : "border-gray-700 hover:border-gray-500 bg-gray-800/50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? mode.color : "text-gray-500"}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-400"}`}>
                          {mode.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{mode.desc}</div>
                      </div>
                      {isActive && (
                        <Badge className="bg-purple-600 text-white text-xs">Active</Badge>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Verified Reveal Toggle */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {identity.verifiedReveal ? (
                    <Unlock className="w-5 h-5 text-green-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="text-white font-medium text-sm">Verified Reveal</div>
                    <div className="text-gray-500 text-xs">
                      {identity.verifiedReveal
                        ? "Verified users can see your real identity"
                        : "Your real identity is hidden from everyone"}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRevealMutation.mutate()}
                  disabled={toggleRevealMutation.isPending}
                  className={`border-gray-600 text-sm ${identity.verifiedReveal ? "text-green-400" : "text-gray-400"}`}
                >
                  {identity.verifiedReveal ? "Revealed" : "Hidden"}
                </Button>
              </CardContent>
            </Card>

            {/* Score Overview */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Reputation Scores</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[
                  { label: "Behavior", value: identity.scores.behavior, icon: Heart, color: "text-green-400" },
                  { label: "Contribution", value: identity.scores.contribution, icon: Star, color: "text-yellow-400" },
                  { label: "Reliability", value: identity.scores.reliability, icon: Shield, color: "text-blue-400" },
                  { label: "Toxicity", value: identity.scores.toxicity, icon: AlertTriangle, color: "text-red-400", inverted: true },
                ].map((score) => {
                  const Icon = score.icon;
                  const displayValue = score.inverted ? 100 - score.value : score.value;
                  return (
                    <div key={score.label} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${score.color}`} />
                        <span className="text-gray-400 text-xs">{score.label}</span>
                      </div>
                      <div className={`text-2xl font-bold ${score.color}`}>{score.value}</div>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                        <div
                          className={`h-1 rounded-full ${score.inverted ? "bg-red-500" : "bg-green-500"}`}
                          style={{ width: `${score.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Display Preview */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base">How Others See You</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                {identity.displayAvatar ? (
                  <img src={identity.displayAvatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center">
                    <Ghost className="w-6 h-6 text-purple-300" />
                  </div>
                )}
                <div>
                  <div className="text-white font-semibold">{identity.displayName}</div>
                  <div className="text-gray-400 text-xs font-mono">{identity.shadowId}</div>
                  <Badge className={`border ${TIER_COLORS[identity.reputationTier] ?? ""} bg-transparent text-xs mt-1`}>
                    {identity.reputationTier}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* REPUTATION TAB */}
        {activeTab === "reputation" && (
          <>
            {analysis ? (
              <>
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      AI Reputation Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-lg font-bold mb-2 ${TIER_COLORS[analysis.tier] ?? "text-gray-400"}`}>
                      {analysis.tier}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{analysis.insight}</p>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(analysis.scores).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm w-24 capitalize">{key}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${key === "toxicity" ? "bg-red-500" : "bg-purple-500"}`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        <span className="text-white text-sm w-8 text-right">{val}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">Loading reputation analysis...</div>
            )}
          </>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                Top Reputation Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((entry, i) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-yellow-500 text-black" :
                      i === 1 ? "bg-gray-400 text-black" :
                      i === 2 ? "bg-orange-600 text-white" :
                      "bg-gray-700 text-gray-300"
                    }`}>
                      {i + 1}
                    </div>
                    {entry.displayAvatar ? (
                      <img src={entry.displayAvatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center">
                        <Ghost className="w-4 h-4 text-purple-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{entry.displayName}</div>
                      <div className="text-gray-500 text-xs font-mono">{entry.shadowId}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${TIER_COLORS[entry.reputationTier]?.split(" ")[0] ?? "text-gray-400"}`}>
                        {entry.composite}
                      </div>
                      <div className="text-gray-500 text-xs">{entry.reputationTier}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No reputation data yet. Be the first to build yours!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
