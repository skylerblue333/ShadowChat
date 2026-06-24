import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, Minus, MessageSquare, Bell, BarChart3, Zap, Globe, RefreshCw } from "lucide-react";

const FEEDS = [
  { source: "Reddit r/crypto",   sentiment: 0.72, volume: 1847, trend: "up",   label: "Bullish",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { source: "Twitter/X #SKY444", sentiment: 0.81, volume: 4293, trend: "up",   label: "Very Bullish", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { source: "Discord #general",  sentiment: 0.65, volume: 892,  trend: "up",   label: "Bullish",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { source: "Telegram Channel",  sentiment: 0.48, volume: 2341, trend: "flat", label: "Neutral",  color: "text-amber-400",   bg: "bg-amber-500/10" },
  { source: "HackerNews",        sentiment: 0.31, volume: 156,  trend: "down", label: "Bearish",  color: "text-rose-400",    bg: "bg-rose-500/10" },
  { source: "CoinGecko Forums",  sentiment: 0.58, volume: 673,  trend: "up",   label: "Bullish",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const ALERTS = [
  { msg: "Sentiment spike detected: Twitter +23% in 1h", time: "2m ago", type: "positive" },
  { msg: "Negative keyword cluster: 'rug pull' mentions up 8x", time: "14m ago", type: "negative" },
  { msg: "Reddit post went viral: 12K upvotes in 30min", time: "31m ago", type: "positive" },
  { msg: "Influencer @CryptoWhale posted about SKY444", time: "1h ago", type: "positive" },
  { msg: "FUD detected on Telegram: coordinated negative campaign", time: "2h ago", type: "negative" },
];

export default function SentimentPipeline() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("2 minutes ago");
  const avgSentiment = FEEDS.reduce((a, f) => a + f.sentiment, 0) / FEEDS.length;
  const totalVolume = FEEDS.reduce((a, f) => a + f.volume, 0);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setLastScan("just now"); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Social Sentiment Pipeline</h1>
              <p className="text-xs text-slate-500 mt-0.5">NLP · Multi-source ingestion · Discord/Slack alerts · Data-as-a-Service</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/25 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block mr-1.5 animate-pulse" />LIVE SCANNING
            </Badge>
            <Button size="sm" onClick={handleScan} disabled={scanning} className="bg-violet-600 hover:bg-violet-700 text-white">
              {scanning ? <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin"/>Scanning</> : <><Zap className="h-3.5 w-3.5 mr-1.5"/>Scan Now</>}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg Sentiment", value: `${(avgSentiment*100).toFixed(0)}%`, icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Total Volume", value: totalVolume.toLocaleString(), icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Active Sources", value: FEEDS.length.toString(), icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Alerts Today", value: ALERTS.length.toString(), icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border border-slate-800/60 p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-slate-500">{s.label}</span></div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-5">
            <h3 className="font-semibold text-white mb-4">Live Feed Sentiment</h3>
            <div className="space-y-3">
              {FEEDS.map(f => (
                <div key={f.source} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300 truncate">{f.source}</span>
                      <span className={`text-xs font-bold ${f.color}`}>{f.label}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${f.sentiment > 0.6 ? "bg-emerald-500" : f.sentiment > 0.4 ? "bg-amber-500" : "bg-rose-500"}`} style={{width:`${f.sentiment*100}%`}} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 w-16 text-right">{f.volume.toLocaleString()}</div>
                  {f.trend === "up" ? <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" /> : f.trend === "down" ? <TrendingDown className="h-4 w-4 text-rose-400 shrink-0" /> : <Minus className="h-4 w-4 text-amber-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-amber-400" />Live Alerts</h3>
            <div className="space-y-3">
              {ALERTS.map((a, i) => (
                <div key={i} className={`rounded-xl p-3 border ${a.type==="positive"?"bg-emerald-500/5 border-emerald-500/20":"bg-rose-500/5 border-rose-500/20"}`}>
                  <div className="text-sm text-slate-300">{a.msg}</div>
                  <div className="text-xs text-slate-600 mt-1">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-violet-950/20 border border-violet-800/30 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-2">Pipeline Architecture</h3>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            {["Reddit/Twitter/Discord","→","Kafka Ingestion","→","NLP Scoring (Python)","→","Sentiment DB","→","Discord/Slack Webhook","→","Dashboard"].map((s,i) => (
              <span key={i} className={s==="→"?"text-slate-600":i===0||i===10?"text-violet-400 font-mono text-xs bg-violet-500/10 px-2 py-1 rounded":"text-slate-400 text-xs bg-slate-800/60 px-2 py-1 rounded"}>{s}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Last scan: {lastScan} · Next scan: in 3 minutes · Kafka throughput: 847K msg/s</p>
        </div>
      </div>
    </div>
  );
}
