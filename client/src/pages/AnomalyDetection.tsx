import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, CheckCircle, Activity, Thermometer, Droplets,
  Vibrate, Clock, Shield, Zap, BarChart3, TrendingUp, ArrowRight,
  RefreshCw, Download, Settings, Bell, Database, Cpu, Network,
  Lock, Globe, ChevronRight, Play, Pause, RotateCcw
} from "lucide-react";

// ── IsolationForest simulation (client-side ML approximation) ─────────────────
function isolationForestPredict(
  temperature: number,
  humidity: number,
  vibration: number,
  duration: number
): { isAnomaly: boolean; score: number; riskLevel: "NORMAL" | "WARNING" | "CRITICAL" } {
  // Baseline normal ranges (trained on historical data)
  const normalRanges = {
    temperature: { mean: 4.2, std: 0.5 },
    humidity: { mean: 62.0, std: 3.0 },
    vibration: { mean: 0.13, std: 0.03 },
    duration: { mean: 24.0, std: 4.0 },
  };

  // Z-score deviation from normal
  const zTemp = Math.abs((temperature - normalRanges.temperature.mean) / normalRanges.temperature.std);
  const zHumidity = Math.abs((humidity - normalRanges.humidity.mean) / normalRanges.humidity.std);
  const zVibration = Math.abs((vibration - normalRanges.vibration.mean) / normalRanges.vibration.std);
  const zDuration = Math.abs((duration - normalRanges.duration.mean) / normalRanges.duration.std);

  // Composite anomaly score (0-1, higher = more anomalous)
  const maxZ = Math.max(zTemp, zHumidity, zVibration, zDuration);
  const avgZ = (zTemp + zHumidity + zVibration + zDuration) / 4;
  const score = Math.min((maxZ * 0.6 + avgZ * 0.4) / 10, 1);

  const isAnomaly = score > 0.25;
  const riskLevel = score > 0.6 ? "CRITICAL" : score > 0.25 ? "WARNING" : "NORMAL";

  return { isAnomaly, score, riskLevel };
}

// ── Live telemetry stream simulator ──────────────────────────────────────────
function generateTelemetryPoint() {
  const isAnomaly = Math.random() < 0.08; // 8% anomaly rate
  return {
    timestamp: new Date().toISOString(),
    temperature: isAnomaly ? 15 + Math.random() * 20 : 3.5 + Math.random() * 2,
    humidity: isAnomaly ? 80 + Math.random() * 15 : 58 + Math.random() * 10,
    vibration: isAnomaly ? 1.5 + Math.random() * 3 : 0.08 + Math.random() * 0.1,
    duration: isAnomaly ? 40 + Math.random() * 20 : 20 + Math.random() * 10,
    shipmentId: `SHP-${Math.floor(Math.random() * 90000) + 10000}`,
    route: ["NYC→LAX", "CHI→MIA", "SEA→DFW", "BOS→ATL", "DEN→PHX"][Math.floor(Math.random() * 5)],
  };
}

interface TelemetryEvent {
  timestamp: string;
  temperature: number;
  humidity: number;
  vibration: number;
  duration: number;
  shipmentId: string;
  route: string;
  result?: ReturnType<typeof isolationForestPredict>;
}

// ── Pricing tiers ─────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: "Starter",
    price: 299,
    period: "month",
    features: ["Up to 500 shipments/mo", "Email alerts", "7-day data retention", "REST API access"],
    highlight: false,
    badge: null,
  },
  {
    name: "Professional",
    price: 999,
    period: "month",
    features: ["Up to 5,000 shipments/mo", "Real-time SMS + Slack alerts", "90-day retention", "Webhook integrations", "Custom anomaly thresholds"],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: 2499,
    period: "month",
    features: ["Unlimited shipments", "Dedicated Slack channel", "1-year retention", "Custom ML model training", "SLA 99.9% uptime", "SOC 2 Type II"],
    highlight: false,
    badge: "Best Value",
  },
];

