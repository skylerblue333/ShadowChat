import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import {
  Smartphone, Download, Star, Shield, Zap, Bell, Wifi,
  Camera, Mic, Fingerprint, QrCode, ChevronRight, Apple,
  Play, Globe, CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const FEATURES = [
  { icon: Bell, label: "Push Notifications", desc: "Real-time alerts for messages, trades, and rewards" },
  { icon: Fingerprint, label: "Biometric Auth", desc: "Face ID and fingerprint unlock for instant secure access" },
  { icon: Camera, label: "AR Camera", desc: "Scan QR codes, NFTs, and physical items with AI overlay" },
  { icon: Mic, label: "Voice Commands", desc: "Hands-free navigation and AI assistant via voice" },
  { icon: Wifi, label: "Offline Mode", desc: "Browse your portfolio and DMs without internet" },
  { icon: Zap, label: "Instant Swap", desc: "One-tap token swaps with best-route optimization" },
  { icon: Shield, label: "Hardware Wallet", desc: "Connect Ledger and Trezor via Bluetooth" },
  { icon: QrCode, label: "Wallet Connect", desc: "Scan to connect any dApp instantly" },
];

const STATS = [
  { value: "4.9", label: "App Store Rating", sub: "12K reviews" },
  { value: "500K+", label: "Downloads", sub: "iOS + Android" },
  { value: "< 50ms", label: "Response Time", sub: "Global CDN" },
  { value: "99.9%", label: "Uptime", sub: "SLA guaranteed" },
];

const COMPARISON = [
  { feature: "Social Feed", web: true, mobile: true },
  { feature: "Push Notifications", web: false, mobile: true },
  { feature: "Biometric Login", web: false, mobile: true },
  { feature: "Offline Mode", web: false, mobile: true },
  { feature: "AR QR Scanner", web: false, mobile: true },
  { feature: "Voice Commands", web: true, mobile: true },
  { feature: "Hardware Wallet", web: true, mobile: true },
  { feature: "Background Mining", web: false, mobile: true },
  { feature: "Widget Support", web: false, mobile: true },
  { feature: "Haptic Feedback", web: false, mobile: true },
];

export default function MobileApp() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  const handleDownload = (p: "ios" | "android") => {
    toast.info(`${p === "ios" ? "App Store" : "Google Play"} — launching soon! Join the waitlist below.`);
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="ShadowChat Mobile"
        subtitle="The full Web3 social OS in your pocket — iOS & Android"
      />

      <div className="container py-8 max-w-5xl space-y-12">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-cyan-900/30 border border-white/10 p-8 md:p-12">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> Coming Soon — Join Waitlist
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient-psychedelic">
                SKYCOIN4444<br />on Mobile
              </h1>
              <p className="text-white/60 text-lg mb-6 max-w-md">
                Trade crypto, chat with AI, earn rewards, stream, and govern — all from your phone. The most powerful Web3 app ever built.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button
                  onClick={() => handleDownload("ios")}
                  className="gap-2 bg-white text-black hover:bg-white/90 font-bold"
                  size="lg"
                >
                  <Apple className="w-5 h-5" />
                  App Store
                </Button>
                <Button
                  onClick={() => handleDownload("android")}
                  className="gap-2 bg-green-600 hover:bg-green-500 font-bold"
                  size="lg"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Google Play
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-white/20 text-white/70 hover:text-white"
                  size="lg"
                  onClick={() => toast.info("PWA install: tap the share icon in your browser and select 'Add to Home Screen'")}
                >
                  <Globe className="w-5 h-5" />
                  Install PWA
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-80 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 gradient-tiedye opacity-10" />
                <div className="text-center z-10">
                  <Smartphone className="w-16 h-16 text-purple-400 mx-auto mb-3" />
                  <div className="text-xs text-white/40">Preview</div>
                  <div className="text-xs text-white/20">Coming Q3 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="stat-card text-center">
              <div className="text-3xl font-black text-gradient mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-white/80">{s.label}</div>
              <div className="text-xs text-white/40 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Mobile-Exclusive Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.label} className="feature-card p-5 hover:border-purple-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                  <f.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{f.label}</div>
                <div className="text-xs text-white/50 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Web vs Mobile comparison */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Web vs Mobile</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">
              <div>Feature</div>
              <div className="text-center">Web App</div>
              <div className="text-center">Mobile App</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white/2" : ""} border-t border-white/5`}>
                <div className="text-white/80">{row.feature}</div>
                <div className="text-center">
                  {row.web
                    ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                    : <span className="text-white/20">—</span>}
                </div>
                <div className="text-center">
                  {row.mobile
                    ? <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto" />
                    : <span className="text-white/20">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform toggle */}
        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Requirements</h2>
          <div className="flex gap-2 mb-6">
            <Button
              size="sm"
              onClick={() => setPlatform("ios")}
              className={platform === "ios" ? "bg-purple-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}
            >
              <Apple className="w-4 h-4 mr-1" /> iOS
            </Button>
            <Button
              size="sm"
              onClick={() => setPlatform("android")}
              className={platform === "android" ? "bg-green-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}
            >
              <Play className="w-4 h-4 mr-1 fill-current" /> Android
            </Button>
          </div>
          {platform === "ios" ? (
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-purple-400" /> iOS 16.0 or later</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-purple-400" /> iPhone 11 or newer (A13 Bionic+)</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-purple-400" /> 150 MB storage</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-purple-400" /> Face ID or Touch ID recommended</div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-green-400" /> Android 10.0 or later</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-green-400" /> 4 GB RAM minimum</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-green-400" /> 200 MB storage</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-green-400" /> Biometric sensor recommended</div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="rounded-3xl gradient-psychedelic p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Be First in Line</h2>
          <p className="text-white/80 mb-6">Join 50,000+ on the waitlist. Early access = 1,000 SKY444 bonus.</p>
          <Button
            size="lg"
            className="bg-white text-purple-900 font-bold hover:bg-white/90 gap-2"
            onClick={() => toast.success("You're on the waitlist! We'll notify you at launch.")}
          >
            <Star className="w-5 h-5" />
            Join Waitlist — Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
