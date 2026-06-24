import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  X, ChevronLeft, ChevronRight, Plus, Heart, Send, Eye, Radio,
  Upload, Lock, ShieldAlert, Flame, Star, Sparkles, Camera,
  MessageCircle, Gift, Share2, MoreHorizontal, Volume2, VolumeX,
  Clock, TrendingUp, Crown, Zap
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const STORY_DURATION = 5000;

const REACTION_EMOJIS = ["❤️", "🔥", "😍", "😂", "👏", "💎", "🚀", "💋"];

// Mock NSFW story groups for demo (real data from trpc.story.feed)
const DEMO_STORY_GROUPS = [
  {
    userId: 1, userName: "skyler.blue", isLive: true, hasUnviewed: true, isNSFW: false,
    stories: [
      { id: 1, content: "Hey 😊 Im Skyler blue and this was my dream. 444 I'll start live streaming soon", mediaUrl: "", viewCount: 1247, createdAt: Date.now() - 3600000, reactions: { "❤️": 89, "🔥": 45 } },
      { id: 2, content: "SKYCOIN4444 is going to change everything 🚀", mediaUrl: "", viewCount: 892, createdAt: Date.now() - 7200000, reactions: { "🚀": 234, "💎": 67 } },
    ]
  },
  {
    userId: 2, userName: "nova.ai", isLive: false, hasUnviewed: true, isNSFW: false,
    stories: [
      { id: 3, content: "AI is the future of social media 🤖", mediaUrl: "", viewCount: 567, createdAt: Date.now() - 1800000, reactions: { "👏": 123 } },
    ]
  },
  {
    userId: 3, userName: "cipher.dev", isLive: false, hasUnviewed: false, isNSFW: false,
    stories: [
      { id: 4, content: "Just deployed a new feature! 🛠️", mediaUrl: "", viewCount: 234, createdAt: Date.now() - 5400000, reactions: {} },
    ]
  },
  {
    userId: 4, userName: "creator_x", isLive: false, hasUnviewed: true, isNSFW: true,
    stories: [
      { id: 5, content: "🔞 Exclusive content — subscribe to unlock", mediaUrl: "", viewCount: 3421, createdAt: Date.now() - 900000, reactions: { "🔥": 567, "❤️": 234 } },
    ]
  },
  {
    userId: 5, userName: "prism.art", isLive: true, hasUnviewed: true, isNSFW: false,
    stories: [
      { id: 6, content: "New artwork dropping tonight 🎨", mediaUrl: "", viewCount: 789, createdAt: Date.now() - 2700000, reactions: { "😍": 89 } },
    ]
  },
  {
    userId: 6, userName: "shadow.trader", isLive: false, hasUnviewed: true, isNSFW: false,
    stories: [
      { id: 7, content: "SKY444 up 44% today 📈 Not financial advice", mediaUrl: "", viewCount: 4567, createdAt: Date.now() - 600000, reactions: { "🚀": 890, "💎": 345 } },
    ]
  },
];

