import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/PageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import {
  Trophy, Zap, MessageSquare, Users, TrendingUp,
  Crown, Medal, Award, Star
} from "lucide-react";

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg, oklch(0.80 0.18 70), oklch(0.72 0.24 40))', icon: <Crown className="w-4 h-4 text-white" />, label: "#1" },
  { bg: 'linear-gradient(135deg, oklch(0.75 0.05 270), oklch(0.65 0.05 270))', icon: <Medal className="w-4 h-4 text-white" />, label: "#2" },
  { bg: 'linear-gradient(135deg, oklch(0.62 0.24 40), oklch(0.55 0.20 40))', icon: <Award className="w-4 h-4 text-white" />, label: "#3" },
];

function LeaderRow({ rank, user, value, label }: { rank: number; user: any; value: string | number; label: string }) {
  const isTop3 = rank <= 3;
  const style = isTop3 ? RANK_STYLES[rank - 1] : null;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
      style={{
        background: isTop3 ? 'oklch(0.72 0.28 305 / 0.08)' : 'oklch(0.10 0.025 270)',
        border: `1px solid ${isTop3 ? 'oklch(0.72 0.28 305 / 0.30)' : 'oklch(0.18 0.025 270)'}`,
      }}
    >
      {/* Rank badge */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={style ? { background: style.bg } : { background: 'oklch(0.15 0.025 270)', color: 'oklch(0.55 0.025 275)' }}
      >
        {isTop3 ? style!.icon : rank}
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))' }}>
        {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user.displayName || user.name || "?")[0].toUpperCase()}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.id}`}>
          <p className="text-white text-sm font-semibold truncate hover:underline cursor-pointer">
            {user.displayName || user.name || "Unknown"}
            {user.verified && <span className="ml-1 text-xs" style={{ color: 'oklch(0.72 0.28 305)' }}>✓</span>}
          </p>
        </Link>
        <p className="text-xs truncate" style={{ color: 'oklch(0.55 0.025 275)' }}>
          @{user.username || `user${user.id}`} · Level {user.level || 1}
        </p>
      </div>

      {/* Value */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold" style={{ color: isTop3 ? 'oklch(0.85 0.25 305)' : 'white' }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("xp");

  const { data: users, isLoading } = trpc.user.leaderboard.useQuery({ type: tab as any, limit: 50 });

  const tabConfig = [
    { id: "xp", label: "XP", icon: Zap, valueKey: "xp", valueLabel: "XP" },
    { id: "posts", label: "Posts", icon: MessageSquare, valueKey: "postCount", valueLabel: "posts" },
    { id: "followers", label: "Followers", icon: Users, valueKey: "followerCount", valueLabel: "followers" },
    { id: "reputation", label: "Rep", icon: Star, valueKey: "reputation", valueLabel: "rep" },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.08 0.025 270)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-12 px-4 text-center" style={{ background: 'linear-gradient(180deg, oklch(0.12 0.025 270), oklch(0.08 0.025 270))' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, oklch(0.72 0.28 305), transparent 70%)' }} />
        <div className="relative">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-sm" style={{ color: 'oklch(0.55 0.025 275)' }}>Top creators, earners, and contributors on SKYCOIN4444</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="w-full" style={{ background: 'oklch(0.12 0.025 270)' }}>
            {tabConfig.map(t => (
              <TabsTrigger key={t.id} value={t.id} className="flex-1 gap-1 text-xs">
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabConfig.map(t => (
            <TabsContent key={t.id} value={t.id} className="space-y-2">
              {isLoading ? (
                <TableSkeleton rows={10} />
              ) : !users || users.length === 0 ? (
                <EmptyState
                  icon="🏆"
                  title="No rankings yet"
                  description="Be the first to earn XP and claim the top spot!"
                />
              ) : (
                users.map((u: any, i: number) => (
                  <LeaderRow
                    key={u.id}
                    rank={i + 1}
                    user={u}
                    value={u[t.valueKey] || 0}
                    label={t.valueLabel}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Your rank */}
        {user && users && users.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'oklch(0.72 0.28 305 / 0.10)', border: '1px solid oklch(0.72 0.28 305 / 0.30)' }}>
            <p className="text-white text-sm font-semibold mb-1">Your Rank</p>
            {(() => {
              const myRank = users.findIndex((u: any) => u.id === (user as any).id);
              if (myRank === -1) return <p className="text-sm" style={{ color: 'oklch(0.55 0.025 275)' }}>Post more to appear on the leaderboard!</p>;
              const myUser = users[myRank];
              const tabConf = tabConfig.find(t => t.id === tab)!;
              return <LeaderRow rank={myRank + 1} user={myUser} value={(myUser as any)[tabConf.valueKey] || 0} label={tabConf.valueLabel} />;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
