import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Flame, Trophy, Star, Gift, Zap, Shield, Crown, Target,
  TrendingUp, Award, Lock, CheckCircle2, Circle,
  ArrowRight, Sparkles, Heart
} from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  bronze: "text-amber-600", silver: "text-slate-400", gold: "text-yellow-400",
  platinum: "text-cyan-400", diamond: "text-blue-400", legend: "text-purple-400",
};
const TIER_BG: Record<string, string> = {
  bronze: "from-amber-900/30 to-amber-800/10 border-amber-700/30",
  silver: "from-slate-700/30 to-slate-600/10 border-slate-500/30",
  gold: "from-yellow-900/30 to-yellow-800/10 border-yellow-700/30",
  platinum: "from-cyan-900/30 to-cyan-800/10 border-cyan-700/30",
  diamond: "from-blue-900/30 to-blue-800/10 border-blue-700/30",
  legend: "from-purple-900/30 to-purple-800/10 border-purple-700/30",
};
const RANK_NAMES = ["Newcomer","Explorer","Contributor","Builder","Creator","Influencer","Leader","Champion","Master","Legend"];

export default function Retention() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview"|"streaks"|"quests"|"badges">("overview");

  const { data: streak, refetch: refetchStreak } = trpc.audienceLockIn.getStreak.useQuery(undefined, { enabled: !!user });
  const { data: loyalty } = trpc.audienceLockIn.getLoyaltyProfile.useQuery(undefined, { enabled: !!user });
  const { data: badges } = trpc.audienceLockIn.getUserBadges.useQuery(undefined, { enabled: !!user });
  const { data: quests, refetch: refetchQuests } = trpc.audienceLockIn.getActiveQuests.useQuery(undefined, { enabled: !!user });
  const { data: fanLevel } = trpc.audienceLockIn.getFanLevel.useQuery(undefined, { enabled: !!user });

  const recordActivity = trpc.audienceLockIn.recordActivity.useMutation({
    onSuccess: (data: any) => {
      refetchStreak();
      if (data?.increased) toast.success(`🔥 Streak extended! Day ${data.streak}`, { description: data.reward || `Multiplier: ${data.multiplier}x` });
      else if (data?.broken) toast.error("💔 Streak broken", { description: "Start a new streak today!" });
      else toast.success("✅ Activity recorded");
    }
  });

  const tierName = (loyalty as any)?.tier ?? "bronze";
  const tierColor = TIER_COLORS[tierName] ?? "text-primary";
  const tierBg = TIER_BG[tierName] ?? TIER_BG.bronze;
  const currentStreak = (streak as any)?.current ?? 0;
  const longestStreak = (streak as any)?.longest ?? 0;
  const multiplier = (streak as any)?.multiplier ?? 1;
  const loyaltyPoints = (loyalty as any)?.lifetimePoints ?? 0;
  const level = (fanLevel as any)?.level ?? 1;
  const xp = (fanLevel as any)?.xp ?? 0;
  const xpToNext = (fanLevel as any)?.xpToNext ?? 1000;
  const rankName = RANK_NAMES[Math.min(level - 1, RANK_NAMES.length - 1)];

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "streaks", label: "Streaks", icon: Flame },
    { id: "quests", label: "Quests", icon: Target },
    { id: "badges", label: "Badges", icon: Award },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard"><button className="text-muted-foreground hover:text-foreground transition-colors text-sm">← Back</button></Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-primary" /> Retention & Loyalty</h1>
                <p className="text-xs text-muted-foreground">Your engagement rewards and progress</p>
              </div>
            </div>
            <Button size="sm" onClick={() => recordActivity.mutate()} disabled={recordActivity.isPending} className="bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4 mr-1" />{recordActivity.isPending ? "Recording..." : "Check In"}
            </Button>
          </div>
          <div className="flex gap-1 mt-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-6 space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Flame, color: "text-orange-400", value: currentStreak, label: "Day Streak" },
                { icon: Star, color: tierColor, value: tierName.charAt(0).toUpperCase()+tierName.slice(1), label: "Loyalty Tier" },
                { icon: Zap, color: "text-primary", value: `${multiplier}x`, label: "XP Multiplier" },
                { icon: Crown, color: "text-purple-400", value: `Lv.${level}`, label: rankName },
              ].map((s, i) => (
                <div key={i} className="card p-4 text-center">
                  <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className={`card p-5 bg-gradient-to-r ${tierBg} border`}>
              <div className="flex items-center justify-between mb-3">
                <div><div className={`text-lg font-bold capitalize ${tierColor}`}>{rankName}</div><div className="text-sm text-muted-foreground">{loyaltyPoints.toLocaleString()} lifetime points</div></div>
                <div className="text-right"><div className="text-sm font-mono">{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</div><div className="text-xs text-muted-foreground">to Level {level + 1}</div></div>
              </div>
              <Progress value={Math.min(100, (xp / xpToNext) * 100)} className="h-3" />
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Your {tierName.charAt(0).toUpperCase()+tierName.slice(1)} Benefits</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "XP Multiplier", value: `${multiplier}x`, icon: Zap },
                  { label: "Streak Shields", value: (streak as any)?.freezesRemaining ?? 3, icon: Shield },
                  { label: "Longest Streak", value: `${longestStreak} days`, icon: Flame },
                  { label: "Badges Earned", value: (badges as any[])?.length ?? 0, icon: Award },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <b.icon className="w-4 h-4 text-primary shrink-0" />
                    <div><div className="text-xs text-muted-foreground">{b.label}</div><div className="font-semibold text-sm">{b.value}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Tier Progression</h3>
              <div className="space-y-2">
                {(Object.entries({ bronze: 0, silver: 500, gold: 2000, platinum: 5000, diamond: 15000, legend: 50000 }) as [string, number][]).map(([tier, threshold]) => {
                  const isActive = tier === tierName;
                  const isUnlocked = loyaltyPoints >= threshold;
                  return (
                    <div key={tier} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isActive ? "border-primary/50 bg-primary/10" : isUnlocked ? "border-green-500/30 bg-green-500/5" : "border-border/30 opacity-50"}`}>
                      <div className="flex items-center gap-3">
                        {isUnlocked ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                        <span className={`font-medium capitalize ${TIER_COLORS[tier]}`}>{tier}</span>
                        {isActive && <Badge variant="outline" className="text-xs">Current</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{threshold.toLocaleString()} pts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "streaks" && (
          <div className="space-y-6">
            <div className="card p-6 text-center">
              <div className="text-6xl font-bold text-orange-400 mb-2">{currentStreak}</div>
              <div className="text-lg text-muted-foreground mb-1">Day Streak</div>
              <div className="text-sm text-muted-foreground">Longest: {longestStreak} days</div>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => recordActivity.mutate()} disabled={recordActivity.isPending}>
                <Flame className="w-4 h-4 mr-2" />Record Today's Activity
              </Button>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Streak Milestones</h3>
              <div className="space-y-3">
                {[
                  { days: 1, reward: "10 SKY444", icon: "🔥" },
                  { days: 7, reward: "100 SKY444 + Bronze Badge", icon: "⚡" },
                  { days: 14, reward: "250 SKY444 + Silver Badge", icon: "🌟" },
                  { days: 30, reward: "1,000 SKY444 + Gold Badge", icon: "👑" },
                  { days: 60, reward: "3,000 SKY444 + Platinum Badge", icon: "💎" },
                  { days: 100, reward: "10,000 SKY444 + Legend Crown NFT", icon: "🏆" },
                  { days: 365, reward: "50,000 SKY444 + Founder Status", icon: "🚀" },
                ].map(m => (
                  <div key={m.days} className={`flex items-center justify-between p-3 rounded-lg border ${currentStreak >= m.days ? "border-green-500/40 bg-green-500/10" : "border-border/30"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{m.icon}</span>
                      <div><div className="font-medium text-sm">{m.days}-Day Streak</div><div className="text-xs text-muted-foreground">{m.reward}</div></div>
                    </div>
                    {currentStreak >= m.days ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <span className="text-xs text-muted-foreground">{m.days - currentStreak} days away</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Streak Shields</h3>
              <p className="text-sm text-muted-foreground mb-4">Streak shields protect your streak when you miss a day.</p>
              <div className="flex items-center gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${i < ((streak as any)?.freezesRemaining ?? 3) ? "border-primary bg-primary/20" : "border-border/30 opacity-30"}`}>
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                ))}
                <div className="text-sm text-muted-foreground ml-2">{(streak as any)?.freezesRemaining ?? 3} shields remaining</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Active Quests</h2>
              <Button variant="outline" size="sm" onClick={() => refetchQuests()}>Refresh</Button>
            </div>
            {!quests || (quests as any[]).length === 0 ? (
              <div className="card p-8 text-center">
                <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active quests right now.</p>
                <p className="text-sm text-muted-foreground mt-1">Check back tomorrow for new daily quests!</p>
              </div>
            ) : (
              (quests as any[]).map((quest: any, i: number) => (
                <div key={quest.id ?? i} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={quest.type === "daily" ? "default" : "secondary"} className="text-xs">{quest.type ?? "quest"}</Badge>
                        <span className="font-medium text-sm">{quest.title ?? quest.name ?? "Quest"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{quest.description ?? ""}</p>
                      {quest.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{quest.progress}/{quest.target ?? 1}</span></div>
                          <Progress value={Math.min(100, ((quest.progress ?? 0) / (quest.target ?? 1)) * 100)} className="h-2" />
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">+{quest.xpReward ?? quest.reward ?? 0} XP</div>
                      {quest.skyReward && <div className="text-xs text-yellow-400">{quest.skyReward} SKY444</div>}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="card p-5 border-dashed">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Daily Quest Examples</h3>
              <div className="space-y-2">
                {[
                  { title: "Post something today", xp: 50, done: false },
                  { title: "Like 5 posts", xp: 25, done: true },
                  { title: "Comment on 3 posts", xp: 30, done: false },
                  { title: "Visit the marketplace", xp: 20, done: true },
                  { title: "Check your wallet", xp: 15, done: false },
                ].map((q, i) => (
                  <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg ${q.done ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2">
                      {q.done ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                      <span className={`text-sm ${q.done ? "line-through text-muted-foreground" : ""}`}>{q.title}</span>
                    </div>
                    <span className="text-xs text-primary font-mono">+{q.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Your Badges</h2>
              <span className="text-sm text-muted-foreground">{(badges as any[])?.length ?? 0} earned</span>
            </div>
            {!badges || (badges as any[]).length === 0 ? (
              <div className="card p-8 text-center">
                <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No badges yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Complete quests and maintain streaks to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(badges as any[]).map((badge: any, i: number) => (
                  <div key={badge.id ?? i} className="card p-4 text-center">
                    <div className="text-3xl mb-2">{badge.icon ?? "🏅"}</div>
                    <div className="font-medium text-sm">{badge.name ?? "Badge"}</div>
                    <div className="text-xs text-muted-foreground mt-1">{badge.description ?? ""}</div>
                    {badge.earnedAt && <div className="text-xs text-muted-foreground mt-2">{new Date(badge.earnedAt).toLocaleDateString()}</div>}
                  </div>
                ))}
              </div>
            )}
            <div className="card p-5">
              <h3 className="font-semibold mb-4">All Badges to Earn</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🔥", name: "7-Day Streak", desc: "Login 7 days in a row" },
                  { icon: "⚡", name: "Power User", desc: "Post 50 times" },
                  { icon: "🌟", name: "Influencer", desc: "Get 100 followers" },
                  { icon: "💎", name: "Diamond Hands", desc: "Stake for 90 days" },
                  { icon: "🏆", name: "Tournament Victor", desc: "Win a tournament" },
                  { icon: "🎯", name: "Quest Master", desc: "Complete 30 quests" },
                  { icon: "🐋", name: "Whale", desc: "Hold 100,000 SKY444" },
                  { icon: "👑", name: "Legend", desc: "Reach Legend tier" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <span className="text-2xl">{b.icon}</span>
                    <div><div className="text-sm font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card p-5 bg-gradient-to-r from-primary/20 to-purple-500/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Earn more SKY444</h3>
              <p className="text-sm text-muted-foreground">Complete quests, maintain streaks, and level up your loyalty tier.</p>
            </div>
            <Link href="/quests">
              <Button size="sm" className="shrink-0">View Quests <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
