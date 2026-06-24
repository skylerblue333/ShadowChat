/**
 * SocialGraph — Visual network of followers, following, mutual connections, and suggested users
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Users, UserPlus, UserCheck, ChevronLeft, Network, Star, TrendingUp, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

function UserCard({ user, onFollow, isFollowing }: { user: any; onFollow: (id: number) => void; isFollowing: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {user.displayName?.[0] ?? user.username?.[0] ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate">{user.displayName ?? user.username}</div>
        <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
        {user.bio && <div className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</div>}
      </div>
      <button
        onClick={() => onFollow(user.id)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isFollowing
            ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
            : "bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
        }`}
      >
        {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function SocialGraph() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"followers" | "following" | "suggested">("suggested");
  const [followingSet, setFollowingSet] = useState<Set<number>>(new Set());

  const { data: followers = [] } = trpc.user.followers.useQuery(
    { userId: user?.id ?? 0 },
    { enabled: !!user }
  );
  const { data: following = [] } = trpc.user.following.useQuery(
    { userId: user?.id ?? 0 },
    { enabled: !!user }
  );
  const { data: suggested = [] } = trpc.user.suggestedFollows.useQuery(undefined, { enabled: !!user });

  const followMutation = trpc.user.follow.useMutation({
    onSuccess: (_, vars) => {
      setFollowingSet(prev => {
        const next = new Set(prev);
        if (next.has(vars.userId)) next.delete(vars.userId);
        else next.add(vars.userId);
        return next;
      });
    },
    onError: (err: unknown) => toast.error((err as Error).message),
  });

  const handleFollow = (userId: number) => {
    followMutation.mutate({ userId });
  };

  const tabs = [
    { id: "suggested" as const, label: "Suggested", icon: Zap, data: suggested as any[] },
    { id: "followers" as const, label: "Followers", icon: Users, data: followers as any[] },
    { id: "following" as const, label: "Following", icon: UserCheck, data: following as any[] },
  ];

  const currentTab = tabs.find(t => t.id === tab)!;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-[#050508] to-purple-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-56 h-56 bg-indigo-500/15 top-0 left-1/3" />
          <div className="glow-orb w-40 h-40 bg-purple-500/10 bottom-0 right-1/4" />
        </div>
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Network className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black rainbow-text">Social Graph</h1>
          </div>
          <p className="text-muted-foreground metallic-shimmer">Your network of connections, followers, and suggested creators.</p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { label: "Followers", value: (followers as any[]).length, icon: Users, color: "text-purple-400" },
              { label: "Following", value: (following as any[]).length, icon: UserCheck, color: "text-cyan-400" },
              { label: "Suggested", value: (suggested as any[]).length, icon: Star, color: "text-amber-400" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center py-20 text-muted-foreground">Sign in to view your social graph</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              {tabs.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tab === t.id ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    <span className="text-xs opacity-60">({t.data.length})</span>
                  </button>
                );
              })}
            </div>

            {/* User list */}
            {currentTab.data.length === 0 ? (
              <div className="text-center py-16">
                <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <div className="text-muted-foreground">
                  {tab === "followers" ? "No followers yet — share your profile to grow your network" :
                   tab === "following" ? "Not following anyone yet — explore and connect" :
                   "No suggestions available right now"}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {currentTab.data.map((u: any) => (
                  <UserCard
                    key={u.id}
                    user={u}
                    isFollowing={followingSet.has(u.id) || (following as any[]).some((f: any) => f.id === u.id)}
                    onFollow={handleFollow}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
