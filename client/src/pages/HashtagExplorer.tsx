/**
 * HashtagExplorer — Browse trending hashtags, search by tag, see post feeds per tag
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Hash, TrendingUp, Search, ChevronLeft, Flame, BarChart2, Eye, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";

const TAG_COLORS = [
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-fuchsia-600",
  "from-amber-500 to-orange-600",
  "from-green-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];

export default function HashtagExplorer() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: trending = [] } = trpc.feed.trending.useQuery();
  const { data: feedData } = trpc.feed.list.useQuery(
    { limit: 20, offset: 0 },
    { enabled: !selectedTag }
  );

  const filtered = (trending as any[]).filter((t: any) =>
    !search || t.hashtag?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-[#050508] to-cyan-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 bg-purple-500/15 top-0 right-1/4" />
          <div className="glow-orb w-48 h-48 bg-cyan-500/10 bottom-0 left-1/4" />
        </div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-3xl font-black rainbow-text">Hashtag Explorer</h1>
          </div>
          <p className="text-muted-foreground metallic-shimmer">Discover trending topics and explore conversations by hashtag.</p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hashtags..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending sidebar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Trending Now</span>
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} tags</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No trending hashtags yet</div>
            ) : (
              <div className="space-y-2">
                {filtered.map((tag: any, i: number) => (
                  <button
                    key={tag.hashtag}
                    onClick={() => setSelectedTag(selectedTag === tag.hashtag ? null : tag.hashtag)}
                    className={`w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                      selectedTag === tag.hashtag
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/3 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${TAG_COLORS[i % TAG_COLORS.length]} flex items-center justify-center text-xs font-black text-white`}>
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">#{tag.hashtag}</div>
                        <div className="text-xs text-muted-foreground">{tag.mentions?.toLocaleString() ?? 0} mentions</div>
                      </div>
                      {i < 3 && <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-4">
            {selectedTag ? (
              <>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/30 bg-purple-500/10">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-lg font-black text-purple-300">#{selectedTag}</div>
                    <div className="text-xs text-muted-foreground">Showing posts tagged #{selectedTag}</div>
                  </div>
                  <button onClick={() => setSelectedTag(null)} className="ml-auto text-xs text-muted-foreground hover:text-white transition-colors">
                    Clear ×
                  </button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <div>Hashtag-filtered feed coming soon</div>
                  <div className="text-xs mt-1">Posts tagged #{selectedTag} will appear here</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">Latest Posts</span>
                </div>
                {((feedData as any[]) ?? []).slice(0, 10).map((post: any) => (
                  <div key={post.id} className="p-4 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                        {post.author?.displayName?.[0] ?? "?"}
                      </div>
                      <span className="text-sm font-medium text-white">{post.author?.displayName ?? "Unknown"}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="text-sm text-white/80 line-clamp-3 mb-2">{post.content}</p>
                    {/* Extract hashtags */}
                    <div className="flex flex-wrap gap-1">
                      {(post.content?.match(/#\w+/g) ?? []).map((tag: string) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag.slice(1))}
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likesCount ?? 0}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewsCount ?? 0}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
