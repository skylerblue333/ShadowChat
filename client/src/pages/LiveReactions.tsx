import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Zap, Heart, Flame, Star, Trophy, Sparkles, Users, TrendingUp } from "lucide-react";

const REACTION_EMOJIS = ["❤️", "🔥", "⚡", "🚀", "💎", "👑", "🎉", "💯", "🌟", "😍", "🤯", "💪"];

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  createdAt: number;
}

interface ReactionCount {
  emoji: string;
  count: number;
  recent: boolean;
}

const INITIAL_COUNTS: ReactionCount[] = [
  { emoji: "❤️", count: 4821, recent: false },
  { emoji: "🔥", count: 3204, recent: false },
  { emoji: "⚡", count: 2891, recent: false },
  { emoji: "🚀", count: 2103, recent: false },
  { emoji: "💎", count: 1847, recent: false },
  { emoji: "👑", count: 1523, recent: false },
  { emoji: "🎉", count: 1201, recent: false },
  { emoji: "💯", count: 987, recent: false },
  { emoji: "🌟", count: 842, recent: false },
  { emoji: "😍", count: 731, recent: false },
  { emoji: "🤯", count: 612, recent: false },
  { emoji: "💪", count: 498, recent: false },
];

export default function LiveReactions() {
  const { user } = useAuth();
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const [counts, setCounts] = useState<ReactionCount[]>(INITIAL_COUNTS);
  const [totalReactions, setTotalReactions] = useState(21261);
  const [viewerCount, setViewerCount] = useState(1847);
  const [reactionRate, setReactionRate] = useState(142);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate incoming reactions from other users
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const randomEmoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
      const x = 10 + Math.random() * 80;

      setFloating(prev => [
        ...prev.slice(-30),
        { id: Math.random().toString(36).slice(2), emoji: randomEmoji, x, createdAt: Date.now() }
      ]);

      setCounts(prev => prev.map(r =>
        r.emoji === randomEmoji
          ? { ...r, count: r.count + 1, recent: true }
          : { ...r, recent: false }
      ));

      setTotalReactions(prev => prev + 1);
      setViewerCount(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0));
      setReactionRate(prev => Math.max(50, Math.min(500, prev + (Math.random() - 0.5) * 20)));
    }, 400);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Remove old floating reactions
  useEffect(() => {
    const cleanup = setInterval(() => {
      const cutoff = Date.now() - 3000;
      setFloating(prev => prev.filter(r => r.createdAt > cutoff));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const sendReaction = useCallback((emoji: string) => {
    const x = 10 + Math.random() * 80;
    setFloating(prev => [
      ...prev,
      { id: Math.random().toString(36).slice(2), emoji, x, createdAt: Date.now() }
    ]);
    setCounts(prev => prev.map(r =>
      r.emoji === emoji ? { ...r, count: r.count + 1, recent: true } : r
    ));
    setTotalReactions(prev => prev + 1);
  }, []);

  const sortedCounts = [...counts].sort((a, b) => b.count - a.count);
  const topReaction = sortedCounts[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <Zap className="w-5 h-5 text-yellow-400" />
          <h1 className="text-lg font-bold">Live Reactions</h1>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs animate-pulse">
            ● LIVE
          </Badge>
          <div className="ml-auto flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {viewerCount.toLocaleString()}</span>
            <span className="flex items-center gap-1 text-yellow-400"><TrendingUp className="w-3 h-3" /> {Math.round(reactionRate)}/min</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main reaction stage */}
          <div className="lg:col-span-2 space-y-4">
            {/* Floating reaction stage */}
            <Card className="bg-black/60 border-white/10 relative overflow-hidden" style={{ height: 320 }}>
              <div ref={containerRef} className="absolute inset-0">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />

                {/* Stream placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🌑</div>
                    <p className="text-gray-500 text-sm">Live Stream / Post Preview</p>
                    <p className="text-gray-600 text-xs mt-1">Reactions overlay here in real streams</p>
                  </div>
                </div>

                {/* Floating reactions */}
                {floating.map(r => {
                  const age = (Date.now() - r.createdAt) / 3000;
                  const opacity = Math.max(0, 1 - age);
                  const translateY = -age * 200;
                  return (
                    <div
                      key={r.id}
                      className="absolute bottom-4 text-2xl pointer-events-none select-none"
                      style={{
                        left: `${r.x}%`,
                        transform: `translateY(${translateY}px) scale(${1 + (1 - age) * 0.3})`,
                        opacity,
                        transition: "none",
                        filter: `drop-shadow(0 0 8px rgba(168,85,247,0.6))`,
                      }}
                    >
                      {r.emoji}
                    </div>
                  );
                })}

                {/* Reaction rate meter */}
                <div className="absolute top-3 right-3 bg-black/60 rounded-lg px-2 py-1 text-xs text-yellow-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {Math.round(reactionRate)}/min
                </div>

                {/* Total counter */}
                <div className="absolute top-3 left-3 bg-black/60 rounded-lg px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-400" />
                  {totalReactions.toLocaleString()} total
                </div>
              </div>
            </Card>

            {/* Reaction buttons */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Send a Reaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {REACTION_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => sendReaction(emoji)}
                      className="aspect-square flex items-center justify-center text-2xl rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 hover:border-purple-500/50 active:scale-90 transition-all duration-100 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Tap to send — reactions appear live for all viewers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Leaderboard */}
          <div className="space-y-4">
            {/* Top reaction */}
            <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-5xl mb-2">{topReaction?.emoji}</div>
                <div className="text-xl font-bold text-yellow-400">{topReaction?.count.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Most popular reaction</div>
              </CardContent>
            </Card>

            {/* Reaction leaderboard */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" /> Reaction Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortedCounts.map((r, i) => {
                  const pct = Math.round((r.count / totalReactions) * 100);
                  return (
                    <div key={r.emoji} className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${r.recent ? "bg-purple-500/10" : ""}`}>
                      <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                      <span className="text-lg">{r.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-300">{r.count.toLocaleString()}</span>
                          <span className="text-gray-500">{pct}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${r.recent ? "bg-purple-400" : "bg-white/30"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Live stats */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Live Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Viewers", value: viewerCount.toLocaleString(), icon: Users, color: "text-blue-400" },
                  { label: "Total Reactions", value: totalReactions.toLocaleString(), icon: Heart, color: "text-pink-400" },
                  { label: "Reactions/min", value: Math.round(reactionRate).toString(), icon: TrendingUp, color: "text-yellow-400" },
                  { label: "Unique Reactors", value: Math.round(viewerCount * 0.73).toLocaleString(), icon: Star, color: "text-green-400" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <stat.icon className={`w-3 h-3 ${stat.color}`} />
                      {stat.label}
                    </div>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
