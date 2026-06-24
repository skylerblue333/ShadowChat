import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Globe, Shield, Zap, BarChart3, Target, Rocket, ChevronRight, ChevronLeft, Building, Coins } from "lucide-react";

const SLIDES = [
  {
    id: 1, title: "The Problem", icon: Target,
    content: "Fragmented digital ecosystems force users across 12+ apps for social, crypto, gaming, and commerce. $2.1T market opportunity remains untapped by a unified platform.",
    stats: [{ label: "Apps avg user juggles", value: "12+" }, { label: "Market opportunity", value: "$2.1T" }, { label: "User churn from fragmentation", value: "67%" }],
    color: "from-rose-600 to-red-600",
  },
  {
    id: 2, title: "The Solution", icon: Rocket,
    content: "SKYCOIN4444 is the first fully integrated AI-powered Web3 social ecosystem. One platform combining social, DeFi, gaming, streaming, marketplace, and governance.",
    stats: [{ label: "Integrated modules", value: "44+" }, { label: "AI bots coding", value: "12" }, { label: "Languages supported", value: "8" }],
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: 3, title: "Market Size", icon: Globe,
    content: "Targeting the intersection of Web3 ($1.08T), social media ($231B), and gaming ($282B) markets. Early mover advantage in AI-native crypto social platforms.",
    stats: [{ label: "TAM", value: "$1.59T" }, { label: "SAM", value: "$47B" }, { label: "SOM (Year 3)", value: "$2.3B" }],
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: 4, title: "Business Model", icon: DollarSign,
    content: "7 revenue streams: subscriptions ($9-$99/mo), transaction fees (0.5-2%), creator monetization (30% cut), enterprise SaaS ($200-$2000/mo), NFT marketplace, token appreciation, and data-as-a-service.",
    stats: [{ label: "Revenue streams", value: "7" }, { label: "Target ARR (18mo)", value: "$1.2M" }, { label: "Gross margin", value: "78%" }],
    color: "from-amber-600 to-orange-600",
  },
  {
    id: 5, title: "Traction", icon: TrendingUp,
    content: "Platform launched with 44+ live modules, 24,557 lines of production code, autonomous AI sprint engine generating 100K lines/sprint, and growing developer community.",
    stats: [{ label: "Live modules", value: "44+" }, { label: "Code lines", value: "24K+" }, { label: "Sprint velocity", value: "100K/sprint" }],
    color: "from-purple-600 to-violet-600",
  },
  {
    id: 6, title: "The Ask", icon: Building,
    content: "Raising $2M seed round at $15M pre-money valuation. 18-month runway to $1.2M ARR milestone. Funds allocated: 40% engineering, 30% growth, 20% infrastructure, 10% legal/compliance.",
    stats: [{ label: "Raise amount", value: "$2M" }, { label: "Pre-money valuation", value: "$15M" }, { label: "Runway", value: "18 months" }],
    color: "from-indigo-600 to-blue-600",
  },
];

export default function InvestorPitch() {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Investor Pitch Deck</h1>
              <p className="text-xs text-slate-500 mt-0.5">SKYCOIN4444 · $15M Pre-Money · Seed Round</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/25 text-xs">Slide {slide+1} / {SLIDES.length}</Badge>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">Download PDF</Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Slide */}
        <div className={`bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800/60 p-10 min-h-[400px] relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${current.color}`} />
          <div className="flex items-start gap-6 mb-8">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center shrink-0`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono mb-1">SLIDE {String(current.id).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}</div>
              <h2 className="text-3xl font-black text-white">{current.title}</h2>
            </div>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl">{current.content}</p>
          <div className="grid grid-cols-3 gap-6">
            {current.stats.map(s => (
              <div key={s.label} className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800/40">
                <div className={`text-3xl font-black bg-gradient-to-r ${current.color} bg-clip-text text-transparent mb-1`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button onClick={() => setSlide(p => Math.max(0, p-1))} disabled={slide===0} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <ChevronLeft className="h-4 w-4 mr-1" />Previous
          </Button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`h-2 rounded-full transition-all ${i===slide?"w-8 bg-indigo-500":"w-2 bg-slate-700 hover:bg-slate-600"}`} />
            ))}
          </div>
          <Button onClick={() => setSlide(p => Math.min(SLIDES.length-1, p+1))} disabled={slide===SLIDES.length-1} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* All slides overview */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
          {SLIDES.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button key={s.id} onClick={() => setSlide(i)} className={`text-left rounded-xl border p-4 transition-all ${i===slide?"border-indigo-500/50 bg-indigo-500/5":"border-slate-800/60 bg-slate-900/40 hover:border-slate-700"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <SIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-mono">0{s.id}</span>
                </div>
                <div className="text-sm font-semibold text-white">{s.title}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
