/**
 * ReputationSystem — Phase 9 Social Reputation Engine
 * Creator scores, social proof, trust signals, leaderboards
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Star, TrendingUp, Award, Users, Zap, Shield } from "lucide-react";

const TOP_CREATORS = [
  { rank: 1, name: "skyler.eth", score: 9840, badge: "Elite Creator", change: "+120", avatar: "S" },
  { rank: 2, name: "nova_builds", score: 9210, badge: "Top Builder", change: "+85", avatar: "N" },
  { rank: 3, name: "crypto_alice", score: 8750, badge: "Verified Pro", change: "+64", avatar: "C" },
  { rank: 4, name: "dev_marcus", score: 8120, badge: "Power User", change: "+42", avatar: "D" },
  { rank: 5, name: "luna_creates", score: 7890, badge: "Rising Star", change: "+98", avatar: "L" },
];

const REPUTATION_FACTORS = [
  { factor: "Content quality", weight: 25, icon: Star, color: "text-yellow-400" },
  { factor: "Community engagement", weight: 20, icon: Users, color: "text-blue-400" },
  { factor: "Transaction success", weight: 20, icon: Zap, color: "text-green-400" },
  { factor: "Trust score", weight: 20, icon: Shield, color: "text-purple-400" },
  { factor: "Creator earnings", weight: 15, icon: TrendingUp, color: "text-pink-400" },
];

export default function ReputationSystem() {
  const [tab, setTab] = useState<"leaderboard" | "factors" | "badges">("leaderboard");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Reputation System
          </h1>
          <p className="text-xs text-muted-foreground">Social proof engine — Phase 9</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["leaderboard", "factors", "badges"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "leaderboard" && (
          <div className="space-y-2">
            {TOP_CREATORS.map(c => (
              <div key={c.rank} className="card p-4 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${c.rank === 1 ? "bg-yellow-500/20 text-yellow-400" : c.rank === 2 ? "bg-gray-500/20 text-gray-400" : c.rank === 3 ? "bg-orange-500/20 text-orange-400" : "bg-secondary text-muted-foreground"}`}>
                  {c.rank}
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.badge}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{c.score.toLocaleString()}</div>
                  <div className="text-xs text-green-400">{c.change} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "factors" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Reputation is calculated from multiple weighted signals.</p>
            {REPUTATION_FACTORS.map(f => (
              <div key={f.factor} className="card p-4 flex items-center gap-3">
                <f.icon className={`w-5 h-5 ${f.color} shrink-0`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{f.factor}</div>
                  <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${f.weight * 4}%` }} />
                  </div>
                </div>
                <div className="text-sm font-bold text-primary">{f.weight}%</div>
              </div>
            ))}
          </div>
        )}

        {tab === "badges" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Elite Creator", desc: "Top 1% creator", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "👑" },
              { name: "Verified Pro", desc: "Identity verified", color: "text-blue-400", bg: "bg-blue-500/10", icon: "✓" },
              { name: "Power Trader", desc: "100+ transactions", color: "text-green-400", bg: "bg-green-500/10", icon: "⚡" },
              { name: "Community Pillar", desc: "High engagement", color: "text-purple-400", bg: "bg-purple-500/10", icon: "🏛️" },
              { name: "Rising Star", desc: "Fast growing", color: "text-pink-400", bg: "bg-pink-500/10", icon: "⭐" },
              { name: "AI Pioneer", desc: "Early AI adopter", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "🤖" },
            ].map(b => (
              <div key={b.name} className={`card p-4 ${b.bg} border border-border/30`}>
                <div className="text-2xl mb-2">{b.icon}</div>
                <div className={`font-bold text-sm ${b.color}`}>{b.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
