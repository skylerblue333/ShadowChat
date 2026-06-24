import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Ghost, Eye, EyeOff, Shuffle, RefreshCw, CheckCircle, AlertTriangle,
  Monitor, Cpu, Globe, Fingerprint, User, Hash, Clock, Zap
} from "lucide-react";

const IDENTITY_LAYERS = [
  { name: "Browser Fingerprint", description: "Canvas, WebGL, audio fingerprint randomization", active: false, risk: "high" },
  { name: "User Agent", description: "Rotate between 50+ real browser user agents", active: false, risk: "high" },
  { name: "Screen Resolution", description: "Report randomized screen dimensions", active: false, risk: "medium" },
  { name: "Timezone Spoofing", description: "Mask your real timezone with a random one", active: false, risk: "medium" },
  { name: "Language Masking", description: "Override Accept-Language headers", active: false, risk: "low" },
  { name: "Font Fingerprint", description: "Randomize detected font list", active: false, risk: "high" },
  { name: "WebRTC Leak Block", description: "Prevent real IP exposure via WebRTC", active: false, risk: "critical" },
  { name: "Behavioral Noise", description: "Inject random mouse/keyboard timing noise", active: false, risk: "medium" },
];

const GHOST_IDENTITIES = [
  { name: "Shadow Walker", ua: "Chrome 121 / Windows 11", tz: "UTC+1 Berlin", screen: "1920x1080", lang: "de-DE" },
  { name: "Neon Ghost", ua: "Firefox 122 / macOS 14", tz: "UTC+9 Tokyo", screen: "2560x1440", lang: "ja-JP" },
  { name: "Phantom Node", ua: "Safari 17 / iOS 17", tz: "UTC-5 New York", screen: "390x844", lang: "en-US" },
  { name: "Cipher Wraith", ua: "Edge 121 / Windows 10", tz: "UTC+8 Singapore", screen: "1366x768", lang: "zh-SG" },
];

export default function GhostMode() {
  const [ghostActive, setGhostActive] = useState(false);
  const [layers, setLayers] = useState(IDENTITY_LAYERS);
  const [selectedIdentity, setSelectedIdentity] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(50);

  const toggleLayer = (idx: number) => {
    setLayers(prev => prev.map((l, i) => i === idx ? { ...l, active: !l.active } : l));
  };

  const activateAll = () => {
    setLayers(prev => prev.map(l => ({ ...l, active: true })));
    setGhostActive(true);
    toast.success("All Ghost Mode layers activated — you are invisible");
  };

  const deactivateAll = () => {
    setLayers(prev => prev.map(l => ({ ...l, active: false })));
    setGhostActive(false);
    toast.info("Ghost Mode deactivated");
  };

  const activeCount = layers.filter(l => l.active).length;

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
          <Ghost className="w-3 h-3 text-purple-400" />
          <span className="text-xs font-mono text-purple-400">IDENTITY MASKING SYSTEM</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Ghost Mode</h1>
        <p className="text-muted-foreground">Randomize your browser fingerprint, mask your identity, and become invisible to tracking systems.</p>
      </div>

      {/* Master Toggle */}
      <Card className={`p-6 mb-6 border-2 transition-all ${ghostActive ? "border-purple-500/50 bg-purple-500/5" : "border-border/30"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${ghostActive ? "bg-purple-500/20 animate-pulse" : "bg-secondary/50"}`}>
              <Ghost className={`w-8 h-8 ${ghostActive ? "text-purple-400" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Ghost Mode {ghostActive ? "Active" : "Inactive"}</h2>
              <p className="text-sm text-muted-foreground">
                {ghostActive ? `${activeCount}/${layers.length} protection layers active` : "Enable to activate all identity protection layers"}
              </p>
              {ghostActive && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">INVISIBLE</Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">PROTECTED</Badge>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {ghostActive ? (
              <Button onClick={deactivateAll} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Eye className="w-4 h-4 mr-2" />Deactivate
              </Button>
            ) : (
              <Button onClick={activateAll} className="bg-purple-600 hover:bg-purple-500 text-white">
                <Ghost className="w-4 h-4 mr-2" />Activate All
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Protection Layers */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-primary" />
            Protection Layers
          </h3>
          <div className="space-y-2">
            {layers.map((layer, idx) => (
              <div key={layer.name} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${layer.active ? "border-purple-500/30 bg-purple-500/5" : "border-border/30 bg-card/30"}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${layer.risk === "critical" ? "bg-red-500" : layer.risk === "high" ? "bg-orange-500" : layer.risk === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{layer.name}</span>
                    <Badge variant="outline" className={`text-[9px] h-4 ${layer.risk === "critical" ? "border-red-500/30 text-red-400" : layer.risk === "high" ? "border-orange-500/30 text-orange-400" : layer.risk === "medium" ? "border-yellow-500/30 text-yellow-400" : "border-green-500/30 text-green-400"}`}>
                      {layer.risk}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{layer.description}</p>
                </div>
                <button
                  onClick={() => toggleLayer(idx)}
                  className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${layer.active ? "bg-purple-500" : "bg-secondary"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${layer.active ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Noise Level */}
          <Card className="p-4 border-border/30 bg-card/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Behavioral Noise Level</h4>
              <span className="text-sm font-bold text-primary">{noiseLevel}%</span>
            </div>
            <input type="range" min="0" max="100" value={noiseLevel} onChange={e => setNoiseLevel(parseInt(e.target.value))} className="w-full accent-purple-500" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Subtle</span><span>Aggressive</span>
            </div>
          </Card>
        </div>

        {/* Identity Presets */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Ghost Identities
          </h3>
          <div className="space-y-2">
            {GHOST_IDENTITIES.map((id, idx) => (
              <button key={id.name} onClick={() => { setSelectedIdentity(idx); toast.success(`Identity switched to ${id.name}`); }} className={`w-full p-3 rounded-xl border text-left transition-all ${selectedIdentity === idx ? "border-purple-500/50 bg-purple-500/10" : "border-border/30 bg-card/30 hover:bg-card/60"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{id.name}</span>
                  {selectedIdentity === idx && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground"><Monitor className="w-2.5 h-2.5 inline mr-1" />{id.ua}</p>
                  <p className="text-[10px] text-muted-foreground"><Globe className="w-2.5 h-2.5 inline mr-1" />{id.tz}</p>
                  <p className="text-[10px] text-muted-foreground"><Hash className="w-2.5 h-2.5 inline mr-1" />{id.screen} · {id.lang}</p>
                </div>
              </button>
            ))}
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast.success("New random identity generated")}>
              <Shuffle className="w-3 h-3 mr-1" />Generate Random Identity
            </Button>
          </div>

          {/* Session Timer */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />Session Rotation</h4>
            <p className="text-xs text-muted-foreground mb-3">Auto-rotate identity every N minutes to prevent session correlation.</p>
            <div className="flex gap-2">
              {[15, 30, 60, 120].map(m => (
                <button key={m} onClick={() => toast.success(`Identity rotation set to every ${m} minutes`)} className="flex-1 py-1.5 rounded-lg bg-secondary/40 text-xs hover:bg-secondary transition-all">
                  {m}m
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
