/**
 * ProfileWallet — YC MVP Surface 3
 * Identity + Balance + Activity History + Monetization CTA
 * The "value accumulation" layer of the core loop
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowLeft, Wallet, TrendingUp, DollarSign, Zap, Star,
  Copy, ExternalLink, Shield, CheckCircle, Clock, ArrowUpRight,
  ArrowDownLeft, Bot, ShoppingBag, Heart, Users, MessageSquare,
  Settings, ChevronRight, Edit3, Camera
} from "lucide-react";

const ACTIVITY_TYPES = {
  tip_sent: { icon: ArrowUpRight, color: "text-red-400", label: "Tip Sent" },
  tip_received: { icon: ArrowDownLeft, color: "text-green-400", label: "Tip Received" },
  service: { icon: ShoppingBag, color: "text-blue-400", label: "Service" },
  ai_action: { icon: Bot, color: "text-purple-400", label: "AI Action" },
  subscription: { icon: Star, color: "text-yellow-400", label: "Subscription" },
};

const MOCK_ACTIVITY = [
  { type: "tip_received", desc: "Tip from Alex Chen", amount: "+25 SKY", time: "2m ago" },
  { type: "ai_action", desc: "AI found designer", amount: "0 SKY", time: "1h ago" },
  { type: "tip_sent", desc: "Tip to PixelPro", amount: "-45 SKY", time: "2h ago" },
  { type: "service", desc: "Logo design delivered", amount: "-45 SKY", time: "1d ago" },
  { type: "subscription", desc: "Premium subscription", amount: "-10 SKY", time: "3d ago" },
  { type: "tip_received", desc: "Tip from Sarah K.", amount: "+10 SKY", time: "5d ago" },
];

export default function ProfileWallet() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "earn">("overview");
  const [copied, setCopied] = useState(false);

  const { data: profile } = trpc.user.profile.useQuery({ userId: user?.id ?? 0 }, { enabled: !!user });
  const { data: walletData } = trpc.wallet.getBalance.useQuery(undefined, { enabled: !!user });
  const { data: transactions } = trpc.wallet.getTransactions.useQuery(undefined, { enabled: !!user });

  const balance = (walletData as any)?.balance ?? 1247;
  const walletAddress = (walletData as any)?.address ?? "0x1a2b...9f3e";
  const profileData = profile as any;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Followers", value: profileData?.followersCount ?? 342, icon: Users },
    { label: "Posts", value: profileData?.postsCount ?? 28, icon: MessageSquare },
    { label: "Tips Received", value: "1.2K SKY", icon: DollarSign },
    { label: "AI Actions", value: 47, icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-bold text-lg">Profile & Wallet</h1>
        </div>
        <Link href="/settings" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <Settings className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Profile hero */}
        <div className="relative">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 relative">
            <button className="absolute bottom-2 right-2 p-1.5 bg-black/40 rounded-lg text-white hover:bg-black/60 transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Avatar */}
          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-10 mb-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 border-4 border-background flex items-center justify-center text-2xl font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() ?? "U"}
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-secondary rounded-full border-2 border-background">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-2">
                <Link href="/chat" className="px-4 py-1.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  Message
                </Link>
                <Link href="/action-panel" className="px-4 py-1.5 bg-secondary/50 hover:bg-secondary rounded-xl text-sm font-medium transition-colors">
                  Actions
                </Link>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl">{user?.username ?? "Anonymous"}</h2>
              <p className="text-sm text-muted-foreground">@{user?.username?.toLowerCase() ?? "user"}</p>
              <p className="text-sm mt-1 text-muted-foreground">Building the future of AI-powered messaging 🚀</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 px-4 mb-4">
          {stats.map(stat => (
            <div key={stat.label} className="card p-2.5 text-center">
              <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="font-bold text-sm">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Wallet card */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-semibold">SKY444 Wallet</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <Shield className="w-3 h-3" />
              Secured
            </div>
          </div>
          <div className="mb-3">
            <div className="text-3xl font-bold">{balance.toLocaleString()} <span className="text-lg text-muted-foreground">SKY</span></div>
            <div className="text-sm text-muted-foreground">≈ ${(balance * 0.042).toFixed(2)} USD</div>
          </div>
          <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 mb-3">
            <span className="text-xs font-mono text-muted-foreground flex-1 truncate">{walletAddress}</span>
            <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Link href="/action-panel" className="flex flex-col items-center gap-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <ArrowUpRight className="w-4 h-4 text-red-400" />
              <span className="text-xs">Send</span>
            </Link>
            <Link href="/wallet" className="flex flex-col items-center gap-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <ArrowDownLeft className="w-4 h-4 text-green-400" />
              <span className="text-xs">Receive</span>
            </Link>
            <Link href="/token-swap" className="flex flex-col items-center gap-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs">Swap</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
            {(["overview", "activity", "earn"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 pb-8">
          {activeTab === "overview" && (
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> This Week</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Earned</div>
                    <div className="font-bold text-green-400">+142 SKY</div>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Spent</div>
                    <div className="font-bold text-red-400">-67 SKY</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">AI Actions</div>
                    <div className="font-bold text-blue-400">12 tasks</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Messages</div>
                    <div className="font-bold text-purple-400">284 sent</div>
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { label: "Creator Analytics", href: "/creator-analytics", icon: TrendingUp },
                    { label: "Subscriptions", href: "/subscriptions", icon: Star },
                    { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
                    { label: "AI Engineer", href: "/ai-engineer", icon: Bot },
                  ].map(link => (
                    <Link key={link.href} href={link.href} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <link.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-2">
              {MOCK_ACTIVITY.map((item, i) => {
                const typeInfo = ACTIVITY_TYPES[item.type as keyof typeof ACTIVITY_TYPES];
                return (
                  <div key={i} className="card p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center shrink-0">
                      <typeInfo.icon className={`w-4 h-4 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.desc}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${item.amount.startsWith("+") ? "text-green-400" : item.amount.startsWith("-") ? "text-red-400" : "text-muted-foreground"}`}>
                      {item.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "earn" && (
            <div className="space-y-3">
              <div className="card p-4 border border-primary/30 bg-primary/5">
                <h3 className="font-bold mb-1 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Start Earning Now</h3>
                <p className="text-sm text-muted-foreground mb-3">Turn your conversations into income. Every action creates value.</p>
                <div className="space-y-2">
                  {[
                    { label: "Enable Tips on your profile", reward: "+5 SKY bonus", done: true },
                    { label: "Complete your first AI task", reward: "+10 SKY", done: false },
                    { label: "Get 10 followers", reward: "+20 SKY", done: false },
                    { label: "Make your first sale", reward: "+50 SKY", done: false },
                    { label: "Subscribe to a creator", reward: "+2 SKY cashback", done: false },
                  ].map((task, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${task.done ? "bg-green-500/10" : "bg-secondary/30"}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${task.done ? "text-green-400" : "text-muted-foreground/30"}`} />
                      <span className={`text-sm flex-1 ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.label}</span>
                      <span className="text-xs text-primary font-medium">{task.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-3">Monetization Options</h3>
                <div className="space-y-2">
                  {[
                    { label: "Creator Subscriptions", desc: "Charge monthly for exclusive content", href: "/creator-monetization" },
                    { label: "Sell in Marketplace", desc: "List products, templates, services", href: "/marketplace" },
                    { label: "Staking Rewards", desc: "Earn yield on your SKY444", href: "/staking" },
                    { label: "Referral Program", desc: "Earn 10% on referrals", href: "/affiliate" },
                  ].map(opt => (
                    <Link key={opt.href} href={opt.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
