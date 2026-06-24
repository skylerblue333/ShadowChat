/**
 * DataLake — Phase 10 Data Economy
 * Platform-wide data ingestion, storage, and analytics pipeline
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Database, Activity, Layers, TrendingUp, Clock, Server, Zap, BarChart2, Globe } from "lucide-react";

const DATA_STREAMS = [
  { name: "Social Events", rate: "2.4K/min", volume: "1.2TB", status: "live", color: "text-blue-400" },
  { name: "Transaction Logs", rate: "840/min", volume: "340GB", status: "live", color: "text-green-400" },
  { name: "AI Inference Logs", rate: "1.1K/min", volume: "890GB", status: "live", color: "text-purple-400" },
  { name: "Stream Metrics", rate: "320/min", volume: "2.1TB", status: "live", color: "text-pink-400" },
  { name: "Wallet Events", rate: "560/min", volume: "180GB", status: "live", color: "text-yellow-400" },
  { name: "Moderation Queue", rate: "120/min", volume: "45GB", status: "processing", color: "text-orange-400" },
];

const PIPELINE_STAGES = [
  { name: "Ingestion", desc: "Raw event capture", throughput: "8.5K events/s", icon: Activity },
  { name: "Processing", desc: "ETL + enrichment", throughput: "7.2K events/s", icon: Zap },
  { name: "Storage", desc: "Columnar + object store", throughput: "6.8K events/s", icon: Database },
  { name: "Indexing", desc: "Search + analytics index", throughput: "6.1K events/s", icon: Layers },
  { name: "Serving", desc: "Query + API layer", throughput: "5.9K events/s", icon: Server },
];

export default function DataLake() {
  const [activeTab, setActiveTab] = useState<"streams" | "pipeline" | "catalog">("streams");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg">Data Lake</h1>
          <p className="text-xs text-muted-foreground">Platform-wide data infrastructure</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          8.5K events/s
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Data", value: "4.8 TB", icon: Database, color: "text-blue-400" },
            { label: "Daily Ingest", value: "120 GB", icon: TrendingUp, color: "text-green-400" },
            { label: "Query Latency", value: "12ms", icon: Clock, color: "text-purple-400" },
          ].map(stat => (
            <div key={stat.label} className="card p-3 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <div className="font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["streams", "pipeline", "catalog"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "streams" && (
          <div className="space-y-3">
            {DATA_STREAMS.map(stream => (
              <div key={stream.name} className="card p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{stream.name}</div>
                  <div className="text-xs text-muted-foreground">{stream.volume} stored</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${stream.color}`}>{stream.rate}</div>
                  <div className="text-xs text-muted-foreground capitalize">{stream.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.name} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stage.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{i + 1}. {stage.name}</div>
                    <div className="text-xs text-muted-foreground">{stage.desc}</div>
                  </div>
                  <div className="ml-auto text-xs font-medium text-green-400">{stage.throughput}</div>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className="ml-4 w-0.5 h-3 bg-border" />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "catalog" && (
          <div className="space-y-3">
            {[
              { table: "events", rows: "2.4B", size: "1.2TB", desc: "All platform events" },
              { table: "transactions", rows: "84M", size: "340GB", desc: "Wallet transactions" },
              { table: "messages", rows: "1.1B", size: "890GB", desc: "Chat messages (encrypted)" },
              { table: "user_signals", rows: "560M", size: "280GB", desc: "Behavioral signals" },
              { table: "ai_logs", rows: "220M", size: "180GB", desc: "AI inference records" },
              { table: "stream_metrics", rows: "45M", size: "45GB", desc: "Streaming analytics" },
            ].map(table => (
              <div key={table.table} className="card p-4 flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="font-mono text-sm font-medium">{table.table}</div>
                  <div className="text-xs text-muted-foreground">{table.desc}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium">{table.rows} rows</div>
                  <div className="text-muted-foreground">{table.size}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
