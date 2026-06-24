import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  EyeOff, AlertTriangle, CheckCircle, XCircle, Scan, Shield,
  Wifi, Globe, Database, Activity, Zap, Lock, Radio, Bug,
  ShieldAlert, ShieldCheck, RefreshCw, Trash2
} from "lucide-react";

const TRACKER_CATEGORIES = [
  { name: "Analytics Trackers", count: 0, blocked: true, icon: Activity, color: "text-blue-400" },
  { name: "Ad Networks", count: 0, blocked: true, icon: Globe, color: "text-orange-400" },
  { name: "Social Pixels", count: 0, blocked: true, icon: Radio, color: "text-pink-400" },
  { name: "Fingerprinting Scripts", count: 0, blocked: true, icon: Bug, color: "text-red-400" },
  { name: "Session Recorders", count: 0, blocked: true, icon: Database, color: "text-purple-400" },
  { name: "Beacon Requests", count: 0, blocked: true, icon: Wifi, color: "text-yellow-400" },
];

const SCAN_RESULTS = [
  { type: "DNS Leak", status: "clean", detail: "No DNS leaks detected. Your DNS queries are private." },
  { type: "WebRTC Leak", status: "warning", detail: "WebRTC may expose your local IP address. Enable blocking." },
  { type: "IPv6 Leak", status: "clean", detail: "IPv6 is properly disabled or tunneled." },
  { type: "HTTP Headers", status: "warning", detail: "Referer header is leaking origin site information." },
  { type: "Canvas Fingerprint", status: "danger", detail: "Canvas fingerprinting is active and trackable." },
  { type: "Battery API", status: "clean", detail: "Battery API is blocked." },
  { type: "Geolocation", status: "clean", detail: "Geolocation access is denied." },
  { type: "Clipboard Access", status: "warning", detail: "Sites may be able to read clipboard on focus." },
];

const SURVEILLANCE_PATTERNS = [
  { name: "Behavioral Profiling", description: "Mouse movement, scroll depth, and click patterns being recorded", risk: "high", detected: true },
  { name: "Cross-Site Tracking", description: "Third-party cookies linking your identity across websites", risk: "high", detected: true },
  { name: "Device Fingerprinting", description: "Browser configuration used to create a unique identifier", risk: "critical", detected: true },
  { name: "Location Inference", description: "IP geolocation and timezone used to estimate your location", risk: "medium", detected: false },
  { name: "Social Graph Mapping", description: "Your connections and interactions being mapped by third parties", risk: "medium", detected: false },
  { name: "Keystroke Dynamics", description: "Typing rhythm analysis for identity verification/tracking", risk: "low", detected: false },
];

