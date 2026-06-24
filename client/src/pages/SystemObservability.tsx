import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Network,
  Wifi,
  BarChart3,
  DollarSign,
  Brain,
  Thermometer,
  AlertCircle,
  Play,
  Pause,
  Trash2,
  Download,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simulated live event types
type EventLevel = "info" | "warn" | "error" | "debug";
interface LiveEvent {
  id: string;
  ts: number;
  type: string;
  level: EventLevel;
  msg: string;
  meta?: Record<string, string | number>;
}

const EVENT_TEMPLATES: Omit<LiveEvent, "id" | "ts">[] = [
  { type: "action", level: "info", msg: "PAYMENT executed: $18.00 → user_7x2", meta: { amount: 18, user: "user_7x2" } },
  { type: "api", level: "info", msg: "POST /api/trpc/social.createPost — 142ms", meta: { latency: 142 } },
  { type: "ws", level: "info", msg: "WebSocket connected: user_3k9 (session #4421)", meta: { session: 4421 } },
  { type: "feed", level: "debug", msg: "Feed ranked: 24 posts → user_5m1 (signals: 12)", meta: { posts: 24 } },
  { type: "wallet", level: "info", msg: "SKY444 transfer: 200 tokens credited", meta: { amount: 200 } },
  { type: "ai", level: "info", msg: "AI decision: feed_rank for user_8p3 — 38ms", meta: { latency: 38 } },
  { type: "error", level: "error", msg: "DB timeout on wallet.getBalance — retrying", meta: {} },
  { type: "auth", level: "info", msg: "OAuth session created: user_2q7", meta: {} },
  { type: "rate", level: "warn", msg: "Rate limit hit: user_9m1 (chat: 60/min)", meta: {} },
  { type: "sim", level: "debug", msg: "Simulation tick #1247 — 3 entities updated", meta: { tick: 1247 } },
];

function genEvent(): LiveEvent {
  const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  return { ...tpl, id: Math.random().toString(36).slice(2), ts: Date.now() };
}

const LATENCY_DATA = [
  { endpoint: "/api/trpc/social.getFeed", p50: 42, p95: 118, p99: 287, calls: 8420 },
  { endpoint: "/api/trpc/wallet.getBalance", p50: 18, p95: 54, p99: 121, calls: 3210 },
  { endpoint: "/api/trpc/ai.chat", p50: 380, p95: 1240, p99: 2800, calls: 1890 },
  { endpoint: "/api/trpc/auth.me", p50: 8, p95: 22, p99: 48, calls: 12400 },
  { endpoint: "/api/trpc/marketplace.list", p50: 65, p95: 182, p99: 410, calls: 2100 },
  { endpoint: "/api/trpc/dating.getMatches", p50: 55, p95: 148, p99: 320, calls: 980 },
];

const ERROR_TIMELINE = [
  { time: "11:14:02", type: "DB_TIMEOUT", msg: "wallet.getBalance timeout after 5000ms", resolved: true },
  { time: "11:09:44", type: "RATE_LIMIT", msg: "user_9m1 exceeded chat rate limit", resolved: true },
  { time: "10:58:17", type: "AI_FAIL", msg: "invokeLLM returned 503 — fallback used", resolved: true },
  { time: "10:41:33", type: "WS_DROP", msg: "WebSocket dropped: user_4k2 (network)", resolved: true },
  { time: "09:22:09", type: "PAYMENT_ERR", msg: "Escrow release failed — manual review", resolved: false },
];

const levelColor: Record<EventLevel, string> = {
  info: "text-[oklch(0.8_0.15_200)]",
  warn: "text-[oklch(0.85_0.18_90)]",
  error: "text-[oklch(0.7_0.2_25)]",
  debug: "text-white/30",
};

const levelBg: Record<EventLevel, string> = {
  info: "bg-[oklch(0.8_0.15_200)]/10 border-[oklch(0.8_0.15_200)]/20",
  warn: "bg-[oklch(0.85_0.18_90)]/10 border-[oklch(0.85_0.18_90)]/20",
  error: "bg-[oklch(0.7_0.2_25)]/10 border-[oklch(0.7_0.2_25)]/20",
  debug: "bg-white/5 border-white/10",
};

