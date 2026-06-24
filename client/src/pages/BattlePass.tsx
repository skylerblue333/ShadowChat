/**
 * BattlePass — Season 1 battle pass with 50 tiers, free + premium track
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Crown, Zap, Lock, Check, ChevronLeft, Star, Shield, Gift } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const RARITY_COLORS: Record<string, string> = {
  common:    "border-slate-500/40 bg-slate-800/30 text-slate-300",
  rare:      "border-blue-500/50 bg-blue-900/20 text-blue-300",
  epic:      "border-purple-500/60 bg-purple-900/20 text-purple-300",
  legendary: "border-amber-500/70 bg-amber-900/20 text-amber-300",
};

function TierCard({ tier, progress, onClaim }: {
  tier: { tier: number; xpRequired: number; freeReward: any; premiumReward: any };
  progress: { currentTier: number; isPremium: boolean; claimedTiers: string };
  onClaim: (tier: number, track: "free" | "premium") => void;
}) {
  const claimed = JSON.parse(progress.claimedTiers || "[]") as string[];
  const freeClaimed = claimed.includes(`${tier.tier}-free`);
  const premClaimed = claimed.includes(`${tier.tier}-premium`);
  const reached = tier.tier <= progress.currentTier;
  const isSpecial = tier.tier % 10 === 0;

  return (
    <div className={`relative rounded-xl border transition-all ${
      isSpecial ? "border-amber-500/50 bg-amber-950/20" :
      reached ? "border-white/15 bg-white/5" :
      "border-white/5 bg-white/2 opacity-60"
    }`}>
      {isSpecial && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-500/50 text-xs text-amber-300 font-bold whitespace-nowrap">
          Milestone Tier
        </div>
      )}

      <div className="p-3">
        {/* Tier number */}
        <div className={`text-center text-xs font-bold mb-2 ${isSpecial ? "text-amber-400" : "text-muted-foreground"}`}>
          T{tier.tier}
        </div>

        {/* Free track */}
        <div className="mb-2">
          <div className="text-xs text-muted-foreground mb-1 text-center">Free</div>
          <button
            onClick={() => !freeClaimed && reached && onClaim(tier.tier, "free")}
            disabled={freeClaimed || !reached}
            className={`w-full p-2 rounded-lg text-center text-xs transition-all ${
              freeClaimed ? "bg-green-900/30 border border-green-500/30 text-green-400" :
              reached ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 cursor-pointer" :
              "bg-white/3 border border-white/5 text-muted-foreground cursor-not-allowed"
            }`}
          >
            {freeClaimed ? (
              <span className="flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Claimed</span>
            ) : !reached ? (
              <span className="flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
            ) : (
              <span>
                {tier.freeReward.type === "xp" ? `+${tier.freeReward.amount} XP` :
                 tier.freeReward.type === "sky444" ? `${tier.freeReward.amount} SKY` :
                 "Reward"}
              </span>
            )}
          </button>
        </div>

        {/* Premium track */}
        <div>
          <div className="text-xs text-amber-400/70 mb-1 text-center">Premium</div>
          <button
            onClick={() => !premClaimed && reached && progress.isPremium && onClaim(tier.tier, "premium")}
            disabled={premClaimed || !reached || !progress.isPremium}
            className={`w-full p-2 rounded-lg text-center text-xs transition-all ${
              premClaimed ? "bg-amber-900/30 border border-amber-500/30 text-amber-400" :
              !progress.isPremium ? "bg-amber-950/20 border border-amber-500/20 text-amber-600 cursor-not-allowed" :
              reached ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 cursor-pointer" :
              "bg-white/3 border border-white/5 text-muted-foreground cursor-not-allowed"
            }`}
          >
            {premClaimed ? (
              <span className="flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Claimed</span>
            ) : !progress.isPremium ? (
              <span className="flex items-center justify-center gap-1"><Crown className="w-3 h-3" /> Premium</span>
            ) : !reached ? (
              <span className="flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
            ) : (
              <span>
                {tier.premiumReward.type === "badge" ? `🏆 ${tier.premiumReward.rarity}` :
                 tier.premiumReward.type === "sky444" ? `${tier.premiumReward.amount} SKY` :
                 "Reward"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BattlePass() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [page, setPage] = useState(0);
  const tiersPerPage = 10;

  const { data, refetch } = trpc.gamification.getBattlePass.useQuery(undefined, { enabled: !!user });

  const claimTier = trpc.gamification.claimTier.useMutation({
    onSuccess: (data: any) => {
      toast.success(`Claimed! ${data.reward.type === "xp" ? `+${data.reward.amount} XP` : data.reward.type === "sky444" ? `+${data.reward.amount} SKY444` : "Badge unlocked!"}`)
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const progress = (data?.progress as any) ?? { currentTier: 0, isPremium: false, xpEarned: 0, claimedTiers: "[]" };
  const tiers = (Array.isArray(data?.tiers) ? data?.tiers : []) as any[];
  const pageTiers = tiers.slice(page * tiersPerPage, (page + 1) * tiersPerPage);
  const totalPages = Math.ceil(tiers.length / tiersPerPage);

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/50 via-[#050508] to-amber-950/30 py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-72 h-72 bg-purple-500/15 top-0 left-1/4" />
          <div className="glow-orb w-56 h-56 bg-amber-500/10 bottom-0 right-1/4" />
        </div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-3">
                <Crown className="w-4 h-4" /> Season 1
              </div>
              <h1 className="text-4xl font-black rainbow-text mb-2">Battle Pass</h1>
              <p className="text-muted-foreground metallic-shimmer">50 tiers of rewards. Earn XP, SKY444, and exclusive badges.</p>
            </div>
            {/* Progress summary */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-300">{progress.currentTier}/50</div>
                <div className="text-xs text-muted-foreground">Tiers</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-amber-300">{progress.xpEarned?.toLocaleString() ?? 0}</div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className={`text-2xl font-black ${progress.isPremium ? "text-amber-400" : "text-muted-foreground"}`}>
                  {progress.isPremium ? "✓" : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Premium</div>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-amber-400 transition-all duration-1000"
              style={{ width: `${(progress.currentTier / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-10">
        {!user ? (
          <div className="text-center py-20 text-muted-foreground">Sign in to view your Battle Pass progress</div>
        ) : (
          <>
            {/* Page navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Tiers {page * tiersPerPage + 1}–{Math.min((page + 1) * tiersPerPage, 50)}
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      i === page ? "bg-purple-500 text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {pageTiers.map((tier: any) => (
                <TierCard
                  key={tier.tier}
                  tier={tier}
                  progress={progress}
                  onClaim={(t) => claimTier.mutate({ tier: t })}
                />
              ))}
            </div>

            {/* Premium CTA */}
            {!progress.isPremium && (
              <div className="mt-8 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-purple-950/20 p-6 text-center">
                <Crown className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="text-xl font-black text-amber-300 mb-2">Upgrade to Premium</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Unlock exclusive badges, bonus SKY444, and premium-only tier rewards across all 50 tiers.
                </p>
                <button
                  onClick={() => toast.info("Premium Battle Pass coming soon! Stay tuned.")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold hover:from-amber-400 hover:to-yellow-300 transition-all hover:scale-105"
                >
                  Get Premium Pass
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
