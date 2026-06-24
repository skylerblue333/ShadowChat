/**
 * Bookmarks — Saved posts with notes, collections, and search
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Bookmark, Search, Trash2, ChevronLeft, FileText, Heart, MessageCircle, Share2, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Bookmarks() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "text" | "image" | "video" | "reel">("all");

  const { data, refetch, isLoading } = trpc.feed.bookmarks.useQuery(
    { limit: 50, offset: 0 },
    { enabled: !!user }
  );

  const removeBookmark = trpc.feed.removeBookmark.useMutation({
    onSuccess: () => { toast.success("Bookmark removed"); refetch(); },
    onError: (err: unknown) => toast.error((err as Error).message),
  });

  const bookmarks = ((data as any[]) ?? []).filter((b: any) => {
    const post = b.post;
    if (!post) return false;
    if (filter !== "all" && post.type !== filter) return false;
    if (search && !post.content?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-[#050508] to-blue-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-56 h-56 bg-cyan-500/15 top-0 left-1/3" />
        </div>
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-black rainbow-text">Bookmarks</h1>
          </div>
          <p className="text-muted-foreground metallic-shimmer">Your saved posts, articles, and content.</p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center py-20 text-muted-foreground">Sign in to view your bookmarks</div>
        ) : (
          <>
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search bookmarks..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {(["all", "text", "image", "video", "reel"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                      filter === f ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="text-sm text-muted-foreground mb-4">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </div>

            {/* Bookmark list */}
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <div className="text-muted-foreground">
                  {search ? "No bookmarks match your search" : "No bookmarks yet — save posts to find them here"}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((b: any) => {
                  const post = b.post;
                  return (
                    <div
                      key={b.id}
                      className="group rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 p-4 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Author */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                              {post?.author?.displayName?.[0] ?? "?"}
                            </div>
                            <span className="text-sm font-medium text-white">{post?.author?.displayName ?? "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">@{post?.author?.username ?? "unknown"}</span>
                            <span className="ml-auto text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {post?.type ?? "post"}
                            </span>
                          </div>
                          {/* Content */}
                          <p className="text-sm text-white/80 line-clamp-3 mb-2">{post?.content ?? "No content"}</p>
                          {/* Note */}
                          {b.note && (
                            <div className="text-xs text-cyan-400/70 italic mb-2">Note: {b.note}</div>
                          )}
                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post?.likesCount ?? 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post?.commentsCount ?? 0}</span>
                            <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{post?.sharesCount ?? 0}</span>
                            <span className="ml-auto">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}</span>
                          </div>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeBookmark.mutate({ postId: post?.id })}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
