/**
 * AmbientFeed — Feed as Living Environment
 * Posts are not a list. They are objects floating in a space.
 * AI highlights what matters. Layout shifts dynamically.
 * Trending content radiates energy. Everything is alive.
 */
import { useState, useEffect, useRef } from "react";
import { Brain, Zap, TrendingUp, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles, Activity, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Ambient particle system — purely CSS-driven
const AMBIENT_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 8 + 4,
  color: ["purple", "cyan", "pink", "blue"][Math.floor(Math.random() * 4)],
}));

const AI_HIGHLIGHTS = [
  "This post matches your interest in Web3 infrastructure",
  "Creator you follow just went live",
  "Trending in your network: #SKY444 +340%",
  "3 people you know liked this",
  "High engagement signal — 94% positive sentiment",
];

const ENERGY_LEVELS = ["low", "medium", "high", "viral"] as const;
type EnergyLevel = typeof ENERGY_LEVELS[number];

const ENERGY_STYLES: Record<EnergyLevel, { ring: string; glow: string; badge: string }> = {
  low: { ring: "ring-border/30", glow: "", badge: "bg-secondary text-muted-foreground" },
  medium: { ring: "ring-blue-500/30", glow: "shadow-blue-500/10", badge: "bg-blue-500/20 text-blue-400" },
  high: { ring: "ring-purple-500/40", glow: "shadow-purple-500/20", badge: "bg-purple-500/20 text-purple-400" },
  viral: { ring: "ring-pink-500/60", glow: "shadow-pink-500/30", badge: "bg-pink-500/20 text-pink-400" },
};

interface FeedPost {
  id: number;
  author: string;
  authorInitial: string;
  authorColor: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  energy: EnergyLevel;
  aiHighlight: string | null;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  size: "normal" | "featured" | "compact";
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: 1,
    author: "NOVA",
    authorInitial: "N",
    authorColor: "from-purple-500 to-pink-500",
    content: "The next phase of Web3 social isn't about decentralization — it's about AI-mediated trust. When your reputation is computed, not claimed, everything changes.",
    time: "2m ago",
    likes: 847,
    comments: 124,
    energy: "viral",
    aiHighlight: "High relevance: matches your interest in AI + Web3",
    tags: ["#Web3", "#AI", "#Trust"],
    isLiked: false,
    isBookmarked: false,
    size: "featured",
  },
  {
    id: 2,
    author: "Skyler",
    authorInitial: "S",
    authorColor: "from-cyan-500 to-blue-500",
    content: "Just deployed the action engine. Chat is now a command terminal. Every message can become a payment, a task, or a hire. This is what the OS feels like.",
    time: "8m ago",
    likes: 312,
    comments: 67,
    energy: "high",
    aiHighlight: "From someone you follow",
    tags: ["#ActionOS", "#ShadowChat"],
    isLiked: true,
    isBookmarked: false,
    size: "normal",
  },
  {
    id: 3,
    author: "CIPHER",
    authorInitial: "C",
    authorColor: "from-green-500 to-emerald-500",
    content: "SKY444 staking APY just hit 34.7%. Treasury at $2.1M. Governance vote passes tomorrow.",
    time: "15m ago",
    likes: 203,
    comments: 41,
    energy: "high",
    aiHighlight: null,
    tags: ["#SKY444", "#DeFi", "#Staking"],
    isLiked: false,
    isBookmarked: true,
    size: "compact",
  },
  {
    id: 4,
    author: "PRISM",
    authorInitial: "P",
    authorColor: "from-orange-500 to-red-500",
    content: "Feed ranking model v3 is live. Engagement prediction accuracy: 91.4%. The feed now knows what you want before you do.",
    time: "22m ago",
    likes: 156,
    comments: 29,
    energy: "medium",
    aiHighlight: "Relevant to your AI interests",
    tags: ["#AI", "#FeedRanking"],
    isLiked: false,
    isBookmarked: false,
    size: "normal",
  },
  {
    id: 5,
    author: "Alex Rivera",
    authorInitial: "A",
    authorColor: "from-pink-500 to-rose-500",
    content: "The dating compatibility engine just matched me with someone who has 94% alignment. We've been talking for 3 hours. This is different.",
    time: "1h ago",
    likes: 89,
    comments: 18,
    energy: "medium",
    aiHighlight: "94% dating compatibility with this person",
    tags: ["#ShadowMatch", "#AI"],
    isLiked: false,
    isBookmarked: false,
    size: "compact",
  },
];

