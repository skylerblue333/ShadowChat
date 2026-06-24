/**
 * TrustSystem — Phase 14 Trust, Safety & Control Layer
 * Trust scores, moderation, fraud detection, RBAC, audit logs, platform health
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Shield, AlertTriangle, CheckCircle, Users, Activity,
  Lock, Eye, Zap, TrendingUp, XCircle, Clock, BarChart2, Database
} from "lucide-react";

const TRUST_LEVELS = [
  { range: "90–100", label: "Trusted", color: "text-green-400", bg: "bg-green-500/10", desc: "Full platform access, priority matching" },
  { range: "70–89", label: "Verified", color: "text-blue-400", bg: "bg-blue-500/10", desc: "Standard access, marketplace enabled" },
  { range: "50–69", label: "Standard", color: "text-yellow-400", bg: "bg-yellow-500/10", desc: "Limited AI calls, payment caps" },
  { range: "30–49", label: "Restricted", color: "text-orange-400", bg: "bg-orange-500/10", desc: "Shadow-limited, review queue" },
  { range: "0–29", label: "Blocked", color: "text-red-400", bg: "bg-red-500/10", desc: "No payments, no marketplace, read-only" },
];

const RBAC_ROLES = [
  { role: "USER", permissions: ["send_message", "view_feed", "tip", "subscribe"], color: "text-muted-foreground" },
  { role: "CREATOR", permissions: ["all USER", "create_listing", "receive_payments", "analytics", "ai_tools"], color: "text-blue-400" },
  { role: "MERCHANT", permissions: ["all CREATOR", "bulk_listings", "escrow", "affiliate"], color: "text-purple-400" },
  { role: "MODERATOR", permissions: ["review_content", "shadow_limit", "escalate", "view_reports"], color: "text-yellow-400" },
  { role: "ADMIN", permissions: ["all permissions", "manage_roles", "system_config", "audit_access"], color: "text-red-400" },
];

const FRAUD_SIGNALS = [
  { signal: "Action velocity", desc: "Too many actions per minute", threshold: "> 30/min", severity: "high" },
  { signal: "Payment pattern", desc: "Repeated small transactions", threshold: "> 20/hour", severity: "medium" },
  { signal: "Bot behavior", desc: "Automated message patterns", threshold: "< 0.5s response", severity: "high" },
  { signal: "Wallet anomaly", desc: "Unusual token movements", threshold: "> 10x avg", severity: "critical" },
  { signal: "Chargeback rate", desc: "Disputed transactions", threshold: "> 2%", severity: "high" },
  { signal: "Report rate", desc: "User reports received", threshold: "> 3 reports", severity: "medium" },
];

const AUDIT_ENTRIES = [
  { time: "2m ago", user: "@alice", action: "PAYMENT_SENT", result: "completed", amount: "50 SKY" },
  { time: "5m ago", user: "@bob", action: "LISTING_CREATED", result: "completed", amount: null },
  { time: "8m ago", user: "@charlie", action: "AI_AGENT_CALLED", result: "completed", amount: null },
  { time: "12m ago", user: "@dave", action: "STAKE_TOKENS", result: "failed", amount: "1000 SKY" },
  { time: "15m ago", user: "@eve", action: "SUBSCRIBE", result: "completed", amount: "29 SKY" },
];

export default function TrustSystem() {
  const [activeTab, setActiveTab] = useState<"trust" | "rbac" | "fraud" | "audit" | "health">("trust");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Trust & Safety
          </h1>
          <p className="text-xs text-muted-foreground">Control layer — Phase 14</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          All systems normal
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Avg Trust", value: "84", icon: Shield, color: "text-green-400" },
            { label: "Flagged", value: "12", icon: AlertTriangle, color: "text-yellow-400" },
            { label: "Blocked", value: "3", icon: XCircle, color: "text-red-400" },
            { label: "Actions/s", value: "142", icon: Zap, color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 overflow-x-auto">
          {(["trust", "rbac", "fraud", "audit", "health"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {tab === "rbac" ? "Roles" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Trust Score System */}
        {activeTab === "trust" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Dynamic trust scores affect visibility, payment limits, and platform access.</p>
            {TRUST_LEVELS.map(level => (
              <div key={level.range} className={`card p-4 border-l-2 ${level.color.replace("text-", "border-")}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${level.bg} ${level.color}`}>{level.label}</span>
                    <span className="text-xs text-muted-foreground font-mono">{level.range}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{level.desc}</p>
              </div>
            ))}
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">Trust Score Signals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {["Payment success rate", "Report history", "Message quality (AI)", "Transaction volume", "Account age", "Verification status"].map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RBAC */}
        {activeTab === "rbac" && (
          <div className="space-y-3">
            {RBAC_ROLES.map(r => (
              <div key={r.role} className="card p-4">
                <div className={`font-bold text-sm mb-2 ${r.color}`}>{r.role}</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 bg-secondary/50 rounded-lg text-muted-foreground">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fraud Detection */}
        {activeTab === "fraud" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Real-time fraud signals monitored across all user actions.</p>
            {FRAUD_SIGNALS.map(sig => (
              <div key={sig.signal} className="card p-4 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${sig.severity === "critical" ? "bg-red-500" : sig.severity === "high" ? "bg-orange-400" : "bg-yellow-400"}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{sig.signal}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sig.severity === "critical" ? "bg-red-500/20 text-red-400" : sig.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{sig.severity}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{sig.desc}</div>
                  <div className="text-xs font-mono text-primary mt-0.5">Threshold: {sig.threshold}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audit Log */}
        {activeTab === "audit" && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Immutable audit trail — every action is traceable.</p>
            {AUDIT_ENTRIES.map((entry, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${entry.result === "completed" ? "bg-green-400" : "bg-red-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{entry.user}</span>
                    <span className="text-xs font-mono text-primary">{entry.action}</span>
                  </div>
                  {entry.amount && <div className="text-xs text-muted-foreground">{entry.amount}</div>}
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs ${entry.result === "completed" ? "text-green-400" : "text-red-400"}`}>{entry.result}</div>
                  <div className="text-xs text-muted-foreground">{entry.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Platform Health */}
        {activeTab === "health" && (
          <div className="space-y-3">
            {[
              { name: "API Gateway", uptime: "99.98%", latency: "12ms", status: "healthy" },
              { name: "Action Engine", uptime: "99.95%", latency: "45ms", status: "healthy" },
              { name: "AI Service", uptime: "99.87%", latency: "280ms", status: "healthy" },
              { name: "Wallet Service", uptime: "99.99%", latency: "8ms", status: "healthy" },
              { name: "Real-time Events", uptime: "99.92%", latency: "3ms", status: "healthy" },
              { name: "Database", uptime: "99.99%", latency: "2ms", status: "healthy" },
            ].map(svc => (
              <div key={svc.name} className="card p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{svc.name}</div>
                  <div className="text-xs text-muted-foreground">Uptime: {svc.uptime}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-green-400">{svc.latency}</div>
                  <div className="text-xs text-muted-foreground">avg latency</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
