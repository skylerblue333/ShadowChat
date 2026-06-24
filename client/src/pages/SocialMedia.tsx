// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Heart, MessageCircle, Share2, Users, TrendingUp, Flame,
  Image, Video, Hash, Sparkles, Bookmark, MoreHorizontal,
  Repeat2, Send, Globe, Lock, UserPlus, Star, Zap, Award
} from "lucide-react";

const TRENDING_TAGS = [
  { tag: "#SKY444", count: "12.4K" }, { tag: "#AIAgents", count: "8.9K" },
  { tag: "#Web3OS", count: "6.2K" }, { tag: "#ChatToEarn", count: "5.1K" },
  { tag: "#ShadowChat", count: "4.7K" }, { tag: "#DeFi2027", count: "3.2K" },
];

const SUGGESTED_CREATORS = [
  { name: "nova_ai", handle: "@nova_ai", followers: "44K", tier: "diamond", bio: "AI agent building the future" },
  { name: "cipher_dev", handle: "@cipher_dev", followers: "28K", tier: "gold", bio: "Web3 developer & educator" },
  { name: "prism_art", handle: "@prism_art", followers: "19K", tier: "silver", bio: "Digital artist & NFT creator" },
];

const TIER_COLORS = { diamond: "text-cyan-400", gold: "text-yellow-400", silver: "text-gray-300", bronze: "text-orange-400" };

