import { useState } from "react";
import { Link } from "wouter";
import { Award, Star, Zap, Shield, Trophy, Users, Wallet, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ACHIEVEMENTS = [
  // Social
  { id: "first-post",      cat: "Social",  icon: "✍️",  title: "First Post",           desc: "Publish your first post",                     xp: 50,   reward: "50 SKY",  unlocked: true,  progress: 1,   max: 1   },
  { id: "social-butterfly",cat: "Social",  icon: "🦋",  title: "Social Butterfly",     desc: "Get 100 followers",                           xp: 200,  reward: "200 SKY", unlocked: true,  progress: 100, max: 100 },
  { id: "viral-post",      cat: "Social",  icon: "🔥",  title: "Viral Post",           desc: "Get 1,000 likes on a single post",            xp: 500,  reward: "500 SKY", unlocked: false, progress: 234, max: 1000},
  { id: "community-leader",cat: "Social",  icon: "👑",  title: "Community Leader",     desc: "Create a community with 500+ members",        xp: 1000, reward: "1K SKY",  unlocked: false, progress: 0,   max: 500 },
  // Crypto
  { id: "first-stake",     cat: "Crypto",  icon: "💎",  title: "First Stake",          desc: "Stake SKY444 tokens for the first time",      xp: 100,  reward: "100 SKY", unlocked: true,  progress: 1,   max: 1   },
  { id: "diamond-hands",   cat: "Crypto",  icon: "🙌",  title: "Diamond Hands",        desc: "Hold SKY444 for 30 consecutive days",         xp: 300,  reward: "300 SKY", unlocked: false, progress: 12,  max: 30  },
  { id: "whale",           cat: "Crypto",  icon: "🐋",  title: "Whale",                desc: "Hold 1,000,000+ SKY444 tokens",               xp: 2000, reward: "2K SKY",  unlocked: false, progress: 50000, max: 1000000 },
  { id: "defi-explorer",   cat: "Crypto",  icon: "🌊",  title: "DeFi Explorer",        desc: "Use 3 different DeFi protocols",              xp: 400,  reward: "400 SKY", unlocked: false, progress: 1,   max: 3   },
  // Creator
  { id: "content-creator", cat: "Creator", icon: "🎨",  title: "Content Creator",      desc: "Publish 50 posts",                            xp: 300,  reward: "300 SKY", unlocked: false, progress: 23,  max: 50  },
  { id: "streamer",        cat: "Creator", icon: "📺",  title: "Streamer",             desc: "Complete your first live stream",             xp: 200,  reward: "200 SKY", unlocked: true,  progress: 1,   max: 1   },
  { id: "top-creator",     cat: "Creator", icon: "⭐",  title: "Top Creator",          desc: "Reach Top 100 on the Creator Leaderboard",   xp: 1500, reward: "1.5K SKY",unlocked: false, progress: 0,   max: 1   },
  // Platform
  { id: "early-adopter",   cat: "Platform",icon: "🚀",  title: "Early Adopter",        desc: "Join during the beta period",                 xp: 500,  reward: "500 SKY", unlocked: true,  progress: 1,   max: 1   },
  { id: "verified",        cat: "Platform",icon: "✅",  title: "Verified",             desc: "Complete identity verification",              xp: 200,  reward: "200 SKY", unlocked: false, progress: 0,   max: 1   },
  { id: "referral-king",   cat: "Platform",icon: "🎯",  title: "Referral King",        desc: "Refer 10 users who sign up",                  xp: 600,  reward: "600 SKY", unlocked: false, progress: 3,   max: 10  },
];

const CATEGORIES = ["All", "Social", "Crypto", "Creator", "Platform"];

export default function Achievements() {
  const [cat, setCat] = useState("All");
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  const filtered = ACHIEVEMENTS.filter(a => cat === "All" || a.cat === cat);
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalXP = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.xp, 0);

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/profile"
        icon={Award}
        title="Achievements"
        subtitle="Earn XP and SKY444 rewards by completing platform milestones"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Trophy} label="Unlocked" value={`${unlocked}/${ACHIEVEMENTS.length}`} color="warning" />
        <StatCard icon={Zap} label="Total XP" value={totalXP.toLocaleString()} color="primary" />
        <StatCard icon={Star} label="Completion" value={`${Math.round(unlocked / ACHIEVEMENTS.length * 100)}%`} color="success" />
        <StatCard icon={Wallet} label="Rewards Earned" value="1.1K SKY" color="accent" />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97] ${
              cat === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-slate-700/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Achievements grid — 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(a => {
          const pct = Math.min((a.progress / a.max) * 100, 100);
          const canClaim = a.unlocked && !claimed.has(a.id);
          return (
            <div
              key={a.id}
              className={`card p-4 transition-all ${
                a.unlocked
                  ? "border-yellow-500/20 bg-yellow-500/5"
                  : "opacity-80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  a.unlocked ? "bg-yellow-500/20" : "bg-secondary/50"
                }`}>
                  {a.unlocked ? a.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{a.title}</span>
                    {a.unlocked && <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-purple-400 font-medium">+{a.xp} XP</span>
                    <span className="text-xs text-yellow-400 font-medium">{a.reward}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">{a.cat}</Badge>
                  </div>
                  {!a.unlocked && a.max > 1 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{a.progress.toLocaleString()} / {a.max.toLocaleString()}</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                  {canClaim && (
                    <button
                      onClick={() => setClaimed(prev => new Set([...prev, a.id]))}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95 transition-all"
                    >
                      <Zap className="w-3 h-3" /> Claim Reward
                    </button>
                  )}
                  {claimed.has(a.id) && (
                    <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Reward claimed!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 card p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">View Full Leaderboard</h3>
          <p className="text-xs text-muted-foreground">See how you rank against other users</p>
        </div>
        <Link href="/leaderboards">
          <Button className="btn-primary gap-2 text-xs">
            <Trophy className="w-3.5 h-3.5" /> Leaderboard <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
