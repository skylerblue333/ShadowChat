import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import {
  Chrome, Globe, Zap, Shield, Eye, Wallet, Bot, Code2,
  Download, Star, CheckCircle2, ArrowRight, Sparkles, Lock,
  MousePointer2, Search, Bell
} from "lucide-react";
import { toast } from "sonner";

const FEATURES = [
  { icon: Wallet, label: "Wallet Overlay", desc: "See your SKY444 balance on any webpage. One-click tip any creator." },
  { icon: Bot, label: "AI Agent Overlay", desc: "Summon Hope AI on any page. Summarize, translate, or act on content." },
  { icon: Eye, label: "Shadow Mode", desc: "Activate GhostMode browsing. Mask fingerprint, block trackers, route via relay." },
  { icon: MousePointer2, label: "Click-to-Buy", desc: "See any product online? Buy it with SKY444 or fiat in one click." },
  { icon: Search, label: "Web3 Search", desc: "Replace Google results with decentralized, AI-ranked alternatives." },
  { icon: Bell, label: "Smart Alerts", desc: "Price alerts, whale movements, and social mentions — right in your browser." },
  { icon: Code2, label: "Dev Tools", desc: "Inspect smart contracts, decode calldata, and simulate transactions." },
  { icon: Lock, label: "Password Vault", desc: "Encrypted credential storage with Web3 key derivation." },
];

const BROWSERS = [
  { name: "Chrome", icon: Chrome, color: "text-yellow-400", status: "Coming Soon" },
  { name: "Firefox", icon: Globe, color: "text-orange-400", status: "Coming Soon" },
  { name: "Brave", icon: Shield, color: "text-orange-500", status: "Coming Soon" },
  { name: "Edge", icon: Globe, color: "text-blue-400", status: "Coming Soon" },
];

export default function BrowserExtension() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="ShadowChat Extension"
        subtitle="Bring the full Web3 OS to every webpage you visit"
      />

      <div className="container py-8 max-w-5xl space-y-12">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-pink-900/20 border border-white/10 p-8 md:p-12">
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="relative z-10 text-center">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              <Sparkles className="w-3 h-3 mr-1" /> In Development — Q4 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient">
              Your Browser.<br />Now Web3-Native.
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              The ShadowChat extension turns any browser into a full Web3 command center. AI, wallet, privacy, and social — everywhere you go.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {BROWSERS.map(b => (
                <Button
                  key={b.name}
                  variant="outline"
                  className="border-white/20 text-white/70 hover:text-white gap-2"
                  onClick={() => toast.info(`${b.name} extension — joining waitlist!`)}
                >
                  <b.icon className={`w-4 h-4 ${b.color}`} />
                  {b.name}
                  <Badge className="text-xs bg-white/10 text-white/50 border-0">{b.status}</Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">What It Does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.label} className="feature-card p-5 hover:border-cyan-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3 group-hover:bg-cyan-500/30 transition-colors">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{f.label}</div>
                <div className="text-xs text-white/50 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Install the extension", desc: "One click from the Chrome Web Store or Firefox Add-ons." },
              { step: "2", title: "Connect your wallet", desc: "Sign in with your SKYCOIN4444 account or connect MetaMask." },
              { step: "3", title: "Browse the web", desc: "The extension silently monitors and enhances every page you visit." },
              { step: "4", title: "Activate on demand", desc: "Click the icon or use keyboard shortcut to summon the overlay." },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full gradient-psychedelic flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{s.title}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy guarantee */}
        <div className="rounded-2xl bg-green-900/20 border border-green-500/20 p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Zero Data Collection</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                The ShadowChat extension never reads your browsing history, never sends page content to our servers, and never stores credentials in plaintext. All AI processing happens locally or via encrypted tunnels. Open source — audit the code yourself.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Open Source", "No Telemetry", "Local AI", "E2E Encrypted", "Audited"].map(t => (
                  <Badge key={t} className="text-xs bg-green-500/10 text-green-300 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl gradient-iridescent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Get Early Access</h2>
          <p className="text-white/80 mb-6">Beta testers get 500 SKY444 and a Founding Member badge.</p>
          <Button
            size="lg"
            className="bg-white text-purple-900 font-bold hover:bg-white/90 gap-2"
            onClick={() => toast.success("Added to beta list! We'll email you when it's ready.")}
          >
            <Download className="w-5 h-5" />
            Join Beta Program
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
