import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Trophy, Zap, DollarSign, FileText, Users, Star, Crown, Medal, Award, TrendingUp } from "lucide-react";

const TABS = [
  { key: "xp", label: "XP / Reputation", icon: Zap, color: "text-yellow-400" },
  { key: "earnings", label: "Earnings", icon: DollarSign, color: "text-emerald-400" },
  { key: "posts", label: "Posts", icon: FileText, color: "text-blue-400" },
  { key: "referrals", label: "Referrals", icon: Users, color: "text-violet-400" },
];

const RANK_ICONS = [
  <Crown className="w-5 h-5 text-yellow-400" />,
  <Medal className="w-5 h-5 text-zinc-300" />,
  <Award className="w-5 h-5 text-amber-600" />,
];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <span className="w-8 flex justify-center">{RANK_ICONS[rank - 1]}</span>;
  return <span className="w-8 text-center text-sm font-bold text-zinc-400">#{rank}</span>;
}

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState<"xp" | "earnings" | "posts" | "referrals">("xp");

  const { data: xpLeaderboard, isLoading: xpLoading } = trpc.gamefi.leaderboard.useQuery(
    { type: "global", limit: 50 },
    { enabled: activeTab === "xp" }
  );

  const { data: socialLeaderboard, isLoading: socialLoading } = trpc.gamefi.leaderboard.useQuery(
    { type: "weekly", limit: 50 },
    { enabled: activeTab === "posts" || activeTab === "earnings" }
  );

  const { data: referralStats, isLoading: referralLoading } = trpc.creatorGrowth.getReferralStats.useQuery(
    undefined,
    { enabled: activeTab === "referrals" }
  );

  const isLoading = xpLoading || socialLoading || referralLoading;

  // Build display data based on active tab
  const getDisplayData = () => {
    if (activeTab === "xp" && xpLeaderboard) {
      return (xpLeaderboard as any[]).map((u: any, i: number) => ({
        rank: i + 1,
        name: u.username || u.name || `User #${u.userId || u.id}`,
        value: `${(u.xp || u.totalXp || 0).toLocaleString()} XP`,
        sub: u.level ? `Level ${u.level}` : undefined,
        avatar: u.avatar,
      }));
    }
    if ((activeTab === "posts" || activeTab === "earnings") && socialLeaderboard) {
      return (socialLeaderboard as any[]).map((u: any, i: number) => ({
        rank: i + 1,
        name: u.username || u.name || `Creator #${u.userId || u.id}`,
        value: activeTab === "earnings"
          ? `$${((u.earnings || u.totalEarnings || 0) / 100).toFixed(2)}`
          : `${(u.postCount || u.posts || 0).toLocaleString()} posts`,
        sub: u.followers ? `${u.followers.toLocaleString()} followers` : undefined,
        avatar: u.avatar,
      }));
    }
    return [];
  };

  const displayData = getDisplayData();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <PageHeader
          title="Leaderboards"
          subtitle="Top performers across the SKYCOIN4444 ecosystem"
          icon={Trophy}
        />

        {/* Tab Bar */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.key ? "text-white" : tab.color}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Referrals tab — show user's own stats */}
        {activeTab === "referrals" && (
          <div className="space-y-4">
            {referralLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : referralStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Referrals", value: (referralStats as any).totalReferrals || 0, icon: Users, color: "text-violet-400" },
                  { label: "Active Referrals", value: (referralStats as any).activeReferrals || 0, icon: TrendingUp, color: "text-emerald-400" },
                  { label: "Tier 2 Referrals", value: (referralStats as any).tier2Count || 0, icon: Star, color: "text-yellow-400" },
                  { label: "Total Earned", value: `${((referralStats as any).totalEarned || 0).toFixed(2)} SKY`, icon: DollarSign, color: "text-blue-400" },
                ].map(item => (
                  <Card key={item.label} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                      <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                      <div className="text-xs text-zinc-500 mt-1">{item.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8 text-center">
                  <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Sign in to view your referral stats</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* XP / Posts / Earnings leaderboard */}
        {activeTab !== "referrals" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {TABS.find(t => t.key === activeTab)?.label} Rankings
                <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">Top 50</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 border-b border-zinc-800 last:border-0">
                      <div className="w-8 h-4 bg-zinc-800 rounded animate-pulse" />
                      <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                      <div className="flex-1 h-4 bg-zinc-800 rounded animate-pulse" />
                      <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : displayData.length > 0 ? (
                <div>
                  {displayData.map((entry, i) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors ${
                        entry.rank <= 3 ? "bg-zinc-800/30" : ""
                      }`}
                    >
                      <RankBadge rank={entry.rank} />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{entry.name}</p>
                        {entry.sub && <p className="text-xs text-zinc-500">{entry.sub}</p>}
                      </div>
                      <span className={`text-sm font-bold ${TABS.find(t => t.key === activeTab)?.color || "text-white"}`}>
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Trophy className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">No data yet — be the first on the leaderboard!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
