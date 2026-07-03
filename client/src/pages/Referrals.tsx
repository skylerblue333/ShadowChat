import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Users, Copy, Gift, TrendingUp, CheckCircle, Share2, Coins, Lock, ExternalLink } from "lucide-react";

const TIERS = [
  { name: "Bronze", min: 0, max: 5, reward: "5 SKY444 per referral", color: "oklch(0.65 0.12 50)", bg: "oklch(0.65 0.12 50 / 0.10)" },
  { name: "Silver", min: 5, max: 20, reward: "10 SKY444 per referral", color: "oklch(0.75 0.02 270)", bg: "oklch(0.75 0.02 270 / 0.10)" },
  { name: "Gold", min: 20, max: 50, reward: "20 SKY444 + 5% revenue share", color: "oklch(0.80 0.18 70)", bg: "oklch(0.80 0.18 70 / 0.10)" },
  { name: "Diamond", min: 50, max: Infinity, reward: "50 SKY444 + 10% revenue share", color: "oklch(0.72 0.28 220)", bg: "oklch(0.72 0.28 220 / 0.10)" },
];

export default function Referrals() {
  
  const [copied, setCopied] = useState(false);

  const { data: stats } = trpc.creatorGrowth.getReferralStats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: tree } = trpc.creatorGrowth.getReferralTree.useQuery(undefined, { enabled: isAuthenticated });

  const referralCode = user ? `SKY-${String(user.id).padStart(6, "0")}` : "LOGIN-FIRST";
  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const referralCount = (stats as any)?.totalReferrals ?? 0;
  const totalEarned = (stats as any)?.totalEarned ?? 0;
  const pendingEarned = (stats as any)?.pendingEarned ?? 0;
  const currentTier = TIERS.find(t => referralCount >= t.min && referralCount < t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: "Join SKYCOIN4444", text: "Join me on SKYCOIN4444 and earn SKY444 tokens!", url: referralLink });
    } else {
      copyLink();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.07 0.025 270)' }}>
        <div className="text-center p-8">
          <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'oklch(0.72 0.28 305)' }} />
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm mb-4" style={{ color: 'oklch(0.50 0.020 275)' }}>Sign in to access your referral program and start earning.</p>
          <Link href="/"><Button style={{ background: 'oklch(0.72 0.28 305)', color: 'white' }}>Sign In</Button></Link>
        </div>
      </div>
    );
  }

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
              <Gift className="w-5 h-5" style={{ color: 'oklch(0.72 0.28 305)' }} />
            </div>
            <h1 className="text-2xl font-bold text-white">Referral Program</h1>
          </div>
          <p className="text-sm mb-6" style={{ color: 'oklch(0.55 0.025 275)' }}>
            Invite friends, earn SKY444 tokens, and unlock higher reward tiers.
          </p>

          {/* Referral Link Box */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
            <p className="text-xs mb-2 font-medium" style={{ color: 'oklch(0.55 0.025 275)' }}>YOUR REFERRAL LINK</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm truncate text-white font-mono">{referralLink}</code>
              <Button size="sm" onClick={copyLink} style={{ background: copied ? 'oklch(0.72 0.28 160 / 0.20)' : 'oklch(0.72 0.28 305 / 0.15)', color: copied ? 'oklch(0.72 0.28 160)' : 'oklch(0.85 0.25 305)', border: 'none' }}>
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={shareLink} style={{ background: 'oklch(0.72 0.28 305 / 0.15)', color: 'oklch(0.85 0.25 305)', border: 'none' }}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs" style={{ color: 'oklch(0.55 0.025 275)' }}>Code:</span>
              <code className="text-xs font-bold" style={{ color: 'oklch(0.80 0.18 70)' }}>{referralCode}</code>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Referrals", value: referralCount, icon: Users, color: 'oklch(0.72 0.28 305)' },
              { label: "SKY444 Earned", value: `${totalEarned}`, icon: Coins, color: 'oklch(0.80 0.18 70)' },
              { label: "Pending", value: `${pendingEarned}`, icon: TrendingUp, color: 'oklch(0.72 0.28 160)' },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: 'oklch(0.10 0.025 270)', border: `1px solid ${stat.color}22` }}>
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px]" style={{ color: 'oklch(0.45 0.020 275)' }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Current Tier */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Your Tier</h2>
          <div className="p-5 rounded-2xl" style={{ background: 'oklch(0.11 0.025 270)', border: `1px solid ${currentTier.color}33` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: currentTier.bg }}>
                  <span className="text-xl">
                    {currentTier.name === "Bronze" ? "🥉" : currentTier.name === "Silver" ? "🥈" : currentTier.name === "Gold" ? "🥇" : "💎"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white">{currentTier.name} Tier</p>
                  <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{currentTier.reward}</p>
                </div>
              </div>
              <Badge style={{ background: currentTier.bg, color: currentTier.color, border: 'none' }}>
                {referralCount} referrals
              </Badge>
            </div>
            {nextTier && (
              <>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: 'oklch(0.50 0.020 275)' }}>Progress to {nextTier.name}</span>
                  <span className="text-white">{referralCount}/{nextTier.min}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'oklch(0.18 0.025 270)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.min(100, (referralCount / nextTier.min) * 100)}%`,
                    background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
                  }} />
                </div>
                <p className="text-xs mt-2" style={{ color: 'oklch(0.50 0.020 275)' }}>
                  {nextTier.min - referralCount} more referrals to unlock {nextTier.name} — {nextTier.reward}
                </p>
              </>
            )}
          </div>
        </section>

        {/* All Tiers */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Reward Tiers</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {TIERS.map(tier => {
              const isActive = tier.name === currentTier.name;
              const isUnlocked = referralCount >= tier.min;
              return (
                <div key={tier.name} className="p-4 rounded-2xl transition-all" style={{
                  background: isActive ? `${tier.color}15` : 'oklch(0.11 0.025 270)',
                  border: `1px solid ${isActive ? tier.color + "44" : 'oklch(0.18 0.025 270)'}`,
                  opacity: isUnlocked ? 1 : 0.6,
                }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {tier.name === "Bronze" ? "🥉" : tier.name === "Silver" ? "🥈" : tier.name === "Gold" ? "🥇" : "💎"}
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">{tier.name}</p>
                      <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>
                        {tier.max === Infinity ? `${tier.min}+ referrals` : `${tier.min}–${tier.max} referrals`}
                      </p>
                    </div>
                    {isActive && <Badge className="ml-auto text-[10px]" style={{ background: `${tier.color}22`, color: tier.color, border: 'none' }}>Current</Badge>}
                  </div>
                  <p className="text-xs font-medium" style={{ color: tier.color }}>{tier.reward}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Referral Tree */}
        {tree && (tree as any).children?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Your Network</h2>
            <div className="space-y-2">
              {(tree as any).children.slice(0, 10).map((ref: any) => (
                <div key={ref.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden" style={{ background: 'oklch(0.72 0.28 305 / 0.20)' }}>
                    {ref.avatar ? <img src={ref.avatar} alt="" className="w-full h-full object-cover" /> : (ref.name || "?")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ref.displayName || ref.name || "User"}</p>
                    <p className="text-xs" style={{ color: 'oklch(0.45 0.020 275)' }}>Joined via your link</p>
                  </div>
                  <Badge className="text-[10px]" style={{ background: 'oklch(0.72 0.28 160 / 0.15)', color: 'oklch(0.72 0.28 160)', border: 'none' }}>
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How It Works */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Share Your Link", desc: "Copy your unique referral link and share it with friends, on social media, or in communities.", icon: Share2 },
              { step: "2", title: "Friend Joins", desc: "When someone signs up using your link, they become your referral and you both get a bonus.", icon: Users },
              { step: "3", title: "Earn SKY444", desc: "Earn SKY444 tokens for every active referral. Higher tiers unlock bigger rewards and revenue share.", icon: Coins },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-4 rounded-2xl" style={{ background: 'oklch(0.11 0.025 270)', border: '1px solid oklch(0.18 0.025 270)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3" style={{ background: 'oklch(0.72 0.28 305 / 0.20)' }}>
                    {item.step}
                  </div>
                  <Icon className="w-5 h-5 mb-2" style={{ color: 'oklch(0.72 0.28 305)' }} />
                  <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                  <p className="text-xs" style={{ color: 'oklch(0.50 0.020 275)' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
