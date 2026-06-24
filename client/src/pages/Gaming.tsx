import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Gamepad2, Trophy, Zap, Users, Star, Play, TrendingUp, Coins, Target, Sword, Crown, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const GAME_CATEGORIES = [
  { id: "battle", name: "Battle Arena", icon: Sword, color: "oklch(0.72 0.28 20)", desc: "PvP combat for SKY444 prizes", href: "/arcade" },
  { id: "crash", name: "Crash", icon: TrendingUp, color: "oklch(0.72 0.28 20)", desc: "Ride the multiplier — cash out before crash!", href: "/game/crash" },
  { id: "slots", name: "Slots", icon: Star, color: "oklch(0.72 0.28 70)", desc: "Spin the reels for SKY444 jackpots", href: "/game/slots" },
  { id: "blackjack", name: "Blackjack", icon: Crown, color: "oklch(0.72 0.28 160)", desc: "Beat the dealer — Split, Double Down", href: "/game/blackjack" },
  { id: "quiz", name: "Crypto Quiz", icon: Zap, color: "oklch(0.72 0.28 70)", desc: "Test your Web3 knowledge", href: "/games/crypto-quiz" },
  { id: "tap", name: "Token Tap", icon: Coins, color: "oklch(0.72 0.28 305)", desc: "Tap to earn SKY444", href: "/games/token-tap" },
  { id: "build", name: "Block Builder", icon: Shield, color: "oklch(0.72 0.28 160)", desc: "Build your DeFi empire", href: "/games/block-builder" },
  { id: "quest", name: "Quest Board", icon: Target, color: "oklch(0.72 0.28 220)", desc: "Daily & weekly missions", href: "/games/quest-board" },
  { id: "tournament", name: "Tournaments", icon: Trophy, color: "oklch(0.80 0.18 70)", desc: "Compete for prize pools", href: "/tournaments" },
];

