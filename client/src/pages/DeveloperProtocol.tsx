import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "wouter";
import {
  Code2, Zap, Globe, Shield, Key, Webhook, GitBranch,
  BookOpen, Terminal, ArrowRight, CheckCircle2, Copy,
  BarChart3, Users, Lock, Cpu
} from "lucide-react";
import { toast } from "sonner";

const ENDPOINTS = [
  { method: "GET",    path: "/v1/users/:id",              desc: "Get user profile and stats" },
  { method: "GET",    path: "/v1/feed",                   desc: "Get social feed with pagination" },
  { method: "POST",   path: "/v1/posts",                  desc: "Create a new post" },
  { method: "GET",    path: "/v1/tokens/price",           desc: "Get live token prices" },
  { method: "POST",   path: "/v1/payments/intent",        desc: "Create a payment intent" },
  { method: "GET",    path: "/v1/nfts/:address",          desc: "Get NFT collection for wallet" },
  { method: "POST",   path: "/v1/ai/chat",                desc: "Send message to Hope AI" },
  { method: "GET",    path: "/v1/staking/positions",      desc: "Get user staking positions" },
  { method: "POST",   path: "/v1/marketplace/orders",     desc: "Create marketplace order" },
  { method: "GET",    path: "/v1/analytics/platform",     desc: "Platform-wide analytics (admin)" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "text-green-400 bg-green-500/10",
  POST: "text-blue-400 bg-blue-500/10",
  PUT: "text-yellow-400 bg-yellow-500/10",
  DELETE: "text-red-400 bg-red-500/10",
  PATCH: "text-orange-400 bg-orange-500/10",
};

const WEBHOOK_EVENTS = [
  "user.created", "user.verified", "post.created", "post.liked",
  "payment.completed", "payment.failed", "nft.minted", "nft.sold",
  "staking.deposited", "staking.withdrawn", "staking.rewarded",
  "order.placed", "order.shipped", "order.delivered",
  "ai.conversation.started", "ai.signal.detected",
];

const RATE_LIMITS = [
  { tier: "Free", rpm: "60", daily: "1,000", burst: "10" },
  { tier: "Pro", rpm: "600", daily: "100,000", burst: "100" },
  { tier: "Enterprise", rpm: "6,000", daily: "Unlimited", burst: "1,000" },
];

const EXAMPLE_RESPONSE = `{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_abc123",
      "username": "skyler.blue",
      "displayName": "Skyler Blue",
      "level": 12,
      "reputation": 9840,
      "skyBalance": "144000.00",
      "isCreator": true,
      "verified": true,
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  },
  "meta": {
    "requestId": "req_xyz789",
    "timestamp": 1718700000000,
    "rateLimit": {
      "remaining": 599,
      "resetAt": 1718700060000
    }
  }
}`;

export default function DeveloperProtocol() {
  const [copiedResponse, setCopiedResponse] = useState(false);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Developer Protocol"
        subtitle="Open API, webhooks, partner integrations, and the SKYCOIN4444 standard"
      />

      <div className="container py-8 max-w-5xl space-y-10">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900/20 via-cyan-900/20 to-blue-900/20 border border-white/10 p-8">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Code2 className="w-3 h-3 mr-1" /> API v1.0 — Live
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black text-gradient mb-4">
                Build on SKYCOIN4444
              </h1>
              <p className="text-white/60 mb-6 max-w-lg">
                A complete REST + WebSocket API for social, crypto, AI, marketplace, and governance. OAuth2, JWT, and API key auth. 99.9% uptime SLA.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="gradient-primary text-white font-bold gap-2"
                  onClick={() => toast.info("API keys — sign in to your account → Settings → API Keys")}>
                  <Key className="w-4 h-4" /> Get API Key
                </Button>
                <Button variant="outline" className="border-white/20 text-white/70 hover:text-white gap-2"
                  onClick={() => toast.info("Full OpenAPI spec at api.skycoin4444.com/docs")}>
                  <BookOpen className="w-4 h-4" /> API Reference
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {[
                { icon: Zap, label: "< 50ms", sub: "P99 latency" },
                { icon: Globe, label: "12 regions", sub: "Global CDN" },
                { icon: Shield, label: "SOC 2", sub: "Compliant" },
                { icon: BarChart3, label: "99.9%", sub: "Uptime SLA" },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                  <s.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="font-bold text-white text-sm">{s.label}</div>
                  <div className="text-xs text-white/40">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <Tabs defaultValue="endpoints">
          <TabsList className="bg-white/5 border border-white/10 mb-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="limits">Rate Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 bg-white/5 px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider">
                <div className="col-span-2">Method</div>
                <div className="col-span-5">Endpoint</div>
                <div className="col-span-5">Description</div>
              </div>
              {ENDPOINTS.map((ep, i) => (
                <div key={i} className={`grid grid-cols-12 px-4 py-3 text-sm border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"} hover:bg-white/5 transition-colors`}>
                  <div className="col-span-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${METHOD_COLORS[ep.method] || "text-white/60 bg-white/10"}`}>
                      {ep.method}
                    </span>
                  </div>
                  <div className="col-span-5 font-mono text-xs text-cyan-300 self-center">{ep.path}</div>
                  <div className="col-span-5 text-white/60 text-xs self-center">{ep.desc}</div>
                </div>
              ))}
            </div>
            {/* Example response */}
            <div className="mt-4 rounded-xl bg-zinc-950 border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs text-white/40 font-mono">Example Response — GET /v1/users/:id</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-white/50 hover:text-white gap-1"
                  onClick={() => { navigator.clipboard.writeText(EXAMPLE_RESPONSE); setCopiedResponse(true); toast.success("Copied!"); setTimeout(() => setCopiedResponse(false), 2000); }}>
                  {copiedResponse ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </Button>
              </div>
              <pre className="p-4 text-xs text-green-300 font-mono overflow-x-auto leading-relaxed">{EXAMPLE_RESPONSE}</pre>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="space-y-4">
              {[
                { icon: Key, title: "API Key Auth", desc: "Pass your API key in the Authorization header: `Bearer sk_live_...`. Best for server-to-server calls.", color: "text-yellow-400" },
                { icon: Users, title: "OAuth 2.0", desc: "Full OAuth2 flow with PKCE for user-delegated access. Scopes: read:profile, write:posts, read:wallet, execute:payments.", color: "text-blue-400" },
                { icon: Lock, title: "JWT Sessions", desc: "Short-lived JWTs (15min) with refresh tokens (30 days). Rotate keys via the dashboard.", color: "text-green-400" },
                { icon: Cpu, title: "HMAC Webhooks", desc: "All webhook payloads are signed with HMAC-SHA256. Verify the X-ShadowChat-Signature header.", color: "text-purple-400" },
              ].map(a => (
                <div key={a.title} className="rounded-xl bg-white/3 border border-white/10 p-5 flex items-start gap-4">
                  <a.icon className={`w-6 h-6 ${a.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <div className="font-semibold text-white mb-1">{a.title}</div>
                    <div className="text-sm text-white/60 leading-relaxed">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="mb-4 rounded-xl bg-white/3 border border-white/10 p-5">
              <div className="flex items-start gap-3 mb-4">
                <Webhook className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Webhook Configuration</div>
                  <div className="text-sm text-white/60">Register your endpoint URL in Settings → Webhooks. We'll POST to it for every subscribed event. Retries: 3 attempts with exponential backoff.</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WEBHOOK_EVENTS.map(e => (
                <div key={e} className="rounded-lg bg-white/3 border border-white/8 px-3 py-2 font-mono text-xs text-cyan-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {e}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="limits">
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-4 bg-white/5 px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider">
                <div>Tier</div>
                <div className="text-center">Req/Min</div>
                <div className="text-center">Daily Limit</div>
                <div className="text-center">Burst</div>
              </div>
              {RATE_LIMITS.map((r, i) => (
                <div key={r.tier} className={`grid grid-cols-4 px-4 py-4 text-sm border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <div className="font-semibold text-white">{r.tier}</div>
                  <div className="text-center font-mono text-cyan-300">{r.rpm}</div>
                  <div className="text-center font-mono text-green-300">{r.daily}</div>
                  <div className="text-center font-mono text-yellow-300">{r.burst}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-yellow-900/20 border border-yellow-500/20 p-4 text-sm text-white/70">
              <strong className="text-yellow-300">429 Too Many Requests</strong> — When rate limited, check the <code className="text-cyan-300 text-xs">Retry-After</code> header. Exponential backoff is recommended. Contact us for temporary limit increases.
            </div>
          </TabsContent>
        </Tabs>

        {/* SDKs */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Official SDKs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { lang: "JavaScript", pkg: "npm i @skycoin4444/sdk", color: "text-yellow-400" },
              { lang: "Python", pkg: "pip install skycoin4444", color: "text-blue-400" },
              { lang: "Rust", pkg: "cargo add skycoin4444", color: "text-orange-400" },
              { lang: "Go", pkg: "go get skycoin4444.dev/sdk", color: "text-cyan-400" },
            ].map(s => (
              <div key={s.lang} className="rounded-xl bg-white/3 border border-white/10 p-4 hover:border-white/20 transition-all cursor-pointer group"
                onClick={() => { navigator.clipboard.writeText(s.pkg); toast.success(`Copied ${s.lang} install command!`); }}>
                <div className={`font-bold ${s.color} mb-2 text-sm`}>{s.lang}</div>
                <code className="text-xs text-white/50 font-mono group-hover:text-white/70 transition-colors">{s.pkg}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Partner program */}
        <div className="rounded-3xl gradient-drip p-8 text-center">
          <GitBranch className="w-10 h-10 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-black text-white mb-2">Partner Program</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Build on SKYCOIN4444 and earn 20% revenue share on all transactions your integration generates. Apply for verified partner status.
          </p>
          <Button size="lg" className="bg-white text-orange-900 font-bold hover:bg-white/90 gap-2"
            onClick={() => toast.info("Partner program — email partners@skycoin4444.com")}>
            <ArrowRight className="w-5 h-5" /> Apply as Partner
          </Button>
        </div>

      </div>
    </div>
  );
}
