import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { Code2, Copy, CheckCircle2, Zap, Globe, Wallet, Bot, BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SNIPPETS: Record<string, string> = {
  iframe: `<!-- Embed ShadowChat Feed -->
<iframe
  src="https://shadowchat.manus.space/embed/feed?theme=dark&token=YOUR_API_KEY"
  width="100%"
  height="600"
  frameborder="0"
  allow="clipboard-write; camera; microphone"
  sandbox="allow-scripts allow-same-origin allow-popups"
></iframe>`,
  js: `// Install SDK
npm install @skycoin4444/sdk

// Initialize
import { ShadowChat } from '@skycoin4444/sdk';

const sc = new ShadowChat({
  apiKey: 'YOUR_API_KEY',
  theme: 'dark',
  locale: 'en',
});

// Embed wallet widget
sc.wallet.mount('#wallet-container', {
  showBalance: true,
  allowSend: true,
  tokens: ['SKY444', 'ETH', 'USDC'],
});

// Embed AI chat
sc.ai.mount('#chat-container', {
  persona: 'hope',
  context: 'customer-support',
  streaming: true,
});`,
  react: `// React component
import { ShadowChatProvider, WalletWidget, AIChat } from '@skycoin4444/react';

export default function App() {
  return (
    <ShadowChatProvider apiKey="YOUR_API_KEY" theme="dark">
      {/* Wallet balance + send */}
      <WalletWidget
        tokens={['SKY444', 'ETH']}
        showChart={true}
        onSend={(tx) => console.log('Sent:', tx)}
      />

      {/* Hope AI chat */}
      <AIChat
        persona="hope"
        placeholder="Ask me anything..."
        onMessage={(msg) => console.log(msg)}
      />
    </ShadowChatProvider>
  );
}`,
  webhook: `// Webhook payload example
POST https://your-server.com/webhook
Content-Type: application/json
X-ShadowChat-Signature: sha256=...

{
  "event": "payment.completed",
  "timestamp": 1718700000000,
  "data": {
    "paymentId": "pay_abc123",
    "amount": 1000,
    "token": "SKY444",
    "from": "0x1a2b...",
    "to": "0x3c4d...",
    "metadata": {
      "orderId": "order_xyz",
      "userId": "user_123"
    }
  }
}

// Verify signature
import crypto from 'crypto';
const sig = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');
if (sig !== receivedSig) throw new Error('Invalid signature');`,
};

const WIDGETS = [
  { icon: Wallet, label: "Wallet Widget", desc: "Balance, send, receive, and swap in a compact embed", color: "text-purple-400" },
  { icon: Bot, label: "AI Chat Widget", desc: "Hope AI embedded in your product with your branding", color: "text-cyan-400" },
  { icon: BarChart3, label: "Price Chart", desc: "Live SKY444 price chart with customizable timeframes", color: "text-green-400" },
  { icon: Globe, label: "Social Feed", desc: "Embed the ShadowChat feed filtered by topic or user", color: "text-pink-400" },
  { icon: Zap, label: "Tip Button", desc: "One-click tipping button for any content creator", color: "text-yellow-400" },
  { icon: Code2, label: "NFT Gallery", desc: "Display and sell NFTs directly on your website", color: "text-orange-400" },
];

export default function EmbedSDK() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string) => {
    navigator.clipboard.writeText(SNIPPETS[key]);
    setCopied(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Embed SDK"
        subtitle="Add Web3 superpowers to any website in minutes"
      />

      <div className="container py-8 max-w-5xl space-y-10">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-cyan-900/20 border border-white/10 p-8">
          <div className="absolute inset-0 cyber-grid-sm opacity-20" />
          <div className="relative z-10 text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Code2 className="w-3 h-3 mr-1" /> SDK v1.0 — Beta
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-gradient mb-4">
              Embed. Extend. Monetize.
            </h1>
            <p className="text-white/60 max-w-xl mx-auto mb-6">
              The SKYCOIN4444 Embed SDK lets you add wallet, AI, social, and payment features to any website with 3 lines of code.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="gradient-primary text-white font-bold gap-2"
                onClick={() => toast.info("API key generation — sign in to your account first")}>
                <Zap className="w-4 h-4" /> Get API Key
              </Button>
              <Button variant="outline" className="border-white/20 text-white/70 hover:text-white gap-2"
                onClick={() => toast.info("Full docs at docs.skycoin4444.com — coming soon")}>
                <Code2 className="w-4 h-4" /> View Docs
              </Button>
            </div>
          </div>
        </div>

        {/* Widgets */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Available Widgets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WIDGETS.map(w => (
              <div key={w.label} className="feature-card p-5 hover:border-blue-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                  <w.icon className={`w-5 h-5 ${w.color}`} />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{w.label}</div>
                <div className="text-xs text-white/50 leading-relaxed">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Code snippets */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Integration Examples</h2>
          <Tabs defaultValue="js">
            <TabsList className="bg-white/5 border border-white/10 mb-4">
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="webhook">Webhooks</TabsTrigger>
            </TabsList>
            {(["iframe", "js", "react", "webhook"] as const).map(key => (
              <TabsContent key={key} value={key}>
                <div className="relative rounded-xl bg-zinc-950 border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                    <span className="text-xs text-white/40 font-mono">{key === "iframe" ? "HTML" : key === "js" ? "JavaScript" : key === "react" ? "React/TSX" : "Node.js"}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-white/50 hover:text-white gap-1"
                      onClick={() => copy(key)}
                    >
                      {copied === key ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copied === key ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="p-4 text-xs text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {SNIPPETS[key]}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">SDK Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Free", price: "$0", limit: "10K API calls/mo", features: ["Wallet widget", "Price chart", "Basic AI", "Community support"] },
              { name: "Pro", price: "$49/mo", limit: "500K API calls/mo", features: ["All widgets", "Custom branding", "Webhooks", "Priority support", "Analytics"], highlight: true },
              { name: "Enterprise", price: "Custom", limit: "Unlimited", features: ["White-label", "SLA 99.9%", "Dedicated infra", "Custom AI training", "Revenue share"] },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl border p-6 ${p.highlight ? "border-purple-500/50 bg-purple-900/20" : "border-white/10 bg-white/2"}`}>
                {p.highlight && <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">Most Popular</Badge>}
                <div className="text-xl font-black text-white mb-1">{p.name}</div>
                <div className="text-3xl font-black text-gradient mb-1">{p.price}</div>
                <div className="text-xs text-white/40 mb-4">{p.limit}</div>
                <div className="space-y-2">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full mt-4 ${p.highlight ? "gradient-psychedelic text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  onClick={() => toast.info(`${p.name} plan — contact sales@skycoin4444.com`)}
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
