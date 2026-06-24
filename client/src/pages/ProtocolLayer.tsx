/**
 * ProtocolLayer — Phase 12 Platform Protocol & Developer Layer
 * Open APIs, SDK, developer tools, third-party integrations, webhooks
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Code2, Webhook, Plug, Key, BookOpen, Terminal } from "lucide-react";

const API_ENDPOINTS = [
  { method: "POST", path: "/api/v1/actions/execute", desc: "Execute any platform action", auth: true },
  { method: "GET", path: "/api/v1/feed", desc: "Get personalized feed", auth: true },
  { method: "POST", path: "/api/v1/payments/send", desc: "Send payment via chat", auth: true },
  { method: "GET", path: "/api/v1/users/:id/profile", desc: "Get user profile", auth: false },
  { method: "POST", path: "/api/v1/ai/intent", desc: "Parse intent from text", auth: true },
  { method: "GET", path: "/api/v1/marketplace/listings", desc: "Browse marketplace", auth: false },
];

const SDK_FEATURES = [
  { name: "Action SDK", desc: "Execute platform actions programmatically", lang: "JS/TS" },
  { name: "Wallet SDK", desc: "Connect and manage wallets", lang: "JS/TS" },
  { name: "AI SDK", desc: "Access intent parser and AI tools", lang: "JS/TS" },
  { name: "Stream SDK", desc: "Embed live streams in any app", lang: "JS/TS" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "text-green-400 bg-green-500/10",
  POST: "text-blue-400 bg-blue-500/10",
  PUT: "text-yellow-400 bg-yellow-500/10",
  DELETE: "text-red-400 bg-red-500/10",
};

export default function ProtocolLayer() {
  const [tab, setTab] = useState<"api" | "sdk" | "webhooks" | "keys">("api");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5 text-green-400" />
            Protocol Layer
          </h1>
          <p className="text-xs text-muted-foreground">Open API & developer platform — Phase 12</p>
        </div>
        <Link href="/api-keys" className="ml-auto text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
          Get API Key
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="card p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
          <h3 className="font-bold text-sm mb-1">ShadowChat Protocol v1.0</h3>
          <p className="text-xs text-muted-foreground">Build on top of the action OS. Every platform feature is accessible via API. Turn conversations into actions in your own apps.</p>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 overflow-x-auto">
          {(["api", "sdk", "webhooks", "keys"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "keys" ? "API Keys" : t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "api" && (
          <div className="space-y-2">
            {API_ENDPOINTS.map((ep, i) => (
              <div key={i} className="card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${METHOD_COLORS[ep.method] || "text-muted-foreground bg-secondary"}`}>
                    {ep.method}
                  </span>
                  <code className="text-xs font-mono text-foreground">{ep.path}</code>
                  {ep.auth && <span className="ml-auto text-xs text-yellow-400">🔑 Auth</span>}
                </div>
                <p className="text-xs text-muted-foreground">{ep.desc}</p>
              </div>
            ))}
            <div className="card p-3 text-center border-dashed border-border/50">
              <Link href="/developer-area" className="text-xs text-primary hover:underline flex items-center justify-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                View full API documentation
              </Link>
            </div>
          </div>
        )}

        {tab === "sdk" && (
          <div className="space-y-3">
            <div className="card p-4 bg-secondary/30">
              <div className="text-xs font-mono text-muted-foreground mb-1">Install</div>
              <code className="text-xs font-mono text-green-400">npm install @shadowchat/sdk</code>
            </div>
            <div className="card p-4 bg-secondary/30">
              <div className="text-xs font-mono text-muted-foreground mb-2">Quick start</div>
              <pre className="text-xs font-mono text-foreground overflow-x-auto">{`import { ShadowChat } from '@shadowchat/sdk';

const sc = new ShadowChat({ apiKey: 'YOUR_KEY' });

// Execute an action from text
const result = await sc.actions.execute({
  input: "Pay $20 for logo design",
  userId: "user_123"
});

console.log(result.action); // PAYMENT
console.log(result.amount); // 20`}</pre>
            </div>
            <div className="space-y-2">
              {SDK_FEATURES.map(f => (
                <div key={f.name} className="card p-3 flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded-lg text-muted-foreground">{f.lang}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "webhooks" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Receive real-time events from the platform in your own systems.</p>
            {[
              { event: "action.completed", desc: "Fires when any action completes" },
              { event: "payment.confirmed", desc: "Fires when payment is confirmed" },
              { event: "user.subscribed", desc: "Fires when user subscribes" },
              { event: "listing.sold", desc: "Fires when marketplace item sells" },
              { event: "ai.intent_detected", desc: "Fires when AI detects intent" },
            ].map(w => (
              <div key={w.event} className="card p-3 flex items-center gap-3">
                <Webhook className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <code className="text-xs font-mono text-purple-400">{w.event}</code>
                  <div className="text-xs text-muted-foreground">{w.desc}</div>
                </div>
              </div>
            ))}
            <button className="w-full card p-3 text-sm text-primary border-dashed border-primary/30 hover:bg-primary/5 transition-colors">
              + Add Webhook Endpoint
            </button>
          </div>
        )}

        {tab === "keys" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage your API keys for platform access.</p>
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Production Key</div>
                  <div className="text-xs font-mono text-muted-foreground">sk_live_••••••••••••••••</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-400">Active</span>
                  <button className="text-xs px-2 py-1 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors">Copy</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Test Key</div>
                  <div className="text-xs font-mono text-muted-foreground">sk_test_••••••••••••••••</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400">Test</span>
                  <button className="text-xs px-2 py-1 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors">Copy</button>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Key className="w-4 h-4" />
              Generate New Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
