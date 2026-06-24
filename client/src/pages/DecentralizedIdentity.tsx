/**
 * DecentralizedIdentity — Phase 11 Decentralized Identity (DID)
 * Self-sovereign identity, verifiable credentials, Web3 identity layer
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Key, Shield, CheckCircle, Lock, Globe, User } from "lucide-react";

const CREDENTIALS = [
  { type: "Email Verified", issuer: "ShadowChat", date: "2024-01-15", status: "active" },
  { type: "Phone Verified", issuer: "ShadowChat", date: "2024-01-16", status: "active" },
  { type: "KYC Level 1", issuer: "ShadowChat Trust", date: "2024-02-01", status: "active" },
  { type: "Creator Verified", issuer: "ShadowChat", date: "2024-03-10", status: "active" },
];

export default function DecentralizedIdentity() {
  const [tab, setTab] = useState<"identity" | "credentials" | "privacy">("identity");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            Decentralized Identity
          </h1>
          <p className="text-xs text-muted-foreground">Self-sovereign identity — Phase 11</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* DID Card */}
        <div className="card p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold">Your DID</div>
              <div className="text-xs font-mono text-muted-foreground">did:shadow:0x7f3a...9c2b</div>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Active</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Your identity is self-sovereign. You control what you share and with whom.</div>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["identity", "credentials", "privacy"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "identity" && (
          <div className="space-y-3">
            {[
              { label: "Identity Type", value: "Shadow DID v1.0", icon: Globe },
              { label: "Created", value: "January 15, 2024", icon: Key },
              { label: "Last Updated", value: "March 10, 2024", icon: Shield },
              { label: "Linked Wallets", value: "2 wallets", icon: Lock },
            ].map(item => (
              <div key={item.label} className="card p-3 flex items-center gap-3">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="ml-auto text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "credentials" && (
          <div className="space-y-3">
            {CREDENTIALS.map((c, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.type}</div>
                  <div className="text-xs text-muted-foreground">Issued by {c.issuer} · {c.date}</div>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">{c.status}</span>
              </div>
            ))}
            <button className="w-full card p-3 text-sm text-primary border-dashed border-primary/30 hover:bg-primary/5 transition-colors">
              + Add Credential
            </button>
          </div>
        )}

        {tab === "privacy" && (
          <div className="space-y-3">
            <div className="card p-4 bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">Zero-Knowledge Proofs</h4>
              <p className="text-xs text-muted-foreground">Prove facts about yourself without revealing the underlying data. e.g., "I am over 18" without sharing your birthdate.</p>
            </div>
            {[
              { claim: "Age verification", status: "enabled", desc: "Prove 18+ without sharing DOB" },
              { claim: "Income range", status: "disabled", desc: "Prove income bracket for services" },
              { claim: "Location region", status: "enabled", desc: "Prove country without exact location" },
              { claim: "Credit score range", status: "disabled", desc: "Prove creditworthiness privately" },
            ].map(p => (
              <div key={p.claim} className="card p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "enabled" ? "bg-green-400" : "bg-secondary"}`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{p.claim}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
                <span className={`text-xs ${p.status === "enabled" ? "text-green-400" : "text-muted-foreground"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
