import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles, Code2, FileText, Image, TrendingUp, Shield,
  Zap, Brain, Globe, Search, ChevronRight, Lock,
  Cpu, Eye, MessageSquare, BarChart3, Wand2, Bot,
  FlaskConical, Crosshair, Fingerprint, Radio, Layers
} from "lucide-react";

const TOOLS = [
  {
    id: "code-studio",
    name: "AI Code Studio",
    desc: "Generate, debug, and refactor code in any language. Full stack, smart contracts, scripts.",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    badge: "LIVE",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    href: "/ai-code-studio",
    category: "dev",
  },
  {
    id: "copy-studio",
    name: "AI Copy Studio",
    desc: "12 copy types — ads, emails, tweets, SEO, product descriptions. 8 tone modes.",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    badge: "LIVE",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    href: "/ai-copy-studio",
    category: "content",
  },
  {
    id: "hope-ai",
    name: "Hope AI",
    desc: "Your personal AI companion. Voice chat, emotional support, life coaching, and grey-area tools.",
    icon: Brain,
    color: "from-pink-500 to-rose-500",
    badge: "LIVE",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    href: "/hope-ai",
    category: "personal",
  },
  {
    id: "ai-brain",
    name: "AI Brain",
    desc: "Multi-model AI hub. GPT-5, Claude, Gemini. Switch models mid-conversation.",
    icon: Cpu,
    color: "from-violet-500 to-purple-500",
    badge: "LIVE",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    href: "/ai-brain",
    category: "chat",
  },
  {
    id: "market-scanner",
    name: "Market Scanner",
    desc: "AI-powered crypto market analysis. Trend detection, sentiment scoring, entry signals.",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    badge: "BETA",
    badgeColor: "bg-green-500/10 text-green-400 border-green-500/20",
    href: "/ai-trading",
    category: "finance",
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    desc: "44 specialized AI agents. Architecture, security, testing, DevOps, blockchain.",
    icon: Bot,
    color: "from-orange-500 to-amber-500",
    badge: "LIVE",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    href: "/ai-engineer",
    category: "dev",
  },
  {
    id: "osint",
    name: "OSINT Toolkit",
    desc: "Open-source intelligence gathering. Domain lookup, social footprint, data aggregation.",
    icon: Search,
    color: "from-slate-500 to-zinc-500",
    badge: "GREY",
    badgeColor: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    href: "/hope-ai?tool=osint",
    category: "grey",
  },
  {
    id: "deepfake-detect",
    name: "Deepfake Detector",
    desc: "AI-powered media authenticity analysis. Detect manipulated images, audio, and video.",
    icon: Eye,
    color: "from-red-500 to-rose-500",
    badge: "GREY",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    href: "/hope-ai?tool=deepfake",
    category: "grey",
  },
  {
    id: "cipher",
    name: "Cipher Tools",
    desc: "Encryption, steganography, hash cracking (ethical), secure messaging protocols.",
    icon: Lock,
    color: "from-cyan-500 to-teal-500",
    badge: "GREY",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    href: "/hope-ai?tool=cipher",
    category: "grey",
  },
  {
    id: "social-engineer",
    name: "Social Engineering Sim",
    desc: "Phishing simulation, awareness training, red-team scenario generator for security teams.",
    icon: Fingerprint,
    color: "from-yellow-500 to-orange-500",
    badge: "GREY",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    href: "/hope-ai?tool=social-eng",
    category: "grey",
  },
  {
    id: "network-scanner",
    name: "Network Recon",
    desc: "Ethical network scanning, port analysis, vulnerability mapping for authorized systems.",
    icon: Radio,
    color: "from-indigo-500 to-blue-500",
    badge: "GREY",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    href: "/hope-ai?tool=network",
    category: "grey",
  },
  {
    id: "ai-moderation",
    name: "AI Moderation",
    desc: "Content moderation engine. Toxic content detection, spam filtering, fraud signals.",
    icon: Shield,
    color: "from-emerald-500 to-green-500",
    badge: "LIVE",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    href: "/ai-engineer?agent=moderation",
    category: "safety",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "dev", label: "Dev" },
  { id: "content", label: "Content" },
  { id: "chat", label: "Chat" },
  { id: "finance", label: "Finance" },
  { id: "personal", label: "Personal" },
  { id: "grey", label: "Grey Area" },
  { id: "safety", label: "Safety" },
];

export default function AIToolsHub() {
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchQ = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#07050f]">
      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "oklch(0.72 0.28 305)" }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "oklch(0.72 0.28 340)" }} />
        </div>
        <div className="max-w-screen-xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Tools Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            The AI{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Arsenal
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
            {TOOLS.length} tools. Code generation, content creation, market analysis, and grey-area capabilities — all in one place.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/40 transition-colors" />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-16">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === c.id ? "text-white" : "text-white/40 hover:text-white/70 bg-white/3 hover:bg-white/5"}`}
              style={activeCategory === c.id ? { background: "linear-gradient(135deg, oklch(0.72 0.28 305 / 0.3), oklch(0.72 0.28 340 / 0.2))", border: "1px solid oklch(0.72 0.28 305 / 0.3)" } : {}}>
              {c.label}
              {c.id === "grey" && <span className="ml-1.5 text-[10px] text-orange-400">⚠</span>}
            </button>
          ))}
        </div>

        {/* Grey area warning */}
        {activeCategory === "grey" && (
          <div className="mb-6 p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-300 mb-1">Grey Area Tools — Use Responsibly</p>
                <p className="text-xs text-white/50">These tools are provided for educational, research, and authorized security testing purposes only. Misuse may violate laws. By accessing these tools you agree to use them ethically and legally.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <div className="group relative bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-200 cursor-pointer overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${tool.color} opacity-30 group-hover:opacity-70 transition-opacity`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} p-0.5`}>
                      <div className="w-full h-full rounded-[14px] bg-[#0e0a1a] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <Badge className={`text-[10px] ${tool.badgeColor}`}>{tool.badge}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">{tool.name}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-4">{tool.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-purple-400 group-hover:text-purple-300 transition-colors">
                    Open Tool <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No tools match "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