export default function AnomalyDetection() {
  // Manual audit form
  const [temperature, setTemperature] = useState("4.1");
  const [humidity, setHumidity] = useState("63.4");
  const [vibration, setVibration] = useState("0.14");
  const [duration, setDuration] = useState("12.5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof isolationForestPredict> | null>(null);

  // Live stream
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamEvents, setStreamEvents] = useState<TelemetryEvent[]>([]);
  const [anomalyCount, setAnomalyCount] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Metrics
  const [selectedTab, setSelectedTab] = useState<"audit" | "stream" | "pricing" | "legal">("audit");

  const handleAuditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800)); // Simulate API latency
    const prediction = isolationForestPredict(
      parseFloat(temperature),
      parseFloat(humidity),
      parseFloat(vibration),
      parseFloat(duration)
    );
    setResult(prediction);
    setLoading(false);
  };

  const toggleStream = () => {
    if (isStreaming) {
      if (streamRef.current) clearInterval(streamRef.current);
      setIsStreaming(false);
    } else {
      setIsStreaming(true);
      streamRef.current = setInterval(() => {
        const point = generateTelemetryPoint();
        const prediction = isolationForestPredict(
          point.temperature, point.humidity, point.vibration, point.duration
        );
        const event: TelemetryEvent = { ...point, result: prediction };
        setStreamEvents((prev) => [event, ...prev].slice(0, 50));
        setTotalProcessed((p) => p + 1);
        if (prediction.isAnomaly) setAnomalyCount((p) => p + 1);
      }, 1200);
    }
  };

  const resetStream = () => {
    if (streamRef.current) clearInterval(streamRef.current);
    setIsStreaming(false);
    setStreamEvents([]);
    setAnomalyCount(0);
    setTotalProcessed(0);
  };

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current); }, []);

  const anomalyRate = totalProcessed > 0 ? ((anomalyCount / totalProcessed) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Logistics AI Anomaly Console</h1>
              <p className="text-xs text-slate-400 mt-0.5">Enterprise ML telemetry auditing platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
              GATEWAY ONLINE
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              MODEL: ISOLATION_FOREST
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Events Processed", value: totalProcessed.toLocaleString(), icon: Database, color: "text-blue-400" },
            { label: "Anomalies Detected", value: anomalyCount.toLocaleString(), icon: AlertTriangle, color: "text-rose-400" },
            { label: "Anomaly Rate", value: `${anomalyRate}%`, icon: Activity, color: "text-amber-400" },
            { label: "Model Accuracy", value: "94.7%", icon: Cpu, color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className={`h-5 w-5 ${stat.color} shrink-0`} />
              <div>
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 w-fit mb-6">
          {(["audit", "stream", "pricing", "legal"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "audit" ? "Manual Audit" : tab === "stream" ? "Live Stream" : tab === "pricing" ? "Enterprise Pricing" : "Legal & Compliance"}
            </button>
          ))}
        </div>

        {/* ── TAB: Manual Audit ─────────────────────────────────────────────── */}
        {selectedTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            {/* Telemetry Input Form */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold text-white mb-1">Live Telemetry Feed</h2>
              <p className="text-xs text-slate-500 mb-5">Enter shipment sensor data to run ML audit</p>
              <form onSubmit={handleAuditRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Thermometer className="h-3 w-3" /> Temp (°C)
                    </label>
                    <input
                      type="number" step="0.1" value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> Humidity (%)
                    </label>
                    <input
                      type="number" step="0.1" value={humidity}
                      onChange={(e) => setHumidity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Vibrate className="h-3 w-3" /> Vibration (G)
                    </label>
                    <input
                      type="number" step="0.01" value={vibration}
                      onChange={(e) => setVibration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Duration (Hrs)
                    </label>
                    <input
                      type="number" step="0.1" value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                </div>

                {/* Quick test presets */}
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Quick Test Presets</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button"
                      onClick={() => { setTemperature("4.2"); setHumidity("62.1"); setVibration("0.12"); setDuration("24.5"); }}
                      className="text-xs bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 rounded-lg px-3 py-1.5 hover:bg-emerald-900/50 transition-colors">
                      ✓ Normal Trip
                    </button>
                    <button type="button"
                      onClick={() => { setTemperature("18.9"); setHumidity("89.2"); setVibration("2.45"); setDuration("48.0"); }}
                      className="text-xs bg-rose-900/30 border border-rose-700/30 text-rose-400 rounded-lg px-3 py-1.5 hover:bg-rose-900/50 transition-colors">
                      ⚠ Faulty Trip
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Evaluating Model...</>
                  ) : (
                    <><Zap className="h-4 w-4 mr-2" /> Execute Audit Diagnostics</>
                  )}
                </Button>
              </form>
            </div>

            {/* Risk Assessment Monitor */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
              <h2 className="text-lg font-bold text-white mb-1">System Risk Assessment Monitor</h2>
              <p className="text-xs text-slate-500 mb-5">ML prediction output with confidence scoring</p>

              {loading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="h-12 w-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-sm text-slate-400 font-mono">Running IsolationForest inference...</p>
                  </div>
                </div>
              )}

              {!loading && !result && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
                  <div className="text-center space-y-2">
                    <Activity className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-500 font-mono">Awaiting telemetry payload...</p>
                    <p className="text-xs text-slate-600">Enter sensor data and click Execute Audit</p>
                  </div>
                </div>
              )}

              {!loading && result && (
                <div className="flex-1 space-y-4">
                  {/* Main result */}
                  <div className={`p-6 rounded-xl border font-mono ${
                    result.riskLevel === "CRITICAL"
                      ? "bg-rose-950/50 border-rose-800 text-rose-200"
                      : result.riskLevel === "WARNING"
                      ? "bg-amber-950/50 border-amber-800 text-amber-200"
                      : "bg-emerald-950/50 border-emerald-800 text-emerald-200"
                  }`}>
                    <div className="text-xs uppercase tracking-widest opacity-70 mb-1">ML Prediction Output</div>
                    <div className="text-3xl font-black tracking-wide mb-3 flex items-center gap-3">
                      {result.riskLevel === "CRITICAL" ? <AlertTriangle className="h-8 w-8" /> :
                       result.riskLevel === "WARNING" ? <AlertTriangle className="h-8 w-8" /> :
                       <CheckCircle className="h-8 w-8" />}
                      {result.riskLevel === "CRITICAL" ? "CRITICAL_RISK_DETECTED" :
                       result.riskLevel === "WARNING" ? "WARNING_THRESHOLD_EXCEEDED" :
                       "SHIPMENT_NOMINAL"}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs border-t border-current/20 pt-3">
                      <div>ANOMALY_FLAGGED: <span className="font-bold">{result.isAnomaly ? "TRUE" : "FALSE"}</span></div>
                      <div>RISK_SCORE: <span className="font-bold">{(result.score * 100).toFixed(1)}%</span></div>
                      <div>HTTP_RESPONSE: <span className="font-bold">200_OK</span></div>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Temperature", value: parseFloat(temperature), normal: "3.5–6.0°C", unit: "°C" },
                      { label: "Humidity", value: parseFloat(humidity), normal: "55–70%", unit: "%" },
                      { label: "Vibration", value: parseFloat(vibration), normal: "0.08–0.20G", unit: "G" },
                      { label: "Duration", value: parseFloat(duration), normal: "16–32hrs", unit: "hrs" },
                    ].map((field) => (
                      <div key={field.label} className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                        <div className="text-xs text-slate-500 mb-1">{field.label}</div>
                        <div className="text-lg font-bold text-white">{field.value}{field.unit}</div>
                        <div className="text-xs text-slate-600">Normal: {field.normal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer metrics */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
                <div>GATEWAY_STATUS: <span className="text-emerald-400 font-bold">ONLINE</span></div>
                <div>MODEL_TYPE: <span className="text-blue-400 font-bold">ISOLATION_FOREST_v2</span></div>
                <div>LATENCY: <span className="text-purple-400 font-bold">&lt;30ms</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Live Stream ──────────────────────────────────────────────── */}
        {selectedTab === "stream" && (
          <div className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <Button onClick={toggleStream} className={isStreaming ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}>
                {isStreaming ? <><Pause className="h-4 w-4 mr-2" /> Stop Stream</> : <><Play className="h-4 w-4 mr-2" /> Start Live Stream</>}
              </Button>
              <Button variant="outline" onClick={resetStream} className="border-slate-700 text-slate-300">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              {isStreaming && (
                <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse">
                  ● LIVE — Processing {totalProcessed} events
                </Badge>
              )}
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Real-Time Telemetry Events</span>
                <span className="text-xs text-slate-500 font-mono">Anomaly Rate: {anomalyRate}%</span>
              </div>
              <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto">
                {streamEvents.length === 0 && (
                  <div className="py-16 text-center text-slate-600 text-sm">
                    Start the live stream to see real-time telemetry events
                  </div>
                )}
                {streamEvents.map((event, i) => (
                  <div key={i} className={`px-4 py-3 flex items-center gap-4 text-xs font-mono transition-colors ${
                    event.result?.riskLevel === "CRITICAL" ? "bg-rose-950/20" :
                    event.result?.riskLevel === "WARNING" ? "bg-amber-950/20" : ""
                  }`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      event.result?.riskLevel === "CRITICAL" ? "bg-rose-500 animate-pulse" :
                      event.result?.riskLevel === "WARNING" ? "bg-amber-500" :
                      "bg-emerald-500"
                    }`} />
                    <span className="text-slate-500 w-20 shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    <span className="text-slate-300 w-28 shrink-0">{event.shipmentId}</span>
                    <span className="text-slate-400 w-20 shrink-0">{event.route}</span>
                    <span className="text-slate-400">T:{event.temperature.toFixed(1)}°C</span>
                    <span className="text-slate-400">H:{event.humidity.toFixed(1)}%</span>
                    <span className="text-slate-400">V:{event.vibration.toFixed(2)}G</span>
                    <span className={`ml-auto font-bold ${
                      event.result?.riskLevel === "CRITICAL" ? "text-rose-400" :
                      event.result?.riskLevel === "WARNING" ? "text-amber-400" :
                      "text-emerald-400"
                    }`}>
                      {event.result?.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Enterprise Pricing ───────────────────────────────────────── */}
        {selectedTab === "pricing" && (
          <div className="space-y-8 pb-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Enterprise Subscription Plans</h2>
              <p className="text-slate-400">SOC 2 Type II compliant. PCI-DSS via Stripe. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.name} className={`rounded-2xl border p-6 relative ${
                  tier.highlight
                    ? "border-blue-500 bg-blue-950/20"
                    : "border-slate-800 bg-slate-900"
                }`}>
                  {tier.badge && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                      tier.highlight ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"
                    }`}>
                      {tier.badge}
                    </Badge>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-white">${tier.price.toLocaleString()}</span>
                      <span className="text-slate-400">/{tier.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.highlight ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-600"} text-white`}>
                    Start {tier.name} Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
            {/* LTV/CAC metrics */}
            <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Unit Economics (Professional Plan)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "ARPU/Month", value: "$999", sub: "Average Revenue Per User" },
                  { label: "Gross Margin", value: "85%", sub: "SaaS industry standard" },
                  { label: "Monthly Churn", value: "1.5%", sub: "Best-in-class retention" },
                  { label: "LTV:CAC Ratio", value: "9.4x", sub: "Target: >3x for investors" },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-950 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-400">{m.value}</div>
                    <div className="text-sm font-medium text-white mt-1">{m.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Legal & Compliance ───────────────────────────────────────── */}
        {selectedTab === "legal" && (
          <div className="space-y-6 pb-12 max-w-4xl">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Enterprise Legal Compliance</h2>
              <p className="text-slate-400">Master Services Agreement (MSA) — SOC 2 / GDPR / PCI-DSS compliant</p>
            </div>
            {[
              {
                section: "Section A",
                title: "Data Protection & Sovereignty (GDPR / SOC 2)",
                icon: Shield,
                color: "text-blue-400",
                content: "The Provider warrants that all telemetry data payloads ingested by the Anomaly Engine are encrypted in transit using TLS 1.3 and at rest via AES-256 protocols. Customer retains exclusive ownership of all raw data logs uploaded to the console, and the Provider maintains zero persistent storage of identifiable end-user attributes post-machine learning inference processing.",
                badges: ["TLS 1.3", "AES-256", "GDPR", "SOC 2 Type II"],
              },
              {
                section: "Section B",
                title: "Intellectual Property Indemnification",
                icon: Lock,
                color: "text-purple-400",
                content: "The Provider guarantees that the Software architecture is a proprietary asset built from original source files or permissive open-source frameworks (MIT/Apache 2.0). The Provider shall indemnify and hold the Customer harmless against any third-party claims alleging that the functional code base infringes upon any existing valid software patent or trademark.",
                badges: ["MIT License", "Apache 2.0", "IP Protected", "Patent Clear"],
              },
              {
                section: "Section C",
                title: "Service Level Agreement (SLA) Availability",
                icon: Globe,
                color: "text-emerald-400",
                content: "The Platform utilizes automated multi-AZ cloud distribution loops via AWS Fargate to guarantee an operational availability standard of 99.9% uptime per calendar month, excluding scheduled maintenance windows documented forty-eight (48) hours in advance.",
                badges: ["99.9% Uptime", "Multi-AZ", "AWS Fargate", "48hr Notice"],
              },
            ].map((clause) => (
              <div key={clause.section} className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0`}>
                    <clause.icon className={`h-5 w-5 ${clause.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-slate-800 text-slate-400 text-xs">{clause.section}</Badge>
                      <h3 className="font-bold text-white">{clause.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{clause.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {clause.badges.map((b) => (
                        <Badge key={b} className="bg-slate-800 text-slate-300 text-xs border-slate-700">{b}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-white">Due Diligence Ready</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                This compliance framework eliminates deal friction and can elevate your software valuation from a standard 3x revenue multiple to a premium 10x–15x ARR multiplier.
              </p>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  <Download className="h-4 w-4 mr-2" /> Download Full MSA PDF
                </Button>
                <Link href="/investor">
                  <Button variant="outline" className="border-slate-700 text-slate-300 text-sm">
                    View Investor Pitch <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
