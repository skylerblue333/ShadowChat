import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

const THREAT_COLORS = {
  low: "text-emerald-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

const PULSE_COLORS = {
  healthy: "bg-emerald-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

function PulsingDot({ status }: { status: "healthy" | "warning" | "critical" }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${PULSE_COLORS[status]} opacity-75`}
      />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${PULSE_COLORS[status]}`} />
    </span>
  );
}

function MetricPanel({
  label,
  value,
  sub,
  trend,
  status,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "stable";
  status?: "healthy" | "warning" | "critical";
}) {
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "●";
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-yellow-400";
  return (
    <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-yellow-500/60 uppercase tracking-widest">{label}</span>
        {status && <PulsingDot status={status} />}
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      {sub && <div className="text-xs text-white/40">{sub}</div>}
      {trend && (
        <div className={`text-xs font-semibold ${trendColor}`}>
          {trendIcon} {trend}
        </div>
      )}
    </div>
  );
}

export default function SituationRoom() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const { data: orchestratorState } = trpc.orchestrator.status.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const { data: econHealth } = trpc.enterprise.economy.healthReport.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const { data: govHealth } = trpc.enterprise.governanceV2.health.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const { data: secRisk } = trpc.enterprise.security.myRiskScore.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const { data: freeWillSnap } = trpc.enterprise.freeWill.systemSnapshot.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  const platformScore = orchestratorState?.platformScore ?? 0;
  const economyHealth = econHealth?.overallHealth ?? "UNKNOWN";
  const nationHealth =
    govHealth?.activeProposals !== undefined
      ? govHealth.activeProposals > 5
        ? "Active"
        : "Stable"
      : "Loading";
  const riskScore = secRisk?.riskScore ?? 0;
  const threatLevel = riskScore > 70 ? "critical" : riskScore > 40 ? "high" : riskScore > 20 ? "medium" : "low";
  const dau = (freeWillSnap as unknown as Record<string, unknown>)?.activeGoals ?? 0;
  const agentActivity = orchestratorState?.recommendations?.length ?? 0;

  const now = new Date();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-yellow-500 rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest uppercase">
                SITUATION ROOM
              </h1>
              <p className="text-xs text-yellow-500/60">
                MANIUS COMMAND — CLASSIFIED INTELLIGENCE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-white/40">PLATFORM TIME</div>
              <div className="text-sm font-mono text-yellow-400">
                {now.toLocaleTimeString()}
              </div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-mono">
              LIVE
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Platform Score Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-black via-yellow-950/20 to-black p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-yellow-500/60 uppercase tracking-widest mb-2">
                CIVILIZATION HEALTH INDEX
              </div>
              <div className="text-7xl font-black text-white font-mono">
                {platformScore.toFixed(0)}
                <span className="text-3xl text-yellow-500">/100</span>
              </div>
              <div className="mt-2 text-sm text-white/50">
                Real-time composite of economy, governance, security, and citizen activity
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-right">
              <div>
                <div className="text-3xl font-bold text-emerald-400">{dau as number}</div>
                <div className="text-xs text-white/40">Active Citizens</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{agentActivity}</div>
                <div className="text-xs text-white/40">AI Recommendations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {govHealth?.activeProposals ?? 0}
                </div>
                <div className="text-xs text-white/40">Active Proposals</div>
              </div>
              <div>
                <div
                  className={`text-3xl font-bold ${THREAT_COLORS[threatLevel as keyof typeof THREAT_COLORS] ?? "text-white"}`}
                >
                  {threatLevel.toUpperCase()}
                </div>
                <div className="text-xs text-white/40">Threat Level</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={platformScore} className="h-2 bg-white/10" />
          </div>
        </div>

        {/* Six Sector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricPanel
            label="Economy Status"
            value={economyHealth.toUpperCase()}
            sub="Token velocity + emission health"
            status={economyHealth === "HEALTHY" ? "healthy" : economyHealth === "CRITICAL" ? "critical" : "warning"} 
            trend="stable"
          />
          <MetricPanel
            label="Nation Health"
            value={nationHealth}
            sub={`${govHealth?.activeProposals ?? 0} active proposals`}
            status="healthy"
            trend="up"
          />
          <MetricPanel
            label="Agent Activity"
            value={agentActivity}
            sub="AI recommendations queued"
            status="healthy"
            trend="up"
          />
          <MetricPanel
            label="Security Threat"
            value={threatLevel.toUpperCase()}
            sub="Real-time risk assessment"
            status={threatLevel === "low" ? "healthy" : threatLevel === "medium" ? "warning" : "critical"}
            trend="stable"
          />
          <MetricPanel
            label="Active Goals"
            value={`${dau}`}
            sub="Daily active citizens"
            status="healthy"
            trend="up"
          />
          <MetricPanel
            label="Platform Score"
            value={`${platformScore.toFixed(1)}`}
            sub="Composite intelligence index"
            status={platformScore > 70 ? "healthy" : platformScore > 40 ? "warning" : "critical"}
            trend="up"
          />
        </div>

        {/* Intelligence Feed + Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Orchestrator Recommendations */}
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest flex items-center gap-2">
                <PulsingDot status="healthy" />
                AI INTELLIGENCE FEED
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orchestratorState?.recommendations && orchestratorState.recommendations.length > 0 ? (
                orchestratorState.recommendations.slice(0, 6).map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">
                        {typeof rec === "object" && rec !== null && "title" in rec
                          ? String((rec as Record<string, unknown>).title)
                          : String(rec)}
                      </div>
                      {typeof rec === "object" && rec !== null && "description" in rec && (
                        <div className="text-xs text-white/40 mt-0.5">
                          {String((rec as Record<string, unknown>).description)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/30">
                  <div className="text-4xl mb-2">🧠</div>
                  <div className="text-sm">Orchestrator initializing...</div>
                  <div className="text-xs mt-1">Intelligence feed will populate after first cycle</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Threats & Opportunities */}
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest flex items-center gap-2">
                <PulsingDot status="warning" />
                THREATS & OPPORTUNITIES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Economy signals */}
              {econHealth && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-400 text-xs font-bold uppercase">ECONOMY</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs border-0">
                      {econHealth.overallHealth}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/70">
                    Overall health: {econHealth.overallHealth} — Emission health nominal
                  </div>
                </div>
              )}
              {/* Security signal */}
              <div
                className={`p-3 rounded-lg border ${
                  threatLevel === "low"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-orange-500/10 border-orange-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase ${
                      threatLevel === "low" ? "text-emerald-400" : "text-orange-400"
                    }`}
                  >
                    SECURITY
                  </span>
                  <Badge
                    className={`text-xs border-0 ${
                      threatLevel === "low"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {threatLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-white/70">
                  Risk score: {riskScore}/100 — Monitoring active
                </div>
              </div>
              {/* Governance signal */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 text-xs font-bold uppercase">GOVERNANCE</span>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs border-0">
                    {govHealth?.activeProposals ?? 0} ACTIVE
                  </Badge>
                </div>
                <div className="text-sm text-white/70">
                  Avg participation: {govHealth?.avgParticipation?.toFixed(1) ?? "0"}% — Nation
                  stable
                </div>
              </div>
              {/* Opportunity */}
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 text-xs font-bold uppercase">OPPORTUNITY</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs border-0">HIGH</Badge>
                </div>
                <div className="text-sm text-white/70">
                  AI agents identified {agentActivity} growth opportunities this cycle
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
            onClick={() => window.location.href = "/life-command"}
          >
            ⚡ Life Command
          </Button>
          <Button
            variant="outline"
            className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
            onClick={() => window.location.href = "/destiny-engine"}
          >
            🔮 Destiny Engine
          </Button>
          <Button
            variant="outline"
            className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => window.location.href = "/sky444-central-bank"}
          >
            🏦 Central Bank
          </Button>
          <Button
            variant="outline"
            className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
            onClick={() => window.location.href = "/nation-map"}
          >
            🌍 Nation Map
          </Button>
          <Button
            variant="outline"
            className="border-pink-500/40 text-pink-400 hover:bg-pink-500/10"
            onClick={() => window.location.href = "/civilization-simulator"}
          >
            🏛️ Civilization Sim
          </Button>
        </div>
      </div>
    </div>
  );
}