export default function Stories() {
  const { user, isAuthenticated } = useAuth();

  // Age / NSFW state
  const [ageVerified, setAgeVerified] = useState(() => {
    try { return localStorage.getItem("age_verified") === "true"; } catch { return false; }
  });
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showNSFW, setShowNSFW] = useState(false);
  const [pendingNSFWStory, setPendingNSFWStory] = useState<number | null>(null);

  // Story viewer state
  const [selectedUserIdx, setSelectedUserIdx] = useState<number | null>(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [reactionBurst, setReactionBurst] = useState<{ emoji: string; id: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create story state
  const [showCreate, setShowCreate] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState("");
  const [newStoryMedia, setNewStoryMedia] = useState("");
  const [newStoryNSFW, setNewStoryNSFW] = useState(false);
  const [storyType, setStoryType] = useState<"text" | "image" | "video">("text");

  // Filter state
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "following" | "trending">("all");

  const { data: storyFeed, refetch } = trpc.story.feed.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 30000 }
  );
  const viewStory = trpc.story.view.useMutation();
  const createStory = trpc.story.create.useMutation({
    onSuccess: () => {
      setShowCreate(false);
      setNewStoryContent("");
      setNewStoryMedia("");
      setNewStoryNSFW(false);
      refetch();
      toast.success("Story posted! 🎉");
    },
    onError: () => toast.error("Failed to post story"),
  });

  // Use real data if available, fallback to demo
  const storyGroups: typeof DEMO_STORY_GROUPS = (storyFeed as any[])?.length
    ? (storyFeed as any[])
    : DEMO_STORY_GROUPS;

  // Filter stories
  const filteredGroups = storyGroups.filter(g => {
    if (!showNSFW && g.isNSFW) return false;
    if (activeFilter === "live") return g.isLive;
    if (activeFilter === "following") return !g.isNSFW;
    if (activeFilter === "trending") return (g.stories[0]?.viewCount || 0) > 500;
    return true;
  });

  const currentGroup = selectedUserIdx !== null ? filteredGroups[selectedUserIdx] : null;
  const currentStory = currentGroup?.stories?.[storyIdx];

  // Auto-advance
  useEffect(() => {
    if (selectedUserIdx === null || paused) return;
    setProgress(0);
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / STORY_DURATION) * 100);
      setProgress(pct);
      if (pct >= 100) advanceStory();
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [selectedUserIdx, storyIdx, paused]);

  useEffect(() => {
    if (currentStory?.id) viewStory.mutate({ storyId: currentStory.id });
  }, [currentStory?.id]);

  const advanceStory = useCallback(() => {
    if (!currentGroup) return;
    if (storyIdx < (currentGroup.stories?.length || 1) - 1) {
      setStoryIdx(s => s + 1);
    } else if (selectedUserIdx !== null && selectedUserIdx < filteredGroups.length - 1) {
      setSelectedUserIdx(i => (i ?? 0) + 1);
      setStoryIdx(0);
    } else {
      closeStory();
    }
  }, [currentGroup, storyIdx, selectedUserIdx, filteredGroups.length]);

  const prevStory = () => {
    if (storyIdx > 0) {
      setStoryIdx(s => s - 1);
    } else if (selectedUserIdx !== null && selectedUserIdx > 0) {
      setSelectedUserIdx(i => (i ?? 1) - 1);
      setStoryIdx(0);
    }
  };

  const closeStory = () => {
    setSelectedUserIdx(null);
    setStoryIdx(0);
    setProgress(0);
    setShowReactions(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const openStory = (idx: number) => {
    const group = filteredGroups[idx];
    if (group?.isNSFW && !ageVerified) {
      setPendingNSFWStory(idx);
      setShowAgeGate(true);
      return;
    }
    setSelectedUserIdx(idx);
    setStoryIdx(0);
  };

  const confirmAge = () => {
    setAgeVerified(true);
    try { localStorage.setItem("age_verified", "true"); } catch {}
    setShowAgeGate(false);
    if (pendingNSFWStory !== null) {
      setSelectedUserIdx(pendingNSFWStory);
      setStoryIdx(0);
      setPendingNSFWStory(null);
    }
  };

  const sendReaction = (emoji: string) => {
    setActiveReaction(emoji);
    const id = Date.now();
    setReactionBurst(prev => [...prev, { emoji, id }]);
    setTimeout(() => setReactionBurst(prev => prev.filter(r => r.id !== id)), 1500);
    setTimeout(() => setActiveReaction(null), 800);
    toast.success(`Reacted with ${emoji}`);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    toast.success("Reply sent!");
    setReplyText("");
  };

  const FILTERS = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "live", label: "Live", icon: Radio },
    { id: "following", label: "Following", icon: Heart },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ] as const;

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">

      {/* Age Gate Modal */}
      {showAgeGate && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Age Verification Required</h2>
              <p className="text-sm text-muted-foreground">
                This story contains mature content (18+). You must confirm your age to continue.
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full btn-primary py-3 text-base font-bold" onClick={confirmAge}>
                I am 18 or older — Continue
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { setShowAgeGate(false); setPendingNSFWStory(null); }}>
                Go Back
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              By continuing you confirm you are 18+ and consent to viewing adult content.
            </p>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Create Story
              </h3>
              <Button size="icon" variant="ghost" onClick={() => setShowCreate(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Type selector */}
            <div className="flex gap-2">
              {(["text", "image", "video"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setStoryType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    storyType === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Textarea
              placeholder={storyType === "text" ? "What's your story? ✨" : "Add a caption..."}
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              rows={3}
              className="resize-none"
            />

            {storyType !== "text" && (
              <Input
                placeholder={storyType === "image" ? "Image URL or upload..." : "Video URL..."}
                value={newStoryMedia}
                onChange={(e) => setNewStoryMedia(e.target.value)}
              />
            )}

            {/* NSFW toggle */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <div>
                  <Label className="text-sm font-medium">Mature Content (18+)</Label>
                  <p className="text-xs text-muted-foreground">Age-gate this story for adult audiences</p>
                </div>
              </div>
              <Switch
                checked={newStoryNSFW}
                onCheckedChange={setNewStoryNSFW}
              />
            </div>

            {newStoryNSFW && (
              <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Viewers will be required to confirm they are 18+ before seeing this story.
              </div>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1 btn-primary"
                onClick={() => createStory.mutate({ content: newStoryContent, mediaUrl: newStoryMedia })}
                disabled={!newStoryContent || createStory.isPending}
              >
                {createStory.isPending ? "Posting..." : "Post Story 🚀"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedUserIdx !== null && currentGroup && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {currentGroup.stories?.map((_: any, i: number) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded overflow-hidden">
                <div
                  className="h-full bg-white transition-none"
                  style={{ width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%" }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Avatar className="w-9 h-9 border-2 border-white">
                <AvatarFallback>{currentGroup.userName?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-semibold text-sm">{currentGroup.userName}</p>
                  {currentGroup.isNSFW && (
                    <Badge className="bg-red-500/80 text-white text-[9px] px-1 py-0">18+</Badge>
                  )}
                </div>
                <p className="text-white/60 text-xs">
                  {currentStory?.createdAt
                    ? new Date(currentStory.createdAt).toLocaleTimeString()
                    : ""}
                </p>
              </div>
              {currentGroup.isLive && (
                <Badge className="bg-red-500 text-white text-xs">
                  <Radio className="w-2 h-2 mr-1" />LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-white w-8 h-8" onClick={() => setMuted(m => !m)}>
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="ghost" className="text-white w-8 h-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white w-8 h-8" onClick={closeStory}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Story Content */}
          <div
            className="w-full h-full flex items-center justify-center select-none"
            onMouseDown={() => setPaused(true)}
            onMouseUp={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {currentStory?.mediaUrl ? (
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="w-full max-w-sm mx-auto px-8 text-center">
                <div className="text-6xl mb-6">
                  {currentGroup.isNSFW ? "🔥" : "✨"}
                </div>
                <p className="text-white text-2xl font-bold leading-relaxed">
                  {currentStory?.content || "Story"}
                </p>
              </div>
            )}
          </div>

          {/* Reaction burst overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {reactionBurst.map(r => (
              <div
                key={r.id}
                className="absolute bottom-24 right-8 text-4xl animate-bounce"
                style={{ animationDuration: "0.5s" }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Nav tap zones */}
          <button className="absolute left-0 top-0 bottom-0 w-1/3 z-10" onClick={prevStory} />
          <button className="absolute right-0 top-0 bottom-0 w-1/3 z-10" onClick={advanceStory} />

          {/* Reaction bar */}
          <div className="absolute bottom-20 left-4 right-4 z-10">
            {showReactions && (
              <div className="flex gap-2 justify-center mb-3 flex-wrap">
                {REACTION_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => { sendReaction(emoji); setShowReactions(false); }}
                    className={`text-2xl p-2 rounded-xl transition-transform hover:scale-125 active:scale-95 ${
                      activeReaction === emoji ? "bg-white/20 scale-125" : "bg-white/10"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2">
            <Input
              placeholder="Reply to story..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-white shrink-0"
              onClick={() => setShowReactions(r => !r)}
            >
              <Heart className={`w-5 h-5 ${showReactions ? "fill-red-400 text-red-400" : ""}`} />
            </Button>
            <Button size="icon" variant="ghost" className="text-white shrink-0" onClick={sendReply}>
              <Send className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white shrink-0">
              <Gift className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white shrink-0">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="absolute bottom-16 right-4 z-10 flex items-center gap-3 text-white/60 text-xs">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{currentStory?.viewCount || 0}</span>
            {Object.entries(currentStory?.reactions || {}).slice(0, 2).map(([emoji, count]) => (
              <span key={emoji} className="flex items-center gap-0.5">{emoji} {count as number}</span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Stories
          </h1>
          <p className="text-sm text-muted-foreground">24-hour moments from creators you follow</p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && ageVerified && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-xl">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <Label className="text-xs cursor-pointer">18+ Content</Label>
              <Switch
                checked={showNSFW}
                onCheckedChange={setShowNSFW}
                className="scale-75"
              />
            </div>
          )}
          {isAuthenticated && (
            <Button onClick={() => setShowCreate(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />
              Add Story
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <f.icon className="w-3.5 h-3.5" />
            {f.label}
            {f.id === "live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Stories Row */}
      {!isAuthenticated ? (
        <div className="text-center py-16 space-y-4">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Sign in to view stories from people you follow</p>
          <Link href="/social">
            <Button className="btn-primary">Browse Public Feed</Button>
          </Link>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No stories match this filter</p>
          <Button variant="outline" onClick={() => setActiveFilter("all")}>Show All Stories</Button>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
          {/* Add Story button */}
          <button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group snap-start"
          >
            <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors group-hover:border-primary">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-center text-muted-foreground">Your Story</span>
          </button>

          {filteredGroups.map((group, idx) => (
            <button
              key={group.userId}
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group snap-start"
            >
              <div className={`relative p-0.5 rounded-full ${
                group.isNSFW
                  ? "bg-gradient-to-tr from-red-500 to-orange-500"
                  : group.hasUnviewed
                  ? "bg-gradient-to-tr from-primary to-purple-500"
                  : "bg-muted"
              }`}>
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-background">
                    <AvatarFallback className="text-lg">{group.userName?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  {group.isNSFW && !ageVerified && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                {group.isLive && (
                  <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-1 py-0 whitespace-nowrap">
                    LIVE
                  </Badge>
                )}
                {group.isNSFW && (
                  <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] px-1 py-0">
                    18+
                  </Badge>
                )}
              </div>
              <span className="text-xs text-center max-w-[64px] truncate">
                {group.userName || `User ${group.userId}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Featured Stories Grid */}
      {filteredGroups.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending Stories
            </h2>
            <Badge variant="outline" className="text-xs">{filteredGroups.length} active</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredGroups.slice(0, 6).map((group, idx) => (
              <button
                key={group.userId}
                onClick={() => openStory(idx)}
                className="relative rounded-xl overflow-hidden aspect-[9/16] max-h-48 bg-gradient-to-br from-slate-800 to-slate-900 border border-border hover:border-primary/40 transition-all group text-left"
              >
                {/* Blurred NSFW overlay */}
                {group.isNSFW && !ageVerified && (
                  <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center gap-2">
                    <Lock className="w-6 h-6 text-white" />
                    <span className="text-white text-xs font-bold">18+ Content</span>
                    <span className="text-white/60 text-[10px]">Tap to verify age</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <p className={`text-sm font-medium text-center leading-snug ${group.isNSFW && !ageVerified ? "blur-sm" : "text-white"}`}>
                    {group.stories[0]?.content}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[10px]">{group.userName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-[10px] font-medium truncate">{group.userName}</span>
                    {group.isNSFW && <Badge className="bg-red-500 text-white text-[8px] px-1 py-0 ml-auto">18+</Badge>}
                    {group.isLive && <Badge className="bg-red-500 text-white text-[8px] px-1 py-0 ml-auto">LIVE</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" />
                      {(group.stories[0]?.viewCount || 0).toLocaleString()}
                    </span>
                    <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {Math.floor((Date.now() - (group.stories[0]?.createdAt || Date.now())) / 3600000)}h
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
