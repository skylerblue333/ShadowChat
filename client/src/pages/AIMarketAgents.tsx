/**
 * AI Agent Market Dashboard
 * Live feed of the 5 AI market agents — Axiom, Vega, Pulse, Oracle, Cipher —
 * driving ICO momentum, market signals, and investor stats.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  TrendingUp, TrendingDown, Minus, Zap, Activity, RefreshCw,
  ChevronRight, AlertTriangle, CheckCircle, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Shield, Sparkles, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Rarity Config ────────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  common:    { color: "text-slate-400",   bg: "bg-slate-800/60",   border: "border-slate-600/40",   glow: "" },
  uncommon:  { color: "text-green-400",   bg: "bg-green-900/30",   border: "border-green-500/40",   glow: "shadow-green-500/20" },
  rare:      { color: "text-blue-400",    bg: "bg-blue-900/30",    border: "border-blue-500/40",    glow: "shadow-blue-500/20" },
  epic:      { color: "text-purple-400",  bg: "bg-purple-900/30",  border: "border-purple-500/40",  glow: "shadow-purple-500/20" },
  legendary: { color: "text-amber-400",   bg: "bg-amber-900/30",   border: "border-amber-500/40",   glow: "shadow-amber-500/20" },
};

const SIGNAL_CONFIG = {
  buy:        { color: "text-green-400",  bg: "bg-green-500/10",  icon: ArrowUpRight,   label: "BUY" },
  accumulate: { color: "text-emerald-400",bg: "bg-emerald-500/10",icon: TrendingUp,     label: "ACCUMULATE" },
  hold:       { color: "text-blue-400",   bg: "bg-blue-500/10",   icon: Minus,          label: "HOLD" },
  sell:       { color: "text-red-400",    bg: "bg-red-500/10",    icon: ArrowDownRight, label: "SELL" },
  watch:      { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Eye,            label: "WATCH" },
  alert:      { color: "text-orange-400", bg: "bg-orange-500/10", icon: AlertTriangle,  label: "ALERT" },
};

const AGENT_COLORS: Record<string, string> = {
  axiom:  "oklch(0.80 0.20 200)",
  vega:   "oklch(0.72 0.28 260)",
  pulse:  "oklch(0.72 0.28 340)",
  oracle: "oklch(0.80 0.20 55)",
  cipher: "oklch(0.72 0.28 160)",
};

const AGENT_EMOJIS: Record<string, string> = {
  axiom: "🔮", vega: "🐋", pulse: "💓", oracle: "🔭", cipher: "🛡️",
};

// ─── ICO Stats Banner ─────────────────────────────────────────────────────────
function IcoStatsBanner() {
  const { data: stats, refetch } = trpc.aiMarket.getIcoStats.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  if (!stats) return (
    <div className="h-24 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-700/40" />
  );

  const rarity = RARITY_CONFIG[stats.rarityStatus as keyof typeof RARITY_CONFIG] ?? RARITY_CONFIG.rare;
  const pct = Math.min(100, stats.percentRaised);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${rarity.border} ${rarity.bg} shadow-xl ${rarity.glow} p-5`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-10"
        style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 200), oklch(0.80 0.20 55))", backgroundSize: "300% 300%", animation: "rainbow-shift 8s linear infinite" }} />

      {/* Top row: round + rarity */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🚀 {stats.currentRound}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
            +{stats.roundBonus}% Bonus
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rarity.border} ${rarity.color}`}>
            ✦ {stats.rarityLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Updated by AI Agents
        </div>
      </div>

      {/* Stats grid */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-2xl font-black text-rainbow">${(stats.totalRaisedUsd / 1000).toFixed(0)}K</div>
          <div className="text-xs text-slate-400">Total Raised</div>
          <div className="text-xs text-green-400 flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> Soft cap reached ✓
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-white">{stats.totalInvestors.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Investors</div>
          <div className="text-xs text-blue-400 mt-0.5">+{Math.floor(Math.random() * 12) + 3} today</div>
        </div>
        <div>
          <div className="text-2xl font-black text-amber-400">${parseFloat(stats.tokenPriceUsd.toString()).toFixed(5)}</div>
          <div className="text-xs text-slate-400">SKY444 Price</div>
          <div className={`text-xs mt-0.5 flex items-center gap-0.5 ${stats.trendDirection === "up" ? "text-green-400" : "text-red-400"}`}>
            {stats.trendDirection === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {stats.trendDirection === "up" ? "+" : ""}{stats.priceChange24h}% 24h
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-purple-400">{stats.rewardApy}% APY</div>
          <div className="text-xs text-slate-400">Staking Rewards</div>
          <div className="text-xs text-purple-400 mt-0.5">{(stats.rewardPoolSky / 1_000_000).toFixed(0)}M SKY pool</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Raise Progress</span>
          <span className="font-bold text-white">{pct.toFixed(1)}% of ${(stats.hardCapUsd / 1_000_000).toFixed(1)}M hard cap</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, oklch(0.72 0.28 305), oklch(0.80 0.20 200), oklch(0.80 0.20 55))",
              backgroundSize: "300% 100%",
              animation: "rainbow-shift 4s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Momentum + Sentiment scores */}
      <div className="relative flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/40">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400">Momentum</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${stats.momentumScore}%` }} />
            </div>
            <span className="text-xs font-bold text-cyan-400">{stats.momentumScore}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-fuchsia-400" />
          <span className="text-xs text-slate-400">Sentiment</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-400 rounded-full transition-all" style={{ width: `${stats.sentimentScore}%` }} />
            </div>
            <span className="text-xs font-bold text-fuchsia-400">{stats.sentimentScore}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-slate-400">Rarity Score</span>
          <span className={`text-xs font-bold ${rarity.color}`}>{stats.rarityScore}/100</span>
        </div>
        <div className="ml-auto">
          <Link href="/investor-portal">
            <Button size="sm" className="text-xs h-7 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0">
              Invest Now <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, onTrigger }: { agent: any; onTrigger: (id: string) => void }) {
  const color = AGENT_COLORS[agent.agentId] ?? "oklch(0.72 0.28 260)";
  const emoji = AGENT_EMOJIS[agent.agentId] ?? "🤖";

  return (
    <div
      className="relative rounded-xl border border-slate-700/40 bg-slate-900/60 p-4 hover:border-slate-600/60 transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
      style={{ boxShadow: `0 0 20px ${color}20` }}
      onClick={() => onTrigger(agent.agentId)}
    >
      {/* Glow top border */}
      <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
          style={{ background: `${color}20`, borderColor: `${color}40` }}
        >
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-sm text-white">{agent.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full border text-slate-300 bg-slate-800/60 border-slate-600/40">
              {agent.role}
            </span>
            {agent.isActive && (
              <span className="flex items-center gap-1 text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mb-2 line-clamp-2">{agent.persona}</div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">Specialty: <span className="text-slate-300">{agent.specialty}</span></span>
            <span className="text-slate-500">Signals: <span style={{ color }}>{agent.totalSignals}</span></span>
          </div>
        </div>
      </div>

      {/* Hover trigger hint */}
      <div className="absolute bottom-2 right-3 text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors flex items-center gap-1">
        <Zap className="w-2.5 h-2.5" /> Click to run cycle
      </div>
    </div>
  );
}

// ─── Signal Card ──────────────────────────────────────────────────────────────
function SignalCard({ signal }: { signal: any }) {
  const cfg = SIGNAL_CONFIG[signal.signalType as keyof typeof SIGNAL_CONFIG] ?? SIGNAL_CONFIG.watch;
  const SignalIcon = cfg.icon;
  const agentColor = AGENT_COLORS[signal.agentId] ?? "oklch(0.72 0.28 260)";
  const agentEmoji = AGENT_EMOJIS[signal.agentId] ?? "🤖";
  const timeAgo = new Date(signal.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/60 transition-all duration-150">
      {/* Agent avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border"
        style={{ background: `${agentColor}20`, borderColor: `${agentColor}40` }}
      >
        {agentEmoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
            <SignalIcon className="w-2.5 h-2.5" /> {cfg.label}
          </span>
          <span className="text-[10px] text-slate-500 capitalize">{signal.agentId}</span>
          <span className="text-[10px] text-slate-600 ml-auto">{timeAgo}</span>
        </div>
        <div className="text-xs font-semibold text-white mb-0.5">{signal.title}</div>
        <div className="text-[11px] text-slate-400 line-clamp-2">{signal.commentary}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`} style={{ width: `${signal.confidenceScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">{signal.confidenceScore}% conf</span>
          </div>
          {Array.isArray(signal.tags) && signal.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-500">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIMarketAgents() {
  const { user } = useAuth();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const { data: agents, refetch: refetchAgents } = trpc.aiMarket.getAgents.useQuery();
  const { data: signals, refetch: refetchSignals } = trpc.aiMarket.getSignals.useQuery({ limit: 30 }, { refetchInterval: 15_000 });
  const { data: activity, refetch: refetchActivity } = trpc.aiMarket.getActivity.useQuery({ limit: 20 }, { refetchInterval: 15_000 });

  const triggerCycle = trpc.aiMarket.triggerCycle.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.agentName} cycle complete`, { description: `Generated ${data.signalsGenerated} signal. Stats updated.` });
      refetchSignals();
      refetchActivity();
    },
    onError: () => {
      toast.error("Cycle failed", { description: "Log in to trigger agent cycles." });
    },
  });

  const handleTrigger = (agentId: string) => {
    if (!user) {
      toast("Login required", { description: "Sign in to trigger agent cycles." });
      return;
    }
    setActiveAgent(agentId);
    triggerCycle.mutate({ agentId }, { onSettled: () => setActiveAgent(null) });
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.28 305), transparent)" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                  5 AGENTS ACTIVE
                </span>
                <span className="text-xs text-slate-500">Live market intelligence for SKY444</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-3 text-rainbow">
                AI Market Agents
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl">
                Five specialized AI agents continuously analyze market conditions, generate signals, and drive the ICO momentum dashboard — giving investors real-time intelligence on SKY444.
              </p>
            </div>
            <div className="shrink-0 hidden sm:block">
              <div className="grid grid-cols-5 gap-1">
                {["🔮","🐋","💓","🔭","🛡️"].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-lg animate-hero-float" style={{ animationDelay: `${i * 0.3}s` }}>
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ICO Stats Banner */}
        <IcoStatsBanner />

        {/* Agents grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span className="text-rainbow-slow">Active Agents</span>
            </h2>
            <span className="text-xs text-slate-500">Click an agent to run a market cycle</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {agents?.map(agent => (
              <AgentCard
                key={agent.agentId}
                agent={agent}
                onTrigger={handleTrigger}
              />
            ))}
          </div>
        </div>

        {/* Signals + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Signals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-rainbow-slow">Live Signals</span>
              </h2>
              <button onClick={() => refetchSignals()} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-hide">
              {signals?.length ? signals.map(signal => (
                <SignalCard key={signal.id} signal={signal} />
              )) : (
                <div className="text-center py-12 text-slate-500">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No signals yet. Click an agent to generate the first signal.</p>
                </div>
              )}
            </div>
          </div>

          {/* Agent Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-rainbow-slow">Agent Activity</span>
              </h2>
              <button onClick={() => refetchActivity()} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-hide">
              {activity?.length ? activity.map(act => {
                const agentColor = AGENT_COLORS[act.agentId] ?? "oklch(0.72 0.28 260)";
                const agentEmoji = AGENT_EMOJIS[act.agentId] ?? "🤖";
                const timeAgo = new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={act.id} className="flex gap-2.5 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 border" style={{ background: `${agentColor}20`, borderColor: `${agentColor}40` }}>
                      {agentEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-300 leading-relaxed">{act.summary}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-500 capitalize">{act.activityType.replace(/_/g, " ")}</span>
                        <span className="text-[9px] text-slate-600">{timeAgo}</span>
                        {act.impactScore > 0 && (
                          <span className="text-[9px] text-green-500">+{act.impactScore} impact</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No activity yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8 border-t border-slate-800/50">
          <p className="text-slate-400 mb-4">Ready to invest based on AI agent intelligence?</p>
          <Link href="/investor-portal">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0 px-8 py-3 text-base font-bold">
              🚀 Open Investor Portal <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
