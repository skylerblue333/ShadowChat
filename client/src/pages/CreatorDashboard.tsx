import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  DollarSign, Users, TrendingUp, Heart, Star, Crown, Zap,
  BarChart3, Gift, Coins, Eye, MessageCircle, Loader2, ArrowUpRight,
  Sparkles, Shield, Clock, CheckCircle2, Video, PenTool, CreditCard, Lock
} from "lucide-react";
import { Link, useLocation } from "wouter";

const CREATOR_TABS = [
  { href: "/creator",              label: "Dashboard",  icon: BarChart3 },
  { href: "/creator-studio",       label: "Studio",     icon: Video },
  { href: "/creator-analytics",    label: "Analytics",  icon: TrendingUp },
  { href: "/creator-monetization", label: "Monetize",   icon: CreditCard },
  { href: "/creator-onboarding",   label: "Onboarding", icon: PenTool },
  { href: "/shadowfans",           label: "ShadowFans", icon: Lock },
] as const;

function CreatorHubNav() {
  const [loc] = useLocation();
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {CREATOR_TABS.map(t => {
        const active = loc === t.href;
        return (
          <Link key={t.href} href={t.href}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card border border-border/50"
            }`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function CreatorDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: earnings, isLoading: earningsLoading } = trpc.creator.earnings.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: subscriptions } = trpc.creator.mySubscriptions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: tips } = trpc.creator.myTips.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center max-w-md rounded-xl border border-border/50 bg-card/80">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Creator Dashboard</h2>
          <p className="text-muted-foreground mb-6">Sign in to access your creator tools, analytics, and monetization settings.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Sign In to Continue
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const totalEarnings = earnings?.totalRevenue ?? 0;
  const subCount = earnings?.subscriptions ?? 0;
  const tipRevenue = earnings?.tipRevenue ?? 0;

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Creator Hub Header + Tab Nav */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold">
                Creator <span className="text-primary">Hub</span>
              </h1>
              <p className="text-muted-foreground mt-1">Dashboard · Studio · Analytics · Monetization · ShadowFans</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/30">
              <Crown className="w-3 h-3 mr-1" /> Creator
            </Badge>
          </div>
          <CreatorHubNav />
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-border/50 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold font-mono">{totalEarnings.toLocaleString()} <span className="text-xs text-muted-foreground">SKY444</span></div>
            <div className="text-xs text-muted-foreground mt-1">Lifetime revenue</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Subscribers</span>
            </div>
            <div className="text-2xl font-bold font-mono">{subCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Paid subscribers</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Tips Received</span>
            </div>
            <div className="text-2xl font-bold font-mono">{tipRevenue.toLocaleString()} <span className="text-xs text-muted-foreground">SKY444</span></div>
            <div className="text-xs text-muted-foreground mt-1">From supporters</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Content Views</span>
            </div>
            <div className="text-2xl font-bold font-mono">0</div>
            <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
          </div>
        </div>

        <Tabs defaultValue="monetization" className="w-full">
          <TabsList className="w-full bg-card/80 border border-border/50">
            <TabsTrigger value="monetization" className="flex-1">Monetization</TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex-1">Subscriptions</TabsTrigger>
            <TabsTrigger value="tipping" className="flex-1">Tipping</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monetization" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Revenue Streams</h3>
                    <p className="text-xs text-muted-foreground">Your active income sources</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Subscriptions</span>
                    </div>
                    <Badge className={`text-[10px] ${subCount > 0 ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : ""}`}>
                      {subCount > 0 ? `${subCount} Active` : "Setup Required"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span className="text-sm">Tips & Donations</span>
                    </div>
                    <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-sm">Token Rewards</span>
                    </div>
                    <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Marketplace Sales</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Setup Required</Badge>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Growth Tips</h3>
                    <p className="text-xs text-muted-foreground">Maximize your earnings</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm font-medium">Post consistently</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Creators who post 3+ times per week earn 4x more on average.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-3 h-3 text-blue-400" />
                      <span className="text-sm font-medium">Engage your audience</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Reply to comments and DMs to build a loyal community.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-3 h-3 text-primary" />
                      <span className="text-sm font-medium">Offer exclusive content</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Subscribers pay for value they can't get elsewhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { tier: "Supporter", price: "5 SKY444/mo", color: "border-border/30", features: ["Supporter badge", "Early access to posts", "Exclusive reactions"] },
                { tier: "Premium", price: "15 SKY444/mo", color: "border-primary/30 bg-primary/5", features: ["All Supporter perks", "Exclusive content", "Monthly Q&A access", "Discord VIP role"] },
                { tier: "VIP", price: "50 SKY444/mo", color: "border-yellow-500/30 bg-yellow-500/5", features: ["All Premium perks", "1-on-1 mentoring", "Custom content requests", "Revenue sharing"] },
              ].map(plan => (
                <div key={plan.tier} className={`p-5 rounded-xl border ${plan.color}`}>
                  <h4 className="font-bold text-lg mb-1">{plan.tier}</h4>
                  <div className="font-mono text-primary text-xl mb-4">{plan.price}</div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Active
                  </Badge>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl border border-border/50 bg-card/80">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Active Subscribers ({subscriptions?.length ?? 0})
              </h3>
              {subscriptions && subscriptions.length > 0 ? (
                <div className="space-y-2">
                  {subscriptions.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {sub.subscriberId}
                        </div>
                        <div>
                          <span className="text-sm font-medium">Subscriber #{sub.subscriberId}</span>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Since {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${sub.tier === "vip" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : sub.tier === "premium" ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/20"}`}>
                        {sub.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No subscribers yet. Share your profile to attract supporters!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tipping" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" /> Tip Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <span className="text-sm">Accept SKY444 Tips</span>
                    <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <span className="text-sm">Minimum Tip Amount</span>
                    <span className="text-sm font-mono">1 SKY444</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <span className="text-sm">Tip Message Display</span>
                    <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">Public</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <span className="text-sm">Platform Fee</span>
                    <span className="text-sm font-mono text-purple-400">0%</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/80">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" /> Recent Tips ({tips?.length ?? 0})
                </h3>
                {tips && tips.length > 0 ? (
                  <div className="space-y-2">
                    {tips.slice(0, 8).map((tip: any) => (
                      <div key={tip.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                        <div>
                          <span className="text-sm font-medium">From #{tip.senderId}</span>
                          {tip.message && <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{tip.message}</p>}
                        </div>
                        <span className="font-mono text-sm text-primary font-bold">+{Number(tip.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Heart className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No tips received yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Share your profile to start receiving tips!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 rounded-xl border border-border/50 bg-card/80 text-center">
                <div className="text-2xl font-bold font-mono text-primary">{subCount}</div>
                <div className="text-xs text-muted-foreground">Subscribers</div>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/80 text-center">
                <div className="text-2xl font-bold font-mono text-purple-400">{totalEarnings.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/80 text-center">
                <div className="text-2xl font-bold font-mono text-blue-400">{tips?.length ?? 0}</div>
                <div className="text-xs text-muted-foreground">Tips Received</div>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/80 text-center">
                <div className="text-2xl font-bold font-mono text-yellow-400">
                  {subCount > 0 ? ((tipRevenue / subCount) || 0).toFixed(0) : "0"}
                </div>
                <div className="text-xs text-muted-foreground">Avg Tip/Sub</div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border/50 bg-card/80">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Subscriptions</span>
                    <span className="font-mono">{(earnings?.subRevenue ?? 0).toLocaleString()} SKY444</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                    <div className="h-full bg-primary rounded-full" style={{ width: totalEarnings > 0 ? `${((earnings?.subRevenue ?? 0) / totalEarnings) * 100}%` : "0%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Tips</span>
                    <span className="font-mono">{tipRevenue.toLocaleString()} SKY444</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: totalEarnings > 0 ? `${(tipRevenue / totalEarnings) * 100}%` : "0%" }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Detailed analytics charts will appear as you accumulate more data.</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