export default function SystemObservability() {
  const [events, setEvents] = useState<LiveEvent[]>(() => Array.from({ length: 12 }, genEvent));
  const [running, setRunning] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setEvents((prev) => {
        const next = [genEvent(), ...prev].slice(0, 80);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [running]);

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter || e.level === filter);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[oklch(0.1_0.03_270)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[oklch(0.8_0.15_200)]" />
            <div>
              <h1 className="text-lg font-bold">System Observability</h1>
              <p className="text-xs text-white/40">Live event stream · API tracer · WebSocket monitor · Feed inspector</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-white/20 text-white/60 hover:text-white"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {running ? "Pause" : "Resume"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-white/20 text-white/60 hover:text-white"
              onClick={() => setEvents([])}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button size="sm" variant="outline" className="text-xs border-white/20 text-white/60 hover:text-white">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="events">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="events" className="text-xs data-[state=active]:bg-white/10">
              <Activity className="w-3 h-3 mr-1" /> Event Stream
            </TabsTrigger>
            <TabsTrigger value="api" className="text-xs data-[state=active]:bg-white/10">
              <Network className="w-3 h-3 mr-1" /> API Tracer
            </TabsTrigger>
            <TabsTrigger value="ws" className="text-xs data-[state=active]:bg-white/10">
              <Wifi className="w-3 h-3 mr-1" /> WebSocket
            </TabsTrigger>
            <TabsTrigger value="latency" className="text-xs data-[state=active]:bg-white/10">
              <Thermometer className="w-3 h-3 mr-1" /> Latency Heatmap
            </TabsTrigger>
            <TabsTrigger value="errors" className="text-xs data-[state=active]:bg-white/10">
              <AlertCircle className="w-3 h-3 mr-1" /> Error Timeline
            </TabsTrigger>
          </TabsList>

          {/* Event Stream */}
          <TabsContent value="events">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">Filter:</span>
              {["all", "action", "api", "ws", "feed", "wallet", "ai", "error", "warn"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    filter === f
                      ? "bg-white/20 border-white/30 text-white"
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1">
                {running && <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.2_145)] animate-pulse" />}
                <span className="text-xs text-white/30">{filtered.length} events</span>
              </div>
            </div>
            <Card className="bg-[oklch(0.06_0.02_270)] border-white/10">
              <CardContent className="p-0">
                <div className="font-mono text-xs max-h-[500px] overflow-y-auto">
                  {filtered.map((ev) => (
                    <div
                      key={ev.id}
                      className={`flex items-start gap-3 px-4 py-2 border-b border-white/5 last:border-0 ${levelBg[ev.level]}`}
                    >
                      <span className="text-white/25 shrink-0 w-20">
                        {new Date(ev.ts).toLocaleTimeString()}
                      </span>
                      <span className={`uppercase shrink-0 w-14 font-bold ${levelColor[ev.level]}`}>
                        [{ev.type}]
                      </span>
                      <span className="text-white/70 flex-1">{ev.msg}</span>
                      <Badge variant="outline" className={`text-[9px] shrink-0 ${levelColor[ev.level]} border-current/30`}>
                        {ev.level}
                      </Badge>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tracer */}
          <TabsContent value="api">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">API Request Tracer — Last 1 Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { method: "POST", path: "/api/trpc/social.createPost", status: 200, ms: 142, user: "user_7x2" },
                    { method: "GET", path: "/api/trpc/social.getFeed", status: 200, ms: 38, user: "user_3k9" },
                    { method: "POST", path: "/api/trpc/wallet.transfer", status: 200, ms: 88, user: "user_5m1" },
                    { method: "POST", path: "/api/trpc/ai.chat", status: 200, ms: 1240, user: "user_8p3" },
                    { method: "GET", path: "/api/trpc/dating.getMatches", status: 200, ms: 55, user: "user_2q7" },
                    { method: "POST", path: "/api/trpc/marketplace.buy", status: 200, ms: 204, user: "user_4k2" },
                    { method: "GET", path: "/api/trpc/auth.me", status: 401, ms: 8, user: "anon" },
                    { method: "POST", path: "/api/trpc/wallet.getBalance", status: 500, ms: 5001, user: "user_9m1" },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 font-mono text-xs">
                      <Badge
                        variant="outline"
                        className={`text-[9px] w-10 justify-center ${req.method === "GET" ? "text-[oklch(0.8_0.15_200)] border-[oklch(0.8_0.15_200)]/30" : "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30"}`}
                      >
                        {req.method}
                      </Badge>
                      <span className="text-white/70 flex-1 truncate">{req.path}</span>
                      <span className={`w-8 text-right ${req.status >= 400 ? "text-[oklch(0.7_0.2_25)]" : "text-[oklch(0.75_0.2_145)]"}`}>
                        {req.status}
                      </span>
                      <span className={`w-16 text-right ${req.ms > 1000 ? "text-[oklch(0.85_0.18_90)]" : "text-white/40"}`}>
                        {req.ms}ms
                      </span>
                      <span className="text-white/25 w-20 text-right">{req.user}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WebSocket Monitor */}
          <TabsContent value="ws">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { label: "Active Connections", value: "847", color: "cyan" },
                { label: "Messages/sec", value: "124", color: "green" },
                { label: "Avg Latency", value: "12ms", color: "purple" },
              ].map((stat) => (
                <Card key={stat.label} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">Active WebSocket Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 8 }, (_, i) => ({
                    id: `session_${1000 + i * 137}`,
                    user: `user_${(i * 7 + 3).toString(16)}x${i + 1}`,
                    room: ["feed", "chat", "dating", "notifications", "trading"][i % 5],
                    msgs: Math.floor(Math.random() * 200) + 10,
                    latency: Math.floor(Math.random() * 30) + 5,
                    connected: `${Math.floor(Math.random() * 45) + 1}m ago`,
                  })).map((sess) => (
                    <div key={sess.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.2_145)] animate-pulse shrink-0" />
                      <span className="text-white/60 font-mono w-28">{sess.id}</span>
                      <span className="text-white/70 flex-1">{sess.user}</span>
                      <Badge variant="outline" className="text-[9px] text-[oklch(0.8_0.15_200)] border-[oklch(0.8_0.15_200)]/30">
                        {sess.room}
                      </Badge>
                      <span className="text-white/40 w-16 text-right">{sess.msgs} msgs</span>
                      <span className="text-white/40 w-12 text-right">{sess.latency}ms</span>
                      <span className="text-white/25 w-20 text-right">{sess.connected}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Latency Heatmap */}
          <TabsContent value="latency">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">Endpoint Latency Heatmap (p50 / p95 / p99)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LATENCY_DATA.map((row) => (
                    <div key={row.endpoint} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-mono truncate flex-1">{row.endpoint}</span>
                        <span className="text-white/30 ml-4">{row.calls.toLocaleString()} calls</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { label: "p50", value: row.p50, max: 500 },
                          { label: "p95", value: row.p95, max: 2000 },
                          { label: "p99", value: row.p99, max: 3000 },
                        ].map((p) => {
                          const pct = Math.min((p.value / p.max) * 100, 100);
                          const color = p.value < 100 ? "bg-[oklch(0.75_0.2_145)]" : p.value < 500 ? "bg-[oklch(0.85_0.18_90)]" : "bg-[oklch(0.7_0.2_25)]";
                          return (
                            <div key={p.label} className="flex-1">
                              <div className="flex justify-between text-[10px] text-white/40 mb-0.5">
                                <span>{p.label}</span>
                                <span>{p.value}ms</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Timeline */}
          <TabsContent value="errors">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">Error + Crash Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ERROR_TIMELINE.map((err, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      {err.resolved ? (
                        <CheckCircle className="w-4 h-4 text-[oklch(0.75_0.2_145)] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[oklch(0.7_0.2_25)] shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[9px] text-[oklch(0.85_0.18_90)] border-[oklch(0.85_0.18_90)]/30">
                            {err.type}
                          </Badge>
                          <span className="text-xs text-white/30 font-mono">{err.time}</span>
                        </div>
                        <p className="text-xs text-white/70">{err.msg}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] shrink-0 ${err.resolved ? "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30" : "text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/30"}`}
                      >
                        {err.resolved ? "RESOLVED" : "OPEN"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
