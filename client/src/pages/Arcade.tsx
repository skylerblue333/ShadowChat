import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, IconTile } from "@/components/ui/sk";
import { toast } from "sonner";
import { Gamepad2, Trophy, Heart, Loader2 } from "lucide-react";
import Blackjack from "@/components/games/Blackjack";
import Roulette from "@/components/games/Roulette";
import TicTacToe from "@/components/games/TicTacToe";
import Dice from "@/components/games/Dice";
import Snake from "@/components/games/Snake";

type GameId = "blackjack" | "roulette" | "tictactoe" | "dice" | "snake";
const GAMES: { id: GameId; label: string; emoji: string }[] = [
  { id: "blackjack", label: "Blackjack", emoji: "🃏" },
  { id: "roulette", label: "Roulette", emoji: "🎡" },
  { id: "tictactoe", label: "Tic-Tac-Toe", emoji: "⭕" },
  { id: "dice", label: "Dice", emoji: "🎲" },
  { id: "snake", label: "Snake", emoji: "🐍" },
];

export default function Arcade() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [game, setGame] = useState<GameId>("blackjack");
  const [donate, setDonate] = useState(true);

  const { data: campaigns } = trpc.charity.campaigns.useQuery();
  const { data: leaderboard } = trpc.gaming.leaderboard.useQuery({});
  const { data: stats } = trpc.gaming.myStats.useQuery(undefined, { enabled: isAuthenticated });

  const record = trpc.gaming.recordSession.useMutation({
    onSuccess: () => { utils.gaming.leaderboard.invalidate(); utils.gaming.myStats.invalidate(); utils.charity.campaigns.invalidate(); },
  });

  const campaignId = campaigns?.[0]?.id;

  function handleEnd(scoreVal: number, result: string) {
    if (!isAuthenticated) { toast.info("Connect to save your score & donate"); return; }
    const charityDonation = donate ? Math.round(scoreVal * 0.05) : 0;
    record.mutate({ game, score: scoreVal, result, charityDonation, campaignId });
    if (charityDonation > 0) toast.success(`Score saved! ${charityDonation} donated to charity`);
    else toast.success("Score saved!");
  }

  const Active = { blackjack: Blackjack, roulette: Roulette, tictactoe: TicTacToe, dice: Dice, snake: Snake }[game];

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={Gamepad2} accent="magenta" />
        <div>
          <h1 className="font-extrabold text-3xl">Arcade</h1>
          <p className="text-muted-foreground text-sm">Fully playable games — every win fuels charity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-2">
            {GAMES.map(g => (
              <button key={g.id} onClick={() => setGame(g.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${game === g.id ? "sk-gradient" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>

          <Card className="p-6 min-h-[360px] flex items-center justify-center">
            <Active onEnd={handleEnd} />
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={donate} onChange={e => setDonate(e.target.checked)} />
              <Heart className="w-4 h-4 text-[var(--neon-magenta)]" /> Donate 5% of score to charity
            </label>
            {campaigns?.[0] && <span className="text-xs text-muted-foreground">→ {campaigns[0].title}</span>}
          </Card>
        </div>

        <div className="space-y-6">
          {isAuthenticated && stats && (
            <Card className="p-5">
              <h3 className="font-bold text-lg mb-3">Your Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total score</span><span className="text-[var(--neon-cyan)] font-bold">{stats.totalScore}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Games played</span><span>{stats.games}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Donated</span><span className="text-[var(--neon-magenta)] font-bold">{stats.donated}</span></div>
              </div>
            </Card>
          )}
          {!isAuthenticated && (
            <Card className="p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">Connect to save scores & donate.</p>
              <button onClick={() => (window.location.href = getLoginUrl())} className="sk-gradient px-5 py-2.5 rounded-full font-bold">Connect</button>
            </Card>
          )}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[var(--neon-amber)]" />
              <h3 className="font-bold text-lg">Leaderboard</h3>
            </div>
            {record.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <div className="space-y-1.5">
              {leaderboard && leaderboard.length > 0 ? leaderboard.slice(0, 10).map((row: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">#{i + 1} {row.name ?? "Pilot"}</span>
                  <span className="text-[var(--neon-cyan)] font-bold">{Number(row.totalScore)}</span>
                </div>
              )) : <p className="text-sm text-muted-foreground">No scores yet — be the first!</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
