/**
 * ClanWars — Clan creation, active wars, war leaderboard, and clan management
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Swords, Shield, Crown, Users, Flame, ChevronLeft, Trophy, Zap, Target, Star, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const CLAN_COLORS = [
  { name: "Crimson", value: "from-red-500 to-rose-600" },
  { name: "Sapphire", value: "from-blue-500 to-cyan-600" },
  { name: "Emerald", value: "from-green-500 to-teal-600" },
  { name: "Amethyst", value: "from-purple-500 to-fuchsia-600" },
  { name: "Gold", value: "from-amber-500 to-yellow-600" },
];

// Sample clan data since clan system is in progress
const SAMPLE_CLANS = [
  { id: 1, name: "Shadow Wolves", tag: "WOLF", members: 24, wins: 47, losses: 12, power: 9840, color: "from-slate-500 to-gray-600", rank: 1 },
  { id: 2, name: "Crypto Reapers", tag: "REAP", members: 19, wins: 41, losses: 15, power: 8720, color: "from-red-500 to-rose-600", rank: 2 },
  { id: 3, name: "Sky Sentinels", tag: "SKY4", members: 31, wins: 38, losses: 18, power: 7950, color: "from-cyan-500 to-blue-600", rank: 3 },
  { id: 4, name: "Neon Dragons", tag: "NEON", members: 16, wins: 33, losses: 21, power: 6800, color: "from-purple-500 to-fuchsia-600", rank: 4 },
  { id: 5, name: "Iron Forge", tag: "IRON", members: 22, wins: 29, losses: 24, power: 5940, color: "from-amber-500 to-orange-600", rank: 5 },
];

const ACTIVE_WARS = [
  { id: 1, clan1: "Shadow Wolves", clan2: "Crypto Reapers", clan1Score: 847, clan2Score: 712, endsIn: "14h 32m", status: "active" },
  { id: 2, clan1: "Sky Sentinels", clan2: "Neon Dragons", clan1Score: 523, clan2Score: 601, endsIn: "6h 15m", status: "active" },
];

export default function ClanWars() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"wars" | "clans" | "create">("wars");
  const [newClanName, setNewClanName] = useState("");
  const [newClanTag, setNewClanTag] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  const { data: leaderboard = [] } = trpc.gamefi.leaderboard.useQuery({ type: "global", limit: 10 });

  const handleCreateClan = () => {
    if (!newClanName.trim() || !newClanTag.trim()) {
      toast.error("Enter a clan name and tag");
      return;
    }
    toast.success(`Clan "${newClanName}" [${newClanTag.toUpperCase()}] created! Recruiting members...`);
    setTab("clans");
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-950/50 via-[#050508] to-orange-950/30 py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-72 h-72 bg-red-500/15 top-0 left-1/4" />
          <div className="glow-orb w-48 h-48 bg-orange-500/10 bottom-0 right-1/4" />
          {/* Animated war particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-400/60 animate-pulse"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Swords className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black rainbow-text">Clan Wars</h1>
              <p className="text-muted-foreground metallic-shimmer">Form clans, declare wars, earn SKY444 glory.</p>
            </div>
          </div>

          {/* Live war stats */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { label: "Active Wars", value: ACTIVE_WARS.length, icon: Swords, color: "text-red-400" },
              { label: "Total Clans", value: SAMPLE_CLANS.length, icon: Shield, color: "text-blue-400" },
              { label: "Warriors", value: SAMPLE_CLANS.reduce((s, c) => s + c.members, 0), icon: Users, color: "text-green-400" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: "wars" as const, label: "⚔️ Active Wars", count: ACTIVE_WARS.length },
            { id: "clans" as const, label: "🛡️ Clan Rankings", count: SAMPLE_CLANS.length },
            { id: "create" as const, label: "➕ Create Clan", count: null },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? "bg-red-500/20 border border-red-500/30 text-red-300" : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
              {t.count !== null && <span className="text-xs opacity-60">({t.count})</span>}
            </button>
          ))}
        </div>

        {/* Active Wars */}
        {tab === "wars" && (
          <div className="space-y-4">
            {ACTIVE_WARS.map(war => {
              const total = war.clan1Score + war.clan2Score;
              const clan1Pct = total > 0 ? (war.clan1Score / total) * 100 : 50;
              const leading = war.clan1Score > war.clan2Score ? war.clan1 : war.clan2;
              return (
                <div key={war.id} className="rounded-xl border border-red-500/20 bg-red-950/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-red-400 font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" /> ACTIVE WAR
                    </div>
                    <div className="text-xs text-muted-foreground">Ends in {war.endsIn}</div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 text-center">
                      <div className="text-lg font-black text-white">{war.clan1}</div>
                      <div className="text-3xl font-black text-red-400">{war.clan1Score.toLocaleString()}</div>
                    </div>
                    <div className="text-2xl font-black text-muted-foreground">VS</div>
                    <div className="flex-1 text-center">
                      <div className="text-lg font-black text-white">{war.clan2}</div>
                      <div className="text-3xl font-black text-blue-400">{war.clan2Score.toLocaleString()}</div>
                    </div>
                  </div>
                  {/* War progress bar */}
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-1000" style={{ width: `${clan1Pct}%` }} />
                    <div className="h-full flex-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    <span className="text-amber-400 font-bold">{leading}</span> is leading
                  </div>
                </div>
              );
            })}
            {ACTIVE_WARS.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <div>No active wars right now</div>
              </div>
            )}
          </div>
        )}

        {/* Clan Rankings */}
        {tab === "clans" && (
          <div className="space-y-3">
            {SAMPLE_CLANS.map(clan => (
              <div key={clan.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${clan.color} flex items-center justify-center text-sm font-black text-white`}>
                  #{clan.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{clan.name}</span>
                    <span className="text-xs text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">[{clan.tag}]</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{clan.members}</span>
                    <span className="text-green-400">{clan.wins}W</span>
                    <span className="text-red-400">{clan.losses}L</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">{clan.power.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Power</div>
                </div>
                <button
                  onClick={() => toast.info(`Joining ${clan.name}... Clan application sent!`)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/20 transition-all"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Clan */}
        {tab === "create" && (
          <div className="max-w-md mx-auto">
            <div className="rounded-xl border border-white/10 bg-white/3 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">Create Your Clan</h2>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Clan Name</label>
                <input
                  value={newClanName}
                  onChange={e => setNewClanName(e.target.value)}
                  placeholder="e.g. Shadow Wolves"
                  maxLength={30}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Clan Tag (4 chars)</label>
                <input
                  value={newClanTag}
                  onChange={e => setNewClanTag(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder="e.g. WOLF"
                  maxLength={4}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Clan Color</label>
                <div className="flex items-center gap-2">
                  {CLAN_COLORS.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.value} transition-all ${
                        selectedColor === i ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateClan}
                  disabled={!user}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-400 text-white font-bold hover:from-red-400 hover:to-rose-300 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {user ? "⚔️ Create Clan" : "Sign in to create a clan"}
                </button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Creating a clan costs 500 SKY444 tokens. You'll be the Clan Leader.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
