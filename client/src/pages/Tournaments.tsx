import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Swords, Users, Clock, Coins, Star, Zap, Lock, ChevronRight, Calendar } from "lucide-react";

function TournamentCard({ t }: { t: any }) {
  const { isAuthenticated } = useAuth();
  const join = trpc.gamefi.joinTournament?.useMutation?.({
    onSuccess: () => toast.success("Joined tournament!"),
    onError: () => toast.error("Could not join tournament"),
  });

  const isLive = t.status === "active";
  const isUpcoming = t.status === "upcoming";
  const prizePool = Number(t.prizePool || 0);
  const fillPct = t.maxParticipants ? Math.round((t.participantCount / t.maxParticipants) * 100) : 0;

  const accentColor = isLive ? "oklch(0.72 0.28 160)" : isUpcoming ? "oklch(0.72 0.28 305)" : "oklch(0.55 0.020 275)";

  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]" style={{
      background: 'oklch(0.11 0.025 270)',
      border: `1px solid ${accentColor}33`,
    }}>
      {/* Header */}
      <div className="p-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${accentColor}22` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${accentColor}20` }}>
            {t.type === "pvp" ? "⚔️" : t.type === "guild_war" ? "🏰" : t.type === "community" ? "🌐" : t.type === "charity" ? "❤️" : "🏆"}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{t.name}</p>
            <p className="text-xs capitalize" style={{ color: 'oklch(0.50 0.020 275)' }}>{t.type.replace("_", " ")}</p>
          </div>
        </div>
        <Badge style={{
          background: isLive ? "oklch(0.72 0.28 160 / 0.15)" : isUpcoming ? "oklch(0.72 0.28 305 / 0.15)" : "oklch(0.18 0.025 270)",
          color: isLive ? "oklch(0.72 0.28 160)" : isUpcoming ? "oklch(0.72 0.28 305)" : "oklch(0.50 0.020 275)",
          border: "none",
          fontSize: "10px",
        }}>
          {isLive ? "🔴 LIVE" : isUpcoming ? "⏳ UPCOMING" : t.status.toUpperCase()}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {t.description && (
          <p className="text-xs line-clamp-2" style={{ color: 'oklch(0.50 0.020 275)' }}>{t.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" style={{ color: 'oklch(0.80 0.18 70)' }} />
            <span className="text-xs text-white font-bold">{prizePool > 0 ? `${prizePool.toLocaleString()} ${t.prizeToken || "SKY444"}` : "TBD"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="text-xs text-white">{t.participantCount}{t.maxParticipants ? `/${t.maxParticipants}` : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: 'oklch(0.55 0.020 275)' }} />
            <span className="text-xs" style={{ color: 'oklch(0.55 0.020 275)' }}>
              {isLive ? `Ends ${new Date(t.endsAt).toLocaleDateString()}` : `Starts ${new Date(t.startsAt).toLocaleDateString()}`}
            </span>
          </div>
        </div>

        {/* Fill bar */}
        {t.maxParticipants > 0 && (
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span style={{ color: 'oklch(0.45 0.020 275)' }}>Spots filled</span>
              <span style={{ color: accentColor }}>{fillPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.18 0.025 270)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, background: `linear-gradient(90deg, ${accentColor}, oklch(0.80 0.18 70))` }} />
            </div>
          </div>
        )}

        <Button
          className="w-full text-xs h-8"
          disabled={!isAuthenticated || t.status === "completed"}
          onClick={() => {
            if (!isAuthenticated) { toast.error("Sign in to join tournaments"); return; }
            toast.info("Tournament registration coming soon!");
          }}
          style={{
            background: isLive ? "oklch(0.72 0.28 160 / 0.20)" : "oklch(0.72 0.28 305 / 0.20)",
            color: isLive ? "oklch(0.72 0.28 160)" : "oklch(0.85 0.25 305)",
            border: "none",
          }}
        >
          {t.status === "completed" ? "Completed" : isAuthenticated ? "Join Tournament" : "Sign In to Join"}
        </Button>
      </div>
    </div>
  );
}

export default function Tournaments() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const { data: tournaments, isLoading } = trpc.gamefi.tournaments.useQuery();
  const { data: quests } = trpc.gamefi.quests?.useQuery?.() ?? { data: [] };

  const filtered = (tournaments || []).filter((t: any) => filter === "all" || t.status === filter);
  const liveCount = (tournaments || []).filter((t: any) => t.status === "active").length;
  const totalPrize = (tournaments || []).reduce((sum: number, t: any) => sum + Number(t.prizePool || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.07 0.025 270)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-10 px-4" style={{
        background: 'linear-gradient(135deg, oklch(0.12 0.04 305) 0%, oklch(0.10 0.025 270) 100%)',
        borderBottom: '1px solid oklch(0.72 0.28 305 / 0.15)',
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: 'oklch(0.80 0.18 70 / 0.15)' }}>
              <Trophy className="w-5 h-5" style={{ color: 'oklch(0.80 0.18 70)' }} />
            </div>
            <h1 className="text-2xl font-bold text-white">Tournaments</h1>
            {liveCount > 0 && (
              <Badge style={{ background: 'oklch(0.72 0.28 160 / 0.15)', color: 'oklch(0.72 0.28 160)', border: 'none', fontSize: '10px' }}>
                🔴 {liveCount} LIVE
              </Badge>
            )}
          </div>
          <p className="text-sm mb-6" style={{ color: 'oklch(0.55 0.025 275)' }}>
            Compete in skill-based tournaments and win SKY444 tokens.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Tournaments", value: (tournaments || []).length, color: 'oklch(0.72 0.28 305)' },
              { label: "Live Now", value: liveCount, color: 'oklch(0.72 0.28 160)' },
              { label: "Total Prize Pool", value: totalPrize > 0 ? `${totalPrize.toLocaleString()} SKY444` : "—", color: 'oklch(0.80 0.18 70)' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: 'oklch(0.10 0.025 270)', border: `1px solid ${stat.color}22` }}>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'oklch(0.45 0.020 275)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {(["all", "active", "upcoming", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f ? 'oklch(0.72 0.28 305 / 0.20)' : 'oklch(0.11 0.025 270)',
                color: filter === f ? 'oklch(0.85 0.25 305)' : 'oklch(0.50 0.020 275)',
                border: `1px solid ${filter === f ? 'oklch(0.72 0.28 305 / 0.40)' : 'oklch(0.18 0.025 270)'}`,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tournament Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'oklch(0.11 0.025 270)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: 'oklch(0.80 0.18 70)' }} />
            <p className="text-white font-semibold mb-1">No {filter === "all" ? "" : filter} tournaments</p>
            <p className="text-sm" style={{ color: 'oklch(0.45 0.020 275)' }}>Check back soon for new competitions.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t: any) => <TournamentCard key={t.id} t={t} />)}
          </div>
        )}

        {/* Quests Section */}
        {quests && (quests as any[]).length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: 'oklch(0.80 0.18 70)' }} />
              Active Quests
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(quests as any[]).slice(0, 4).map((q: any) => (
                <div key={q.id} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'oklch(0.80 0.18 70 / 0.15)' }}>
                    {q.type === "daily" ? "⚡" : q.type === "weekly" ? "📅" : "🎯"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{q.title}</p>
                    <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>Reward: {q.rewardAmount} {q.rewardToken || "SKY444"}</p>
                  </div>
                  <Badge className="text-[10px]" style={{ background: 'oklch(0.80 0.18 70 / 0.15)', color: 'oklch(0.80 0.18 70)', border: 'none' }}>
                    {q.type}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
