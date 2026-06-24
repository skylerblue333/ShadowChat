import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Radio, Globe, Copy, ExternalLink, CheckCircle, Shield, Lock,
  AlertTriangle, Server, Zap, BookOpen, ArrowRight, Eye
} from "lucide-react";

const TOR_BRIDGES = [
  { type: "obfs4", address: "obfs4 85.17.30.79:443 CERT=abc123...xyz fingerprint=A1B2C3", country: "NL", status: "active" },
  { type: "obfs4", address: "obfs4 194.165.16.10:8443 CERT=def456...uvw fingerprint=D4E5F6", country: "DE", status: "active" },
  { type: "meek-azure", address: "meek_lite 0.0.2.0:2 url=https://ajax.aspnetcdn.com/ front=ajax.microsoft.com", country: "US", status: "active" },
  { type: "snowflake", address: "snowflake 192.0.2.3:80 fingerprint=2B280B23E1107BB62ABFC40DDCC8824814F80A72", country: "Global", status: "active" },
];

const ONION_BOOKMARKS = [
  { name: "DuckDuckGo Search", url: "https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion", category: "Search" },
  { name: "ProtonMail", url: "https://protonmailrmez3lotccipshtkleegetolb73fuirgj7r4o4vfu7ozyd.onion", category: "Email" },
  { name: "SecureDrop", url: "https://secrdrop5wyphb5x.onion", category: "Whistleblowing" },
  { name: "Tor Project", url: "https://2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion", category: "Tools" },
];

const SETUP_STEPS = [
  { step: 1, title: "Download Tor Browser", description: "Get the official Tor Browser from torproject.org — it's free and open source.", link: "https://www.torproject.org/download/" },
  { step: 2, title: "Configure Bridges", description: "If Tor is blocked in your region, use the bridge addresses below to bypass censorship." },
  { step: 3, title: "Connect to Tor", description: "Launch Tor Browser and click Connect. Your traffic is now routed through 3 relay nodes." },
  { step: 4, title: "Access .onion Sites", description: "Use the bookmarks below to access privacy-focused .onion services." },
];

export default function TorBridge() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [selectedBridgeType, setSelectedBridgeType] = useState("obfs4");

  const copyBridge = (bridge: string, idx: number) => {
    navigator.clipboard.writeText(bridge);
    setCopiedIdx(idx);
    toast.success("Bridge address copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const filteredBridges = TOR_BRIDGES.filter(b => selectedBridgeType === "all" || b.type === selectedBridgeType);

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/5 mb-4">
          <Radio className="w-3 h-3 text-green-400" />
          <span className="text-xs font-mono text-green-400">TOR NETWORK ACCESS</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Tor Bridge</h1>
        <p className="text-muted-foreground">Connect to the Tor anonymity network. Configure bridges to bypass censorship and access .onion services.</p>
      </div>

      {/* Legal Notice */}
      <Card className="p-4 mb-6 border-green-500/20 bg-green-500/5">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-400 mb-1">Tor is Legal in Most Countries</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Tor Project is a 501(c)(3) nonprofit. Tor Browser is used by journalists, activists, whistleblowers, and privacy-conscious individuals worldwide.
              It is legal in the US, EU, UK, Canada, Australia, and most other countries. Check your local laws if you are in a restrictive jurisdiction.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Setup Guide */}
          <Card className="p-5 border-border/30 bg-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Quick Setup Guide
            </h3>
            <div className="space-y-3">
              {SETUP_STEPS.map(s => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{s.title}</p>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-0.5">
                          Download <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bridge Addresses */}
          <Card className="p-5 border-border/30 bg-card/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                Bridge Addresses
              </h3>
              <div className="flex gap-1">
                {["all", "obfs4", "meek-azure", "snowflake"].map(t => (
                  <button key={t} onClick={() => setSelectedBridgeType(t)} className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${selectedBridgeType === t ? "bg-primary/20 text-primary" : "bg-secondary/40 text-muted-foreground hover:bg-secondary"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredBridges.map((bridge, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-[9px] h-4 bg-green-500/10 text-green-400 border-green-500/20">{bridge.type}</Badge>
                      <Badge variant="outline" className="text-[9px] h-4">{bridge.country}</Badge>
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyBridge(bridge.address, idx)}>
                      {copiedIdx === idx ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <code className="text-[10px] text-muted-foreground font-mono break-all leading-relaxed">{bridge.address}</code>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              Copy a bridge address and paste it into Tor Browser → Settings → Connection → Bridges → Add a Bridge Manually.
            </p>
          </Card>
        </div>

        {/* .onion Bookmarks */}
        <div className="space-y-4">
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              .onion Bookmarks
            </h3>
            <div className="space-y-2">
              {ONION_BOOKMARKS.map(b => (
                <div key={b.name} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs">{b.name}</span>
                    <Badge variant="outline" className="text-[9px] h-4">{b.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-[9px] text-muted-foreground font-mono truncate flex-1 mr-2">{b.url.slice(0, 35)}...</code>
                    <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0" onClick={() => { navigator.clipboard.writeText(b.url); toast.success("URL copied"); }}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              These .onion addresses only work inside Tor Browser.
            </p>
          </Card>

          {/* Tor Status */}
          <Card className="p-4 border-border/30 bg-card/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Tor Network Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Active relays</span><span className="text-green-400 font-medium">7,000+</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Exit nodes</span><span className="text-green-400 font-medium">1,200+</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Daily users</span><span className="text-green-400 font-medium">2M+</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Network status</span><span className="text-green-400 font-medium">Healthy</span></div>
            </div>
          </Card>

          <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-1">Security Tips</p>
                <ul className="text-[10px] text-muted-foreground space-y-1">
                  <li>• Never log into personal accounts over Tor</li>
                  <li>• Don't enable JavaScript on sensitive sites</li>
                  <li>• Use HTTPS .onion addresses when available</li>
                  <li>• Keep Tor Browser updated</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
