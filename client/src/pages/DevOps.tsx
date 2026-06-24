import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server, Database, Activity, Shield, GitBranch, Container,
  Cpu, Network, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Terminal, Layers, BarChart3, Zap, Globe, RefreshCw, Play,
  Settings, Eye, Download, Upload, Lock, Flame
} from "lucide-react";

const SERVICES = [
  { name: "api-gateway",       image: "python:3.11-slim", port: 8000, status: "running", cpu: 12, mem: 256, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  { name: "celery-worker",     image: "python:3.11-slim", port: null, status: "running", cpu: 45, mem: 512, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { name: "stream-processor",  image: "python:3.11-slim", port: null, status: "running", cpu: 8,  mem: 128, color: "text-purple-400",  bg: "bg-purple-600/10",  border: "border-purple-500/30" },
  { name: "frontend-dashboard",image: "node:20-slim",     port: 3000, status: "running", cpu: 5,  mem: 192, color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30" },
  { name: "partitioned-db",    image: "postgres:15",      port: 5432, status: "running", cpu: 18, mem: 768, color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  { name: "redis-broker",      image: "redis:alpine",     port: 6379, status: "running", cpu: 3,  mem: 64,  color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30" },
  { name: "kafka-event-bus",   image: "ubuntu/kafka",     port: 9092, status: "running", cpu: 22, mem: 1024,color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { name: "prometheus",        image: "prom/prometheus",  port: 9090, status: "running", cpu: 4,  mem: 128, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  { name: "grafana",           image: "grafana/grafana",  port: 3001, status: "running", cpu: 6,  mem: 256, color: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/30" },
];

const PROMQL_QUERIES = [
  { name: "API Throughput (req/s)", query: `sum(rate(http_requests_total{job="fastapi-gateway-metrics"}[5m]))`, value: "2,847 req/s" },
  { name: "ML Latency P99", query: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`, value: "142ms" },
  { name: "Active Workers", query: `sum(up{job="celery-inference-workers"})`, value: "8 workers" },
  { name: "Kafka Lag", query: `kafka_consumer_group_lag{group="telemetry-processing-group"}`, value: "0 msgs" },
  { name: "DB Connections", query: `pg_stat_activity_count{datname="enterprise_logistics"}`, value: "47 conn" },
  { name: "Redis Memory", query: `redis_memory_used_bytes / redis_memory_max_bytes * 100`, value: "34.2%" },
];

const ACQUISITION_CHECKLIST = [
  { category: "Technical", items: [
    { label: "All branches merged to main", done: true },
    { label: "Zero open TypeScript errors", done: true },
    { label: "Docker images tagged and pushed", done: true },
    { label: "Secrets sanitized from git history", done: true },
    { label: "API documentation generated", done: false },
    { label: "Architecture diagrams updated", done: false },
  ]},
  { category: "Legal & Financial", items: [
    { label: "IP assignment waivers signed", done: false },
    { label: "Stripe account transfer initiated", done: false },
    { label: "P&L statements audited", done: false },
    { label: "SOC 2 Type II in progress", done: true },
    { label: "Open source license audit", done: true },
    { label: "DocSend data room prepared", done: false },
  ]},
  { category: "Infrastructure", items: [
    { label: "AWS root credentials documented", done: false },
    { label: "Cloudflare DNS transferred", done: false },
    { label: "Domain registrar access granted", done: false },
    { label: "Kubernetes cluster access shared", done: true },
    { label: "Grafana dashboards exported", done: true },
    { label: "Backup restoration tested", done: true },
  ]},
];

const DOCKER_COMPOSE = `version: '3.8'
services:
  api-gateway:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["8000:8000"]
    environment:
      - REDIS_URL=redis://redis-broker:6379/0
      - DB_DSN=dbname=enterprise_logistics user=postgres host=partitioned-db
      - KAFKA_BROKER=kafka-event-bus:9092
    depends_on: [redis-broker, partitioned-db, kafka-event-bus]

  celery-worker:
    build: { context: ., dockerfile: Dockerfile }
    command: ["celery", "-A", "tasks", "worker", "--concurrency=4"]
    environment: [REDIS_URL=redis://redis-broker:6379/0]
    depends_on: [redis-broker]

  stream-processor:
    build: { context: ., dockerfile: Dockerfile }
    command: ["python", "consumer.py"]
    depends_on: [partitioned-db, kafka-event-bus]

  partitioned-db:
    image: postgres:15-alpine
    environment: [POSTGRES_DB=enterprise_logistics, POSTGRES_PASSWORD=secure_password]
    ports: ["5432:5432"]

  redis-broker:
    image: redis:alpine
    ports: ["6379:6379"]

  kafka-event-bus:
    image: ubuntu/kafka:latest
    ports: ["9092:9092"]

  prometheus:
    image: prom/prometheus:v2.45.0
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:10.0.0
    ports: ["3001:3000"]
    environment: [GF_SECURITY_ADMIN_PASSWORD=enterprise_secure_password]`;

export default function DevOps() {
  const [tab, setTab] = useState<"services"|"metrics"|"kafka"|"acquisition"|"compose">("services");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const totalCpu = SERVICES.reduce((a, s) => a + s.cpu, 0);
  const totalMem = SERVICES.reduce((a, s) => a + s.mem, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">DevOps Operations Hub</h1>
              <p className="text-xs text-slate-500 mt-0.5">Prometheus · Grafana · Kafka · Redis · Kubernetes · Docker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
              {SERVICES.filter(s => s.status === "running").length}/{SERVICES.length} SERVICES UP
            </Badge>
            <Button size="sm" variant="outline" onClick={handleRefresh} className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total CPU", value: `${totalCpu}%`, icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Total Memory", value: `${(totalMem/1024).toFixed(1)} GB`, icon: Database, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Uptime", value: "...", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Kafka Throughput", value: "847K msg/s", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border border-slate-800/60 p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-slate-500">{s.label}</span></div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1 w-fit mb-6 border border-slate-800/50 flex-wrap">
          {(["services","metrics","kafka","acquisition","compose"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab===t?"bg-emerald-600 text-white shadow-lg":"text-slate-400 hover:text-slate-200"}`}>
              {t==="services"?"🐳 Services":t==="metrics"?"📊 Prometheus":t==="kafka"?"⚡ Kafka":t==="acquisition"?"✅ M&A Checklist":"📄 Docker Compose"}
            </button>
          ))}
        </div>

        {/* SERVICES */}
        {tab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(svc => (
              <div key={svc.name} className={`rounded-2xl border p-4 ${svc.bg} ${svc.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`font-bold text-sm ${svc.color}`}>{svc.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{svc.image}</div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse" />
                    {svc.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950/40 rounded-lg p-2">
                    <div className={`text-sm font-bold ${svc.color}`}>{svc.cpu}%</div>
                    <div className="text-xs text-slate-600">CPU</div>
                  </div>
                  <div className="bg-slate-950/40 rounded-lg p-2">
                    <div className={`text-sm font-bold ${svc.color}`}>{svc.mem}MB</div>
                    <div className="text-xs text-slate-600">Memory</div>
                  </div>
                  <div className="bg-slate-950/40 rounded-lg p-2">
                    <div className={`text-sm font-bold ${svc.color}`}>{svc.port ?? "—"}</div>
                    <div className="text-xs text-slate-600">Port</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>CPU Load</span><span>{svc.cpu}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${svc.cpu > 70 ? "bg-rose-500" : svc.cpu > 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${svc.cpu}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROMETHEUS METRICS */}
        {tab === "metrics" && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-400" /> Live PromQL Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROMQL_QUERIES.map(q => (
                  <div key={q.name} className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{q.name}</span>
                      <span className="text-sm font-bold text-emerald-400">{q.value}</span>
                    </div>
                    <code className="text-xs text-slate-500 font-mono break-all">{q.query}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-400" /> Grafana Dashboard Access
              </h3>
              <p className="text-sm text-slate-400 mb-3">Grafana is running at port 3001. Connect to view historical verification logs, request drop-offs, and live system memory stability graphs for enterprise acquisition audits.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["API Throughput","ML Latency","Worker Health","Kafka Lag"].map(d => (
                  <div key={d} className="bg-slate-950/40 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">{d}</div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">Live</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KAFKA */}
        {tab === "kafka" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Messages/sec", value: "847,293", color: "text-orange-400", bg: "bg-orange-500/10" },
                { label: "Active Topics", value: "12", color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Consumer Groups", value: "4", color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Total Lag", value: "0 msgs", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              ].map(m => (
                <div key={m.label} className={`rounded-xl border border-slate-800/60 p-4 ${m.bg}`}>
                  <div className="text-xs text-slate-500 mb-2">{m.label}</div>
                  <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6">
              <h3 className="font-semibold text-white mb-4">Active Topics</h3>
              <div className="space-y-3">
                {[
                  { topic: "enterprise.telemetry.stream", partitions: 12, msgs: "2.4M", lag: 0 },
                  { topic: "social.feed.events", partitions: 6, msgs: "847K", lag: 0 },
                  { topic: "defi.transactions", partitions: 8, msgs: "156K", lag: 0 },
                  { topic: "ai.inference.results", partitions: 4, msgs: "89K", lag: 0 },
                  { topic: "notifications.push", partitions: 3, msgs: "1.2M", lag: 0 },
                ].map(t => (
                  <div key={t.topic} className="flex items-center justify-between py-3 border-b border-slate-800/40 last:border-0">
                    <div>
                      <div className="text-sm font-mono text-orange-400">{t.topic}</div>
                      <div className="text-xs text-slate-500">{t.partitions} partitions · {t.msgs} messages</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">Lag: {t.lag}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACQUISITION CHECKLIST */}
        {tab === "acquisition" && (
          <div className="space-y-6">
            <div className="bg-blue-950/20 border border-blue-800/30 rounded-2xl p-5 mb-2">
              <h3 className="font-semibold text-white mb-1">M&A Acquisition Readiness</h3>
              <p className="text-sm text-slate-400">Complete all items before initiating acquisition discussions. Target: $15M valuation at 10-15x ARR.</p>
            </div>
            {ACQUISITION_CHECKLIST.map(cat => (
              <div key={cat.category} className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-5">
                <h3 className="font-semibold text-white mb-4">{cat.category}</h3>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-800/30 last:border-0">
                      {item.done
                        ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        : <div className="h-4 w-4 rounded-full border-2 border-slate-600 shrink-0" />}
                      <span className={`text-sm ${item.done ? "text-slate-300" : "text-slate-500"}`}>{item.label}</span>
                      {item.done && <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-0 text-xs">Done</Badge>}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(cat.items.filter(i=>i.done).length/cat.items.length)*100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{cat.items.filter(i=>i.done).length}/{cat.items.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOCKER COMPOSE */}
        {tab === "compose" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">docker-compose.yml</h2>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Download className="h-3.5 w-3.5 mr-1.5" />Download
              </Button>
            </div>
            <div className="bg-[#0a0a0f] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
                <div className="w-3 h-3 rounded-full bg-rose-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-slate-500">docker-compose.yml — full-stack enterprise orchestration</span>
              </div>
              <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">{DOCKER_COMPOSE}</pre>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-2xl p-4">
              <h3 className="font-semibold text-white mb-2">Launch Command</h3>
              <code className="text-sm font-mono text-emerald-400">docker-compose up --build</code>
              <p className="text-xs text-slate-500 mt-2">Spins up all 9 services. Frontend at :3000, API at :8000, Grafana at :3001, Prometheus at :9090.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