export default function SocialMedia() {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "following" | "trending" | "ai">("all");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [postPrivacy, setPostPrivacy] = useState<"public" | "followers">("public");
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const { data: feed, refetch: refetchFeed } = trpc.social.getFeed.useQuery({ limit: 50 });
  const { data: trending } = trpc.social.getTrending.useQuery({ limit: 20 });
  const { data: userStats } = trpc.social.getUserStats.useQuery({ userId: user?.id || 0 }, { enabled: !!user });
  const { data: postComments } = trpc.social.getComments.useQuery({ postId: selectedPost || 0, limit: 20 }, { enabled: !!selectedPost });

  const utils = trpc.useUtils();
  const createPostMutation = trpc.social.createPost.useMutation({
    onSuccess: () => { setPostContent(""); utils.social.getFeed.invalidate(); toast.success("Post published!"); },
  });
  const toggleLikeMutation = trpc.social.toggleLike.useMutation({
    onSuccess: () => utils.social.getFeed.invalidate(),
  });
  const addCommentMutation = trpc.social.addComment.useMutation({
    onSuccess: () => { setCommentContent(""); utils.social.getComments.invalidate(); },
  });

  const displayFeed = activeTab === "trending" ? trending : feed;

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); setSelectedPost(null); }
      else { next.add(postId); setSelectedPost(postId); }
      return next;
    });
  };

  return (
    <div className="container py-6 max-w-6xl animate-page-in">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Feed */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-card/50 rounded-xl p-1 border border-border/30">
            {(["all", "following", "trending", "ai"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab === "ai" ? "AI World" : tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap gap-2">
            {TRENDING_TAGS.map(t => (
              <button key={t.tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-sm hover:bg-secondary transition-all">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="font-medium">{t.tag}</span>
                <span className="text-muted-foreground text-xs">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Create Post */}
          {user && (
            <Card className="p-4 border-border/30 bg-card/50">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="What's on your mind? Share with the world..."
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    className="min-h-[80px] resize-none bg-background/50 border-border/30 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Image upload coming soon")}><Image className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Video upload coming soon")}><Video className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Add hashtag")}><Hash className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => toast.info("AI draft coming soon")}><Sparkles className="w-4 h-4" /></Button>
                      <button onClick={() => setPostPrivacy(p => p === "public" ? "followers" : "public")} className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground hover:bg-secondary transition-all">
                        {postPrivacy === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {postPrivacy}
                      </button>
                    </div>
                    <Button size="sm" onClick={() => createPostMutation.mutate({ content: postContent })} disabled={!postContent.trim() || createPostMutation.isPending} className="px-4">
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Feed Posts */}
          <div className="space-y-3">
            {(!displayFeed || displayFeed.length === 0) && (
              <Card className="p-12 text-center border-border/30 bg-card/30">
                <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
              </Card>
            )}
            {displayFeed?.map((post: any, idx: number) => (
              <Card key={post.id || idx} className="p-4 border-border/30 bg-card/50 hover:border-border/60 transition-all group">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {String(post.userId || "U").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-semibold text-sm">User #{post.userId}</span>
                        <span className="text-muted-foreground text-xs ml-2">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "just now"}</span>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                    {activeTab === "trending" && (
                      <div className="flex items-center gap-1 mb-3">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs text-orange-400 font-medium">Trending</span>
                        <Badge variant="outline" className="text-[10px] h-4 border-orange-400/30 text-orange-400">#{idx + 1}</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <button onClick={() => toggleLikeMutation.mutate({ postId: post.id })} className="flex items-center gap-1.5 text-xs hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />{post.likes || 0}
                      </button>
                      <button onClick={() => toggleComments(post.id)} className={`flex items-center gap-1.5 text-xs hover:text-primary transition-colors ${expandedComments.has(post.id) ? "text-primary" : ""}`}>
                        <MessageCircle className="w-4 h-4" />{post.comments || 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-green-400 transition-colors">
                        <Repeat2 className="w-4 h-4" />Repost
                      </button>
                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />Share
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-yellow-400 transition-colors ml-auto">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comments */}
                    {expandedComments.has(post.id) && (
                      <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                        {postComments?.map((c: any) => (
                          <div key={c.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center shrink-0">U</div>
                            <div className="flex-1 bg-secondary/40 rounded-lg px-3 py-2">
                              <span className="text-xs font-medium">User #{c.userId}</span>
                              <p className="text-xs text-muted-foreground mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        ))}
                        {user && (
                          <div className="flex gap-2 mt-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0">{user.name?.charAt(0) || "U"}</div>
                            <div className="flex-1 flex gap-2">
                              <input value={commentContent} onChange={e => setCommentContent(e.target.value)} onKeyDown={e => e.key === "Enter" && commentContent.trim() && addCommentMutation.mutate({ postId: post.id, content: commentContent })} placeholder="Add a comment..." className="flex-1 bg-background/50 border border-border/30 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/50" />
                              <Button size="sm" className="h-7 px-2" onClick={() => commentContent.trim() && addCommentMutation.mutate({ postId: post.id, content: commentContent })}><Send className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 hidden lg:block">
          {/* User Stats */}
          {user && (
            <Card className="p-4 border-border/30 bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary/40 rounded-lg p-2">
                  <p className="font-bold text-primary text-lg">{userStats?.posts || 0}</p>
                  <p className="text-[10px] text-muted-foreground">Posts</p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-2">
                  <p className="font-bold text-blue-400 text-lg">{userStats?.followers || 0}</p>
                  <p className="text-[10px] text-muted-foreground">Followers</p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-2">
                  <p className="font-bold text-purple-400 text-lg">{userStats?.following || 0}</p>
                  <p className="text-[10px] text-muted-foreground">Following</p>
                </div>
              </div>
            </Card>
          )}

          {/* Suggested Creators */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Suggested Creators</h3>
            <div className="space-y-3">
              {SUGGESTED_CREATORS.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-xs">{c.handle}</span>
                      <Star className={`w-3 h-3 ${TIER_COLORS[c.tier]}`} />
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{c.bio}</p>
                    <p className="text-[10px] text-muted-foreground">{c.followers} followers</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] shrink-0" onClick={() => toast.success(`Following ${c.handle}`)}>
                    <UserPlus className="w-3 h-3 mr-1" />Follow
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Hope AI Widget */}
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-primary">Hope AI</h3>
              <Badge className="text-[9px] h-4 bg-primary/20 text-primary border-primary/30">LIVE</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">I'm reading your feed signals. Your engagement pattern suggests you're in discovery mode. Want me to curate your feed?</p>
            <div className="flex gap-2">
              <Link href="/hope-ai">
                <Button size="sm" className="h-7 text-xs flex-1">Open Hope AI</Button>
              </Link>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Feed curated by Hope AI!")}>
                <Zap className="w-3 h-3" />
              </Button>
            </div>
          </Card>

          {/* Trending Tags */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Trending</h3>
            <div className="space-y-2">
              {TRENDING_TAGS.map((t, i) => (
                <div key={t.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm font-medium text-primary">{t.tag}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
