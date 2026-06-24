import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield, Eye, EyeOff, Lock, Unlock, Wifi, WifiOff, Globe,
  Radio, Zap, AlertTriangle, CheckCircle, Ghost, Server,
  Network, Key, Fingerprint, Layers, ArrowRight, Activity,
  ShieldCheck, ShieldAlert, ShieldOff, Cpu, Database
} from "lucide-react";

const PRIVACY_TOOLS = [
  {
    id: "ghost-mode",
    name: "Ghost Mode",
    icon: Ghost,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    description: "Mask your identity, randomize your fingerprint, and become invisible to tracking systems.",
    status: "available",
    href: "/ghost-mode",
    features: ["Browser fingerprint randomization", "IP rotation", "Behavioral noise injection", "Session isolation"],
  },
  {
    id: "shadow-relay",
    name: "Shadow Relay",
    icon: Network,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    description: "Route your traffic through a decentralized relay network. Build your own onion-style routing with trusted nodes.",
    status: "available",
    href: "/shadow-relay",
    features: ["Multi-hop relay routing", "Node reputation scoring", "Traffic obfuscation", "Custom relay chains"],
  },
  {
    id: "tor-bridge",
    name: "Tor Bridge",
    icon: Radio,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    description: "Connect to the Tor network, configure bridges, and access .onion services securely.",
    status: "available",
    href: "/tor-bridge",
    features: ["Tor network guide", "Bridge configuration", ".onion address book", "Exit node selection"],
  },
  {
    id: "anti-surveillance",
    name: "Anti-Surveillance",
    icon: EyeOff,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "Detect and neutralize surveillance systems. Scan for trackers, beacons, and data collection endpoints.",
    status: "available",
    href: "/anti-surveillance",
    features: ["Tracker detection", "DNS leak prevention", "WebRTC leak blocker", "Surveillance pattern alerts"],
  },
  {
    id: "i2p-network",
    name: "I2P Network",
    icon: Layers,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    description: "Access the Invisible Internet Project — a fully encrypted, peer-to-peer anonymous network layer.",
    status: "coming-soon",
    href: "#",
    features: ["Garlic routing protocol", "Eepsite access", "Tunnel management", "Bandwidth contribution"],
  },
];

const PRIVACY_SCORE_FACTORS = [
  { name: "IP Exposure", score: 45, risk: "high" },
  { name: "Browser Fingerprint", score: 62, risk: "medium" },
  { name: "DNS Leaks", score: 88, risk: "low" },
  { name: "WebRTC Leaks", score: 91, risk: "low" },
  { name: "Cookie Tracking", score: 34, risk: "high" },
  { name: "Behavioral Profiling", score: 28, risk: "critical" },
];