export default function AntiSurveillance() {
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [blockerActive, setBlockerActive] = useState(true);
  const [blockedCount, setBlockedCount] = useState(247);

  const runScan = () => {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => {
      setScanning(false);
      setScanDone(true);
      toast.warning("Scan complete — 3 surveillance vectors detected");
    }, 3000);
  };

  const statusIcon = (status: string) => {
    if (status === "clean") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const statusColor = (status: string) => status === "clean" ? "border-green-500/20 bg-green-500/5" : status === "warning" ? "border-yellow-500/20 bg-yellow-500/5" : "border-red-500/20 bg-red-500/5";

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 mb-4">
          <EyeOff className="w-3 h-3 text-red-400" />
          <span className="text-xs font-mono text-red-400">SURVEILLANCE DETECTION & BLOCKING</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Anti-Surveillance</h1>
        <p className="text-muted-foreground">Detect, analyze, and neutralize surveillance systems. Scan for trackers, beacons, and data collection endpoints.</p>
      </div>

      {/* Master Blocker */}
      <Card className={`p-5 mb-6 border-2 transition-all ${blockerActive ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${blockerActive ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {blockerActive ? <ShieldCheck className="w-7 h-7 text-green-400" /> : <ShieldAlert className="w-7 h-7 text-red-400" />}
            </div>
            <div>
              <h2 className="text-xl font-bold">{blockerActive ? "Surveillance Blocker Active" : "Surveillance Blocker Disabled"}</h2>
              <p className="text-sm text-muted-foreground">
                {blockerActive ? `${blockedCount} tracking attempts blocked this session` : "Enable to block trackers, beacons, and fingerprinting scripts"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="outline" className="h-9" onClick={runScan} disabled={scanning}>
              {scanning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Scanning...</> : <><Scan className="w-4 h-4 mr-2" />Run Scan</>}
            </Button>
            <Button size="sm" className={blockerActive ? "bg-red-600 hover:bg-red-500 text-white" : "bg-green-600 hover:bg-green-500 text-white"} onClick={() => { setBlockerActive(v => !v); toast.success(blockerActive ? "Blocker disabled" : "Blocker enabled"); }}>
              {blockerActive ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Scan Results */}
          {scanDone && (
            <Card className="p-5 border-border/30 bg-card/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" />
                Scan Results
              </h3>
              <div className="space-y-2">
                {SCAN_RESULTS.map(r => (
                  <div key={r.type} className={`flex items-start gap-3 p-3 rounded-lg border ${statusColor(r.status)}`}>
                    {statusIcon(r.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{r.type}</span>
                        <Badge variant="outline" className={`text-[9px] h-4 ${r.status === "clean" ? "border-green-500/30 text-green-400" : r.status === "warning" ? "border-yellow-500/30 text-yellow-400" : "border-red-500/30 text-red-400"}`}>
                          {r.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.detail}</p>
                    </div>
                    {r.status !== "clean" && (
                      <Button size="sm" variant="outline" className="h-6 text-[10px] shrink-0" onClick={() => toast.success(`${r.type} blocked`)}>Fix</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Surveillance Patterns */}
          <Card className="p-5 border-border/30 bg-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Surveillance Pattern Detection
            </h3>
            <div className="space-y-3">
              {SURVEILLANCE_PATTERNS.map(p => (
                <div key={p.name} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${p.detected ? (p.risk === "critical" ? "border-red-500/30 bg-red-500/5" : p.risk === "high" ? "border-orange-500/30 bg-orange-500/5" : "border-yellow-500/30 bg-yellow-500/5") : "border-border/30 bg-card/30"}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${p.detected ? (p.risk === "critical" ? "bg-red-500" : p.risk === "high" ? "bg-orange-500" : "bg-yellow-500") : "bg-green-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{p.name}</span>
                      <Badge variant="outline" className={`text-[9px] h-4 ${p.risk === "critical" ? "border-red-500/30 text-red-400" : p.risk === "high" ? "border-orange-500/30 text-orange-400" : p.risk === "medium" ? "border-yellow-500/30 text-yellow-400" : "border-green-500/30 text-green-400"}`}>
                        {p.risk}
                      </Badge>
                      {p.detected && <Badge className="text-[9px] h-4 bg-red-500/10 text-red-400 border-red-500/20">DETECTED</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  {p.detected && (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => toast.success(`${p.name} neutralized`)}>
                      Block
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tracker Categories */}
        <div className="space-y-4">
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Tracker Blocklist
            </h3>
            <div className="space-y-2">
              {TRACKER_CATEGORIES.map(cat => (
                <div key={cat.name} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <cat.icon className={`w-4 h-4 ${cat.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.count} blocked</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${cat.blocked ? "bg-green-400" : "bg-red-400"}`} />
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3 text-xs" onClick={() => { setBlockedCount(v => v + 12); toast.success("Blocklist updated — 12 new trackers added"); }}>
              <RefreshCw className="w-3 h-3 mr-1" />Update Blocklists
            </Button>
          </Card>

          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Session Stats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Trackers blocked</span><span className="text-green-400 font-bold">{blockedCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Beacons blocked</span><span className="text-green-400 font-bold">83</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fingerprint attempts</span><span className="text-red-400 font-bold">12</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data saved</span><span className="text-primary font-bold">1.2 MB</span></div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => { setBlockedCount(0); toast.info("Session stats cleared"); }}>
              <Trash2 className="w-3 h-3 mr-1" />Clear Session
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
