import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Zap, Calendar, ChevronRight, Crown, Swords } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function TournamentBracket() {
  
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);

  const { data: tournaments, isLoading } = trpc.gamefi.tournaments.useQuery();

  const joinMutation = trpc.gamefi.joinTournament.useMutation({
    onSuccess: () => toast.success("Joined tournament!"),
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto" />
          <p className="text-slate-400">Loading brackets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, oklch(0.25 0.08 305 / 0.5) 0%, transparent 60%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Badge className="mb-4 border-yellow-500/40 text-yellow-300 bg-yellow-500/10">
            <Trophy className="w-3 h-3 mr-1" /> Tournament Brackets
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ background: "linear-gradient(135deg, oklch(0.85 0.25 305), oklch(0.80 0.25 60))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Compete & Win SKY444
          </h1>
          <p className="text-slate-400 text-lg">Enter tournaments, climb the bracket, claim prizes</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        {!tournaments || tournaments.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No Active Tournaments</h3>
            <p className="text-slate-500">Check back soon — new tournaments launch every week</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((t: any) => (
              <div
                key={t.id}
                onClick={() => setSelectedTournament(t.id)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all ${selectedTournament === t.id ? "border-purple-500/60 bg-purple-500/10" : "border-slate-700/50 bg-slate-900/60 hover:border-slate-600/60"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{t.name}</h3>
                    <p className="text-sm text-slate-400">{t.game}</p>
                  </div>
                  <Badge className={
                    t.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                    t.status === "upcoming" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                    "bg-slate-700/50 text-slate-400 border-slate-600/30"
                  }>
                    {t.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-slate-800/60">
                    <p className="text-xs text-slate-500">Prize Pool</p>
                    <p className="font-bold text-yellow-400 text-sm">{t.prizePool?.toLocaleString() ?? 0} SKY</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/60">
                    <p className="text-xs text-slate-500">Players</p>
                    <p className="font-bold text-white text-sm">{t.currentParticipants ?? 0}/{t.maxParticipants ?? "∞"}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/60">
                    <p className="text-xs text-slate-500">Entry Fee</p>
                    <p className="font-bold text-purple-400 text-sm">{t.entryFee ?? 0} SKY</p>
                  </div>
                </div>

                {t.status === "upcoming" && isAuthenticated && (
                  <Button
                    onClick={(e) => { e.stopPropagation(); joinMutation.mutate({ tournamentId: t.id }); }}
                    disabled={joinMutation.isPending}
                    className="w-full"
                    style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}
                  >
                    <Swords className="w-4 h-4 mr-2" /> Enter Tournament
                  </Button>
                )}
                {!isAuthenticated && t.status === "upcoming" && (
                  <Button onClick={() => // Removed login redirect for testing} variant="outline" className="w-full">
                    Sign in to Enter
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
