import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Heart, Trophy, Zap, Users, Star, Play, ChevronRight,
  Globe, TrendingUp, Award, Clock, Coins, Shield, Target,
  BarChart3, Flame, ArrowRight, CheckCircle2
} from "lucide-react";

const GAMES = [
  {
    id: "crypto-quiz",
    title: "Crypto Quiz Blitz",
    desc: "Answer blockchain questions to earn donation points. 10 questions, 60 seconds each.",
    emoji: "🧠",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    players: 8421,
    donated: 12480,
    category: "Quiz",
    difficulty: "Easy",
    duration: "5 min",
    href: "/games/crypto-quiz",
    charity: "Education Fund",
    charityEmoji: "📚",
    featured: true,
  },
  {
    id: "token-tap",
    title: "Token Tap Frenzy",
    desc: "Tap as fast as you can to generate tokens for charity. Pure speed challenge.",
    emoji: "👆",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    players: 15203,
    donated: 28940,
    category: "Arcade",
    difficulty: "Easy",
    duration: "2 min",
    href: "/games/token-tap",
    charity: "Clean Water Initiative",
    charityEmoji: "💧",
    featured: true,
  },
  {
    id: "block-builder",
    title: "Block Builder",
    desc: "Stack blockchain blocks as high as possible. Each block = 1 SKY444 donated.",
    emoji: "🏗️",
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    players: 6782,
    donated: 9340,
    category: "Puzzle",
    difficulty: "Medium",
    duration: "5 min",
    href: "/games/block-builder",
    charity: "Hunger Relief",
    charityEmoji: "🍎",
    featured: true,
  },
  {
    id: "defi-runner",
    title: "DeFi Runner",
    desc: "Run through the DeFi landscape, collect yield, dodge rug pulls.",
    emoji: "🏃",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    players: 4120,
    donated: 6200,
    category: "Runner",
    difficulty: "Medium",
    duration: "3 min",
    href: "/games/defi-runner",
    charity: "Mental Health Fund",
    charityEmoji: "🧘",
    featured: false,
  },
  {
    id: "nft-match",
    title: "NFT Memory Match",
    desc: "Match NFT pairs to unlock charity donations. Classic memory game with crypto twist.",
    emoji: "🎴",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    players: 3890,
    donated: 5120,
    category: "Memory",
    difficulty: "Easy",
    duration: "4 min",
    href: "/games/nft-match",
    charity: "Animal Rescue",
    charityEmoji: "🐾",
    featured: false,
  },
  {
    id: "hash-breaker",
    title: "Hash Breaker",
    desc: "Solve cryptographic puzzles to mine charity tokens. Educational and fun.",
    emoji: "🔐",
    color: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    players: 2341,
    donated: 3890,
    category: "Puzzle",
    difficulty: "Hard",
    duration: "10 min",
    href: "/games/hash-breaker",
    charity: "STEM Education",
    charityEmoji: "🔬",
    featured: false,
  },
];

