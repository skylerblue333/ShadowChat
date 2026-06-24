import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Heart, HandHeart, Globe, Users, TrendingUp, Sparkles, Vote,
  Trophy, BarChart3, Target, Coins, Shield, Loader2, ThumbsUp,
  ThumbsDown, Award, Flame, Clock, CheckCircle2, ArrowUpRight
} from "lucide-react";

// DAO Proposals for charity fund allocation
const DAO_PROPOSALS = [
  {
    id: "prop-1",
    title: "Allocate 50,000 SKY444 to Clean Water Initiative",
    description: "Fund the deployment of water purification systems in 3 rural communities in East Africa. Partnership with WaterAid verified.",
    category: "Environment",
    requestedAmount: 50000,
    votesFor: 847,
    votesAgainst: 123,
    status: "active" as const,
    endsIn: "3 days",
    proposer: "SkylerDev",
  },
  {
    id: "prop-2",
    title: "Fund 100 STEM Scholarships for Underserved Youth",
    description: "Provide full scholarships for coding bootcamps and university CS programs. Partnered with Code.org and local universities.",
    category: "Education",
    requestedAmount: 120000,
    votesFor: 1203,
    votesAgainst: 89,
    status: "active" as const,
    endsIn: "5 days",
    proposer: "CryptoKing",
  },
  {
    id: "prop-3",
    title: "Emergency Relief: Disaster Recovery Fund",
    description: "Rapid-response fund for natural disaster relief. Funds distributed within 24 hours of verified events via smart contract.",
    category: "Humanitarian",
    requestedAmount: 200000,
    votesFor: 2341,
    votesAgainst: 156,
    status: "passed" as const,
    endsIn: "Ended",
    proposer: "NFTQueen",
  },
];

// Top donors leaderboard
const LEADERBOARD = [
  { rank: 1, name: "SkylerDev", donated: 125000, campaigns: 12, badge: "Diamond Donor" },
  { rank: 2, name: "CryptoKing", donated: 89000, campaigns: 8, badge: "Platinum Donor" },
  { rank: 3, name: "AITrader", donated: 67000, campaigns: 15, badge: "Gold Donor" },
  { rank: 4, name: "NFTQueen", donated: 45000, campaigns: 6, badge: "Gold Donor" },
  { rank: 5, name: "DeFiPro", donated: 34000, campaigns: 9, badge: "Silver Donor" },
  { rank: 6, name: "GameDev", donated: 28000, campaigns: 4, badge: "Silver Donor" },
  { rank: 7, name: "BlockchainBob", donated: 22000, campaigns: 7, badge: "Bronze Donor" },
  { rank: 8, name: "CyberAlice", donated: 18000, campaigns: 5, badge: "Bronze Donor" },
];



