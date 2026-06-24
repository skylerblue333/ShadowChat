import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Activity, RefreshCw, Eye, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const CHURN_DATA = [
  { day: "Mon", risk: 12, predicted: 8 },
  { day: "Tue", risk: 15, predicted: 11 },
  { day: "Wed", risk: 9, predicted: 7 },
  { day: "Thu", risk: 22, predicted: 18 },
  { day: "Fri", risk: 18, predicted: 15 },
  { day: "Sat", risk: 7, predicted: 6 },
  { day: "Sun", risk: 10, predicted: 9 },
];

const TREND_DATA = [
  { hour: "00", score: 45 },
  { hour: "04", score: 32 },
  { hour: "08", score: 78 },
  { hour: "12", score: 95 },
  { hour: "16", score: 88 },
  { hour: "20", score: 72 },
  { hour: "23", score: 61 },
];

const REVENUE_RISK = [
  { segment: "Premium", risk: "low", mrr: 48200, churnProb: 0.03, action: "Upsell to Enterprise" },
  { segment: "Creator", risk: "medium", mrr: 22100, churnProb: 0.12, action: "Engagement campaign" },
  { segment: "Free", risk: "high", mrr: 0, churnProb: 0.34, action: "Conversion push" },
  { segment: "Enterprise", risk: "low", mrr: 91000, churnProb: 0.01, action: "Expand seats" },
];

export default function PredictiveSystems() {
  const [activeModel, setActiveModel] = useState<"churn" | "trends" | "revenue">("churn");
  const { data: platformStats } = trpc.platform.stats.useQuery();

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <PageHeader
        backHref="/memory-system"
        icon={TrendingUp}
        title="Predictive Systems"
        subtitle="Phase 9 — Churn prediction, trend forecasting, revenue risk analysis"
      />

      {/* Model selector */}
      <div className="flex gap-2 mb-6">
        {(["churn", "trends", "revenue"] as const).map(model => (
          <button
            key={model}
            onClick={() => setActiveModel(model)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeModel === model ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
            }`}
          >
            {model === "churn" ? "Churn Prediction" : model === "trends" ? "Trend Forecasting" : "Revenue Risk"}
          </button>
        ))}
      </div>

      {/* Churn Prediction */}
      {activeModel === "churn" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "At-Risk Users", value: "247", change: "+12", bad: true, icon: Users },
              { label: "Predicted Churn", value: "3.2%", change: "-0.4%", bad: false, icon: TrendingDown },
              { label: "Saved This Week", value: "89", change: "+23", bad: false, icon: Zap },
              { label: "Model Accuracy", value: "94.1%", change: "+0.3%", bad: false, icon: Activity },
            ].map(stat => (
              <div key={stat.label} className="card p-4">
                <stat.icon className="w-5 h-5 text-muted-foreground mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className={`text-xs mt-1 font-medium ${stat.bad ? "text-red-400" : "text-green-400"}`}>{stat.change} vs last week</div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Daily Churn Risk vs Prediction</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={CHURN_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#ef444420" name="Actual Risk" />
                <Area type="monotone" dataKey="predicted" stroke="#3b82f6" fill="#3b82f620" name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Top Churn Signals</h3>
            <div className="space-y-3">
              {[
                { signal: "No login in 7+ days", weight: 0.89, users: 134 },
                { signal: "Subscription expiring in 3 days", weight: 0.76, users: 67 },
                { signal: "Zero posts in 14 days", weight: 0.71, users: 89 },
                { signal: "Failed payment attempt", weight: 0.94, users: 23 },
              ].map(s => (
                <div key={s.signal} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.signal}</span>
                      <span className="text-muted-foreground">{s.users} users</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.weight * 100}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Intervention triggered for ${s.users} users`)}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg hover:bg-primary/30 transition-colors shrink-0"
                  >
                    Intervene
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trend Forecasting */}
      {activeModel === "trends" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Trending Score by Hour (Next 24h Forecast)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Trend Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Predicted Rising Topics
              </h3>
              <div className="space-y-2">
                {["#SKY444Mining", "#TRUMPToken", "#DeFiYield", "#AIAgents", "#Web3Social"].map((tag, i) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-primary">{tag}</span>
                    <span className="text-xs text-green-400">+{(85 - i * 12)}% predicted</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                Predicted Declining Topics
              </h3>
              <div className="space-y-2">
                {["#NFTFlip", "#MetaverseLand", "#PlayToEarn", "#ICOSeason", "#DogeCoin"].map((tag, i) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{tag}</span>
                    <span className="text-xs text-red-400">-{(42 + i * 8)}% predicted</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Risk */}
      {activeModel === "revenue" && (
        <div className="space-y-4">
          {REVENUE_RISK.map(seg => (
            <div key={seg.segment} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">{seg.segment} Segment</div>
                  <div className="text-sm text-muted-foreground">MRR: ${seg.mrr.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    seg.risk === "low" ? "bg-green-500/20 text-green-400" :
                    seg.risk === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {seg.risk} risk
                  </span>
                  <button
                    onClick={() => toast.success(`Action triggered: ${seg.action}`)}
                    className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30 transition-colors"
                  >
                    {seg.action}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Churn probability:</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${seg.risk === "low" ? "bg-green-500" : seg.risk === "medium" ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${seg.churnProb * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{(seg.churnProb * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
