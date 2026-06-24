import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/_core/hooks/useAuth";

function ScoreBadge({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  const pct = Math.round((score / max) * 100);
  const colorMap: Record<string, string> = {
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
  };
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/50 uppercase tracking-wider">{label}</span>
        <span className={`text-lg font-black font-mono ${colorMap[color] ?? "text-white"}`}>{score}</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}

export default function CitizenPassport() {
  const { user } = useAuth();
  const { data: reputation } = trpc.hopeIntelligence.reputation.me.useQuery();
  const { data: myProfile } = trpc.enterprise.behavior.myProfile.useQuery();
  const { data: govHealth } = trpc.enterprise.governanceV2.health.useQuery();

  const overall = reputation?.overall ?? 0;
  const breakdown = reputation?.breakdown ?? {};
  const archetype = myProfile?.archetype ?? "Explorer";
  const joinDate = (user as Record<string, unknown>)?.createdAt
    ? new Date((user as Record<string, unknown>).createdAt as string).toLocaleDateString()
    : "Genesis Citizen";

  const getCitizenshipTier = (score: number) => {
    if (score >= 900) return { tier: "LEGENDARY CITIZEN", color: "text-yellow-400", badge: "🏆" };
    if (score >= 700) return { tier: "ELITE CITIZEN", color: "text-purple-400", badge: "💎" };
    if (score >= 500) return { tier: "TRUSTED CITIZEN", color: "text-blue-400", badge: "⭐" };
    if (score >= 300) return { tier: "ACTIVE CITIZEN", color: "text-emerald-400", badge: "✅" };
    return { tier: "NEW CITIZEN", color: "text-white/60", badge: "🌱" };
  };

  const { tier, color: tierColor, badge: tierBadge } = getCitizenshipTier(overall);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Passport Cover */}
      <div className="bg-gradient-to-br from-yellow-950/40 via-black to-purple-950/20 border-b border-yellow-500/20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Passport Photo Area */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-purple-500/30 border-2 border-yellow-500/40 flex items-center justify-center">
                <span className="text-5xl">{tierBadge}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-black">
                ✓
              </div>
            </div>

            {/* Passport Data */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-xs text-yellow-500/60 uppercase tracking-widest mb-1">
                DIGITAL NATION — CITIZEN PASSPORT
              </div>
              <h1 className="text-3xl font-black text-white mb-1">{user?.name ?? "Anonymous Citizen"}</h1>
              <div className={`text-lg font-bold ${tierColor} mb-3`}>{tier}</div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-0">{archetype}</Badge>
                <Badge className="bg-white/10 text-white/60 border-0">Since {joinDate}</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">VERIFIED</Badge>
              </div>
            </div>

            {/* Overall Score */}
            <div className="text-center shrink-0">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-1">TRUST SCORE</div>
              <div className="text-6xl font-black text-white font-mono">{overall}</div>
              <div className="text-xs text-white/30 mt-1">/ 1000</div>
            </div>
          </div>

          {/* Passport Number */}
          <div className="mt-6 pt-6 border-t border-yellow-500/20 flex items-center justify-between">
            <div className="font-mono text-xs text-white/30">
              PASSPORT NO: SKY-{String(user?.id ?? "000000").padStart(6, "0")}
            </div>
            <div className="font-mono text-xs text-white/30">
              MANIUS DIGITAL NATION · GENESIS CHARTER
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Reputation Scores */}
        <div>
          <h2 className="text-xs text-white/40 uppercase tracking-widest mb-4">REPUTATION DIMENSIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <ScoreBadge label="Learning" score={reputation?.learningScore ?? 0} max={200} color="blue" />
            <ScoreBadge label="Building" score={reputation?.builderScore ?? 0} max={200} color="yellow" />
            <ScoreBadge label="Teaching" score={reputation?.teachingScore ?? 0} max={200} color="emerald" />
            <ScoreBadge label="Community" score={reputation?.communityScore ?? 0} max={200} color="purple" />
            <ScoreBadge label="Trust" score={reputation?.trustScore ?? 0} max={200} color="pink" />
            <ScoreBadge label="Overall" score={overall} max={1000} color="yellow" />
          </div>
        </div>

        {/* Citizenship Rights */}
        <Card className="bg-black/60 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
              CITIZENSHIP RIGHTS & PRIVILEGES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { right: "Vote on Governance Proposals", unlocked: overall >= 100, icon: "🗳️" },
                { right: "Create Governance Proposals", unlocked: overall >= 300, icon: "📜" },
                { right: "Access Premium AI Features", unlocked: overall >= 200, icon: "🧠" },
                { right: "Join Elite Councils", unlocked: overall >= 500, icon: "👑" },
                { right: "Earn Passive Staking Rewards", unlocked: overall >= 150, icon: "💰" },
                { right: "Mentor New Citizens", unlocked: overall >= 400, icon: "🎓" },
                { right: "Launch Startup in Venture Studio", unlocked: overall >= 250, icon: "🚀" },
                { right: "Access Legendary Status", unlocked: overall >= 900, icon: "⭐" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    item.unlocked
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-white/80">{item.right}</span>
                  {item.unlocked ? (
                    <span className="ml-auto text-emerald-400 text-xs font-bold">UNLOCKED</span>
                  ) : (
                    <span className="ml-auto text-white/30 text-xs">LOCKED</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Citizenship Tiers */}
        <Card className="bg-black/60 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
              CITIZENSHIP PROGRESSION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { tier: "NEW CITIZEN", min: 0, max: 300, badge: "🌱" },
              { tier: "ACTIVE CITIZEN", min: 300, max: 500, badge: "✅" },
              { tier: "TRUSTED CITIZEN", min: 500, max: 700, badge: "⭐" },
              { tier: "ELITE CITIZEN", min: 700, max: 900, badge: "💎" },
              { tier: "LEGENDARY CITIZEN", min: 900, max: 1000, badge: "🏆" },
            ].map((t, i) => {
              const active = overall >= t.min && overall < t.max;
              const completed = overall >= t.max;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    active
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : completed
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-white/5 border-white/10 opacity-40"
                  }`}
                >
                  <span className="text-xl">{t.badge}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{t.tier}</div>
                    <div className="text-xs text-white/40">{t.min} — {t.max} trust score</div>
                  </div>
                  {active && <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">CURRENT</Badge>}
                  {completed && <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">ACHIEVED</Badge>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
