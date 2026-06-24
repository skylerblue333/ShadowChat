import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image, Video, Smile, Send, TrendingUp, Users, Zap,
  Flame, Hash, Plus, Play, Eye, Repeat2,
  ChevronRight, Sparkles, Crown, CheckCircle2, Globe,
  X, BarChart2, HelpCircle, Info, DollarSign, Star,
  Lock, ShieldAlert, EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";


function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

const GRAD = [
  "from-[oklch(0.72_0.28_305)] to-[oklch(0.72_0.28_340)]",
  "from-[oklch(0.72_0.28_340)] to-[oklch(0.80_0.20_200)]",
  "from-[oklch(0.80_0.20_200)] to-[oklch(0.80_0.18_70)]",
  "from-[oklch(0.72_0.28_305)] to-[oklch(0.80_0.18_70)]",
];

function TipButton({ authorId, authorName }: { authorId: number; authorName: string }) {
  const { user } = useAuth();
  const [tipped, setTipped] = useState(false);
  const sendTip = trpc.creator.tip.useMutation({
    onSuccess: () => { setTipped(true); toast.success(`Tipped ${authorName}! 🎉`); },
    onError: () => toast.error("Tip failed — check your SKY444 balance"),
  });
  const handleTip = () => {
    if (!user) { window.location.href = getLoginUrl(); return; }
    sendTip.mutate({ recipientId: authorId, amount: 10, message: "Great post! ⚡ SKY444" });
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleTip}
          disabled={sendTip.isPending || tipped}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
            tipped
              ? "text-yellow-400 bg-yellow-500/10"
              : "text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10"
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${tipped ? "fill-yellow-400" : ""}`} />
          <span>{tipped ? "Tipped" : "Tip"}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-black/90 border-white/20 text-white text-xs">
        Tip 10 SKY444 to {authorName}
      </TooltipContent>
    </Tooltip>
  );
}

function WhySeeingButton({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  const { data, isFetching } = trpc.feed.whySeeing.useQuery({ postId }, { enabled: open });
  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-white/25 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-150">
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute bottom-8 left-0 z-50 w-56 bg-[#1a1025] border border-white/10 rounded-xl p-3 shadow-xl">
          <div className="flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-white/70">Why you're seeing this</span>
          </div>
          {isFetching ? (
            <div className="space-y-1.5">{[0,1].map(i => <div key={i} className="h-3 bg-white/10 rounded animate-pulse" />)}</div>
          ) : (
            <ul className="space-y-1">
              {(data?.reasons || ["Trending in your network"]).map((r: string, i: number) => (
                <li key={i} className="text-xs text-white/50 flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />{r}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-white/30 hover:text-white/60">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onComment, onBookmark, showNSFW }: {
  post: any;
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
  onBookmark: (id: number) => void;
  showNSFW?: boolean;
}) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  // NSFW detection: flag on post data or hashtag hints
  const isNSFW = !!(post.isNSFW || post.tags?.includes("nsfw") || post.tags?.includes("18+"));
  const [nsfwRevealed, setNsfwRevealed] = useState(false);
  const shouldBlur = isNSFW && !showNSFW && !nsfwRevealed;

  const { data: comments } = trpc.feed.comments.useQuery(
    { postId: post.id, limit: 5 },
    { enabled: showComments }
  );

  const handleLike = () => {
    if (!user) { window.location.href = getLoginUrl(); return; }
    setLiked(p => !p);
    setLikeCount((c: number) => liked ? c - 1 : c + 1);
    onLike(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  };

  const grad = GRAD[post.id % GRAD.length];

  return (
    <article className="group relative bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-200">
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${grad} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="p-4">
        {/* Author */}
        <div className="flex items-start justify-between mb-3">
          <Link href={`/profile/${post.author?.username || post.authorId}`}>
            <div className="flex items-center gap-3 cursor-pointer group/author">
              <div className="relative">
                <Avatar className="w-10 h-10 ring-2 ring-white/5 group-hover/author:ring-purple-500/40 transition-all">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
                    {(post.author?.displayName || post.author?.name || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {post.author?.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white group-hover/author:text-purple-300 transition-colors">
                    {post.author?.displayName || post.author?.name || "User"}
                  </span>
                  {post.author?.level >= 5 && <Crown className="w-3 h-3 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <span>@{post.author?.username || `user${post.authorId}`}</span>
                  <span>·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                  {post.visibility === "public" && <Globe className="w-3 h-3" />}
                </div>
              </div>
            </div>
          </Link>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* NSFW badge */}
        {isNSFW && (
          <div className="flex items-center gap-1.5 mb-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0.5">
              <ShieldAlert className="w-2.5 h-2.5 mr-1" />18+ Mature Content
            </Badge>
            {shouldBlur && (
              <span className="text-[10px] text-white/30">Click to reveal</span>
            )}
          </div>
        )}

        {/* Content */}
        {post.content && (
          <p className={`text-[15px] text-white/85 leading-relaxed mb-3 whitespace-pre-wrap transition-all ${shouldBlur ? "blur-sm select-none" : ""}`}>
            {post.content.length > 300 ? post.content.slice(0, 300) + "…" : post.content}
          </p>
        )}

        {/* Hashtags */}
        {post.hashtags && Array.isArray(post.hashtags) && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.hashtags.slice(0, 4).map((tag: string) => (
              <span key={tag} className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">#{tag}</span>
            ))}
          </div>
        )}

        {/* Media */}
        {post.mediaUrl && (
          <div className="relative rounded-xl overflow-hidden mb-3 bg-black/30">
            {shouldBlur && (
              <button
                onClick={() => setNsfwRevealed(true)}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <EyeOff className="w-6 h-6 text-white/70" />
                </div>
                <span className="text-white/70 text-sm font-medium">Tap to reveal mature content</span>
                <Badge className="bg-red-500/80 text-white text-xs">18+ Only</Badge>
              </button>
            )}
            {post.type === "video" || post.type === "reel" ? (
              <div className={`relative aspect-video ${shouldBlur ? "blur-xl" : ""}`}>
                <video src={post.mediaUrl} className="w-full h-full object-cover" controls poster={post.thumbnailUrl} />
              </div>
            ) : (
              <img src={post.mediaUrl} alt="Post media" className={`w-full max-h-80 object-cover transition-all ${shouldBlur ? "blur-xl" : ""}`} loading="lazy" />
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-white/25 mb-3 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount || 0}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.commentCount || 0}</span>
          <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3" />{post.repostCount || 0}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${liked ? "text-pink-400 bg-pink-500/10" : "text-white/40 hover:text-pink-400 hover:bg-pink-500/10"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-pink-400" : ""}`} />
            <span>{likeCount}</span>
          </button>
          <button onClick={() => setShowComments(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150 active:scale-95">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount || 0}</span>
          </button>
          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`); toast.success("Link copied!"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150 active:scale-95">
            <Share2 className="w-4 h-4" />
          </button>
          <WhySeeingButton postId={post.id} />
          <TipButton authorId={post.authorId} authorName={post.author?.displayName || post.author?.name || "Creator"} />
          <button onClick={() => { setBookmarked(p => !p); onBookmark(post.id); }}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${bookmarked ? "text-yellow-400 bg-yellow-500/10" : "text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10"}`}>
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-yellow-400" : ""}`} />
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
            {user && (
              <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={user.avatar ?? undefined} />
                  <AvatarFallback className="bg-purple-600 text-white text-xs">{(user.name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleComment()}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none" />
                  <button onClick={handleComment} disabled={!commentText.trim()} className="text-purple-400 hover:text-purple-300 disabled:opacity-30 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
            {comments && comments.length > 0 ? comments.map((c: any) => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={c.author?.avatar} />
                  <AvatarFallback className="bg-slate-700 text-white text-xs">{(c.author?.name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-xs font-semibold text-white/70 mr-2">{c.author?.displayName || c.author?.name}</span>
                  <span className="text-xs text-white/60">{c.content}</span>
                </div>
              </div>
            )) : (
              <p className="text-xs text-white/30 text-center py-2">No comments yet — be first!</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function StoryRing({ story, isOwn, onAddStory }: { story: any; isOwn?: boolean; onAddStory?: () => void }) {
  const grads = [
    "from-purple-500 via-pink-500 to-orange-400",
    "from-cyan-400 via-blue-500 to-purple-600",
    "from-pink-500 via-rose-500 to-red-500",
    "from-green-400 via-teal-500 to-cyan-500",
    "from-yellow-400 via-orange-500 to-red-500",
  ];
  const g = grads[(story.userId || 0) % grads.length];
  return (
    <button className="flex flex-col items-center gap-1.5 shrink-0 group" onClick={isOwn ? onAddStory : undefined}>
      <div className={`relative p-0.5 rounded-full bg-gradient-to-br ${g}`}>
        <div className="p-0.5 rounded-full bg-[#07050f]">
          <Avatar className="w-14 h-14">
            <AvatarImage src={story.author?.avatar || story.avatar} />
            <AvatarFallback className="bg-slate-800 text-white text-lg font-bold">
              {isOwn ? "+" : (story.author?.name || story.name || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {isOwn && (
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-purple-500 border-2 border-[#07050f] flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <span className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors max-w-[60px] truncate">
        {isOwn ? "Your story" : (story.author?.displayName || story.author?.name || story.name || "User")}
      </span>
    </button>
  );
}

function PostComposer({ user, onPost }: { user: any; onPost: () => void }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "image" | "video" | "poll">("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createPost = trpc.feed.create.useMutation({
    onSuccess: () => { setContent(""); setMediaUrl(""); setExpanded(false); setType("text"); toast.success("Posted!"); onPost(); },
    onError: () => toast.error("Failed to post"),
  });

  const handleSubmit = () => {
    if (!content.trim() && !mediaUrl) return;
    createPost.mutate({ content, type, mediaUrl: mediaUrl || undefined, visibility: "public" });
  };

  if (!user) {
    return (
      <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-5 text-center">
        <p className="text-white/50 text-sm mb-3">Sign in to share your thoughts</p>
        <a href={getLoginUrl()}>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white border-0">Sign In</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 shrink-0 ring-2 ring-purple-500/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
              {(user.name || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea value={content} onChange={e => setContent(e.target.value)} onFocus={() => setExpanded(true)}
              placeholder="What's happening in the ecosystem? 🚀"
              rows={expanded ? 3 : 1}
              className="w-full bg-transparent text-[15px] text-white placeholder-white/25 outline-none resize-none leading-relaxed" />
            {expanded && mediaUrl && (
              <div className="relative mt-2 rounded-xl overflow-hidden">
                <img src={mediaUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
                <button onClick={() => setMediaUrl("")} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
        {expanded && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => { setMediaUrl(ev.target?.result as string); setType("image"); };
                  reader.readAsDataURL(file);
                }
              }} />
              <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg text-white/40 hover:text-purple-400 hover:bg-purple-500/10 transition-all" title="Image">
                <Image className="w-4 h-4" />
              </button>
              <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg text-white/40 hover:text-pink-400 hover:bg-pink-500/10 transition-all" title="Video">
                <Video className="w-4 h-4" />
              </button>
              <button onClick={() => setType(t => t === "poll" ? "text" : "poll")}
                className={`p-2 rounded-lg transition-all ${type === "poll" ? "text-cyan-400 bg-cyan-500/10" : "text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10"}`} title="Poll">
                <BarChart2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" title="Emoji">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {content.length > 0 && (
                <span className={`text-xs ${content.length > 450 ? "text-red-400" : "text-white/30"}`}>{500 - content.length}</span>
              )}
              <Button size="sm" onClick={handleSubmit}
                disabled={(!content.trim() && !mediaUrl) || createPost.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white border-0 text-xs px-4 disabled:opacity-40">
                {createPost.isPending ? "Posting…" : "Post"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendingSidebar() {
  const { data: trending } = trpc.feed.trending.useQuery();
  const { data: suggestions } = trpc.user.suggestedFollows.useQuery(undefined, { retry: false });
  const { data: stats } = trpc.platform.stats.useQuery();
  const followUser = trpc.user.follow.useMutation({ onSuccess: () => toast.success("Following!") });
  const { user } = useAuth();

  return (
    <div className="space-y-4 sticky top-20">
      {/* Platform stats */}
      <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-bold text-white">Platform</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Members", value: stats?.totalUsers ?? "—" },
            { label: "Posts", value: stats?.totalPosts ?? "—" },
            { label: "Communities", value: stats?.totalCommunities ?? "—" },
            { label: "Streams", value: stats?.totalStreams ?? "—" },
          ].map(s => (
            <div key={s.label} className="bg-white/3 rounded-xl p-2.5 text-center">
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-white">Trending</h3>
        </div>
        {trending && trending.length > 0 ? (
          <div className="space-y-3">
            {trending.slice(0, 7).map((tag: any, i: number) => (
              <div key={tag.hashtag || i} className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-[11px] text-white/30">#{i + 1} · Trending</p>
                  <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">#{tag.hashtag}</p>
                  {tag.count && <p className="text-[11px] text-white/25">{tag.count} posts</p>}
                </div>
                <Flame className="w-3.5 h-3.5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {["Web3", "SKY444", "DeFi", "AI", "Crypto", "NFTs"].map((tag, i) => (
              <div key={tag} className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-[11px] text-white/25">#{i + 1} · Trending</p>
                  <p className="text-sm font-semibold text-white/60 group-hover:text-purple-300 transition-colors">#{tag}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Who to follow */}
      {user && (
        <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Who to Follow</h3>
          </div>
          {suggestions && suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.slice(0, 5).map((u: any) => (
                <div key={u.id} className="flex items-center gap-3">
                  <Link href={`/profile/${u.username}`}>
                    <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-purple-500/40 transition-all">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold">
                        {(u.displayName || u.name || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-white truncate">{u.displayName || u.name}</p>
                      {u.verified && <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-white/40 truncate">@{u.username}</p>
                  </div>
                  <Button size="sm" variant="outline"
                    onClick={() => followUser.mutate({ userId: u.id })}
                    className="text-xs h-7 px-3 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/60 bg-transparent">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 text-center py-2">Invite friends to grow your network</p>
          )}
        </div>
      )}

      {/* SKY444 price */}
      <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-bold text-white">SKY444</h3>
          <Badge className="ml-auto text-[10px] bg-green-500/10 text-green-400 border-green-500/20">LIVE</Badge>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-white">$0.0444</span>
          <span className="text-xs text-green-400 mb-1">+4.44%</span>
        </div>
        <Link href="/token">
          <Button size="sm" variant="outline" className="w-full mt-3 text-xs border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 bg-transparent">
            View Token <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

type FeedTab = "foryou" | "following" | "trending";

export default function Social() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<FeedTab>("foryou");
  const [showNSFW, setShowNSFW] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyCaption, setStoryCaption] = useState("");
  const [storyMediaUrl, setStoryMediaUrl] = useState("");
  const storyFileRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = trpc.user.uploadAvatar.useMutation();
  const createStory = trpc.story.create.useMutation({
    onSuccess: () => {
      setShowStoryModal(false);
      setStoryCaption("");
      setStoryMediaUrl("");
      toast.success("Story posted! 🌟");
    },
    onError: (e) => toast.error("Failed to post story: " + e.message),
  });

  const handleStoryImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setStoryMediaUrl(dataUrl);
      uploadAvatar.mutate({ data: dataUrl, type: "avatar", mimeType: file.type || "image/jpeg" }, {
        onSuccess: (res) => setStoryMediaUrl(res.url),
      });
    };
    reader.readAsDataURL(file);
  };

  const publicFeed = trpc.feed.list.useQuery({ limit: 20, offset: 0 });
  const forYouFeed = trpc.feed.forYou.useQuery(undefined, { enabled: isAuthenticated && tab === "foryou" });
  const followingFeed = trpc.feed.following.useQuery(undefined, { enabled: isAuthenticated && tab === "following" });
  const { data: stories } = trpc.story.feed.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const { data: reels } = trpc.socialCore.reelsFeed.useQuery({ limit: 8 }, { retry: false });

  const likePost = trpc.feed.like.useMutation({ onError: () => toast.error("Failed to like") });
  const addComment = trpc.feed.comment.useMutation({
    onSuccess: () => { publicFeed.refetch(); forYouFeed.refetch(); },
    onError: () => toast.error("Failed to comment"),
  });
  const bookmarkPost = trpc.feed.bookmark.useMutation({
    onSuccess: () => toast.success("Bookmarked!"),
    onError: () => toast.error("Failed to bookmark"),
  });

  const activeFeed = isAuthenticated
    ? (tab === "following" ? followingFeed : forYouFeed)
    : publicFeed;

  const posts: any[] = activeFeed.data || publicFeed.data || [];
  const isLoading = activeFeed.isLoading;

  const handleRefresh = useCallback(() => {
    publicFeed.refetch();
    forYouFeed.refetch();
    followingFeed.refetch();
  }, [publicFeed, forYouFeed, followingFeed]);

  const tabs: { id: FeedTab; label: string; icon: any; auth?: boolean }[] = [
    { id: "foryou", label: "For You", icon: Sparkles },
    { id: "following", label: "Following", icon: Users, auth: true },
    { id: "trending", label: "Trending", icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-[#07050f]">
      {/* Story Creation Modal */}
      <Dialog open={showStoryModal} onOpenChange={setShowStoryModal}>
        <DialogContent className="bg-[#0e0a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Your Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {storyMediaUrl && (
              <div className="relative rounded-xl overflow-hidden bg-black/30 aspect-video">
                <img src={storyMediaUrl} alt="Story preview" className="w-full h-full object-cover" />
                <button onClick={() => setStoryMediaUrl("")} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}
            <button
              onClick={() => storyFileRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 rounded-xl p-4 text-center text-white/40 hover:border-purple-500/40 hover:text-purple-400 transition-all flex flex-col items-center gap-2"
            >
              <Image className="w-6 h-6" />
              <span className="text-sm">{storyMediaUrl ? "Change photo/video" : "Add photo or video"}</span>
            </button>
            <input ref={storyFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleStoryImagePick} />
            <Textarea
              placeholder="Write a caption... (optional)"
              value={storyCaption}
              onChange={e => setStoryCaption(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 bg-transparent" onClick={() => setShowStoryModal(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                disabled={createStory.isPending || (!storyCaption.trim() && !storyMediaUrl)}
                onClick={() => createStory.mutate({ content: storyCaption, mediaUrl: storyMediaUrl || undefined, visibility: "public" })}
              >
                {createStory.isPending ? "Posting..." : "Post Story"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Main feed */}
          <div className="space-y-4 min-w-0">

            {/* Stories */}
            {isAuthenticated && (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  <StoryRing story={{ userId: user?.id, author: user, name: user?.name || "You" }} isOwn onAddStory={() => setShowStoryModal(true)} />
                  {stories && stories.length > 0 ? (
                    stories.slice(0, 10).map((s: any) => <StoryRing key={s.id} story={s} />)
                  ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className="w-[62px] h-[62px] rounded-full bg-white/5 animate-pulse" />
                        <div className="w-10 h-2 rounded bg-white/5 animate-pulse" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Reels Row */}
            {reels && (reels as any[]).length > 0 && (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-bold text-white">Reels</span>
                  </div>
                  <button className="text-xs text-purple-400 hover:text-purple-300">See all</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {(reels as any[]).slice(0, 8).map((reel: any) => (
                    <div key={reel.id} className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden bg-black/40 cursor-pointer group">
                      {reel.thumbnailUrl ? (
                        <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white font-medium truncate">{reel.caption || "Reel"}</p>
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <Eye className="w-3 h-3" />
                          <span>{reel.viewCount || 0}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Feed header: tabs + NSFW toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-1.5 flex-1">
                {tabs.map(t => {
                  if (t.auth && !isAuthenticated) return null;
                  const active = tab === t.id;
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "text-white" : "text-white/40 hover:text-white/70"}`}
                      style={active ? { background: "linear-gradient(135deg, oklch(0.72 0.28 305 / 0.25), oklch(0.72 0.28 340 / 0.15))" } : {}}>
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
              {/* NSFW toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0e0a1a]/90 border border-white/5 rounded-2xl shrink-0">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <Label className="text-xs text-white/50 cursor-pointer whitespace-nowrap">18+</Label>
                <Switch
                  checked={showNSFW}
                  onCheckedChange={(v) => {
                    if (v && !localStorage.getItem("age_verified")) {
                      toast.error("Visit Stories to verify your age first");
                      return;
                    }
                    setShowNSFW(v);
                    toast.success(v ? "Mature content enabled" : "Mature content hidden");
                  }}
                  className="scale-75"
                />
              </div>
            </div>

            {/* Composer */}
            <PostComposer user={user} onPost={handleRefresh} />

            {/* Feed */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-white/5 rounded animate-pulse w-32" />
                        <div className="h-2.5 bg-white/5 rounded animate-pulse w-20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/5 rounded animate-pulse" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post}
                    onLike={id => likePost.mutate({ postId: id })}
                    onComment={(id, text) => addComment.mutate({ postId: id, content: text })}
                    onBookmark={id => bookmarkPost.mutate({ postId: id })}
                    showNSFW={showNSFW}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {tab === "following" ? "Follow people to see their posts" : "Be the first to post"}
                </h3>
                <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
                  {tab === "following"
                    ? "Discover creators and follow them to build your personalized feed."
                    : "Share your thoughts, ideas, and discoveries with the community."}
                </p>
                {tab === "following" ? (
                  <Button size="sm" onClick={() => setTab("foryou")} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Discover People
                  </Button>
                ) : isAuthenticated ? (
                  <Button size="sm" onClick={() => document.querySelector("textarea")?.focus()} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    <Plus className="w-4 h-4 mr-1" /> Create Post
                  </Button>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Sign In to Post</Button>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