const CHARITIES = [
  { name: "Education Fund", emoji: "📚", raised: 48200, goal: 100000, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { name: "Clean Water Initiative", emoji: "💧", raised: 72400, goal: 100000, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { name: "Hunger Relief", emoji: "🍎", raised: 31800, goal: 50000, color: "text-purple-400", bg: "bg-purple-600/10", border: "border-purple-500/30" },
  { name: "Mental Health Fund", emoji: "🧘", raised: 19200, goal: 50000, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
];

const LEADERBOARD = [
  { rank: 1, name: "crypto_alice", avatar: "A", donated: 4820, games: 142, badge: "🏆" },
  { rank: 2, name: "defi_bob", avatar: "B", donated: 3940, games: 118, badge: "🥈" },
  { rank: 3, name: "web3_carol", avatar: "C", donated: 3210, games: 97, badge: "🥉" },
  { rank: 4, name: "skyler_blue", avatar: "S", donated: 2890, games: 84, badge: "⭐" },
  { rank: 5, name: "nft_dave", avatar: "D", donated: 2340, games: 71, badge: "⭐" },
];

export default function GamingForCharity() {
  const [activeTab, setActiveTab] = useState<"games" | "charities" | "leaderboard">("games");
  const [filter, setFilter] = useState("all");

  const totalDonated = GAMES.reduce((s, g) => s + g.donated, 0);
  const totalPlayers = GAMES.reduce((s, g) => s + g.players, 0);

  const filteredGames = filter === "all" ? GAMES : GAMES.filter(g => g.category.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-green-500/5 via-background to-purple-500/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
        <div className="container py-12 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-purple-400 border-purple-500/30 font-mono">PLAY TO DONATE</Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 font-mono">LIVE</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Gaming for <span className="text-purple-400">Charity</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Play games, earn points, and automatically donate to verified charities. Every game you play generates real SKY444 donations.
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Donated", value: `${(totalDonated / 1000).toFixed(1)}K SKY444`, icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
              { label: "Active Players", value: totalPlayers.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Games Available", value: GAMES.length.toString(), icon: Gamepad2, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Charities Funded", value: CHARITIES.length.toString(), icon: Globe, color: "text-purple-400", bg: "bg-purple-600/10" },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`rounded-xl border border-border/50 ${stat.bg} p-4 flex items-center gap-3`}>
                  <Icon className={`h-6 w-6 ${stat.color} shrink-0`} />
                  <div>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Featured Game CTA */}
          <Link href="/games/token-tap">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-600 text-white font-bold transition-all cursor-pointer shadow-lg shadow-green-500/20 hover:scale-105">
              <Play className="h-5 w-5" />
              Play Now & Donate
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border/50 mb-8">
          {(["games", "charities", "leaderboard"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px capitalize ${activeTab === tab ? "border-purple-500 text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>
          ))}
        </div>

        {activeTab === "games" && (
          <div>
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "quiz", "arcade", "puzzle", "runner", "memory"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl border text-sm capitalize transition-all ${filter === f ? "border-purple-500/50 bg-purple-600/10 text-purple-400" : "border-border/50 text-muted-foreground hover:border-border"}`}>{f}</button>
              ))}
            </div>

            {/* Featured Games */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Flame className="h-5 w-5 text-orange-400" />Featured Games</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {GAMES.filter(g => g.featured).map(game => (
                  <Link key={game.id} href={game.href}>
                    <div className={`rounded-xl border ${game.border} bg-gradient-to-br ${game.color} p-5 hover:scale-[1.02] transition-all cursor-pointer group`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{game.emoji}</span>
                        <Badge variant="outline" className={`text-xs ${game.iconColor} border-current`}>{game.category}</Badge>
                      </div>
                      <h3 className="font-bold text-base mb-1">{game.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{game.desc}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{game.duration}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{game.players.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/30 border border-border/20">
                        <span>{game.charityEmoji}</span>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{game.charity}</p>
                          <p className={`text-xs ${game.iconColor} font-mono`}>{game.donated.toLocaleString()} SKY444 raised</p>
                        </div>
                        <Heart className={`h-3.5 w-3.5 ${game.iconColor}`} />
                      </div>
                      <Button className="w-full mt-3 bg-primary text-primary-foreground gap-2 group-hover:bg-primary/90">
                        <Play className="h-4 w-4" />Play & Donate
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Games */}
            <div>
              <h2 className="text-lg font-bold mb-4">All Games</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.map(game => (
                  <Link key={game.id} href={game.href}>
                    <div className="rounded-xl border border-border/50 bg-card/30 p-4 hover:border-purple-500/30 hover:bg-purple-600/5 transition-all cursor-pointer flex items-center gap-4">
                      <span className="text-2xl shrink-0">{game.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm truncate">{game.title}</p>
                          <Badge variant="outline" className="text-xs shrink-0">{game.difficulty}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{game.desc}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{game.duration}</span>
                          <span className={`flex items-center gap-1 ${game.iconColor}`}><Heart className="h-3 w-3" />{(game.donated / 1000).toFixed(1)}K donated</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "charities" && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm mb-6">All donations are verified on-chain. 95% of every SKY444 earned goes directly to the charity.</p>
            {CHARITIES.map(charity => {
              const pct = Math.round((charity.raised / charity.goal) * 100);
              return (
                <div key={charity.name} className={`rounded-xl border ${charity.border} ${charity.bg} p-5`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{charity.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{charity.name}</h3>
                      <p className="text-xs text-muted-foreground">Verified non-profit · On-chain transparent</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${charity.color}`}>{charity.raised.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of {charity.goal.toLocaleString()} SKY444</p>
                    </div>
                  </div>
                  <Progress value={pct} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pct}% funded</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-purple-400" />Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <p className="text-muted-foreground text-sm mb-6">Top donors this month. Play more games to climb the leaderboard and earn exclusive badges.</p>
            <div className="space-y-3">
              {LEADERBOARD.map(player => (
                <div key={player.rank} className={`rounded-xl border p-4 flex items-center gap-4 ${player.rank <= 3 ? "border-yellow-500/30 bg-yellow-500/5" : "border-border/50 bg-card/30"}`}>
                  <div className="w-8 text-center">
                    <span className="text-lg">{player.badge}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm">{player.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.games} games played</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-400">{player.donated.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">SKY444 donated</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl border border-border/50 bg-card/30 text-center">
              <p className="text-sm text-muted-foreground mb-3">Your current rank: <span className="text-primary font-bold">#47</span></p>
              <Link href="/games/token-tap">
                <Button className="bg-purple-600 hover:bg-purple-600 text-white gap-2">
                  <Play className="h-4 w-4" />Play to Climb the Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