function AmbientPost({ post, onLike, onBookmark }: { post: FeedPost; onLike: (id: number) => void; onBookmark: (id: number) => void }) {
  const [showAI, setShowAI] = useState(false);
  const energy = ENERGY_STYLES[post.energy];

  return (
    <div
      className={`relative card ring-1 ${energy.ring} shadow-lg ${energy.glow} transition-all duration-300 hover:scale-[1.01] hover:shadow-xl
        ${post.size === "featured" ? "col-span-2" : post.size === "compact" ? "" : ""}
      `}
    >
      {/* Energy indicator */}
      {post.energy !== "low" && (
        <div className="absolute -top-1.5 -right-1.5">
          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${energy.badge}`}>
            {post.energy === "viral" ? "🔥 Viral" : post.energy === "high" ? "⚡ Hot" : "📈 Rising"}
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.authorColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
            {post.authorInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{post.author}</div>
            <div className="text-xs text-muted-foreground">{post.time}</div>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Content */}
        <p className={`text-muted-foreground mb-3 leading-relaxed ${post.size === "featured" ? "text-base" : "text-sm"}`}>
          {post.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

        {/* AI Highlight */}
        {post.aiHighlight && (
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 mb-3 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            AI insight
          </button>
        )}
        {showAI && post.aiHighlight && (
          <div className="mb-3 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
            <Brain className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {post.aiHighlight}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all ${post.isLiked ? "text-pink-400 bg-pink-500/10" : "text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10"}`}
          >
            <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-current" : ""}`} />
            {post.likes}
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-all">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onBookmark(post.id)}
            className={`ml-auto flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all ${post.isBookmarked ? "text-yellow-400 bg-yellow-500/10" : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-500/10"}`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${post.isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AmbientFeed() {
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [aiMode, setAiMode] = useState(true);
  const [layout, setLayout] = useState<"grid" | "stream" | "focus">("grid");
  const [ambientHighlight, setAmbientHighlight] = useState(0);
  const feedData = trpc.social.getFeed.useQuery({ limit: 20 });

  // Rotate ambient AI highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientHighlight(prev => (prev + 1) % AI_HIGHLIGHTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleBookmark = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
  };

  // Merge real feed data if available
  const displayPosts = feedData.data && feedData.data.length > 0
    ? feedData.data.slice(0, 3).map((p: any, i: number) => ({
        id: p.id,
        author: p.author?.username || "User",
        authorInitial: (p.author?.username || "U")[0].toUpperCase(),
        authorColor: ["from-purple-500 to-pink-500", "from-cyan-500 to-blue-500", "from-green-500 to-emerald-500"][i % 3],
        content: p.content || "",
        time: "just now",
        likes: p.likeCount || 0,
        comments: p.commentCount || 0,
        energy: (["medium", "high", "viral"] as EnergyLevel[])[i % 3],
        aiHighlight: i === 0 ? "High relevance: matches your interests" : null,
        tags: [] as string[],
        isLiked: false,
        isBookmarked: false,
        size: (i === 0 ? "featured" : "normal") as "featured" | "normal" | "compact",
      }))
    : posts;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient particle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {AMBIENT_PARTICLES.map(p => (
          <div
            key={p.id}
            className={`absolute rounded-full opacity-20 animate-pulse`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color === "purple" ? "#a855f7" : p.color === "cyan" ? "#06b6d4" : p.color === "pink" ? "#ec4899" : "#3b82f6",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Ambient Feed
            </h1>
            <p className="text-xs text-muted-foreground">Feed as living environment</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={aiMode ? "default" : "outline"}
              size="sm"
              className={`gap-1.5 text-xs ${aiMode ? "bg-purple-500 hover:bg-purple-400" : ""}`}
              onClick={() => setAiMode(!aiMode)}
            >
              <Brain className="w-3.5 h-3.5" />
              AI {aiMode ? "On" : "Off"}
            </Button>
            <div className="flex gap-1 p-0.5 bg-secondary/50 rounded-lg">
              {(["grid", "stream", "focus"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-2 py-1 rounded text-xs capitalize transition-all ${layout === l ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient AI banner — rotates insights */}
        {aiMode && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs text-cyan-300 transition-all duration-500">{AI_HIGHLIGHTS[ambientHighlight]}</p>
          </div>
        )}

        {/* Live activity strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { label: "847 reactions", icon: Heart, color: "text-pink-400" },
            { label: "12 live streams", icon: Activity, color: "text-red-400" },
            { label: "4 trending topics", icon: TrendingUp, color: "text-green-400" },
            { label: "23 new actions", icon: Zap, color: "text-yellow-400" },
            { label: "156 views/min", icon: Eye, color: "text-blue-400" },
          ].map(item => {
            const ItemIcon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 shrink-0 text-xs">
                <ItemIcon className={`w-3 h-3 ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Feed grid */}
        <div className={`
          ${layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}
          ${layout === "stream" ? "space-y-3" : ""}
          ${layout === "focus" ? "max-w-lg mx-auto space-y-4" : ""}
        `}>
          {displayPosts.map(post => (
            <AmbientPost
              key={post.id}
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>

        {/* Load more */}
        <div className="text-center py-4">
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => toast("Loading more from the ambient stream...")}
          >
            <Activity className="w-4 h-4" />
            Load more from the stream
          </Button>
        </div>
      </div>
    </div>
  );
}
