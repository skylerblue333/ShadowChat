import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Era {
  id: string;
  name: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  icon: string;
  metrics: { label: string; value: string }[];
  color: string;
}

const ERAS: Era[] = [
  {
    id: "era1",
    name: "ERA 1: THE AWAKENING",
    status: "active",
    description: "The AI OS launches. Citizens discover their Digital Twin. The first economy emerges.",
    icon: "🌅",
    color: "yellow",
    metrics: [
      { label: "Citizens", value: "1,247" },
      { label: "AI Actions", value: "89,421" },
      { label: "Tokens Minted", value: "8.4M SKY444" },
    ],
  },
  {
    id: "era2",
    name: "ERA 2: THE AGENT ECONOMY",
    status: "upcoming",
    description: "AI agents become autonomous workers. The first agent-to-agent economy emerges.",
    icon: "🤖",
    color: "blue",
    metrics: [
      { label: "Active Agents", value: "—" },
      { label: "Agent Revenue", value: "—" },
      { label: "Agent-to-Agent Tx", value: "—" },
    ],
  },
  {
    id: "era3",
    name: "ERA 3: DIGITAL ECONOMY",
    status: "upcoming",
    description: "The treasury AI becomes self-sustaining. Token velocity reaches critical mass.",
    icon: "💰",
    color: "emerald",
    metrics: [
      { label: "GDP (SKY444)", value: "—" },
      { label: "Token Velocity", value: "—" },
      { label: "Active Markets", value: "—" },
    ],
  },
  {
    id: "era4",
    name: "ERA 4: DIGITAL NATION",
    status: "upcoming",
    description: "The first laws are passed. Ministries form. The nation elects its first council.",
    icon: "🏛️",
    color: "purple",
    metrics: [
      { label: "Laws Passed", value: "—" },
      { label: "Ministries", value: "—" },
      { label: "Citizens", value: "—" },
    ],
  },
  {
    id: "era5",
    name: "ERA 5: THE VENTURE CIVILIZATION",
    status: "upcoming",
    description: "Startups launch inside the nation. The first billion-dollar company is born from the ecosystem.",
    icon: "🚀",
    color: "orange",
    metrics: [
      { label: "Startups", value: "—" },
      { label: "Total Funding", value: "—" },
      { label: "Jobs Created", value: "—" },
    ],
  },
];

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
};

export default function CivilizationSimulator() {
  const [selectedEra, setSelectedEra] = useState("era1");

  const { data: econHealth } = trpc.enterprise.economy.healthReport.useQuery();
  const { data: govHealth } = trpc.enterprise.governanceV2.health.useQuery();
  const { data: emergentStatus } = trpc.enterprise.emergent.digitalNationStatus.useQuery();

  const activeEra = ERAS.find((e) => e.id === selectedEra)!;
  const colors = COLOR_MAP[activeEra.color];

  const civilizationScore = 34; // Era 1 progress %

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cinematic Header */}
      <div className="relative overflow-hidden border-b border-yellow-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/20 via-black to-purple-950/20" />
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="text-xs text-yellow-500/60 uppercase tracking-widest mb-2">
              MANIUS DIGITAL NATION
            </div>
            <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">
              CIVILIZATION SIMULATOR
            </h1>
            <p className="text-white/40 max-w-xl mx-auto">
              A living digital civilization powered by AI, governed by citizens, and built to last 1,000 years
            </p>
          </div>

          {/* Civilization Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>GENESIS</span>
              <span>CIVILIZATION SCORE: {civilizationScore}%</span>
              <span>UTOPIA</span>
            </div>
            <Progress value={civilizationScore} className="h-3" />
            <div className="flex justify-between mt-1">
              {ERAS.map((era) => (
                <div
                  key={era.id}
                  className={`text-xs ${era.status === "active" ? "text-yellow-400 font-bold" : "text-white/20"}`}
                >
                  {era.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Era Timeline */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ERAS.map((era) => {
            const c = COLOR_MAP[era.color];
            return (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`shrink-0 px-4 py-3 rounded-xl border text-left transition-all ${
                  selectedEra === era.id
                    ? `${c.bg} ${c.border}`
                    : era.status === "upcoming"
                    ? "bg-black/40 border-white/5 opacity-50"
                    : "bg-black/40 border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{era.icon}</span>
                  <Badge
                    className={`text-xs border-0 ${
                      era.status === "active"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : era.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {era.status.toUpperCase()}
                  </Badge>
                </div>
                <div className={`text-xs font-bold ${selectedEra === era.id ? c.text : "text-white/50"}`}>
                  {era.name.split(":")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Era Detail */}
        <Card className={`bg-black/60 border ${colors.border}`}>
          <CardHeader>
            <CardTitle className={`${colors.text} text-sm uppercase tracking-widest flex items-center gap-2`}>
              <span>{activeEra.icon}</span>
              {activeEra.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-white/60">{activeEra.description}</p>
            <div className="grid grid-cols-3 gap-4">
              {activeEra.metrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 text-center">
                  <div className={`text-xl font-black font-mono ${colors.text}`}>{metric.value}</div>
                  <div className="text-xs text-white/40 mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Civilization Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 text-xs uppercase tracking-widest">ECONOMY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Health", value: econHealth?.overallHealth ?? "LOADING" },
                { label: "Tokens in Circulation", value: "8.4M SKY444" },
                { label: "Active Sinks", value: "3" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-yellow-400 font-mono">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 text-xs uppercase tracking-widest">GOVERNANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Total Proposals", value: String(govHealth?.totalProposals ?? 0) },
                { label: "Active Votes", value: String(govHealth?.activeProposals ?? 0) },
                { label: "Pass Rate", value: `${govHealth?.passRate ?? 0}%` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-purple-400 font-mono">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 text-xs uppercase tracking-widest">NATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Gov Health", value: emergentStatus?.governanceHealth ?? "GENESIS" },
                { label: "Citizens", value: "1,247" },
                { label: "Territories", value: "7" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-blue-400 font-mono">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* The Vision */}
        <Card className="bg-gradient-to-r from-yellow-950/30 via-black to-purple-950/30 border border-yellow-500/20">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-2xl font-black text-white mb-3">THE 1,000-YEAR VISION</h2>
            <p className="text-white/50 max-w-2xl mx-auto text-sm leading-relaxed">
              SKYCOIN4444 is not a product. It is a civilization. A living, breathing digital nation where AI and humans 
              co-govern, co-create, and co-prosper. Every token earned is a vote. Every skill learned is a law. 
              Every agent deployed is a citizen. This is the future of human organization.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-0">AI-GOVERNED</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-0">SELF-SUSTAINING</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-0">PERMISSIONLESS</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">OPEN SOURCE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
