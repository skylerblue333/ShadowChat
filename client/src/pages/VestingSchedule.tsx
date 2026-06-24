import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Clock, Coins, TrendingUp, Calendar, ChevronRight, AlertCircle } from "lucide-react";

// Vesting schedule types
const TEAM_VESTING = [
  { label: "Team & Founders", allocation: 15, cliff: 12, vesting: 48, color: "oklch(0.72 0.28 305)" },
  { label: "Advisors", allocation: 5, cliff: 6, vesting: 24, color: "oklch(0.80 0.18 70)" },
  { label: "Investors (Seed)", allocation: 10, cliff: 3, vesting: 18, color: "oklch(0.72 0.28 220)" },
  { label: "Investors (Series A)", allocation: 10, cliff: 6, vesting: 24, color: "oklch(0.72 0.28 160)" },
  { label: "Ecosystem Fund", allocation: 20, cliff: 0, vesting: 60, color: "oklch(0.72 0.28 30)" },
  { label: "Community Rewards", allocation: 25, cliff: 0, vesting: 48, color: "oklch(0.72 0.28 0)" },
  { label: "Reserve", allocation: 15, cliff: 12, vesting: 36, color: "oklch(0.55 0.020 275)" },
];

const TOTAL_SUPPLY = 1_000_000_000; // 1B SKY444

