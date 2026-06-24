/**
 * EntityProfile — Profile as Floating Entity Node
 * Profiles are not pages. They are entities in the system.
 * Hover reveals intelligence: behavior score, earnings, AI summary,
 * dating compatibility index, trust overlay, reputation graph.
 */
import { useState } from "react";
import { Brain, Shield, TrendingUp, Heart, Star, Zap, MessageCircle, UserPlus, DollarSign, Activity, Eye, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mini sparkline component using SVG
function Sparkline({ data, color = "#a855f7" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Circular score ring
function ScoreRing({ score, color, label, size = 64 }: { score: number; color: string; label: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center -mt-12">
        <div className="text-base font-bold" style={{ color }}>{score}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-8">{label}</div>
    </div>
  );
}

const ENTITY_DATA = {
  name: "Skyler Blue",
  username: "@skylerblue",
  role: "Software Engineer · Creator",
  bio: "Building the AI-native OS for digital life. Founder of ShadowChat.",
  avatar: "S",
  avatarColor: "from-purple-500 to-cyan-500",
  isVerified: true,
  isPremium: true,
  joinedDaysAgo: 142,
  // Intelligence scores
  trustScore: 94,
  behaviorScore: 88,
  reputationScore: 91,
  datingCompatibility: 87,
  // Earnings
  totalEarnings: 12840,
  earningsThisMonth: 2340,
  earningsTrend: [800, 950, 1100, 980, 1200, 1450, 1800, 2100, 2340],
  // Activity
  postsCount: 847,
  followersCount: 12400,
  followingCount: 340,
  actionsCompleted: 1240,
  // Behavior signals
  behaviorSignals: [
    { label: "Payment reliability", score: 98, icon: DollarSign, color: "#22c55e" },
    { label: "Response rate", score: 94, icon: MessageCircle, color: "#3b82f6" },
    { label: "Content quality", score: 89, icon: Star, color: "#f59e0b" },
    { label: "Action success rate", score: 91, icon: Zap, color: "#a855f7" },
  ],
  // AI summary
  aiSummary: "High-value creator and builder. Consistent payment behavior, strong community engagement. Top 2% of platform users by trust score. Specializes in AI + Web3 content.",
  // Trust layers
  trustLayers: [
    { label: "Identity verified", status: true },
    { label: "Payment history clean", status: true },
    { label: "No reports", status: true },
    { label: "AI behavior normal", status: true },
    { label: "Wallet linked", status: true },
  ],
  // Recent actions
  recentActions: [
    { type: "PAYMENT", desc: "Paid $45 for logo design", time: "2h ago", status: "completed" },
    { type: "TIP", desc: "Tipped $10 to NOVA", time: "5h ago", status: "completed" },
    { type: "HIRE", desc: "Hired AI agent for market analysis", time: "1d ago", status: "completed" },
  ],
};

export default function EntityProfile() {
  const [activeTab, setActiveTab] = useState<"overview" | "intelligence" | "earnings" | "actions">("overview");
  const [showAIPanel, setShowAIPanel] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-4">
      {/* Entity card — the "node" */}
      <div className="relative card overflow-hidden">
        {/* Background energy field */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

        <div className="relative p-5">
          {/* Avatar + identity */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ENTITY_DATA.avatarColor} flex items-center justify-center text-2xl font-bold text-white`}>
                {ENTITY_DATA.avatar}
              </div>
              {/* Trust ring */}
              <div className="absolute -inset-1 rounded-2xl ring-2 ring-purple-500/40 pointer-events-none" />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold">{ENTITY_DATA.name}</h1>
                {ENTITY_DATA.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
                {ENTITY_DATA.isPremium && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>
              <p className="text-xs text-muted-foreground">{ENTITY_DATA.username}</p>
              <p className="text-xs text-purple-400">{ENTITY_DATA.role}</p>
            </div>
            {/* Trust score badge */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{ENTITY_DATA.trustScore}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5">trust</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{ENTITY_DATA.bio}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Posts", value: ENTITY_DATA.postsCount.toLocaleString() },
              { label: "Followers", value: `${(ENTITY_DATA.followersCount / 1000).toFixed(1)}K` },
              { label: "Earned", value: `$${(ENTITY_DATA.totalEarnings / 1000).toFixed(1)}K` },
              { label: "Actions", value: ENTITY_DATA.actionsCompleted.toLocaleString() },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-bold text-sm">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 gap-2 text-sm">
              <UserPlus className="w-4 h-4" />
              Follow
            </Button>
            <Button variant="outline" className="flex-1 gap-2 text-sm" onClick={() => toast("Opening chat...")}>
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${showAIPanel ? "border-purple-500 text-purple-400" : ""}`}
              onClick={() => setShowAIPanel(!showAIPanel)}
            >
              <Brain className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Intelligence Panel — hover panel equivalent */}
      {showAIPanel && (
        <div className="card p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">AI Intelligence Panel</span>
          </div>
          <p className="text-xs text-muted-foreground">{ENTITY_DATA.aiSummary}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-background/50">
              <div className="text-muted-foreground">Dating Compatibility</div>
              <div className="font-bold text-pink-400">{ENTITY_DATA.datingCompatibility}% match</div>
            </div>
            <div className="p-2 rounded-lg bg-background/50">
              <div className="text-muted-foreground">Behavior Score</div>
              <div className="font-bold text-green-400">{ENTITY_DATA.behaviorScore}/100</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
        {(["overview", "intelligence", "earnings", "actions"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          {/* Score rings */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Entity Scores</h3>
            <div className="flex justify-around">
              <ScoreRing score={ENTITY_DATA.trustScore} color="#22c55e" label="Trust" />
              <ScoreRing score={ENTITY_DATA.behaviorScore} color="#a855f7" label="Behavior" />
              <ScoreRing score={ENTITY_DATA.reputationScore} color="#3b82f6" label="Reputation" />
              <ScoreRing score={ENTITY_DATA.datingCompatibility} color="#ec4899" label="Match" />
            </div>
          </div>

          {/* Trust layers */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trust Overlay</h3>
            <div className="space-y-2">
              {ENTITY_DATA.trustLayers.map(layer => (
                <div key={layer.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${layer.status ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={layer.status ? "text-foreground" : "text-muted-foreground"}>{layer.label}</span>
                  <span className="ml-auto text-muted-foreground">{layer.status ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Intelligence tab */}
      {activeTab === "intelligence" && (
        <div className="space-y-3">
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Behavior Signals</h3>
            <div className="space-y-3">
              {ENTITY_DATA.behaviorSignals.map(signal => {
                const SigIcon = signal.icon;
                return (
                  <div key={signal.label}>
                    <div className="flex items-center gap-2 mb-1">
                      <SigIcon className="w-3.5 h-3.5" style={{ color: signal.color }} />
                      <span className="text-xs font-medium">{signal.label}</span>
                      <span className="ml-auto text-xs font-bold" style={{ color: signal.color }}>{signal.score}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${signal.score}%`, backgroundColor: signal.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Summary</h3>
            <p className="text-sm text-muted-foreground">{ENTITY_DATA.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Earnings tab */}
      {activeTab === "earnings" && (
        <div className="space-y-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-bold">${ENTITY_DATA.earningsThisMonth.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-400">+18.4%</div>
                <div className="text-xs text-muted-foreground">vs last month</div>
              </div>
            </div>
            <Sparkline data={ENTITY_DATA.earningsTrend} color="#a855f7" />
            <div className="text-xs text-muted-foreground mt-1">9-month earnings trend</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Total earned", value: `$${ENTITY_DATA.totalEarnings.toLocaleString()}`, color: "text-green-400" },
              { label: "Actions completed", value: ENTITY_DATA.actionsCompleted.toLocaleString(), color: "text-purple-400" },
              { label: "Avg per action", value: `$${(ENTITY_DATA.totalEarnings / ENTITY_DATA.actionsCompleted).toFixed(2)}`, color: "text-blue-400" },
              { label: "Member for", value: `${ENTITY_DATA.joinedDaysAgo}d`, color: "text-cyan-400" },
            ].map(stat => (
              <div key={stat.label} className="card p-3">
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions tab */}
      {activeTab === "actions" && (
        <div className="space-y-2">
          {ENTITY_DATA.recentActions.map((action, idx) => (
            <div key={idx} className="card p-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${action.type === "PAYMENT" ? "bg-green-500/20 text-green-400" : action.type === "TIP" ? "bg-pink-500/20 text-pink-400" : "bg-purple-500/20 text-purple-400"}`}>
                {action.type === "PAYMENT" ? "$" : action.type === "TIP" ? "♥" : "⚡"}
              </div>
              <div className="flex-1">
                <div className="text-sm">{action.desc}</div>
                <div className="text-xs text-muted-foreground">{action.time}</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs">{action.status}</Badge>
            </div>
          ))}
          <Button variant="outline" className="w-full text-sm gap-2" onClick={() => toast("Loading full action history...")}>
            <Activity className="w-4 h-4" />
            View full history
          </Button>
        </div>
      )}
    </div>
  );
}
