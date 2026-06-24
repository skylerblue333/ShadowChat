/**
 * DefensibilityMoat — Phase 18 Defensibility & Platform Moat
 * Data moat, action lock-in, creator lock-in, AI personalization moat, network effects
 */
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Database, Brain, TrendingUp, Users, Layers, Zap, Star } from "lucide-react";

const MOAT_LAYERS = [
  {
    rank: 1,
    title: "Data Moat",
    icon: Database,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    desc: "Every interaction trains the AI uniquely to this ecosystem. Competitors can copy features — not 9M+ labeled interaction samples.",
    strength: 95,
  },
  {
    rank: 2,
    title: "Action Lock-in",
    icon: Lock,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    desc: "Users build payment history, wallet balances, saved workflows, and transaction records inside the platform. Leaving means losing all of it.",
    strength: 88,
  },
  {
    rank: 3,
    title: "Creator Economic Lock-in",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    desc: "Creators build audiences, income streams, AI agents, and digital products here. Switching cost: lose income + audience + tools simultaneously.",
    strength: 92,
  },
  {
    rank: 4,
    title: "AI Personalization Moat",
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    desc: "The AI becomes uniquely tuned to each user's behavior, preferences, and action patterns. No generic AI can replicate this instantly.",
    strength: 85,
  },
  {
    rank: 5,
    title: "Network Effect Lock",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-500/10",
    desc: "More users = better matches, more marketplace liquidity, more AI training data, better recommendations. Growth improves product quality.",
    strength: 78,
  },
  {
    rank: 6,
    title: "Workflow Lock-in",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    desc: "Users build habits: recurring payments, saved actions, repeat AI commands, daily chat interactions. The platform becomes part of daily workflow.",
    strength: 82,
  },
  {
    rank: 7,
    title: "Platform Extension Layer",
    icon: Layers,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    desc: "External APIs, developer tools, agent plugins, third-party integrations. Others build on top of you — deepening the ecosystem.",
    strength: 65,
  },
  {
    rank: 8,
    title: "Economic System Lock-in",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    desc: "Credits, wallet balances, staking rewards, earned tokens. Moving away becomes financially inconvenient — users have skin in the game.",
    strength: 80,
  },
];

export default function DefensibilityMoat() {
  const avgStrength = Math.round(MOAT_LAYERS.reduce((s, m) => s + m.strength, 0) / MOAT_LAYERS.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Defensibility & Moat
          </h1>
          <p className="text-xs text-muted-foreground">Why we win long-term — Phase 18</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-bold text-primary">{avgStrength}/100</div>
          <div className="text-xs text-muted-foreground">Moat Score</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Positioning */}
        <div className="card p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="font-bold text-sm mb-2">Platform Positioning</h3>
          <p className="text-sm text-foreground font-medium mb-1">"The execution layer for digital life."</p>
          <p className="text-xs text-muted-foreground">Not a chat app. Not a social app. Not an AI tool. A controlled execution network with trust, money, and identity.</p>
        </div>

        {/* YC Reality Check */}
        <div className="grid grid-cols-2 gap-2">
          <div className="card p-3 bg-red-500/5 border border-red-500/20">
            <div className="text-xs font-bold text-red-400 mb-2">YC won't fund</div>
            {["Complexity", "Feature-heavy apps", "AI demos without safety", "Social without moderation"].map(x => (
              <div key={x} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <span className="text-red-400">✗</span> {x}
              </div>
            ))}
          </div>
          <div className="card p-3 bg-green-500/5 border border-green-500/20">
            <div className="text-xs font-bold text-green-400 mb-2">YC funds</div>
            {["Controlled systems", "Safe financial flows", "Scalable architecture", "Predictable failure handling"].map(x => (
              <div key={x} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <span className="text-green-400">✓</span> {x}
              </div>
            ))}
          </div>
        </div>

        {/* Moat Layers */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">8 Moat Layers</h3>
          {MOAT_LAYERS.map(m => (
            <div key={m.rank} className={`card p-4 border-l-2 ${m.color.replace("text-", "border-")}`}>
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{m.title}</span>
                    <span className={`text-xs font-bold ${m.color}`}>{m.strength}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                </div>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.color.replace("text-", "bg-")}`} style={{ width: `${m.strength}%`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
