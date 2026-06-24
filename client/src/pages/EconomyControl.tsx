/**
 * EconomyControl — Unhidden Mode: Economy Control Panel
 * Platform economy management: token supply, treasury, fee controls, revenue streams
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  DollarSign, TrendingUp, Settings, ArrowLeft, Zap, BarChart2,
  Lock, Unlock, AlertTriangle, RefreshCw, ChevronRight, Activity
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const REVENUE_STREAMS = [
  { name: "Marketplace Fees",    rate: "2.5%",  status: "active",   monthly: 12400  },
  { name: "Subscription Plans",  rate: "flat",  status: "active",   monthly: 8900   },
  { name: "AI Agent Usage",      rate: "per-call", status: "active", monthly: 6200  },
  { name: "Streaming Tips",      rate: "5%",    status: "active",   monthly: 3800   },
  { name: "NFT Minting",         rate: "1%",    status: "active",   monthly: 2100   },
  { name: "Token Swap",          rate: "0.3%",  status: "active",   monthly: 1700   },
  { name: "Premium DMs",         rate: "flat",  status: "paused",   monthly: 0      },
  { name: "Staking Rewards",     rate: "APY",   status: "active",   monthly: 4500   },
];

const FEE_CONTROLS = [
  { label: "Marketplace Fee",    key: "marketplace_fee",    value: "2.5", unit: "%" },
  { label: "Streaming Cut",      key: "streaming_cut",      value: "5.0", unit: "%" },
  { label: "NFT Royalty",        key: "nft_royalty",        value: "1.0", unit: "%" },
  { label: "Swap Fee",           key: "swap_fee",           value: "0.3", unit: "%" },
  { label: "Referral Bonus",     key: "referral_bonus",     value: "10",  unit: "%" },
  { label: "Creator Revenue Share", key: "creator_share",  value: "70",  unit: "%" },
];

export default function EconomyControl() {
  const [fees, setFees] = useState<Record<string, string>>(
    Object.fromEntries(FEE_CONTROLS.map(f => [f.key, f.value]))
  );
  const [locked, setLocked] = useState(true);

  const { data: tokenData } = trpc.token.tokenomics.useQuery();
  const totalMonthly = REVENUE_STREAMS.reduce((s, r) => s + r.monthly, 0);

  const handleSaveFees = () => {
    toast.success("Fee structure updated. Changes take effect next billing cycle.");
    setLocked(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/unhidden">
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            Economy Control
          </h1>
          <p className="text-xs text-muted-foreground">Platform revenue, fees & treasury</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full">
          <Activity className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monthly Revenue", value: `$${totalMonthly.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
            { label: "Treasury Balance", value: "$2.4M", icon: TrendingUp, color: "text-blue-400" },
            { label: "Token Supply", value: tokenData?.totalSupply ? `${Number(tokenData.totalSupply).toLocaleString()}` : "1,000,000,000", icon: Zap, color: "text-yellow-400" },
            { label: "Active Streams", value: REVENUE_STREAMS.filter(r => r.status === "active").length.toString(), icon: BarChart2, color: "text-purple-400" },
          ].map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-secondary/30 border border-border/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="font-bold text-lg">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue Streams */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Revenue Streams</h2>
            <span className="text-xs text-muted-foreground">{REVENUE_STREAMS.filter(r => r.status === "active").length} active</span>
          </div>
          <div className="divide-y divide-border/30">
            {REVENUE_STREAMS.map(stream => (
              <div key={stream.name} className="px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${stream.status === "active" ? "bg-green-400" : "bg-yellow-400"}`} />
                  <div>
                    <p className="text-sm font-medium">{stream.name}</p>
                    <p className="text-xs text-muted-foreground">Rate: {stream.rate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {stream.monthly > 0 ? `$${stream.monthly.toLocaleString()}` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">/ month</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-secondary/30 flex items-center justify-between">
            <span className="text-sm font-semibold">Total Monthly</span>
            <span className="text-sm font-bold text-green-400">${totalMonthly.toLocaleString()}</span>
          </div>
        </div>

        {/* Fee Controls */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Fee Controls
            </h2>
            <button onClick={() => setLocked(!locked)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                locked ? "bg-secondary text-muted-foreground" : "bg-yellow-500/20 text-yellow-400"
              }`}>
              {locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {locked ? "Locked" : "Editing"}
            </button>
          </div>
          {!locked && (
            <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              <p className="text-xs text-yellow-400">Changes affect all active users. Review carefully before saving.</p>
            </div>
          )}
          <div className="divide-y divide-border/30">
            {FEE_CONTROLS.map(fee => (
              <div key={fee.key} className="px-4 py-3 flex items-center justify-between">
                <label className="text-sm text-muted-foreground">{fee.label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={fees[fee.key]}
                    onChange={e => !locked && setFees(prev => ({ ...prev, [fee.key]: e.target.value }))}
                    readOnly={locked}
                    className={`w-16 text-right text-sm font-mono bg-transparent border rounded px-2 py-1 outline-none ${
                      locked ? "border-transparent text-foreground" : "border-primary/50 text-primary"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground w-4">{fee.unit}</span>
                </div>
              </div>
            ))}
          </div>
          {!locked && (
            <div className="px-4 py-3 flex gap-2">
              <button onClick={handleSaveFees}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Save Fee Structure
              </button>
              <button onClick={() => setLocked(true)}
                className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Token Tokenomics", path: "/token-economy",    icon: Zap },
            { label: "Investor Room",    path: "/investor-room",    icon: TrendingUp },
            { label: "Yield Farming",    path: "/yield-farming",    icon: RefreshCw },
            { label: "Staking",          path: "/staking",          icon: BarChart2 },
          ].map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
