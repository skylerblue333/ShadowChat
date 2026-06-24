/**
 * PaymentInfra — Phase 31 Payments + Wallet + Execution Infrastructure
 * Wallet system, action billing, escrow, Stripe integration, cost tracking
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Wallet, CreditCard, Shield, BarChart3,
  ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2,
  DollarSign, Zap, Lock, RefreshCw
} from "lucide-react";

const WALLET_STATS = [
  { label: "Total Revenue", value: "$—", change: "+12.4%", positive: true },
  { label: "AI Cost", value: "$89.20", change: "+3.1%", positive: false },
  { label: "Net Profit", value: "$1,158.60", change: "+14.2%", positive: true },
  { label: "Margin", value: "92.9%", change: "+1.8%", positive: true },
];

const TRANSACTIONS = [
  { id: "tx001", type: "credit", label: "Logo Designer AI — Premium", amount: 9.99, status: "completed", time: "2m ago" },
  { id: "tx002", type: "credit", label: "Resume Builder AI — Power", amount: 34.99, status: "completed", time: "8m ago" },
  { id: "tx003", type: "debit", label: "AI Compute Cost", amount: 0.42, status: "completed", time: "8m ago" },
  { id: "tx004", type: "credit", label: "Gig Finder AI — Basic", amount: 3.99, status: "completed", time: "15m ago" },
  { id: "tx005", type: "escrow", label: "Marketplace Service — Held", amount: 49.00, status: "pending", time: "22m ago" },
  { id: "tx006", type: "credit", label: "Creator Subscription — Monthly", amount: 25.00, status: "completed", time: "1h ago" },
];

const ACTION_BILLING_FLOW = [
  { step: "User Request", desc: "User submits action via chat", icon: Zap },
  { step: "Cost Estimation", desc: "AI calculates execution cost", icon: DollarSign },
  { step: "Payment Check", desc: "Verify wallet balance or card", icon: CreditCard },
  { step: "Deduct Credits", desc: "Atomic deduction from balance", icon: ArrowDownLeft },
  { step: "Execute Action", desc: "AI performs the task", icon: RefreshCw },
  { step: "Return Result", desc: "Deliver output to user", icon: CheckCircle2 },
];

const PAYMENT_SYSTEMS = [
  { name: "Stripe", desc: "Primary payment gateway — cards, Apple/Google Pay", status: "ready", color: "text-blue-400" },
  { name: "Internal Wallet", desc: "Credit system: $1 = 100 credits", status: "live", color: "text-green-400" },
  { name: "Escrow Engine", desc: "Marketplace service payments held until completion", status: "live", color: "text-green-400" },
  { name: "Crypto Payments", desc: "SKY444, USDT, BTC via wallet connect", status: "planned", color: "text-muted-foreground" },
];

export default function PaymentInfra() {
  const [activeTab, setActiveTab] = useState<"overview" | "billing" | "transactions" | "systems">("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Payment Infrastructure
          </h1>
          <p className="text-xs text-muted-foreground">Phase 31 — Real-time AI execution economy</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {WALLET_STATS.map(s => (
            <div key={s.label} className="card p-3">
              <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
              <div className="text-lg font-bold">{s.value}</div>
              <div className={`text-xs font-medium ${s.positive ? "text-green-400" : "text-red-400"}`}>{s.change} this week</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["overview", "billing", "transactions", "systems"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "billing" ? "Billing" : t === "transactions" ? "Txns" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-3">
            <div className="card p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h3 className="font-bold text-sm mb-2">Financial Architecture</h3>
              <div className="space-y-2">
                {[
                  { name: "Wallet System", desc: "User balance: deposits, earned credits, spent credits, refunds" },
                  { name: "Payment Gateway", desc: "Stripe primary → converts real money to platform credits" },
                  { name: "Credit System", desc: "$1 = 100 credits — simplifies pricing, enables AI action billing" },
                ].map(item => (
                  <div key={item.name} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{item.name}</span>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3">End-to-End Money Flow</h3>
              <div className="flex items-center gap-1 flex-wrap text-xs">
                {["User", "AI Suggestion", "Pricing Display", "Payment Gateway", "Wallet Credit", "Action Execution", "AI Result", "Transaction Log", "Feed Update"].map((step, i, arr) => (
                  <span key={step} className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded ${i === 3 ? "bg-green-500/20 text-green-400 font-medium" : "bg-secondary/50 text-muted-foreground"}`}>{step}</span>
                    {i < arr.length - 1 && <span className="text-primary">→</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-2">Profit Formula</h3>
              <div className="font-mono text-sm bg-secondary/30 rounded-lg p-3">
                <span className="text-green-400">Profit</span> = <span className="text-blue-400">Revenue</span> - <span className="text-red-400">AI Compute</span> - <span className="text-yellow-400">Infra Cost</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Current margin: 92.9% — AI costs tracked per action to ensure profitability at scale.</p>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Every AI action goes through this billing pipeline before execution.</p>
            {ACTION_BILLING_FLOW.map((step, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.step}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground">{i + 1}/{ACTION_BILLING_FLOW.length}</div>
              </div>
            ))}
            <div className="card p-3 bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold">Fraud Protection</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Idempotent transactions — no duplicate charges</div>
                <div>• Double-spend prevention via atomic DB operations</div>
                <div>• Rollback support for failed executions</div>
                <div>• Escrow validation before marketplace releases</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-2">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="card p-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === "credit" ? "bg-green-500/20" : tx.type === "debit" ? "bg-red-500/20" : "bg-yellow-500/20"
                }`}>
                  {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> :
                   tx.type === "debit" ? <ArrowUpRight className="w-4 h-4 text-red-400" /> :
                   <Clock className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{tx.label}</div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${tx.type === "credit" ? "text-green-400" : tx.type === "debit" ? "text-red-400" : "text-yellow-400"}`}>
                    {tx.type === "credit" ? "+" : tx.type === "debit" ? "-" : "~"}${tx.amount.toFixed(2)}
                  </div>
                  <div className={`text-xs ${tx.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "systems" && (
          <div className="space-y-3">
            {PAYMENT_SYSTEMS.map(sys => (
              <div key={sys.name} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{sys.name}</span>
                  <span className={`text-xs font-medium ${sys.color}`}>{sys.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{sys.desc}</p>
              </div>
            ))}
            <div className="card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">Subscription + Credits Hybrid</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { tier: "Basic", price: "$10/mo", credits: "1,000 credits" },
                  { tier: "Execution", price: "$25/mo", credits: "Unlimited basic" },
                  { tier: "Power", price: "$50/mo", credits: "All agents + priority" },
                ].map(t => (
                  <div key={t.tier} className="p-2 bg-background/50 rounded-lg">
                    <div className="font-bold">{t.tier}</div>
                    <div className="text-primary">{t.price}</div>
                    <div className="text-muted-foreground">{t.credits}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
