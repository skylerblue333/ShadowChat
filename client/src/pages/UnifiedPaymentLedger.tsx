import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Filter,
  Download, RefreshCw, CreditCard, Zap, Users, ShoppingBag,
  Heart, Crown, Coins, BarChart3, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const REVENUE_DATA = [
  { day: "Jun 12", tips: 120, subs: 450, marketplace: 80, tokens: 200 },
  { day: "Jun 13", tips: 85, subs: 450, marketplace: 120, tokens: 150 },
  { day: "Jun 14", tips: 210, subs: 450, marketplace: 60, tokens: 380 },
  { day: "Jun 15", tips: 175, subs: 450, marketplace: 200, tokens: 290 },
  { day: "Jun 16", tips: 320, subs: 450, marketplace: 150, tokens: 440 },
  { day: "Jun 17", tips: 450, subs: 450, marketplace: 280, tokens: 520 },
  { day: "Jun 18", tips: 380, subs: 450, marketplace: 190, tokens: 610 },
];

type Transaction = {
  id: string;
  type: "tip" | "subscription" | "marketplace" | "token" | "payout";
  from: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  note?: string;
};

const TRANSACTIONS: Transaction[] = [
  { id: "tx-001", type: "tip", from: "alex.chen", amount: "+$25.00", status: "completed", timestamp: "2m ago", note: "Great content!" },
  { id: "tx-002", type: "subscription", from: "nova.subscriber", amount: "+$9.99", status: "completed", timestamp: "8m ago", note: "Monthly sub" },
  { id: "tx-003", type: "token", from: "Staking Reward", amount: "+444 SKY", status: "completed", timestamp: "15m ago" },
  { id: "tx-004", type: "marketplace", from: "DHgate Order #8821", amount: "-$89.99", status: "completed", timestamp: "22m ago", note: "Luxury Watch" },
  { id: "tx-005", type: "tip", from: "prism.fan", amount: "+$50.00", status: "completed", timestamp: "35m ago", note: "PPV unlock" },
  { id: "tx-006", type: "payout", from: "Stripe Payout", amount: "-$500.00", status: "pending", timestamp: "1h ago", note: "Weekly payout" },
  { id: "tx-007", type: "subscription", from: "blaze.creator", amount: "+$19.99", status: "completed", timestamp: "2h ago", note: "Premium tier" },
  { id: "tx-008", type: "token", from: "Token Swap", amount: "+0.15 ETH", status: "completed", timestamp: "3h ago" },
  { id: "tx-009", type: "marketplace", from: "DHgate Order #8820", amount: "-$45.00", status: "failed", timestamp: "4h ago", note: "Sneakers" },
  { id: "tx-010", type: "tip", from: "cipher.ai", amount: "+$10.00", status: "completed", timestamp: "5h ago" },
];

const typeIcons: Record<string, typeof DollarSign> = {
  tip: Heart,
  subscription: Crown,
  marketplace: ShoppingBag,
  token: Coins,
  payout: ArrowDownLeft,
};

const typeColors: Record<string, string> = {
  tip: "text-pink-400 bg-pink-500/10",
  subscription: "text-purple-400 bg-purple-500/10",
  marketplace: "text-green-400 bg-green-500/10",
  token: "text-yellow-400 bg-yellow-500/10",
  payout: "text-orange-400 bg-orange-500/10",
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  pending: Clock,
  failed: XCircle,
};

const statusColors: Record<string, string> = {
  completed: "text-green-400",
  pending: "text-yellow-400",
  failed: "text-red-400",
};

export default function UnifiedPaymentLedger() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState<"all" | "tip" | "subscription" | "marketplace" | "token" | "payout">("all");

  const filtered = filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === filter);
  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.tips + d.subs + d.marketplace + d.tokens, 0);
  const weeklyNet = REVENUE_DATA.reduce((s, d) => s + d.tips + d.subs + d.marketplace + d.tokens, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Unified Payment Ledger</h1>
          </div>
          <p className="text-sm text-white/50">Tips · Subscriptions · Marketplace · Tokens — all in one ledger</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gradient-psychedelic text-white gap-2">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Weekly Revenue", value: `$${(weeklyNet / 100).toFixed(0)}K`, icon: TrendingUp, color: "text-green-400", change: "+28%" },
          { label: "Total Tips", value: "$1,740", icon: Heart, color: "text-pink-400", change: "+34%" },
          { label: "Subscriptions", value: "$3,150", icon: Crown, color: "text-purple-400", change: "+12%" },
          { label: "Token Earnings", value: "2,590 SKY", icon: Coins, color: "text-yellow-400", change: "+67%" },
        ].map(kpi => (
          <Card key={kpi.label} className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                <span className="text-xs text-green-400 font-mono">{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{kpi.value}</div>
              <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" /> Revenue by Stream (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Area type="monotone" dataKey="subs" stackId="1" stroke="#a855f7" fill="rgba(168,85,247,0.3)" strokeWidth={2} name="Subscriptions" />
                  <Area type="monotone" dataKey="tips" stackId="1" stroke="#ec4899" fill="rgba(236,72,153,0.2)" strokeWidth={2} name="Tips" />
                  <Area type="monotone" dataKey="tokens" stackId="1" stroke="#eab308" fill="rgba(234,179,8,0.2)" strokeWidth={2} name="Tokens" />
                  <Area type="monotone" dataKey="marketplace" stackId="1" stroke="#22c55e" fill="rgba(34,197,94,0.2)" strokeWidth={2} name="Marketplace" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="mt-4 space-y-3">
          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "tip", "subscription", "marketplace", "token", "payout"] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 h-7 text-xs capitalize ${filter === f ? "gradient-psychedelic text-white border-0" : "border-white/10 text-white/50"}`}
              >
                {f}
              </Button>
            ))}
          </div>

          {filtered.map(tx => {
            const Icon = typeIcons[tx.type];
            const StatusIcon = statusIcons[tx.status];
            const isPositive = tx.amount.startsWith("+");
            return (
              <Card key={tx.id} className="glass-card border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[tx.type]}`}>
                      <Icon className={`w-4 h-4 ${typeColors[tx.type].split(" ")[0]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{tx.from}</div>
                      <div className="text-xs text-white/40">{tx.note || tx.type} · {tx.timestamp}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-bold font-mono text-sm ${isPositive ? "text-green-400" : "text-white/60"}`}>
                        {tx.amount}
                      </div>
                      <div className={`flex items-center gap-1 justify-end text-xs ${statusColors[tx.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {tx.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