function DonateDialog({ campaign, onSuccess }: { campaign: any; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const donate = trpc.charity.donate.useMutation({
    onSuccess: () => {
      toast.success(`Thank you! ${amount} SKY444 donated to "${campaign.title}"`);
      setAmount("");
      setOpen(false);
      onSuccess();
    },
    onError: () => toast.error("Failed to process donation. Please try again."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs font-semibold">
          <Heart className="w-3 h-3 mr-1" /> Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg">Donate to Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div className="p-3 rounded-lg bg-background/50 border border-border/30">
            <h4 className="font-semibold text-sm">{campaign.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{campaign.description}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Donation Amount (SKY444)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-border/30 font-mono"
            />
            <div className="flex gap-2 mt-2">
              {[10, 50, 100, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="px-3 py-1 rounded-md border border-border/30 bg-background/50 text-xs font-mono hover:border-primary/50 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-600/5 border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Shield className="w-3.5 h-3.5" />
              <span>100% of donations go directly to the cause. On-chain verified.</span>
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={!amount || parseFloat(amount) <= 0 || donate.isPending}
            onClick={() => donate.mutate({ campaignId: campaign.id, amount: parseFloat(amount) })}
          >
            {donate.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
            Confirm Donation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProposalCard({ proposal }: { proposal: typeof DAO_PROPOSALS[0] }) {
  const { isAuthenticated } = useAuth();
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div className={`p-5 rounded-xl border ${proposal.status === "passed" ? "border-purple-500/30 bg-purple-600/5" : "border-border/50 bg-card/80"} backdrop-blur`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{proposal.category}</Badge>
          <Badge className={`text-[10px] ${proposal.status === "passed" ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : "bg-primary/10 text-primary border-primary/30"}`}>
            {proposal.status === "passed" ? <><CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Passed</> : <><Clock className="w-2.5 h-2.5 mr-0.5" /> {proposal.endsIn}</>}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">by {proposal.proposer}</span>
      </div>

      <h3 className="font-semibold mb-2">{proposal.title}</h3>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{proposal.description}</p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-purple-400 font-mono">{proposal.votesFor} For</span>
        <span className="text-red-400 font-mono">{proposal.votesAgainst} Against</span>
      </div>
      <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30 mb-3">
        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${forPercent}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          <Coins className="w-3 h-3 inline mr-1" />{(proposal.requestedAmount ?? 0).toLocaleString()} SKY444
        </span>
        {proposal.status === "active" && (
          isAuthenticated ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7 text-purple-400 border-purple-500/30 hover:bg-purple-600/10">
                <ThumbsUp className="w-3 h-3 mr-1" /> For
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 text-red-400 border-red-500/30 hover:bg-red-500/10">
                <ThumbsDown className="w-3 h-3 mr-1" /> Against
              </Button>
            </div>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="sm" variant="outline" className="text-xs h-7">Sign In to Vote</Button>
            </a>
          )
        )}
      </div>
    </div>
  );
}

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const { data: campaigns, isLoading, refetch } = trpc.charity.campaigns.useQuery({});
  const { data: charityStats } = trpc.charity.stats.useQuery();
  const { data: donorLeaderboard } = trpc.charity.leaderboard.useQuery();
  const impactMetrics = [
    { label: "Active Campaigns", value: String(charityStats?.activeCampaigns ?? "—"), icon: Target, color: "text-primary" },
    { label: "Total Campaigns", value: String(charityStats?.totalCampaigns ?? "—"), icon: HandHeart, color: "text-purple-400" },
    { label: "SKY444 Raised", value: charityStats ? String(Math.round(charityStats.totalRaised)) : "—", icon: Coins, color: "text-[oklch(0.7_0.2_60)]" },
    { label: "Donors", value: String(charityStats?.totalDonors ?? "—"), icon: Users, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══ CINEMATIC CHARITY HERO ═══ */}
      <section className="hero-cinematic border-b border-slate-800/60" style={{ minHeight: 320 }}>
        <div className="glow-orb glow-orb-pink w-96 h-96 -top-20 right-0 animate-hero-float" />
        <div className="glow-orb w-64 h-64 bottom-0 left-10 animate-hero-float" style={{ background: 'oklch(0.55 0.24 15 / 0.18)', animationDelay: '2s' }} />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 mb-6">
              <Heart className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-400 tracking-wide">TRANSPARENT GIVING — ON-CHAIN</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight text-rainbow">
              <span className="text-white">Charity</span>{' '}
              <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl desc-metallic">
              Support causes, vote on fund allocation via DAO governance, and track real-world impact — all on-chain and fully transparent.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {impactMetrics.map((metric, i) => (
              <div key={metric.label} className="card-epic p-5 text-center animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 bg-white/5">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`text-3xl font-black stat-number ${metric.color} mb-1`}>{metric.value}</div>
                <div className="text-xs text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="w-full max-w-lg bg-card/80 border border-border/50">
              <TabsTrigger value="campaigns" className="flex-1">
                <HandHeart className="w-4 h-4 mr-1.5" /> Campaigns
              </TabsTrigger>
              <TabsTrigger value="dao" className="flex-1">
                <Vote className="w-4 h-4 mr-1.5" /> DAO Voting
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">
                <Trophy className="w-4 h-4 mr-1.5" /> Leaderboard
              </TabsTrigger>
              <TabsTrigger value="impact" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-1.5" /> Impact
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-5 rounded-xl border border-border/50 animate-pulse">
                      <div className="h-4 bg-muted/20 rounded w-1/3 mb-3" />
                      <div className="h-5 bg-muted/20 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-muted/20 rounded w-full mb-4" />
                      <div className="h-2 bg-muted/20 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c: any) => {
                    const progress = c.goalAmount > 0 ? (Number(c.raisedAmount) / Number(c.goalAmount)) * 100 : 0;
                    return (
                      <div key={c.id} className="p-5 rounded-xl border border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                          <Badge className={`text-[10px] ${c.status === "active" ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : "bg-muted/20 text-muted-foreground"}`}>
                            {c.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{c.description}</p>
                        <div className="mb-2">
                          {/* Progress bar with milestone markers */}
                          <div className="relative h-3 bg-background/50 rounded-full overflow-visible border border-border/30 mb-1">
                            <div className="h-full bg-gradient-to-r from-primary to-[oklch(0.72_0.28_160)] rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                            {/* Milestone markers at 25%, 50%, 75% */}
                            {[25, 50, 75].map(pct => (
                              <div key={pct} className="absolute top-0 bottom-0 w-0.5 flex flex-col items-center" style={{ left: `${pct}%` }}>
                                <div className={`w-2 h-2 rounded-full border-2 mt-0.5 transition-all ${progress >= pct ? "bg-[oklch(0.80_0.18_70)] border-[oklch(0.80_0.18_70)]" : "bg-background border-border/50"}`} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] text-muted-foreground/50 px-1">
                            <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="font-mono text-primary">{Number(c.raisedAmount).toLocaleString()} SKY444 raised</span>
                          <span className="text-muted-foreground">{Math.round(progress)}% of goal</span>
                        </div>
                        {isAuthenticated ? (
                          <DonateDialog campaign={c} onSuccess={refetch} />
                        ) : (
                          <a href={getLoginUrl()} className="block">
                            <Button size="sm" variant="outline" className="w-full text-xs">Sign In to Donate</Button>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <HandHeart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Active Campaigns</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Charity campaigns will be launched soon. Every donation is tracked on-chain for full transparency.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* DAO Voting Tab */}
            <TabsContent value="dao" className="mt-6">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 flex items-start gap-3">
                <Vote className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">Charity DAO Governance</h4>
                  <p className="text-xs text-muted-foreground">SKY444 holders vote on how charity funds are allocated. 1 token = 1 vote. Proposals require 66% approval to pass.</p>
                </div>
              </div>
              <div className="space-y-4">
                {DAO_PROPOSALS.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-6 flex items-start gap-3">
                <Trophy className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">Donor Leaderboard</h4>
                  <p className="text-xs text-muted-foreground">Top contributors earn badges, exclusive NFTs, and governance weight multipliers. Donate to climb the ranks!</p>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/80 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-3 border-b border-border/30 text-xs text-muted-foreground font-medium">
                  <span>Rank</span>
                  <span>Donor</span>
                  <span className="text-right">Donated</span>
                  <span className="text-right">Campaigns</span>
                  <span className="text-right">Badge</span>
                </div>
                {((donorLeaderboard as any[]) || LEADERBOARD).map(donor => (
                  <div key={donor.rank} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-3 items-center border-b border-border/10 last:border-0 ${donor.rank <= 3 ? "bg-yellow-500/5" : ""}`}>
                    <span className={`font-mono font-bold text-sm ${donor.rank === 1 ? "text-yellow-400" : donor.rank === 2 ? "text-gray-300" : donor.rank === 3 ? "text-orange-400" : "text-muted-foreground"}`}>
                      #{donor.rank}
                    </span>
                    <span className="font-medium text-sm">{donor.name}</span>
                    <span className="font-mono text-sm text-right text-primary">{(donor.donated ?? 0).toLocaleString()}</span>
                    <span className="font-mono text-sm text-right text-muted-foreground">{donor.campaigns}</span>
                    <Badge className={`text-[9px] ${
                      (donor.badge || "").includes("Diamond") ? "bg-primary/10 text-primary border-primary/30" :
                      (donor.badge || "").includes("Platinum") ? "bg-gray-200/10 text-gray-300 border-gray-300/30" :
                      (donor.badge || "").includes("Gold") ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                      (donor.badge || "").includes("Silver") ? "bg-gray-400/10 text-gray-400 border-gray-400/30" :
                      "bg-orange-500/10 text-orange-400 border-orange-500/30"
                    }`}>
                      <Award className="w-2.5 h-2.5 mr-0.5" /> {donor.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Impact Analytics Tab */}
            <TabsContent value="impact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Impact by Category */}
                <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Impact by Category
                  </h3>
                  <div className="space-y-3">
                    {[
                      { category: "Education", amount: 320000, percent: 38, color: "bg-primary" },
                      { category: "Environment", amount: 210000, percent: 25, color: "bg-purple-600" },
                      { category: "Humanitarian", amount: 180000, percent: 21, color: "bg-red-500" },
                      { category: "Healthcare", amount: 87000, percent: 10, color: "bg-[oklch(0.7_0.2_280)]" },
                      { category: "Technology", amount: 50000, percent: 6, color: "bg-[oklch(0.7_0.2_60)]" },
                    ].map(item => (
                      <div key={item.category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.category}</span>
                          <span className="font-mono">${(item.amount / 1000).toFixed(0)}K ({item.percent}%)</span>
                        </div>
                        <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Milestones */}
                <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> Recent Milestones
                  </h3>
                  <div className="space-y-3">
                    {[
                      { event: "Clean Water Initiative reached 5,000 beneficiaries", date: "Jun 10, 2026", icon: Globe },
                      { event: "100th scholarship awarded via STEM program", date: "Jun 8, 2026", icon: Award },
                      { event: "Emergency fund deployed to flood relief", date: "Jun 5, 2026", icon: Heart },
                      { event: "$500K total donations milestone reached", date: "Jun 1, 2026", icon: TrendingUp },
                      { event: "New partnership with UNICEF Innovation", date: "May 28, 2026", icon: HandHeart },
                    ].map((milestone, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                        <milestone.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm">{milestone.event}</p>
                          <span className="text-[10px] text-muted-foreground">{milestone.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transparency Report */}
                <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-600/5 md:col-span-2">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" /> Transparency Report
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-purple-400">100%</div>
                      <div className="text-xs text-muted-foreground mt-1">On-Chain Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-primary">0%</div>
                      <div className="text-xs text-muted-foreground mt-1">Admin Fees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_280)]">24h</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg Disbursement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_60)]">47</div>
                      <div className="text-xs text-muted-foreground mt-1">Verified Partners</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    All charity fund flows are publicly auditable on-chain. Smart contracts ensure funds reach verified recipients without intermediaries.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