export default function Gaming() {
  const { user } = useAuth();
  const { data: tournaments, isLoading: tournamentsLoading } = trpc.gamefi.tournaments.useQuery();
  const { data: quests } = trpc.gamefi.quests.useQuery();
  const { data: leaderboard } = trpc.gamefi.leaderboard.useQuery({ type: "global", limit: 10 });
  const { data: seasonPass } = trpc.gamefi.seasonPass.useQuery();
  const { data: platformStats } = trpc.platform.stats.useQuery();

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.07 0.025 270)' }}>
      {/* ═══ CINEMATIC GAMING HERO ═══ */}
      <div className="hero-cinematic border-b border-slate-800/60" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="glow-orb glow-orb-purple w-80 h-80 -top-10 left-1/4 animate-hero-float" />
        <div className="glow-orb w-64 h-64 top-0 right-10 animate-hero-float" style={{ background: 'oklch(0.55 0.28 145 / 0.20)', animationDelay: '3s' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.28 145), oklch(0.72 0.28 305))' }}>
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-4xl font-black text-rainbow">SKY444 Gaming Hub</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold">P2E LIVE</span>
                </div>
              </div>
              <p className="text-sm mt-1 desc-metallic">Play games, complete quests, and earn real SKY444 tokens.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Users,  value: platformStats?.totalUsers || 0, label: 'Players',      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
              { icon: Trophy, value: tournaments?.length || 0,        label: 'Tournaments', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
              { icon: Target, value: quests?.length || 0,             label: 'Quests',      color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
              { icon: Coins,  value: '∞',                             label: 'SKY444 Prizes',color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color} shrink-0`} />
                  <div>
                    <div className={`text-lg font-black stat-number ${stat.color}`}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</div>
                    <div className="text-[10px] text-slate-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Game Categories */}
        <section>
          <h2 className="text-xl font-bold text-rainbow-slow mb-4 flex items-center gap-2 section-header-neon">
            <Gamepad2 className="w-5 h-5 icon-rainbow" />
            Choose Your Game
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GAME_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={cat.href}>
                  <div
                    className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group"
                    style={{
                      background: 'oklch(0.11 0.025 270)',
                      border: `1px solid ${cat.color}33`,
                      boxShadow: `0 0 20px ${cat.color}11`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${cat.color}22` }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{cat.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: cat.color }}>
                      <Play className="w-3 h-3" />
                      Play Now
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tournaments */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-rainbow-slow flex items-center gap-2 section-header-neon">
              <Trophy className="w-5 h-5 icon-rainbow" />
              Live Tournaments
            </h2>
            {tournamentsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'oklch(0.13 0.025 270)' }} />
                ))}
              </div>
            ) : !tournaments || tournaments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                <Trophy className="w-10 h-10 mb-3 opacity-30" style={{ color: 'oklch(0.80 0.18 70)' }} />
                <p className="text-white font-medium mb-1">No Active Tournaments</p>
                <p className="text-sm" style={{ color: 'oklch(0.50 0.020 275)' }}>Check back soon for upcoming events</p>
                {user && (
                  <Link href="/tournaments">
                    <Button size="sm" className="mt-4" style={{ background: 'oklch(0.80 0.18 70)', color: 'black' }}>
                      Create Tournament
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tournaments.slice(0, 5).map((t: any) => (
                  <Link key={t.id} href={`/tournaments/${t.id}`}>
                    <div
                      className="p-4 rounded-2xl cursor-pointer transition-all hover:opacity-90"
                      style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">{t.name}</span>
                            <Badge className="text-[10px] px-1.5 py-0" style={{
                              background: t.status === 'active' ? 'oklch(0.72 0.28 160 / 0.20)' : 'oklch(0.80 0.18 70 / 0.20)',
                              color: t.status === 'active' ? 'oklch(0.72 0.28 160)' : 'oklch(0.80 0.18 70)',
                              border: 'none',
                            }}>
                              {t.status === 'active' ? '● Live' : 'Upcoming'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {t.currentParticipants || 0}/{t.maxParticipants} players
                            </span>
                            <span className="flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {t.prizePool || 0} SKY444
                            </span>
                          </div>
                        </div>
                        <Button size="sm" style={{ background: 'oklch(0.72 0.28 305 / 0.15)', color: 'oklch(0.85 0.25 305)', border: 'none' }}>
                          Join
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/tournaments">
                  <Button variant="ghost" className="w-full text-sm" style={{ color: 'oklch(0.72 0.28 305)' }}>
                    View All Tournaments →
                  </Button>
                </Link>
              </div>
            )}

            {/* Active Quests */}
            <h2 className="text-xl font-bold text-rainbow-slow flex items-center gap-2 pt-2 section-header-neon">
              <Target className="w-5 h-5 icon-rainbow" />
              Active Quests
            </h2>
            {!quests || quests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 rounded-2xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                <Target className="w-8 h-8 mb-2 opacity-30" style={{ color: 'oklch(0.72 0.28 160)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.020 275)' }}>No active quests right now</p>
              </div>
            ) : (
              <div className="space-y-2">
                {quests.slice(0, 4).map((q: any) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.72 0.28 160 / 0.15)' }}>
                      <Target className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 160)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{q.name}</p>
                      <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{q.description || q.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold" style={{ color: 'oklch(0.80 0.18 70)' }}>+{q.rewardXp || 0} XP</p>
                      <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{q.rewardTokens || 0} SKY444</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Season Pass */}
            {seasonPass && seasonPass.season > 0 && (
              <div className="p-4 rounded-2xl" style={{
                background: 'linear-gradient(135deg, oklch(0.13 0.04 305) 0%, oklch(0.11 0.025 270) 100%)',
                border: '1px solid oklch(0.72 0.28 305 / 0.25)',
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4" style={{ color: 'oklch(0.80 0.18 70)' }} />
                  <span className="text-white text-sm font-bold">Season {seasonPass.season}</span>
                  <Badge className="text-[10px]" style={{ background: 'oklch(0.80 0.18 70 / 0.20)', color: 'oklch(0.80 0.18 70)', border: 'none' }}>
                    {seasonPass.endsIn}
                  </Badge>
                </div>
                <p className="text-xs mb-3" style={{ color: 'oklch(0.50 0.020 275)' }}>{seasonPass.name}</p>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: 'oklch(0.50 0.020 275)' }}>Progress</span>
                  <span className="text-white">{seasonPass.currentTier}/{seasonPass.tiers} tiers</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.18 0.025 270)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(seasonPass.currentTier / seasonPass.tiers) * 100}%`,
                    background: 'oklch(0.72 0.28 305)',
                  }} />
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
                Top Players
              </h3>
              <div className="space-y-2">
                {!leaderboard || leaderboard.length === 0 ? (
                  <div className="text-center py-6 rounded-xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                    <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>No players yet — be first!</p>
                  </div>
                ) : (
                  leaderboard.slice(0, 8).map((p: any, i: number) => (
                    <Link key={p.id} href={`/profile/${p.id}`}>
                      <div
                        className="flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors hover:opacity-80"
                        style={{ background: 'oklch(0.11 0.025 270)' }}
                      >
                        <span className="w-5 text-center text-xs font-bold" style={{
                          color: i === 0 ? 'oklch(0.80 0.18 70)' : i === 1 ? 'oklch(0.75 0.02 270)' : i === 2 ? 'oklch(0.65 0.12 50)' : 'oklch(0.45 0.020 275)',
                        }}>
                          {i + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden" style={{ background: 'oklch(0.72 0.28 305 / 0.20)' }}>
                          {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : (p.displayName || p.name || "?")[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{p.displayName || p.name || "Player"}</p>
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'oklch(0.72 0.28 305)' }}>
                          {(p.xp || 0).toLocaleString()} XP
                        </span>
                      </div>
                    </Link>
                  ))
                )}
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm" className="w-full text-xs" style={{ color: 'oklch(0.72 0.28 305)' }}>
                    Full Leaderboard →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Quick Access</h3>
              <div className="space-y-1">
                {[
                  { href: "/arcade", label: "🕹️ Arcade Games" },
                  { href: "/tournaments", label: "🏆 Tournaments" },
                  { href: "/leaderboard", label: "📊 Leaderboards" },
                  { href: "/staking", label: "💎 Stake to Play" },
                  { href: "/sky-school", label: "🎓 Sky School" },
                ].map(link => (
                  <Link key={link.href} href={link.href}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors hover:opacity-80" style={{ color: 'oklch(0.60 0.025 275)' }}>
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
