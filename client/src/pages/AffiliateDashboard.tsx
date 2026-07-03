import { useState, useMemo } from "react";
import { Copy, Wallet, Users, TrendingUp, DollarSign, Award, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";

const TIERS = [
  { name: "Bronze", minReferrals: 0, commissionRate: 0.10, color: "text-amber-600", bg: "bg-amber-600/10 border-amber-600/30" },
  { name: "Silver", minReferrals: 5, commissionRate: 0.15, color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/30" },
  { name: "Gold", minReferrals: 15, commissionRate: 0.20, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { name: "Platinum", minReferrals: 30, commissionRate: 0.25, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30" },
];

export default function AffiliateDashboard() {
  
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: stats } = trpc.creatorGrowth.getReferralStats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: tree } = trpc.creatorGrowth.getReferralTree.useQuery(undefined, { enabled: isAuthenticated });

  const referralCode = user ? `SKY-${String(user.id).padStart(6, "0")}` : "LOGIN-FIRST";
  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const totalReferrals = (stats as any)?.totalReferrals ?? 0;
  const totalEarned = (stats as any)?.totalEarned ?? 0;
  const pendingEarned = (stats as any)?.pendingEarned ?? 0;

  const currentTier = useMemo(() => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (totalReferrals >= TIERS[i].minReferrals) return TIERS[i];
    }
    return TIERS[0];
  }, [totalReferrals]);

  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? Math.min(100, ((totalReferrals - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100)
    : 100;

  const referredUsers: any[] = (tree as any)?.children ?? [];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join me on Shadowchat — the AI-powered Web3 social platform! Earn SKY444 tokens just by joining. ${referralLink}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join Shadowchat & earn SKY444!")}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Affiliate Program</h2>
          <p className="text-muted-foreground mb-4">Sign in to access your referral dashboard and start earning SKY444.</p>
          <Link href="/"><Button className="w-full">Sign In to Continue</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground text-sm">Earn SKY444 by inviting friends to Shadowchat</p>
          </div>
          <Badge className={`${currentTier.bg} ${currentTier.color} border text-sm px-3 py-1`}>
            {currentTier.name} Affiliate
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Referrals", value: totalReferrals, icon: Users, color: "text-blue-400" },
            { label: "Total Earned", value: `${totalEarned.toFixed(0)} SKY`, icon: DollarSign, color: "text-green-400" },
            { label: "Pending", value: `${pendingEarned.toFixed(0)} SKY`, icon: TrendingUp, color: "text-yellow-400" },
            { label: "Commission Rate", value: `${(currentTier.commissionRate * 100).toFixed(0)}%`, icon: Award, color: "text-purple-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tier Progress */}
        {nextTier && (
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                <span className="text-xs text-muted-foreground">{totalReferrals} / {nextTier.minReferrals} referrals</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {nextTier.minReferrals - totalReferrals} more referrals to unlock {(nextTier.commissionRate * 100).toFixed(0)}% commission rate
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="link">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="link">My Link</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
          </TabsList>

          {/* Referral Link Tab */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Your Referral Link</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="font-mono text-xs bg-muted/30" />
                  <Button onClick={handleCopy} variant="outline" size="sm" className="shrink-0">
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleShare("twitter")} variant="outline" size="sm" className="flex-1 text-sky-400 border-sky-400/30">
                    <Share2 className="w-4 h-4 mr-1" /> Twitter
                  </Button>
                  <Button onClick={() => handleShare("telegram")} variant="outline" size="sm" className="flex-1 text-blue-400 border-blue-400/30">
                    <ExternalLink className="w-4 h-4 mr-1" /> Telegram
                  </Button>
                  <Button onClick={() => handleShare("whatsapp")} variant="outline" size="sm" className="flex-1 text-green-400 border-green-400/30">
                    <ExternalLink className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Withdraw */}
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Withdraw Earnings</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Available: <span className="text-green-400 font-semibold">{pendingEarned.toFixed(2)} SKY444</span></p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-muted/30"
                  />
                  <Button
                    onClick={() => { toast.success(`Withdrawal of ${withdrawAmount} SKY444 requested`); setWithdrawAmount(""); }}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > pendingEarned}
                    className="shrink-0"
                  >
                    <Wallet className="w-4 h-4 mr-1" /> Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="mt-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">People You've Referred ({referredUsers.length})</CardTitle></CardHeader>
              <CardContent>
                {referredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No referrals yet. Share your link to start earning!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {referredUsers.map((u: any, i: number) => (
                      <div key={u.userId ?? i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                            {(u.username ?? "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.username ?? `User #${u.userId}`}</p>
                            <p className="text-xs text-muted-foreground">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "Recently joined"}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">Active</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers" className="mt-4">
            <div className="grid gap-3">
              {TIERS.map((tier) => (
                <Card key={tier.name} className={`border ${tier.name === currentTier.name ? tier.bg : "border-border/30"}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${tier.color}`}>{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.minReferrals}+ referrals required</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{(tier.commissionRate * 100).toFixed(0)}% commission</p>
                      {tier.name === currentTier.name && <Badge className="text-xs mt-1">Current Tier</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
