/**
 * ActionObjects — Actions as Floating Objects
 *
 * Every action shows:
 *   cost → impact → result preview
 *
 * Features:
 * - Live balance overlay (current wallet balance always visible)
 * - Income flow visualization (earnings stream)
 * - Action cost preview before execution
 * - Action history with status (COMPLETED / FAILED / PENDING)
 * - Deterministic execution — no AI required for core flow
 * - AI enhancement optional (smart suggestions layer)
 */
import { useState, useEffect, useRef } from "react";
import { DollarSign, TrendingUp, TrendingDown, Zap, ChevronRight, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight, BarChart2, Activity, Wallet, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ACTION_TYPES } from "@/core/actions/actionTypes";
import type { ActionType } from "@/core/actions/actionTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

interface ActionObject {
  id: string;
  type: ActionType;
  label: string;
  cost: number;
  impact: string;
  result: string;
  status: ActionStatus;
  timestamp: number;
  actualResult?: string;
  color: string;
}

interface IncomeEvent {
  id: string;
  label: string;
  amount: number;
  direction: "in" | "out";
  timestamp: number;
  source: string;
}

// ─── Static action catalog ────────────────────────────────────────────────────

const ACTION_CATALOG: Omit<ActionObject, "id" | "status" | "timestamp">[] = [
  {
    type: ACTION_TYPES.PAYMENT,
    label: "Send Payment",
    cost: 0,
    impact: "Instant transfer",
    result: "Recipient credited immediately",
    color: "#22c55e",
  },
  {
    type: ACTION_TYPES.TIP,
    label: "Tip Creator",
    cost: 1,
    impact: "+15 trust score",
    result: "Unlocks premium content access",
    color: "#a855f7",
  },
  {
    type: ACTION_TYPES.REQUEST_SERVICE,
    label: "Request Service",
    cost: 5,
    impact: "Service queued",
    result: "Delivered within 24h",
    color: "#06b6d4",
  },
  {
    type: ACTION_TYPES.CREATE_LISTING,
    label: "Create Listing",
    cost: 0,
    impact: "Listed in marketplace",
    result: "Visible to 1,200+ users",
    color: "#f59e0b",
  },
  {
    type: ACTION_TYPES.MATCH_USER,
    label: "Connect Match",
    cost: 0,
    impact: "+28% engagement",
    result: "Opens dating channel",
    color: "#ec4899",
  },
  {
    type: ACTION_TYPES.CALL_AI_AGENT,
    label: "Hire AI Agent",
    cost: 3,
    impact: "Task delegated",
    result: "AI completes in ~2 min",
    color: "#8b5cf6",
  },
  {
    type: ACTION_TYPES.SCHEDULE_EVENT,
    label: "Schedule Event",
    cost: 0,
    impact: "Event created",
    result: "Notifies all followers",
    color: "#14b8a6",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ActionStatusIcon({ status }: { status: ActionStatus }) {
  switch (status) {
    case "COMPLETED": return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "FAILED":    return <XCircle className="w-4 h-4 text-red-400" />;
    case "PENDING":   return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
    case "CANCELLED": return <XCircle className="w-4 h-4 text-muted-foreground" />;
  }
}

function ActionObjectCard({
  action,
  onExecute,
}: {
  action: Omit<ActionObject, "id" | "status" | "timestamp">;
  onExecute: (a: typeof action) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card p-4 cursor-pointer transition-all duration-200"
      style={{
        borderColor: hovered ? `${action.color}50` : `${action.color}20`,
        transform: hovered ? "scale(1.01)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onExecute(action)}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${action.color}20`, color: action.color }}
        >
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm">{action.label}</span>
            <Badge variant="outline" className="text-xs" style={{ borderColor: `${action.color}40`, color: action.color }}>
              {action.type}
            </Badge>
          </div>
          {/* Cost → Impact → Result chain */}
          <div className="flex items-center gap-1.5 mt-2 text-xs flex-wrap">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/60">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{action.cost > 0 ? `$${action.cost}` : "Free"}</span>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/60" style={{ color: action.color }}>
              <TrendingUp className="w-3 h-3" />
              <span>{action.impact}</span>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/60">
              <CheckCircle className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground truncate max-w-[120px]">{action.result}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeFlowItem({ event }: { event: IncomeEvent }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${event.direction === "in" ? "bg-green-500/20" : "bg-red-500/20"}`}>
        {event.direction === "in"
          ? <ArrowUpRight className="w-4 h-4 text-green-400" />
          : <ArrowDownRight className="w-4 h-4 text-red-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">{event.label}</span>
          <span className={`text-sm font-bold ${event.direction === "in" ? "text-green-400" : "text-red-400"}`}>
            {event.direction === "in" ? "+" : "-"}${Math.abs(event.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{event.source}</span>
          <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ActionObjects() {
  const [activeTab, setActiveTab] = useState<"catalog" | "history" | "flow">("catalog");
  const [actionHistory, setActionHistory] = useState<ActionObject[]>([]);
  const [incomeFlow, setIncomeFlow] = useState<IncomeEvent[]>([]);

  // Wallet balance
  const walletQuery = trpc.wallet.getBalance.useQuery(undefined, {
    refetchInterval: 15_000,
  });
  const balance = walletQuery.data?.balance ?? 0;

  // Simulate income flow events on mount
  useEffect(() => {
    const mockFlow: IncomeEvent[] = [
      { id: "1", label: "Tip received from NOVA", amount: 5, direction: "in", timestamp: Date.now() - 60_000, source: "AI Persona" },
      { id: "2", label: "AI Agent task fee", amount: 3, direction: "out", timestamp: Date.now() - 120_000, source: "CIPHER Agent" },
      { id: "3", label: "Content subscription", amount: 9.99, direction: "in", timestamp: Date.now() - 300_000, source: "Premium Plan" },
      { id: "4", label: "Marketplace listing fee", amount: 0.50, direction: "out", timestamp: Date.now() - 600_000, source: "Marketplace" },
      { id: "5", label: "Dating boost", amount: 4.99, direction: "out", timestamp: Date.now() - 900_000, source: "Dating Premium" },
      { id: "6", label: "Creator tip sent", amount: 2, direction: "out", timestamp: Date.now() - 1_200_000, source: "Chat Action" },
      { id: "7", label: "Staking yield", amount: 12.40, direction: "in", timestamp: Date.now() - 1_800_000, source: "SKY444 Staking" },
    ];
    setIncomeFlow(mockFlow);
  }, []);

  const handleExecuteAction = (action: Omit<ActionObject, "id" | "status" | "timestamp">) => {
    const newAction: ActionObject = {
      ...action,
      id: `act-${Date.now()}`,
      status: "PENDING",
      timestamp: Date.now(),
    };
    setActionHistory(prev => [newAction, ...prev]);

    toast.loading(`Executing: ${action.label}`, { id: newAction.id });

    // Simulate action lifecycle: PENDING → COMPLETED
    setTimeout(() => {
      setActionHistory(prev =>
        prev.map(a => a.id === newAction.id
          ? { ...a, status: "COMPLETED", actualResult: action.result }
          : a
        )
      );
      toast.success(`Completed: ${action.label}`, {
        id: newAction.id,
        description: action.result,
      });

      // Add to income flow if it has a cost
      if (action.cost > 0) {
        const flowEvent: IncomeEvent = {
          id: `flow-${Date.now()}`,
          label: action.label,
          amount: action.cost,
          direction: "out",
          timestamp: Date.now(),
          source: "Action OS",
        };
        setIncomeFlow(prev => [flowEvent, ...prev]);
      }
    }, 1500 + Math.random() * 1000);
  };

  // Income flow totals
  const totalIn = incomeFlow.filter(e => e.direction === "in").reduce((s, e) => s + e.amount, 0);
  const totalOut = incomeFlow.filter(e => e.direction === "out").reduce((s, e) => s + e.amount, 0);
  const netFlow = totalIn - totalOut;

  return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto space-y-4">
      {/* Header with live balance overlay */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Action Objects</h1>
            <p className="text-xs text-muted-foreground">Every action: cost → impact → result</p>
          </div>
        </div>
        {/* Live balance overlay */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <Wallet className="w-4 h-4 text-green-400" />
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">${balance.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Balance</div>
          </div>
        </div>
      </div>

      {/* Income flow summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-green-400">+${totalIn.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total In</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-red-400">-${totalOut.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total Out</div>
        </div>
        <div className="card p-3 text-center">
          <div className={`text-lg font-bold ${netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
            {netFlow >= 0 ? "+" : ""}${netFlow.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Net Flow</div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-0.5 bg-secondary/50 rounded-xl">
        {(["catalog", "history", "flow"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
          >
            {tab === "catalog" ? "Action Catalog" : tab === "history" ? "History" : "Income Flow"}
          </button>
        ))}
      </div>

      {/* CATALOG TAB */}
      {activeTab === "catalog" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground px-1">
            Tap any action to execute. Every action shows cost → impact → result before you commit.
          </p>
          {ACTION_CATALOG.map(action => (
            <ActionObjectCard
              key={action.type}
              action={action}
              onExecute={handleExecuteAction}
            />
          ))}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {actionHistory.length === 0 ? (
            <div className="card p-8 text-center">
              <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No actions yet. Execute an action from the catalog.</p>
            </div>
          ) : (
            actionHistory.map(action => (
              <div key={action.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <ActionStatusIcon status={action.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{action.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <span style={{ color: action.color }}>{action.type}</span>
                      {action.cost > 0 && <span>· ${action.cost}</span>}
                      {action.actualResult && (
                        <>
                          <span>·</span>
                          <span className="text-green-400">{action.actualResult}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* INCOME FLOW TAB */}
      {activeTab === "flow" && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm">Income Flow</span>
            <span className="text-xs text-muted-foreground ml-auto">Last 7 events</span>
          </div>
          {incomeFlow.map(event => (
            <IncomeFlowItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
