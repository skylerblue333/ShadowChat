/**
 * SecurityCompliance — Phase 32 Security + Compliance + Abuse Control
 * Auth hardening, fraud detection, rate limits, audit logs, trust scores
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, ShieldCheck, AlertTriangle, Activity, Lock,
  Eye, FileText, Users, Zap, CheckCircle2, XCircle, Clock
} from "lucide-react";

const SECURITY_LAYERS = [
  { name: "Identity + Auth Hardening", icon: Lock, status: "live", items: ["JWT + refresh tokens", "Device tracking", "Login anomaly detection", "Session management"] },
  { name: "Fraud Detection Engine", icon: AlertTriangle, status: "live", items: ["Payment velocity checks", "Bot behavior detection", "Refund abuse patterns", "Action spike monitoring"] },
  { name: "AI Abuse Filter", icon: Eye, status: "live", items: ["Harmful instruction blocking", "Spam generation prevention", "Manipulation detection", "Policy violation filter"] },
  { name: "Rate Limiting System", icon: Zap, status: "live", items: ["60 req/min per user", "10 AI actions/min", "Feed refresh limits", "Payment velocity caps"] },
  { name: "Transaction Safety", icon: CheckCircle2, status: "live", items: ["Double-spend prevention", "Idempotent transactions", "Rollback support", "Escrow validation"] },
  { name: "Audit Log System", icon: FileText, status: "live", items: ["Full event traceability", "Who + when + cost + outcome", "Tamper-proof logs", "Compliance export"] },
  { name: "Privacy Protection", icon: Lock, status: "live", items: ["Encryption at rest", "TLS in transit", "Minimal data retention", "Access control layers"] },
  { name: "Trust Score System", icon: Users, status: "live", items: ["Good behavior rewards", "Fraud signal penalties", "Spam behavior detection", "Payment limit gates"] },
  { name: "System Protection", icon: Activity, status: "live", items: ["Circuit breakers", "Fallback responses", "Degraded mode (light AI)", "Queue overflow handling"] },
  { name: "Compliance Readiness", icon: ShieldCheck, status: "in-progress", items: ["ToS enforcement", "Moderation tools", "Content flagging", "Dispute handling"] },
];

const AUDIT_EVENTS = [
  { event: "auth.login", user: "user_8821", risk: "low", time: "1m ago", outcome: "allowed" },
  { event: "payment.execute", user: "user_4412", risk: "low", time: "3m ago", outcome: "allowed" },
  { event: "ai.action", user: "user_9901", risk: "medium", time: "5m ago", outcome: "throttled" },
  { event: "auth.login", user: "user_1123", risk: "high", time: "8m ago", outcome: "blocked" },
  { event: "payment.execute", user: "user_7734", risk: "low", time: "12m ago", outcome: "allowed" },
  { event: "content.flag", user: "user_5521", risk: "high", time: "18m ago", outcome: "escalated" },
];

const SAFE_FLOW = [
  "User Action",
  "Auth Check",
  "Risk Score Check",
  "Rate Limit Check",
  "AI Execution",
  "Payment Check",
  "Audit Log",
  "Result",
  "Monitoring Update",
];

const TRUST_TIERS = [
  { range: "80–100", label: "Trusted", color: "text-green-400", bg: "bg-green-500/10", perks: "Full access, higher limits, priority execution" },
  { range: "50–79", label: "Standard", color: "text-blue-400", bg: "bg-blue-500/10", perks: "Normal access, standard limits" },
  { range: "20–49", label: "Restricted", color: "text-yellow-400", bg: "bg-yellow-500/10", perks: "Reduced limits, payment caps, moderation queue" },
  { range: "0–19", label: "Flagged", color: "text-red-400", bg: "bg-red-500/10", perks: "Read-only, no payments, manual review required" },
];

export default function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState<"layers" | "audit" | "trust" | "flow">("layers");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-400" />
            Security & Compliance
          </h1>
          <p className="text-xs text-muted-foreground">Phase 32 — Production-grade security layer</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">All Systems Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Blocked Today", value: "247", color: "text-red-400" },
            { label: "Throttled", value: "1,891", color: "text-yellow-400" },
            { label: "Allowed", value: "48.2K", color: "text-green-400" },
            { label: "Avg Trust Score", value: "74.2", color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["layers", "audit", "trust", "flow"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "layers" ? "Layers" : t === "audit" ? "Audit Log" : t === "trust" ? "Trust" : "Safe Flow"}
            </button>
          ))}
        </div>

        {activeTab === "layers" && (
          <div className="space-y-2">
            {SECURITY_LAYERS.map(layer => (
              <div key={layer.name} className="card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <layer.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium text-sm flex-1">{layer.name}</span>
                  <span className={`text-xs font-medium ${layer.status === "live" ? "text-green-400" : "text-yellow-400"}`}>{layer.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {layer.items.map(item => (
                    <div key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${layer.status === "live" ? "bg-green-400" : "bg-yellow-400"}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Every system event is logged: who, what, when, cost, outcome.</p>
            {AUDIT_EVENTS.map((ev, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ev.outcome === "allowed" ? "bg-green-400" : ev.outcome === "blocked" ? "bg-red-400" : ev.outcome === "throttled" ? "bg-yellow-400" : "bg-orange-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-medium">{ev.event}</div>
                  <div className="text-xs text-muted-foreground">{ev.user} · {ev.time}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${ev.risk === "high" ? "text-red-400" : ev.risk === "medium" ? "text-yellow-400" : "text-green-400"}`}>{ev.risk} risk</div>
                  <div className={`text-xs ${ev.outcome === "allowed" ? "text-green-400" : ev.outcome === "blocked" ? "text-red-400" : "text-yellow-400"}`}>{ev.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "trust" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Dynamic trust score (0–100) controls feature access, payment limits, and marketplace participation.</p>
            {TRUST_TIERS.map(tier => (
              <div key={tier.range} className={`card p-4 ${tier.bg} border`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-sm ${tier.color}`}>{tier.label}</span>
                  <span className="text-xs text-muted-foreground">Score: {tier.range}</span>
                </div>
                <p className="text-xs text-muted-foreground">{tier.perks}</p>
              </div>
            ))}
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-2">Score Signals</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Payment success", effect: "+5", positive: true },
                  { label: "Completed actions", effect: "+3", positive: true },
                  { label: "Positive reviews", effect: "+4", positive: true },
                  { label: "Spam behavior", effect: "-15", positive: false },
                  { label: "Fraud attempt", effect: "-30", positive: false },
                  { label: "Chargeback", effect: "-20", positive: false },
                ].map(sig => (
                  <div key={sig.label} className="flex items-center justify-between text-xs p-2 rounded-lg bg-secondary/20">
                    <span className="text-muted-foreground">{sig.label}</span>
                    <span className={`font-bold ${sig.positive ? "text-green-400" : "text-red-400"}`}>{sig.effect}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "flow" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">Every user action passes through this security pipeline before execution.</p>
            {SAFE_FLOW.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  i === 0 ? "bg-blue-500/20 text-blue-400" :
                  i === 3 ? "bg-red-500/20 text-red-400" :
                  i === SAFE_FLOW.length - 1 ? "bg-green-500/20 text-green-400" :
                  "bg-primary/20 text-primary"
                }`}>
                  {i + 1}
                </div>
                <div className={`flex-1 p-3 rounded-lg border ${
                  i === 3 ? "bg-red-500/5 border-red-500/20" :
                  i === SAFE_FLOW.length - 1 ? "bg-green-500/5 border-green-500/20" :
                  "bg-secondary/20 border-border/30"
                }`}>
                  <span className="text-sm">{step}</span>
                  {i === 3 && <span className="text-xs text-red-400 ml-2">← Abuse blocked here</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
