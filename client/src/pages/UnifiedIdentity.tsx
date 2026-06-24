import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User, Wallet, Star, Network, Shield, Key, Globe, Link2,
  CheckCircle2, Lock, Fingerprint, Crown, Zap, TrendingUp,
  Eye, EyeOff, Copy, ExternalLink, QrCode, Award, Users,
} from "lucide-react";
import { toast } from "sonner";

const IDENTITY_LAYERS = [
  { label: "Social Profile", icon: User, status: "verified", color: "text-purple-400", desc: "skyler.spillers · 4,821 followers" },
  { label: "Crypto Wallet", icon: Wallet, status: "connected", color: "text-cyan-400", desc: "0x1a2b...3c4d · $12,450 balance" },
  { label: "Reputation Score", icon: Star, status: "active", color: "text-yellow-400", desc: "94/100 · Legendary tier" },
  { label: "Social Graph", icon: Network, status: "mapped", color: "text-green-400", desc: "4,821 followers · 312 following" },
  { label: "DID Identity", icon: Fingerprint, status: "issued", color: "text-pink-400", desc: "did:sky:skyler.spillers.444" },
  { label: "Privacy Shield", icon: Shield, status: "active", color: "text-orange-400", desc: "GhostMode OFF · 3 relays available" },
];

const CONNECTED_APPS = [
  { name: "ShadowChat", icon: "🌑", status: "primary", perms: ["read", "write", "wallet"] },
  { name: "DHgate Shop", icon: "🛍️", status: "connected", perms: ["read", "purchase"] },
  { name: "SKYCOIN4444 ICO", icon: "🪙", status: "connected", perms: ["read", "stake", "vote"] },
  { name: "Hope AI", icon: "🧠", status: "connected", perms: ["read", "analyze"] },
  { name: "Creator Studio", icon: "🎬", status: "connected", perms: ["read", "write", "monetize"] },
];

const REPUTATION_BREAKDOWN = [
  { label: "Content Quality", score: 96, weight: "25%" },
  { label: "Community Trust", score: 91, weight: "20%" },
  { label: "Payment History", score: 100, weight: "20%" },
  { label: "Creator Activity", score: 88, weight: "15%" },
  { label: "Security Score", score: 95, weight: "10%" },
  { label: "Governance Participation", score: 82, weight: "10%" },
];

export default function UnifiedIdentity() {
  const [showDID, setShowDID] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const DID = "did:sky:skyler.spillers.444.0x1a2b3c4d5e6f";

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Unified Identity</h1>
          </div>
          <p className="text-sm text-white/50">Profile · Wallet · Reputation · Social Graph · DID — all in one sovereign identity</p>
        </div>
        <Button className="gradient-psychedelic text-white gap-2">
          <QrCode className="w-4 h-4" /> Share Identity
        </Button>
      </div>

      {/* Identity Card */}
      <Card className="glass-card border-white/10 overflow-hidden">
        <div className="h-24 gradient-psychedelic opacity-30" />
        <CardContent className="p-4 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-background">
              <AvatarFallback className="gradient-psychedelic text-white text-2xl font-bold">S</AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Skyler Blue Spillers</h2>
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-sm text-white/50">@skyler.spillers · Founder & Builder</div>
            </div>
          </div>

          {/* DID */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3 mb-4">
            <Fingerprint className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="text-xs font-mono text-white/60 flex-1 truncate">
              {showDID ? DID : "did:sky:••••••••••••••••"}
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowDID(!showDID)}>
              {showDID ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(DID); toast.success("DID copied"); }}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "Reputation", value: "94", color: "text-yellow-400" },
              { label: "Followers", value: "4.8K", color: "text-purple-400" },
              { label: "Net Worth", value: "$12K", color: "text-green-400" },
              { label: "Trust Tier", value: "Legend", color: "text-cyan-400" },
            ].map(stat => (
              <div key={stat.label}>
                <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="overview">Layers</TabsTrigger>
          <TabsTrigger value="reputation">Reputation</TabsTrigger>
          <TabsTrigger value="apps">Connected Apps</TabsTrigger>
        </TabsList>

        {/* Identity Layers */}
        <TabsContent value="overview" className="mt-4 space-y-3">
          {IDENTITY_LAYERS.map(layer => (
            <Card key={layer.label} className="glass-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <layer.icon className={`w-4 h-4 ${layer.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{layer.label}</div>
                    <div className="text-xs text-white/40">{layer.desc}</div>
                  </div>
                  <Badge className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                    {layer.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Reputation */}
        <TabsContent value="reputation" className="mt-4 space-y-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-6xl font-black text-gradient mb-2">94</div>
              <div className="text-sm text-white/50 mb-1">Reputation Score</div>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Legendary Tier</Badge>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {REPUTATION_BREAKDOWN.map(item => (
              <Card key={item.label} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">{item.weight}</span>
                      <span className="text-sm font-mono font-bold">{item.score}/100</span>
                    </div>
                  </div>
                  <Progress value={item.score} className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Connected Apps */}
        <TabsContent value="apps" className="mt-4 space-y-3">
          {CONNECTED_APPS.map(app => (
            <Card key={app.name} className="glass-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{app.name}</div>
                    <div className="flex gap-1 mt-1">
                      {app.perms.map(p => (
                        <Badge key={p} className="text-xs bg-white/5 text-white/40 border-white/10">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={`text-xs border ${app.status === "primary" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-green-500/20 text-green-300 border-green-500/30"}`}>
                    {app.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full border-white/10 gap-2">
            <Link2 className="w-4 h-4" /> Connect New App
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
