import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Swords, Star, Zap, Crown, Target, Dices, CircleDot, Circle, Spade, Flame, Coins } from "lucide-react";
import { Link } from "wouter";

export default function Arcade() {
  const { isAuthenticated } = useAuth();
  const { data: tournaments, isLoading } = trpc.gamefi.tournaments.useQuery();
  const { data: quests } = trpc.gamefi.quests.useQuery();

  const gameTypes = [
    { name: "PvP Arena", icon: Swords, color: "oklch(0.7_0.2_0)", desc: "1v1 and team battles" },
    { name: "Tournaments", icon: Trophy, color: "oklch(0.8_0.15_90)", desc: "Compete for prizes" },
    { name: "Quests", icon: Target, color: "oklch(0.72 0.28 305)", desc: "Daily & weekly missions" },
    { name: "Ranked", icon: Crown, color: "oklch(0.7_0.15_280)", desc: "Climb the ladder" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[oklch(0.8_0.15_90)] to-[oklch(0.7_0.2_0)] bg-clip-text text-transparent">Arcade</span>
          </h1>
          <p className="text-muted-foreground">Play games, earn tokens, compete in tournaments, and climb the leaderboards.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {gameTypes.map(g => (
            <Card key={g.name} className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all text-center cursor-pointer">
              <g.icon className="w-6 h-6 mx-auto mb-2" style={{ color: g.color }} />
              <h3 className="font-semibold text-sm">{g.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
            </Card>
          ))}
        </div>

        {/* Casino Games */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" /> Casino Games
            <Badge className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30 ml-1">SKY444 Wagering</Badge>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Crash", icon: Flame, color: "from-red-600 to-orange-600", href: "/game/crash", desc: "Ride the curve" },
              { name: "Slots", icon: Star, color: "from-purple-600 to-pink-600", href: "/game/slots", desc: "Spin to win" },
              { name: "Blackjack", icon: Spade, color: "from-slate-700 to-slate-900", href: "/game/blackjack", desc: "Beat the dealer" },
              { name: "Dice", icon: Dices, color: "from-blue-600 to-purple-600", href: "/game/dice", desc: "Over or under" },
              { name: "Roulette", icon: CircleDot, color: "from-red-700 to-red-900", href: "/game/roulette", desc: "Spin the wheel" },
              { name: "Plinko", icon: Circle, color: "from-yellow-500 to-orange-500", href: "/game/plinko", desc: "Drop the ball" },
            ].map(game => (
              <Link key={game.name} href={game.href}>
                <Card className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all text-center cursor-pointer group hover:scale-105">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <game.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm">{game.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{game.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-[oklch(0.8_0.15_90)]" /> Tournaments</h2>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="p-4 border-border/50 animate-pulse"><div className="h-20 bg-muted rounded" /></Card>)}</div>
            ) : tournaments && tournaments.length > 0 ? (
              <div className="space-y-3">
                {tournaments.map((t: any) => (
                  <Card key={t.id} className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <Badge variant="secondary" className="text-[10px]">{t.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{t.description || "Compete for token rewards!"}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.currentPlayers}/{t.maxPlayers} players</span>
                      <span className="font-mono text-primary">Prize: {t.prizePool} SKY444</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-border/50 bg-card/80">
                <Trophy className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No tournaments yet</h3>
                <p className="text-xs text-muted-foreground">Tournaments are coming soon!</p>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-[oklch(0.72 0.28 305)]" /> Active Quests</h2>
            {quests && quests.length > 0 ? (
              <div className="space-y-3">
                {quests.map((q: any) => (
                  <Card key={q.id} className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{q.title}</h3>
                      <Badge className="text-[10px] bg-[oklch(0.8_0.15_90)]/20 text-[oklch(0.8_0.15_90)]">{q.xpReward} XP</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{q.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{q.type} quest</span>
                      <span className="font-mono text-primary">+{q.tokenReward} SKY444</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-border/50 bg-card/80">
                <Target className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No quests available</h3>
                <p className="text-xs text-muted-foreground">Daily and weekly quests are coming soon!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
