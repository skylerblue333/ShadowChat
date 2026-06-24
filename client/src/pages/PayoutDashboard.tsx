import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Zap, ArrowDownToLine, Wallet, BarChart3, Users, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

const PAYOUT_HISTORY = [
  { id: 1, amount: 1240.50, method: "Bank Transfer", status: "completed", date: "Jun 15", txId: "PAY-001" },
  { id: 2, amount: 890.00,  method: "Crypto (SKY444)", status: "completed", date: "Jun 1",  txId: "PAY-002" },
  { id: 3, amount: 2100.75, method: "Bank Transfer", status: "pending",   date: "Jun 18", txId: "PAY-003" },
  { id: 4, amount: 450.00,  method: "Crypto (ETH)",   status: "failed",    date: "May 28", txId: "PAY-004" },
];

const EARNINGS_BREAKDOWN = [
  { source: "Subscriptions", amount: 3840, pct: 52, color: "bg-purple-500" },
  { source: "PPV Content",   amount: 1920, pct: 26, color: "bg-fuchsia-500" },
  { source: "Tips",          amount: 1100, pct: 15, color: "bg-pink-500" },
  { source: "Referrals",     amount: 520,  pct: 7,  color: "bg-rose-500" },
];

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  completed: { icon: CheckCircle, color: "text-green-400",  label: "Completed" },
  pending:   { icon: Clock,       color: "text-yellow-400", label: "Pending"   },
  failed:    { icon: XCircle,     color: "text-red-400",    label: "Failed"    },
};

export default function PayoutDashboard() {
  const [requestAmount, setRequestAmount] = useState("");
  const [method, setMethod] = useState("bank");

  const { data: earnings } = trpc.creator.earnings.useQuery(undefined, { retry: false });

  const totalEarnings = 7380;
  const availableBalance = 2840;
  const pendingPayout = 2100.75;
  const lifetimePayouts = 14200;

  const handleRequestPayout = () => {
    const amt = parseFloat(requestAmount);
    if (!amt || amt < 50) { toast.error("Minimum payout is $50"); return; }
    if (amt > availableBalance) { toast.error("Insufficient balance"); return; }
    toast.success(`Payout of $${amt.toFixed(2)} requested via ${method === "bank" ? "Bank Transfer" : "Crypto"}`);
    setRequestAmount("");
  };

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050308]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="font-black text-white">Payout Dashboard</span>
          </div>
          <Link href="/creator-studio">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs">
              Creator Studio
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Available Balance", value: `$${availableBalance.toLocaleString()}`, icon: Wallet,       color: "text-green-400",  sub: "Ready to withdraw" },
            { label: "This Month",        value: `$${totalEarnings.toLocaleString()}`,    icon: TrendingUp,   color: "text-purple-400", sub: "+23% vs last month" },
            { label: "Pending Payout",    value: `$${pendingPayout.toFixed(2)}`,          icon: Clock,        color: "text-yellow-400", sub: "Processing 3-5 days" },
            { label: "Lifetime Payouts",  value: `$${lifetimePayouts.toLocaleString()}`,  icon: CheckCircle,  color: "text-blue-400",   sub: "All time" },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Request Payout */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-green-400" />
              Request Payout
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={e => setRequestAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Available: ${availableBalance.toLocaleString()} · Min: $50</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Payout Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bank",   label: "Bank Transfer", sub: "3-5 days" },
                    { id: "crypto", label: "Crypto (SKY444)", sub: "Instant" },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${method === m.id ? "border-green-500 bg-green-900/20" : "border-slate-700 hover:border-slate-600"}`}
                    >
                      <p className="text-xs font-semibold text-white">{m.label}</p>
                      <p className="text-[10px] text-slate-500">{m.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleRequestPayout} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold">
                <Zap className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </div>
          </div>

          {/* Earnings breakdown */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Earnings Breakdown
            </h2>
            <div className="space-y-3">
              {EARNINGS_BREAKDOWN.map(item => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{item.source}</span>
                    <span className="text-xs font-semibold text-white">${item.amount.toLocaleString()} <span className="text-slate-500">({item.pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-400">Platform Fee (20%)</span>
              <span className="text-sm font-semibold text-red-400">-${(totalEarnings * 0.2).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-white">Net Earnings</span>
              <span className="text-sm font-black text-green-400">${(totalEarnings * 0.8).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Payout History
            </h2>
            <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-xs">{PAYOUT_HISTORY.length} transactions</Badge>
          </div>
          <div className="divide-y divide-slate-800">
            {PAYOUT_HISTORY.map(payout => {
              const { icon: StatusIcon, color, label } = STATUS_STYLES[payout.status];
              return (
                <div key={payout.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <StatusIcon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{payout.method}</p>
                    <p className="text-xs text-slate-500">{payout.txId} · {payout.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-white">${payout.amount.toFixed(2)}</p>
                    <Badge className={`text-[9px] px-1.5 py-0.5 ${color} bg-transparent border-current`}>{label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tax notice */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Earnings may be subject to tax reporting requirements. Creators earning over $600/year will receive a 1099-K form. Consult a tax professional for guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
