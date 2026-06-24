import { useState } from "react";
import { Link } from "wouter";
import { TrendingUp, Flame, Hash, Users, Video, ArrowRight, Zap, Star, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";

const TABS = ["All", "Hashtags", "Creators", "Posts"] as const;
type Tab = typeof TABS[number];

export default function Trending() {
  const [tab, setTab] = useState<Tab>("All");

  const { data: trendingRaw, refetch: refetchTrending, isLoading: loadingTrending } = trpc.explore.getTrending.useQuery();
  const { data: postsRaw, isLoading: loadingPosts } = trpc.social.getFeed.useQuery({ limit: 6 });
  const { data: statsRaw } = trpc.platform.stats.useQuery();

  const trendingTags: { rank: number; tag: string; posts: string; hot: boolean }[] = Array.isArray(trendingRaw)
    ? (trendingRaw as any[]).slice(0, 10).map((t: any, i: number) => ({
        rank: i + 1,
        tag: t.hashtag?.startsWith("#") ? t.hashtag : `#${t.hashtag ?? "trending"}`,
        posts: t.count != null ? (t.count >= 1000 ? `${(t.count / 1000).toFixed(1)}K` : String(t.count)) : "—",
        hot: i < 3,
      }))
    : [];

  const posts: any[] = Array.isArray(postsRaw) ? postsRaw : (postsRaw as any)?.posts ?? [];

  const totalPosts = (statsRaw as any)?.totalPosts ?? 0;
  const totalUsers = (statsRaw as any)?.totalUsers ?? 0;

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/social"
        icon={TrendingUp}
        title="Trending"
        subtitle="What the world is talking about right now"
        badge="Live"
        badgeVariant="destructive"
      />

      {/* Live stats from DB */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-orange-400"><Flame className="w-4 h-4" /><span className="text-xs text-muted-foreground">Trending Topics</span></div>
          <div className="text-2xl font-bold">{trendingTags.length > 0 ? trendingTags.length : "—"}</div>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary"><Hash className="w-4 h-4" /><span className="text-xs text-muted-foreground">Total Posts</span></div>
          <div className="text-2xl font-bold">{totalPosts >= 1000 ? `${(totalPosts / 1000).toFixed(1)}K` : totalPosts || "—"}</div>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-400"><Users className="w-4 h-4" /><span className="text-xs text-muted-foreground">Total Users</span></div>
          <div className="text-2xl font-bold">{totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(1)}K` : totalUsers || "—"}</div>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400"><Video className="w-4 h-4" /><span className="text-xs text-muted-foreground">Live Streams</span></div>
          <div className="text-2xl font-bold">{(statsRaw as any)?.totalStreams ?? "—"}</div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {(tab === "All" || tab === "Hashtags") && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Trending Hashtags
            </h3>
            <button
              onClick={() => refetchTrending()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {loadingTrending ? (
            <div className="text-center text-sm text-muted-foreground py-8">Loading trending hashtags…</div>
          ) : trendingTags.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No trending hashtags yet — start posting with hashtags to see them here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {trendingTags.map(t => (
                <Link key={t.tag} href={`/explore?q=${t.tag}`}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                    t.hot
                      ? "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15"
                      : "bg-secondary/30 border-slate-700/40 hover:bg-secondary/60"
                  }`}>
                    <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">#{t.rank}</span>
                    {t.hot ? <Flame className="w-4 h-4 text-orange-400 shrink-0" /> : <Hash className="w-4 h-4 text-slate-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{t.tag}</div>
                      <div className="text-xs text-muted-foreground">{t.posts} posts</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {(tab === "All" || tab === "Creators") && (
        <TrendingCreators />
      )}

      {(tab === "All" || tab === "Posts") && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Trending Posts
          </h3>
          {loadingPosts ? (
            <div className="card p-8 text-center text-muted-foreground text-sm">Loading trending posts…</div>
          ) : posts.length === 0 ? (
            <div className="card p-8 text-center text-muted-foreground text-sm">No posts yet — be the first to post!</div>
          ) : (
            posts.map((post: any) => (
              <Link key={post.id} href="/social">
                <div className="card p-4 hover:border-slate-700/60 active:scale-[0.99] transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {post.author?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{post.author?.name ?? "User"}</div>
                      <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>❤️ {post._count?.likes ?? 0}</span>
                        <span>💬 {post._count?.comments ?? 0}</span>
                        {(post._count?.likes ?? 0) > 0 && (
                          <span className="ml-auto text-orange-400 font-medium">🔥 Trending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TrendingCreators() {
  // Use explore.discoverUsers which queries real DB recommended users
  const { data: creatorsRaw, isLoading } = trpc.explore.discoverUsers.useQuery();
  const creators: any[] = Array.isArray(creatorsRaw) ? creatorsRaw : [];

  const COLORS = [
    "from-purple-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-green-500 to-teal-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
    "from-orange-500 to-red-500",
  ];

  return (
    <div className="card p-5 mb-6">
      <h3 className="font-semibold flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-yellow-400" /> Trending Creators
      </h3>
      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-8">Loading creators…</div>
      ) : creators.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">No creators yet — start posting to appear here!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {creators.map((c: any, i: number) => (
            <Link key={c.id} href={`/profile/${c.username ?? c.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-slate-700/40 hover:bg-secondary/60 hover:border-slate-600/60 active:scale-[0.98] transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {(c.name ?? c.username ?? "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{c.name ?? c.username}</div>
                  <div className="text-xs text-muted-foreground">@{c.username ?? "user"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-primary">
                    {(c._count?.followers ?? 0) >= 1000
                      ? `${((c._count?.followers ?? 0) / 1000).toFixed(1)}K`
                      : c._count?.followers ?? 0} followers
                  </div>
                  <div className="text-xs text-muted-foreground">{c._count?.posts ?? 0} posts</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
