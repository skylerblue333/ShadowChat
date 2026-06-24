import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  AlertTriangle,
  Ban,
  Eye,
  Activity,
  FileText,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-green-900/50 text-green-300",
  medium: "bg-yellow-900/50 text-yellow-300",
  high: "bg-orange-900/50 text-orange-300",
  critical: "bg-red-900/50 text-red-300",
  info: "bg-blue-900/50 text-blue-300",
  warning: "bg-yellow-900/50 text-yellow-300",
  error: "bg-red-900/50 text-red-300",
};

const ACTION_COLORS: Record<string, string> = {
  flag: "bg-yellow-900/50 text-yellow-300",
  warn: "bg-orange-900/50 text-orange-300",
  mute: "bg-gray-800 text-gray-300",
  ban: "bg-red-900/50 text-red-300",
  shadow_ban: "bg-purple-900/50 text-purple-300",
  delete: "bg-red-900/70 text-red-200",
};

function TrustScoreRing({ score }: { score: number }) {
  const color =
    score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : score >= 20 ? "#f97316" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(score)}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

export default function TrustSafetyDashboard() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [auditFilter, setAuditFilter] = useState<"info" | "warning" | "error" | "critical" | undefined>(undefined);

  const { data: myScore } = trpc.trustSafety.getMyTrustScore.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: rules } = trpc.trustSafety.getModerationRules.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: actions } = trpc.trustSafety.getModerationActions.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );
  const { data: auditLog } = trpc.trustSafety.getAuditLog.useQuery(
    { limit: 100, severity: auditFilter },
    { enabled: !!user }
  );
  const { data: rateLimits } = trpc.trustSafety.getRateLimitStats.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 30000,
  });
  const { data: safetyStats } = trpc.trustSafety.getSafetyStats.useQuery();

  const toggleRule = trpc.trustSafety.toggleRule.useMutation({
    onSuccess: () => {
      toast.success("Rule updated");
      utils.trustSafety.getModerationRules.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const riskLevel = myScore?.riskLevel ?? "medium";
  const riskColor =
    riskLevel === "low"
      ? "text-green-400"
      : riskLevel === "medium"
      ? "text-yellow-400"
      : riskLevel === "high"
      ? "text-orange-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-900/30 rounded-xl">
          <Shield className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trust & Safety</h1>
          <p className="text-gray-400 text-sm">Moderation rules, audit logs, trust scores</p>
        </div>
      </div>

      {/* My Trust Score */}
      {user && myScore && (
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6 flex-wrap">
              <TrustScoreRing score={myScore.score} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-bold text-white">Your Trust Score</h2>
                  <Badge className={SEVERITY_COLORS[riskLevel] ?? ""}>
                    {riskLevel} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between bg-gray-800 rounded p-2">
                    <span className="text-gray-400">Account Age</span>
                    <span className="text-white">{myScore.breakdown?.accountAgeDays ?? 0} days</span>
                  </div>
                  <div className="flex justify-between bg-gray-800 rounded p-2">
                    <span className="text-gray-400">Posts</span>
                    <span className="text-white">{myScore.breakdown?.postCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between bg-gray-800 rounded p-2">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-white">{myScore.breakdown?.followersCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between bg-gray-800 rounded p-2">
                    <span className="text-gray-400">Reports</span>
                    <span className={myScore.breakdown?.reportCount > 0 ? "text-red-400" : "text-white"}>
                      {myScore.breakdown?.reportCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Stats */}
      {safetyStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {Math.round(safetyStats.trustScores.avgScore)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Avg Trust Score</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {safetyStats.trustScores.totalScored}
              </p>
              <p className="text-xs text-gray-400 mt-1">Scored Users</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">
                {safetyStats.trustScores.highRisk + safetyStats.trustScores.criticalRisk}
              </p>
              <p className="text-xs text-gray-400 mt-1">High/Critical Risk</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {safetyStats.moderationActions24h.reduce((sum: number, a: { count: number }) => sum + a.count, 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Actions (24h)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user && (
        <Tabs defaultValue="rules">
          <TabsList className="bg-gray-900 border border-gray-800 mb-6">
            <TabsTrigger value="rules" className="data-[state=active]:bg-red-600">
              <Shield className="w-4 h-4 mr-1" /> Rules
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-red-600">
              <Ban className="w-4 h-4 mr-1" /> Actions
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-red-600">
              <FileText className="w-4 h-4 mr-1" /> Audit Log
            </TabsTrigger>
            <TabsTrigger value="ratelimits" className="data-[state=active]:bg-red-600">
              <Zap className="w-4 h-4 mr-1" /> Rate Limits
            </TabsTrigger>
          </TabsList>

          {/* Rules Tab */}
          <TabsContent value="rules">
            <div className="space-y-3">
              {(rules?.rules ?? []).map((rule: { id: number; name: string; ruleType: string; pattern: string; action: string; severity: string; isActive: boolean; triggerCount: number; createdAt: number }) => (
                <Card key={rule.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-white">{rule.name}</span>
                          <Badge className={SEVERITY_COLORS[rule.severity] ?? ""}>
                            {rule.severity}
                          </Badge>
                          <Badge className={ACTION_COLORS[rule.action] ?? ""}>
                            {rule.action.replace(/_/g, " ")}
                          </Badge>
                          <Badge className="bg-gray-800 text-gray-400 text-xs capitalize">
                            {rule.ruleType}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{rule.pattern}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Triggered {rule.triggerCount} times
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {rule.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-600" />
                        )}
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) =>
                            toggleRule.mutate({ ruleId: rule.id, isActive: checked })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions">
            <div className="space-y-2">
              {(actions?.actions ?? []).length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No moderation actions yet</p>
                </div>
              ) : (
                (actions?.actions ?? []).map((action: { id: number; userId: number; userName: string; userUsername: string; actionType: string; reason: string; contentId: number | null; contentType: string | null; isActive: boolean; expiresAt: number | null; createdAt: number }) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800"
                  >
                    <div className={`p-2 rounded-lg ${ACTION_COLORS[action.actionType] ?? "bg-gray-800"}`}>
                      <Ban className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          @{action.userUsername}
                        </span>
                        <Badge className={ACTION_COLORS[action.actionType] ?? ""}>
                          {action.actionType.replace(/_/g, " ")}
                        </Badge>
                        {!action.isActive && (
                          <Badge className="bg-gray-800 text-gray-500">expired</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{action.reason}</p>
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">
                      {formatDistanceToNow(new Date(action.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <div className="flex gap-2 flex-wrap mb-4">
              {(["info", "warning", "error", "critical"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setAuditFilter(auditFilter === s ? undefined : s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                    auditFilter === s
                      ? "bg-red-600 text-white border-red-500"
                      : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {(auditLog?.events ?? []).length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No audit events yet</p>
                </div>
              ) : (
                (auditLog?.events ?? []).map((event: { id: number; actorId: number | null; actorName: string; actorType: string; action: string; targetId: number | null; targetType: string | null; details: Record<string, unknown>; ipAddress: string | null; severity: string; createdAt: number }) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800"
                  >
                    <Badge className={`${SEVERITY_COLORS[event.severity] ?? ""} shrink-0 mt-0.5`}>
                      {event.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-mono">
                        {event.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {event.actorName} ({event.actorType})
                        {event.targetType && ` → ${event.targetType} #${event.targetId}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Rate Limits Tab */}
          <TabsContent value="ratelimits">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">Blocked requests (last hour)</span>
                </div>
                <span className="text-lg font-bold text-red-400">
                  {rateLimits?.totalBlockedLastHour ?? 0}
                </span>
              </div>
              {(rateLimits?.byAction ?? []).map((item: { actionType: string; eventCount: number; totalRequests: number; blockedCount: number; uniqueUsers: number }) => (
                <Card key={item.actionType} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white capitalize">
                        {item.actionType.replace(/_/g, " ")}
                      </span>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-900/50 text-blue-300">
                          {item.totalRequests} req
                        </Badge>
                        {item.blockedCount > 0 && (
                          <Badge className="bg-red-900/50 text-red-300">
                            {item.blockedCount} blocked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Activity className="w-3 h-3" />
                      <span>{item.uniqueUsers} unique users · {item.eventCount} events</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min((item.blockedCount / Math.max(item.totalRequests, 1)) * 100, 100)}%`,
                          backgroundColor: item.blockedCount > 0 ? "#ef4444" : "#3b82f6",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(rateLimits?.byAction ?? []).length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No rate limit events in the last hour</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!user && (
        <div className="text-center py-16 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Sign in to access Trust & Safety dashboard</p>
        </div>
      )}
    </div>
  );
}