function VestingBar({ schedule, currentMonth }: { schedule: typeof TEAM_VESTING[0]; currentMonth: number }) {
  const { label, allocation, cliff, vesting, color } = schedule;
  const tokens = (allocation / 100) * TOTAL_SUPPLY;
  const monthsElapsed = Math.max(0, currentMonth - cliff);
  const vestingProgress = vesting > 0 ? Math.min(1, monthsElapsed / vesting) : 1;
  const unlockedTokens = Math.round(tokens * vestingProgress);
  const lockedTokens = tokens - unlockedTokens;
  const isInCliff = currentMonth < cliff;

  return (
    <div className="p-4 rounded-2xl" style={{ background: 'oklch(0.11 0.025 270)', border: `1px solid ${color}22` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-white text-sm">{label}</p>
          <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>
            {(allocation)}% · {(tokens / 1e6).toFixed(0)}M SKY444
          </p>
        </div>
        <div className="text-right">
          {isInCliff ? (
            <Badge style={{ background: 'oklch(0.80 0.18 70 / 0.15)', color: 'oklch(0.80 0.18 70)', border: 'none', fontSize: '10px' }}>
              🔒 Cliff: {cliff - currentMonth}mo left
            </Badge>
          ) : vestingProgress >= 1 ? (
            <Badge style={{ background: 'oklch(0.72 0.28 160 / 0.15)', color: 'oklch(0.72 0.28 160)', border: 'none', fontSize: '10px' }}>
              ✅ Fully Vested
            </Badge>
          ) : (
            <Badge style={{ background: `${color}22`, color, border: 'none', fontSize: '10px' }}>
              {Math.round(vestingProgress * 100)}% Vested
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'oklch(0.18 0.025 270)' }}>
        {isInCliff ? (
          <div className="h-full rounded-full" style={{ width: `${(currentMonth / (cliff + vesting)) * 100}%`, background: 'oklch(0.80 0.18 70 / 0.40)' }} />
        ) : (
          <div className="h-full rounded-full transition-all" style={{
            width: `${vestingProgress * 100}%`,
            background: `linear-gradient(90deg, ${color}, oklch(0.80 0.18 70))`,
          }} />
        )}
      </div>

      <div className="flex items-center justify-between text-[10px]">
        <span style={{ color: 'oklch(0.45 0.020 275)' }}>
          Unlocked: {(unlockedTokens / 1e6).toFixed(1)}M
        </span>
        <span style={{ color: 'oklch(0.45 0.020 275)' }}>
          Locked: {(lockedTokens / 1e6).toFixed(1)}M
        </span>
        {!isInCliff && vestingProgress < 1 && (
          <span style={{ color: 'oklch(0.45 0.020 275)' }}>
            Ends: Month {cliff + vesting}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VestingSchedule() {
  const { isAuthenticated } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(6); // Simulate month 6 post-launch

  const { data: mySchedules } = trpc.token.vestingSchedules.useQuery(undefined, { enabled: isAuthenticated });
  const claimMutation = trpc.token.claimVesting.useMutation({
    onSuccess: () => toast.success("Tokens claimed successfully!"),
    onError: () => toast.error("Claim failed — check eligibility"),
  });

  const totalUnlocked = TEAM_VESTING.reduce((sum, s) => {
    const tokens = (s.allocation / 100) * TOTAL_SUPPLY;
    const monthsElapsed = Math.max(0, currentMonth - s.cliff);
    const progress = s.vesting > 0 ? Math.min(1, monthsElapsed / s.vesting) : 1;
    return sum + tokens * progress;
  }, 0);

  const circulatingPct = (totalUnlocked / TOTAL_SUPPLY) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.07 0.025 270)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-10 px-4" style={{
        background: 'linear-gradient(135deg, oklch(0.12 0.04 305) 0%, oklch(0.10 0.025 270) 100%)',
        borderBottom: '1px solid oklch(0.72 0.28 305 / 0.15)',
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: 'oklch(0.72 0.28 305 / 0.15)' }}>
              <Lock className="w-5 h-5" style={{ color: 'oklch(0.72 0.28 305)' }} />
            </div>
            <h1 className="text-2xl font-bold text-white">Token Vesting Schedule</h1>
          </div>
          <p className="text-sm mb-6" style={{ color: 'oklch(0.55 0.025 275)' }}>
            Full transparency on SKY444 token unlock schedule, cliff periods, and circulating supply.
          </p>

          {/* Month Slider */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-white">Simulate: Month {currentMonth} post-launch</p>
              <p className="text-xs" style={{ color: 'oklch(0.72 0.28 160)' }}>{circulatingPct.toFixed(1)}% circulating</p>
            </div>
            <input
              type="range"
              min={0}
              max={72}
              value={currentMonth}
              onChange={e => setCurrentMonth(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'oklch(0.72 0.28 305)' }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'oklch(0.40 0.020 275)' }}>
              <span>Launch</span>
              <span>1 Year</span>
              <span>2 Years</span>
              <span>3 Years</span>
              <span>4 Years</span>
              <span>5 Years</span>
              <span>6 Years</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Supply", value: "1B SKY444", color: 'oklch(0.72 0.28 305)' },
              { label: "Circulating", value: `${(totalUnlocked / 1e6).toFixed(0)}M`, color: 'oklch(0.72 0.28 160)' },
              { label: "Still Locked", value: `${((TOTAL_SUPPLY - totalUnlocked) / 1e6).toFixed(0)}M`, color: 'oklch(0.80 0.18 70)' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: 'oklch(0.10 0.025 270)', border: `1px solid ${stat.color}22` }}>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'oklch(0.45 0.020 275)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Allocation Pie Visual */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Token Allocation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {TEAM_VESTING.map(s => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{s.label}</p>
                  <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>
                    Cliff: {s.cliff}mo · Vesting: {s.vesting}mo
                  </p>
                </div>
                <span className="text-sm font-bold" style={{ color: s.color }}>{s.allocation}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Vesting Bars */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'oklch(0.72 0.28 305)' }} />
            Vesting Progress at Month {currentMonth}
          </h2>
          <div className="space-y-3">
            {TEAM_VESTING.map(s => (
              <VestingBar key={s.label} schedule={s} currentMonth={currentMonth} />
            ))}
          </div>
        </section>

        {/* My Vesting (if authenticated) */}
        {isAuthenticated && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Unlock className="w-5 h-5" style={{ color: 'oklch(0.72 0.28 160)' }} />
              My Vesting Positions
            </h2>
            {mySchedules && (mySchedules as any[]).length > 0 ? (
              <div className="space-y-3">
                {(mySchedules as any[]).map((s: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.72 0.28 160 / 0.20)' }}>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{s.name || "Vesting Position"}</p>
                      <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>
                        {s.totalAmount} SKY444 · {s.claimedAmount || 0} claimed
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => claimMutation.mutate({ vestingId: String(s.id) })}
                      disabled={claimMutation.isPending}
                      style={{ background: 'oklch(0.72 0.28 160 / 0.20)', color: 'oklch(0.72 0.28 160)', border: 'none' }}
                    >
                      Claim
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ background: 'oklch(0.11 0.025 270)', borderRadius: '16px', border: '1px solid oklch(0.18 0.025 270)' }}>
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: 'oklch(0.72 0.28 305)' }} />
                <p className="text-sm text-white mb-1">No vesting positions</p>
                <p className="text-xs" style={{ color: 'oklch(0.45 0.020 275)' }}>Participate in token sales or earn through staking to get vesting positions.</p>
              </div>
            )}
          </section>
        )}

        {/* Key Dates */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: 'oklch(0.80 0.18 70)' }} />
            Key Unlock Events
          </h2>
          <div className="space-y-2">
            {[
              { month: 0, event: "TGE — Community Rewards begin vesting", color: "oklch(0.72 0.28 0)" },
              { month: 3, event: "Seed Investor cliff ends — 18mo linear vesting begins", color: "oklch(0.72 0.28 220)" },
              { month: 6, event: "Advisor cliff ends — 24mo linear vesting begins", color: "oklch(0.80 0.18 70)" },
              { month: 12, event: "Team & Founder cliff ends — 48mo linear vesting begins", color: "oklch(0.72 0.28 305)" },
              { month: 12, event: "Reserve cliff ends — 36mo linear vesting begins", color: "oklch(0.55 0.020 275)" },
              { month: 24, event: "Seed Investors fully vested", color: "oklch(0.72 0.28 220)" },
              { month: 48, event: "Community Rewards fully vested", color: "oklch(0.72 0.28 0)" },
              { month: 60, event: "Team & Founders fully vested", color: "oklch(0.72 0.28 305)" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{
                background: e.month <= currentMonth ? `${e.color}10` : 'oklch(0.11 0.025 270)',
                border: `1px solid ${e.month <= currentMonth ? e.color + "33" : "oklch(0.18 0.025 270)"}`,
              }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
                  background: e.month <= currentMonth ? `${e.color}20` : 'oklch(0.18 0.025 270)',
                  color: e.month <= currentMonth ? e.color : 'oklch(0.45 0.020 275)',
                }}>
                  M{e.month}
                </div>
                <p className="text-xs text-white">{e.event}</p>
                {e.month <= currentMonth && (
                  <Badge className="ml-auto text-[9px]" style={{ background: `${e.color}20`, color: e.color, border: 'none' }}>
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
