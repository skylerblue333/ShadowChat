import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Play, Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX,
  Plus, Music2, TrendingUp, Loader2, RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const GRADIENTS = [
  "from-purple-600 to-pink-600","from-blue-600 to-cyan-600","from-green-600 to-teal-600",
  "from-orange-600 to-red-600","from-indigo-600 to-purple-600","from-pink-600 to-rose-600",
  "from-cyan-600 to-blue-600","from-yellow-600 to-orange-600",
];

export default function Reels() {
  const { isAuthenticated } = useAuth();
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const { data: reels, isLoading, refetch, isFetching } = trpc.socialCore.reelsFeed.useQuery(
    { limit: 16 }, { retry: false }
  );

  const recordEngagement = trpc.socialCore.recordEngagement.useMutation();

  const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  const handleLike = useCallback((id: string) => {
    if (!isAuthenticated) { toast.error("Sign in to like reels"); return; }
    setLiked(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); recordEngagement.mutate({ contentId: id, contentType: "reel", action: "like" }); }
      return n;
    });
  }, [isAuthenticated, recordEngagement]);

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <div className="flex items-center justify-between mb-6">
        <PageHeader backHref="/social" icon={Play} title="Reels" subtitle="Short-form video content from creators in the SKYCOIN4444 ecosystem" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
          {isAuthenticated && (
            <Link href="/create-reel">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Plus className="w-3 h-3" />Create
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !reels || reels.length === 0 ? (
        <div className="text-center py-24">
          <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reels Yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Be the first to create a reel in the SKYCOIN4444 ecosystem.</p>
          {isAuthenticated && (
            <Link href="/create-reel">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />Create First Reel
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>{reels.length} reels trending now</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reels.map((reel: any, i: number) => {
              const id = String(reel.id || i);
              const isLiked = liked.has(id);
              const isSaved = saved.has(id);
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const creator = reel.creator?.username || reel.creatorId || "creator";
              const title = reel.caption || reel.title || "Untitled Reel";
              return (
                <div key={id} className="card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1">
                  <div className={`relative h-64 ${reel.thumbnailUrl ? "" : `bg-gradient-to-b ${gradient}`} flex items-center justify-center`}>
                    {reel.thumbnailUrl && <img src={reel.thumbnailUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />}
                    {!reel.thumbnailUrl && <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-black/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <button onClick={e => { e.stopPropagation(); setMuted(!muted); }} className="p-1.5 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                        {muted ? <VolumeX className="w-3 h-3 text-white" /> : <Volume2 className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 z-10 text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-full">{fmt(reel.viewCount || 0)} views</div>
                    {reel.duration > 0 && <div className="absolute bottom-2 right-2 z-10 text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-full">{reel.duration}s</div>}
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium mb-1 line-clamp-2">{title}</div>
                    <Link href={`/creator/${creator}`} className="text-xs text-primary hover:underline">@{creator}</Link>
                    {reel.audioTrack?.name && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Music2 className="w-3 h-3" /><span className="truncate">{reel.audioTrack.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => handleLike(id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                        <Heart className={`w-3 h-3 ${isLiked ? "fill-destructive text-destructive" : ""}`} />{fmt((reel.likeCount || 0) + (isLiked ? 1 : 0))}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="w-3 h-3" />{fmt(reel.commentCount || 0)}
                      </span>
                      <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/reels/${id}`); toast.success("Link copied!"); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => setSaved(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; })} className="ml-auto">
                        <Bookmark className={`w-3 h-3 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