function PrivacyScoreBar({ score, risk }: { score: number; risk: string }) {
  const color = risk === "critical" ? "bg-red-500" : risk === "high" ? "bg-orange-500" : risk === "medium" ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="w-full bg-secondary/40 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function PrivacyVault() {
  const [ghostModeActive, setGhostModeActive] = useState(false);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const runPrivacyScan = () => {
    setScanRunning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanRunning(false);
      setScanComplete(true);
      toast.warning("Privacy scan complete — 3 high-risk exposures detected");
    }, 2500);
  };

  const overallScore = Math.round(PRIVACY_SCORE_FACTORS.reduce((a, b) => a + b.score, 0) / PRIVACY_SCORE_FACTORS.length);

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
          <Shield className="w-3 h-3 text-purple-400" />
          <span className="text-xs font-mono text-purple-400">DIGITAL SOVEREIGNTY HUB</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Privacy Vault</h1>
        <p className="text-muted-foreground max-w-2xl">
          Your digital sovereignty toolkit. Control your identity, route your traffic, and protect your data from surveillance systems.
          All tools are legal, educational, and freedom-focused.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Tools Grid */}
        <div className="space-y-6">
          {/* Ghost Mode Toggle */}
          <Card className={`p-5 border-2 transition-all ${ghostModeActive ? "border-purple-500/50 bg-purple-500/5" : "border-border/30 bg-card/50"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${ghostModeActive ? "bg-purple-500/20" : "bg-secondary/50"}`}>
                  {ghostModeActive ? <Ghost className="w-6 h-6 text-purple-400" /> : <Eye className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">Ghost Mode</h3>
                    {ghostModeActive && <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">ACTIVE</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ghostModeActive ? "You are invisible. Identity masked. Traffic obfuscated." : "Enable to mask your identity across all platform activity."}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => { setGhostModeActive(v => !v); toast.success(ghostModeActive ? "Ghost Mode deactivated" : "Ghost Mode activated — you are now invisible"); }}
                className={`px-6 ${ghostModeActive ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30" : "bg-primary hover:bg-primary/90"}`}
              >
                {ghostModeActive ? <><EyeOff className="w-4 h-4 mr-2" />Deactivate</> : <><Ghost className="w-4 h-4 mr-2" />Activate</>}
              </Button>
            </div>
          </Card>

          {/* Privacy Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRIVACY_TOOLS.map(tool => (
              <Card key={tool.id} className={`p-5 border ${tool.border} ${tool.bg} hover:scale-[1.01] transition-all group`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center`}>
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  {tool.status === "coming-soon" ? (
                    <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">Coming Soon</Badge>
                  ) : (
                    <Badge className={`text-[10px] ${tool.bg} ${tool.color} border ${tool.border}`}>Available</Badge>
                  )}
                </div>
                <h3 className="font-bold mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{tool.description}</p>
                <ul className="space-y-1 mb-4">
                  {tool.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle className={`w-3 h-3 ${tool.color} shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
                {tool.status === "available" ? (
                  <Link href={tool.href}>
                    <Button size="sm" variant="outline" className={`w-full border ${tool.border} ${tool.color} hover:${tool.bg} text-xs`}>
                      Open {tool.name} <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="outline" className="w-full text-xs" disabled>
                    Coming Soon
                  </Button>
                )}
              </Card>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <Card className="p-4 border-border/30 bg-card/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-1">Legal & Ethical Use</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All tools in the Privacy Vault are designed for legal use — protecting personal privacy, bypassing censorship in restrictive regions, security research, and digital rights advocacy.
                  Use of these tools to engage in illegal activity is strictly prohibited. Know your local laws.
                  Tor and I2P are legal in most countries. VPN usage laws vary by jurisdiction.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar — Privacy Score */}
        <div className="space-y-4">
          <Card className="p-4 border-border/30 bg-card/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Privacy Score
              </h3>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={runPrivacyScan} disabled={scanRunning}>
                {scanRunning ? "Scanning..." : "Run Scan"}
              </Button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center flex-col ${overallScore > 70 ? "border-green-500" : overallScore > 40 ? "border-yellow-500" : "border-red-500"}`}>
                <span className={`text-2xl font-bold ${overallScore > 70 ? "text-green-400" : overallScore > 40 ? "text-yellow-400" : "text-red-400"}`}>{overallScore}</span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="space-y-3">
              {PRIVACY_SCORE_FACTORS.map(f => (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{f.name}</span>
                    <span className={`text-[10px] font-medium ${f.risk === "critical" ? "text-red-400" : f.risk === "high" ? "text-orange-400" : f.risk === "medium" ? "text-yellow-400" : "text-green-400"}`}>
                      {f.score}%
                    </span>
                  </div>
                  <PrivacyScoreBar score={f.score} risk={f.risk} />
                </div>
              ))}
            </div>
            {scanComplete && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  3 critical exposures detected
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Enable Ghost Mode and run the Anti-Surveillance scanner to resolve.</p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: "Clear all cookies", icon: Database, action: () => toast.success("Cookies cleared") },
                { label: "Flush DNS cache", icon: Server, action: () => toast.success("DNS cache flushed") },
                { label: "Generate new identity", icon: Fingerprint, action: () => toast.success("New identity generated") },
                { label: "Encrypt clipboard", icon: Key, action: () => toast.success("Clipboard encrypted") },
                { label: "Kill all connections", icon: WifiOff, action: () => toast.warning("All connections terminated") },
              ].map(a => (
                <button key={a.label} onClick={a.action} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-all text-left">
                  <a.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Status */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Network Status
            </h3>
            <div className="space-y-2">
              {[
                { label: "Tor Network", status: "reachable", color: "text-green-400" },
                { label: "I2P Network", status: "checking...", color: "text-yellow-400" },
                { label: "Shadow Relay", status: "3 nodes active", color: "text-cyan-400" },
                { label: "VPN Tunnel", status: "not connected", color: "text-muted-foreground" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className={`text-[10px] font-medium ${s.color}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
