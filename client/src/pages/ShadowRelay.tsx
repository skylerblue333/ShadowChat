import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Network, Server, Shuffle, Plus, Trash2, ArrowRight, CheckCircle,
  Globe, Zap, Shield, Activity, RefreshCw, Lock, Wifi
} from "lucide-react";

const RELAY_NODES = [
  { id: "n1", name: "Shadow Node Alpha", location: "Frankfurt, DE", latency: 23, reputation: 98, load: 34, type: "entry" },
  { id: "n2", name: "Phantom Relay Beta", location: "Tokyo, JP", latency: 87, reputation: 95, load: 12, type: "middle" },
  { id: "n3", name: "Ghost Exit Gamma", location: "São Paulo, BR", latency: 145, reputation: 91, load: 67, type: "exit" },
  { id: "n4", name: "Cipher Node Delta", location: "Toronto, CA", latency: 56, reputation: 99, load: 23, type: "middle" },
  { id: "n5", name: "Wraith Relay Epsilon", location: "Singapore, SG", latency: 112, reputation: 87, load: 45, type: "exit" },
  { id: "n6", name: "Specter Node Zeta", location: "Amsterdam, NL", latency: 18, reputation: 96, load: 8, type: "entry" },
];

const TYPE_COLORS: Record<string, string> = {
  entry: "text-green-400 bg-green-500/10 border-green-500/20",
  middle: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  exit: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function ShadowRelay() {
  const [chain, setChain] = useState<typeof RELAY_NODES>([]);
  const [relayActive, setRelayActive] = useState(false);
  const [hops, setHops] = useState(3);

  const addToChain = (node: typeof RELAY_NODES[0]) => {
    if (chain.find(n => n.id === node.id)) { toast.error("Node already in chain"); return; }
    if (chain.length >= 5) { toast.error("Maximum 5 hops allowed"); return; }
    setChain(prev => [...prev, node]);
  };

  const removeFromChain = (id: string) => setChain(prev => prev.filter(n => n.id !== id));

  const buildRandomChain = () => {
    const shuffled = [...RELAY_NODES].sort(() => Math.random() - 0.5).slice(0, hops);
    setChain(shuffled);
    toast.success(`${hops}-hop relay chain built`);
  };

  const activateRelay = () => {
    if (chain.length < 2) { toast.error("Add at least 2 nodes to the chain"); return; }
    setRelayActive(true);
    toast.success(`Shadow Relay activated — ${chain.length}-hop chain routing all traffic`);
  };

  const totalLatency = chain.reduce((a, n) => a + n.latency, 0);

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-4">
          <Network className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">DECENTRALIZED RELAY NETWORK</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Shadow Relay</h1>
        <p className="text-muted-foreground">Build your own onion-style routing chain. Route traffic through multiple trusted nodes to mask your origin.</p>
      </div>

      {/* Relay Chain Builder */}
      <Card className={`p-5 mb-6 border-2 transition-all ${relayActive ? "border-cyan-500/50 bg-cyan-500/5" : "border-border/30"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Relay Chain
            {relayActive && <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">ACTIVE</Badge>}
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Hops:</span>
              {[2, 3, 4, 5].map(h => (
                <button key={h} onClick={() => setHops(h)} className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${hops === h ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-secondary/40 text-muted-foreground hover:bg-secondary"}`}>{h}</button>
              ))}
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs border-cyan-500/30 text-cyan-400" onClick={buildRandomChain}>
              <Shuffle className="w-3 h-3 mr-1" />Random
            </Button>
          </div>
        </div>

        {chain.length === 0 ? (
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-border/30 rounded-xl text-muted-foreground text-sm">
            Click nodes below to build your relay chain
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">
              <Globe className="w-3 h-3" />You
            </div>
            {chain.map((node, idx) => (
              <div key={node.id} className="flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group">
                  <Server className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400">{node.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-muted-foreground">{node.latency}ms</span>
                  <button onClick={() => removeFromChain(node.id)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 font-medium">
                <Globe className="w-3 h-3" />Destination
              </div>
            </div>
          </div>
        )}

        {chain.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Total latency: <span className="text-foreground font-medium">~{totalLatency}ms</span></span>
              <span>Hops: <span className="text-foreground font-medium">{chain.length}</span></span>
              <span>Anonymity: <span className="text-green-400 font-medium">{chain.length >= 3 ? "High" : "Medium"}</span></span>
            </div>
            {relayActive ? (
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => { setRelayActive(false); toast.info("Shadow Relay deactivated"); }}>
                <Wifi className="w-3.5 h-3.5 mr-1" />Disconnect
              </Button>
            ) : (
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white" onClick={activateRelay}>
                <Zap className="w-3.5 h-3.5 mr-1" />Activate Relay
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Available Nodes */}
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Server className="w-4 h-4 text-primary" />
        Available Relay Nodes
        <Badge variant="outline" className="text-[10px]">{RELAY_NODES.length} nodes</Badge>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {RELAY_NODES.map(node => (
          <Card key={node.id} className={`p-4 border-border/30 bg-card/50 hover:border-cyan-500/30 transition-all cursor-pointer group ${chain.find(n => n.id === node.id) ? "border-cyan-500/50 bg-cyan-500/5" : ""}`} onClick={() => addToChain(node)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{node.name}</p>
                <p className="text-xs text-muted-foreground">{node.location}</p>
              </div>
              <Badge className={`text-[9px] h-4 border ${TYPE_COLORS[node.type]}`}>{node.type}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <p className="text-xs font-bold text-cyan-400">{node.latency}ms</p>
                <p className="text-[10px] text-muted-foreground">Latency</p>
              </div>
              <div>
                <p className="text-xs font-bold text-green-400">{node.reputation}%</p>
                <p className="text-[10px] text-muted-foreground">Trust</p>
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-400">{node.load}%</p>
                <p className="text-[10px] text-muted-foreground">Load</p>
              </div>
            </div>
            {chain.find(n => n.id === node.id) && (
              <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400">
                <CheckCircle className="w-3 h-3" />In chain
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-4 mt-6 border-border/30 bg-card/30">
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">How Shadow Relay works:</span> Your traffic is encrypted in layers (like an onion) and routed through each node in your chain. Each node only knows the previous and next hop — no single node knows both your origin and destination. This is the same principle used by Tor, but with community-operated nodes you can trust and verify.
          </p>
        </div>
      </Card>
    </div>
  );
}
