/**
 * WorldBrain — AI as Ambient World Brain Layer
 *
 * AI is not a chatbox. It is:
 * - ambient intelligence
 * - context-aware suggestions everywhere
 * - always present in UI
 * - highlights posts you care about
 * - suggests actions before you ask
 * - modifies feed layout dynamically
 *
 * Shows:
 * - Live simulation world state
 * - AI persona activity feed
 * - Context-aware action suggestions
 * - Action cost → impact → result preview
 * - Behavior predictions
 * - Market intelligence
 */
import { useState } from "react";
import type { SimEntity, WorldEvent, MarketSignal, TrendSignal } from "../../../server/simulationEngine";
import { Brain, Zap, TrendingUp, Eye, Activity, Sparkles, ChevronRight, BarChart2, Heart, MessageCircle, DollarSign, Users, Globe, Shield, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ActionPreview {
  id: string;
  type: string;
  label: string;
  cost: number;
  impact: string;
  result: string;
  confidence: number;
  color: string;
  icon: React.ReactNode;
}

const ACTION_PREVIEWS: ActionPreview[] = [
  {
    id: "boost-post",
    type: "BOOST",
    label: "Boost top post",
    cost: 5,
    impact: "+340% reach",
    result: "~1,200 new impressions",
    confidence: 89,
    color: "#a855f7",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "tip-creator",
    type: "TIP",
    label: "Tip trending creator",
    cost: 2,
    impact: "+15 trust score",
    result: "Unlocks premium content",
    confidence: 94,
    color: "#22c55e",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: "match-connect",
    type: "MATCH",
    label: "Connect with 94% match",
    cost: 0,
    impact: "+28% engagement",
    result: "Opens dating channel",
    confidence: 91,
    color: "#ec4899",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: "stake-tokens",
    type: "STAKE",
    label: "Stake SKY444 (7-day)",
    cost: 100,
    impact: "+12.4% APY",
    result: "~$12.40 weekly yield",
    confidence: 87,
    color: "#f59e0b",
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: "hire-agent",
    type: "AGENT",
    label: "Hire NOVA for content",
    cost: 3,
    impact: "3 posts generated",
    result: "~450 avg engagement",
    confidence: 82,
    color: "#06b6d4",
    icon: <Brain className="w-4 h-4" />,
  },
];

// Pulsing ambient indicator
function AmbientPulse({ color, size = "md" }: { color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" };
  return (
    <div className="relative flex items-center justify-center">
      <div className={`${sizes[size]} rounded-full`} style={{ backgroundColor: color }} />
      <div className={`absolute ${sizes[size]} rounded-full animate-ping opacity-40`} style={{ backgroundColor: color }} />
    </div>
  );
}

// Action cost → impact → result preview card
function ActionPreviewCard({ action, onExecute }: { action: ActionPreview; onExecute: (a: ActionPreview) => void }) {
  return (
    <div
      className="card p-3 cursor-pointer hover:scale-[1.01] transition-all"
      style={{ borderColor: `${action.color}30` }}
      onClick={() => onExecute(action)}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm">{action.label}</span>
            <span className="text-xs font-bold" style={{ color: action.color }}>{action.confidence}%</span>
          </div>
          {/* Cost → Impact → Result chain */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground">
              {action.cost > 0 ? `$${action.cost}` : "Free"}
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="px-1.5 py-0.5 rounded bg-secondary/60" style={{ color: action.color }}>
              {action.impact}
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{action.result}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorldBrain() {
  const [activeTab, setActiveTab] = useState<"brain" | "entities" | "events" | "market">("brain");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const worldState = trpc.simulation.getWorldState.useQuery(undefined, {
    refetchInterval: autoRefresh ? 5000 : false,
  });
  const trends = trpc.simulation.getTrends.useQuery(undefined, {
    refetchInterval: autoRefresh ? 8000 : false,
  });
  const events = trpc.simulation.getEvents.useQuery({ limit: 15 }, {
    refetchInterval: autoRefresh ? 5000 : false,
  });
  const marketSignals = trpc.simulation.getMarketSignals.useQuery(undefined, {
    refetchInterval: autoRefresh ? 10000 : false,
  });
  const tickMutation = trpc.simulation.tick.useMutation({
    onSuccess: () => {
      worldState.refetch();
      events.refetch();
    },
  });

  const handleExecuteAction = (action: ActionPreview) => {
    toast.success(`Action queued: ${action.label}`, {
      description: `Expected: ${action.result}`,
    });
  };

  const entities = worldState.data?.entities ?? [];
  const recentEvents = events.data ?? [];
  const trendData = trends.data ?? [];
  const market = marketSignals.data ?? [];

  const stateColors: Record<string, string> = {
    active: "#22c55e",
    evolving: "#a855f7",
    dormant: "#f59e0b",
    decaying: "#ef4444",
  };

  const eventTypeLabels: Record<string, string> = {
    post_generated: "Post Generated",
    trend_spike: "Trend Spike",
    market_move: "Market Move",
    match_suggested: "Match Suggested",
    action_triggered: "Action Triggered",
    persona_interaction: "Persona Interaction",
    feed_update: "Feed Update",
    behavior_signal: "Behavior Signal",
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold">World Brain</h1>
            <p className="text-xs text-muted-foreground">
              Ambient AI · Tick #{worldState.data?.tick ?? 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${autoRefresh ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-secondary text-muted-foreground"}`}
          >
            {autoRefresh ? "Live" : "Paused"}
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => tickMutation.mutate()}
            disabled={tickMutation.isPending}
            className="text-xs"
          >
            <Zap className="w-3 h-3 mr-1" />
            Tick
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-0.5 bg-secondary/50 rounded-xl">
        {(["brain", "entities", "events", "market"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* BRAIN TAB — AI suggestions + action previews */}
      {activeTab === "brain" && (
        <div className="space-y-4">
          {/* Ambient intelligence status */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">Ambient Intelligence</span>
              <AmbientPulse color="#a855f7" size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {([
                { label: "Active Entities", value: entities.filter((e: SimEntity) => e.state === "active").length, color: "#22c55e" },
                { label: "World Tick", value: worldState.data?.tick ?? 0, color: "#a855f7" },
                { label: "Live Events", value: recentEvents.length, color: "#06b6d4" },
                { label: "Trending Topics", value: trendData.length, color: "#f59e0b" },
              ] as { label: string; value: number; color: string }[]).map(s => (
                <div key={s.label} className="p-2 rounded-lg bg-secondary/50 flex items-center justify-between">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending signals */}
          {trendData.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-sm">Live Trends</span>
              </div>
              <div className="space-y-2">
                {trendData.slice(0, 5).map((trend: TrendSignal, i: number) => (
                  <div key={trend.topic} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-cyan-400">{trend.topic}</span>
                        <span className="text-xs text-muted-foreground">{Math.round(trend.score)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${trend.score}%`, backgroundColor: "#06b6d4" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI action suggestions — cost → impact → result */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">AI Suggests</span>
              <span className="text-xs text-muted-foreground ml-auto">Tap to execute</span>
            </div>
            <div className="space-y-2">
              {ACTION_PREVIEWS.map(action => (
                <ActionPreviewCard key={action.id} action={action} onExecute={handleExecuteAction} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ENTITIES TAB — AI persona states */}
      {activeTab === "entities" && (
        <div className="space-y-3">
          {entities.length === 0 ? (
            <div className="card p-8 text-center text-muted-foreground text-sm">
              Loading entities...
            </div>
          ) : (
            entities.map((entity: SimEntity) => (
              <div key={entity.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center font-bold text-sm">
                      {entity.name.charAt(0)}
                    </div>
                    <AmbientPulse color={stateColors[entity.state] ?? "#888"} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{entity.name}</span>
                      <Badge variant="outline" className="text-xs" style={{ borderColor: `${stateColors[entity.state]}40`, color: stateColors[entity.state] }}>
                        {entity.state}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Energy: <span className="text-foreground font-medium">{entity.energy}</span></span>
                      <span>Momentum: <span className={`font-medium ${entity.momentum > 0 ? "text-green-400" : "text-red-400"}`}>{entity.momentum > 0 ? "+" : ""}{entity.momentum.toFixed(2)}</span></span>
                    </div>
                    {/* Energy bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${entity.energy}%`, backgroundColor: stateColors[entity.state] }}
                      />
                    </div>
                    {/* Traits */}
                    {Object.keys(entity.traits).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(entity.traits).slice(0, 4).map(([key, val]: [string, number]) => (
                          <span key={key} className="px-1.5 py-0.5 rounded bg-secondary/60 text-xs text-muted-foreground">
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EVENTS TAB — world event stream */}
      {activeTab === "events" && (
        <div className="space-y-2">
          {recentEvents.length === 0 ? (
            <div className="card p-8 text-center text-muted-foreground text-sm">
              Waiting for world events...
            </div>
          ) : (
            recentEvents.map((event: WorldEvent) => {
              const typeColor: Record<string, string> = {
                post_generated: "#a855f7",
                trend_spike: "#f59e0b",
                market_move: "#22c55e",
                match_suggested: "#ec4899",
                action_triggered: "#06b6d4",
                behavior_signal: "#94a3b8",
              };
              const color = typeColor[event.type] ?? "#888";
              return (
                <div key={event.id} className="card p-3">
                  <div className="flex items-start gap-3">
                    <AmbientPulse color={color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium" style={{ color }}>
                          {eventTypeLabels[event.type] ?? event.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Impact: {event.impact}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by <span className="text-foreground">{event.entityName}</span>
                        {event.payload.content ? ` · "${String(event.payload.content).substring(0, 60)}..."` : null}
                        {event.payload.topic ? ` · ${String(event.payload.topic)}` : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MARKET TAB — live market signals */}
      {activeTab === "market" && (
        <div className="space-y-3">
          {market.map((signal: MarketSignal) => (
            <div key={signal.symbol} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center font-bold text-sm text-yellow-400">
                    {signal.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{signal.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      Sentiment: <span className={signal.sentiment > 60 ? "text-green-400" : "text-red-400"}>{Math.round(signal.sentiment)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${signal.price < 1 ? signal.price.toFixed(4) : signal.price.toFixed(2)}
                  </div>
                  <div className={`text-xs font-medium ${signal.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {signal.change24h >= 0 ? "+" : ""}{signal.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
              {/* Momentum bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Momentum</span>
                  <span>{signal.momentum > 0 ? "Bullish" : "Bearish"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.abs(signal.momentum) * 100}%`,
                      backgroundColor: signal.momentum > 0 ? "#22c55e" : "#ef4444",
                      marginLeft: signal.momentum < 0 ? `${(1 - Math.abs(signal.momentum)) * 100}%` : "0",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
