import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Brain, Database, User, Tag, Clock, Search, Plus, Trash2, RefreshCw, Layers } from "lucide-react";

const MEMORY_CATEGORIES = [
  { id: "preferences", label: "Preferences", icon: User, color: "text-blue-400", count: 47 },
  { id: "context", label: "Context", icon: Layers, color: "text-purple-400", count: 128 },
  { id: "interactions", label: "Interactions", icon: Clock, color: "text-green-400", count: 2341 },
  { id: "knowledge", label: "Knowledge", icon: Brain, color: "text-yellow-400", count: 89 },
];

const SAMPLE_MEMORIES = [
  { id: 1, type: "preference", content: "User prefers dark mode and compact layouts", confidence: 0.97, lastAccessed: "2 min ago", tags: ["UI", "display"] },
  { id: 2, type: "context", content: "Currently building a DeFi staking dashboard with SKY444 integration", confidence: 0.94, lastAccessed: "5 min ago", tags: ["crypto", "project"] },
  { id: 3, type: "interaction", content: "Asked about TRUMP mining 3 times this week — high interest signal", confidence: 0.88, lastAccessed: "1 hour ago", tags: ["mining", "TRUMP"] },
  { id: 4, type: "knowledge", content: "User is a software engineer with Web3 and React expertise", confidence: 0.99, lastAccessed: "1 day ago", tags: ["skills", "background"] },
  { id: 5, type: "preference", content: "Prefers concise responses with code examples over long explanations", confidence: 0.91, lastAccessed: "3 hours ago", tags: ["communication", "style"] },
  { id: 6, type: "context", content: "Working on YC pitch — needs clean MVP narrative, not feature list", confidence: 0.96, lastAccessed: "30 min ago", tags: ["YC", "pitch", "startup"] },
];

export default function MemorySystem() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemory, setNewMemory] = useState("");

  const filtered = SAMPLE_MEMORIES.filter(m => {
    if (activeCategory !== "all" && !m.type.startsWith(activeCategory.slice(0, -1))) return false;
    if (searchQuery && !m.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <PageHeader
        backHref="/agent-coordination"
        icon={Brain}
        title="Long-Term Memory System"
        subtitle="Phase 9 — Persistent memory graphs, user preference models, context continuity"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {MEMORY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
            className={`card p-4 text-left transition-all hover:border-primary/50 ${activeCategory === cat.id ? "border-primary" : ""}`}
          >
            <cat.icon className={`w-6 h-6 ${cat.color} mb-2`} />
            <div className="text-xl font-bold">{cat.count.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{cat.label}</div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Memory list */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm"
                placeholder="Search memories..."
              />
            </div>
            <button
              onClick={() => toast.info("Memory sync running...")}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {filtered.map(mem => (
            <div key={mem.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm mb-2">{mem.content}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mem.lastAccessed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {(mem.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mem.tags.map(tag => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toast.success("Memory removed")}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Confidence bar */}
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${mem.confidence * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add memory + model info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add Memory
            </h3>
            <textarea
              value={newMemory}
              onChange={e => setNewMemory(e.target.value)}
              rows={4}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm resize-none mb-3"
              placeholder="Enter a fact, preference, or context to remember..."
            />
            <button
              onClick={() => {
                if (!newMemory.trim()) return;
                toast.success("Memory stored");
                setNewMemory("");
              }}
              className="btn-primary w-full text-sm"
            >
              Store Memory
            </button>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              Preference Model
            </h3>
            <div className="space-y-3">
              {[
                { label: "Content Style", value: "Technical + Concise", bar: 0.91 },
                { label: "Response Length", value: "Short", bar: 0.78 },
                { label: "Code Examples", value: "Always include", bar: 0.97 },
                { label: "Topic Focus", value: "Web3 + AI", bar: 0.94 },
              ].map(pref => (
                <div key={pref.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{pref.label}</span>
                    <span className="font-medium">{pref.value}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: `${pref.bar * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-yellow-400" />
              Context Continuity
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Context Window</span>
                <span className="font-medium text-green-400">Live</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memory Depth</span>
                <span className="font-medium">30 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Graph Nodes</span>
                <span className="font-medium">2,605</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compression</span>
                <span className="font-medium text-blue-400">Auto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
