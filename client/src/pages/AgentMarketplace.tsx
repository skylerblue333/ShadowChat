import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Bot, Star, Search, Zap, TrendingUp, Shield, Brain, Code, BarChart3, Cpu, Globe, Lock, Rocket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const CATEGORY_ICONS: Record<string, any> = {
  "Core Engineering": Code,
  "AI & Intelligence": Brain,
  "Security & Trust": Shield,
  "Analytics & Data": BarChart3,
  "Growth & Marketing": TrendingUp,
  "Social & Community": Globe,
  "DeFi & Crypto": Zap,
  "Infrastructure": Cpu,
  "Compliance & Legal": Lock,
  "Creator Economy": Rocket,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Core Engineering": "from-blue-500 to-cyan-600",
  "AI & Intelligence": "from-purple-500 to-violet-600",
  "Security & Trust": "from-red-500 to-rose-600",
  "Analytics & Data": "from-amber-500 to-orange-600",
  "Growth & Marketing": "from-green-500 to-emerald-600",
  "Social & Community": "from-pink-500 to-fuchsia-600",
  "DeFi & Crypto": "from-yellow-500 to-amber-600",
  "Infrastructure": "from-slate-500 to-gray-600",
  "Compliance & Legal": "from-teal-500 to-cyan-600",
  "Creator Economy": "from-indigo-500 to-purple-600",
};

export default function AgentMarketplace() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deployedAgents, setDeployedAgents] = useState<Set<string>>(new Set());

  const { data, isLoading } = trpc.agents44.getAll.useQuery();

  const agents = data?.agents ?? [];
  const rawCategories = (data?.categories ?? []) as Array<{ id: string; label: string }>;
  const categories = [{ id: "All", label: "All" }, ...rawCategories];

  const filtered = useMemo(() => {
    return agents.filter((a: any) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || a.category === selectedCategory || a.category?.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [agents, search, selectedCategory]);

  const handleDeploy = (agentId: string) => {
    setDeployedAgents(prev => {
      const next = new Set(prev);
      if (next.has(agentId)) next.delete(agentId);
      else next.add(agentId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Agent Marketplace</h1>
            <p className="text-muted-foreground">Deploy AI agents to automate your platform — {data?.total ?? 44} agents available</p>
          </div>
          <Link href="/agents/builder">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white">
              <Rocket className="w-4 h-4 mr-2" /> Build Agent
            </Button>
          </Link>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="pl-9 bg-muted/30" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 6).map(cat => (
              <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat.id)} className="text-xs">
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Agents", value: data?.total ?? 44, icon: Bot },
            { label: "Deployed", value: deployedAgents.size, icon: Zap },
            { label: "Categories", value: rawCategories.length ?? 10, icon: BarChart3 },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border/50 bg-muted/20 p-4 flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/30 bg-muted/20 p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((agent: any) => {
              const Icon = CATEGORY_ICONS[agent.category] ?? Bot;
              const gradient = CATEGORY_COLORS[agent.category] ?? "from-slate-500 to-gray-600";
              const isDeployed = deployedAgents.has(agent.id ?? agent.name);
              const rating = (4.2 + (agent.name.charCodeAt(0) % 8) * 0.1).toFixed(1);
              return (
                <div key={agent.id ?? agent.name} className="rounded-2xl border border-border/50 bg-card/50 p-5 hover:border-border transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
                        {agent.priority === "critical" && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-red-500/20 text-red-400 border-red-500/30">Core</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{agent.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {agent.description ?? "Advanced AI agent for automated platform operations."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{rating}</span>
                    </div>
                    <div className="flex gap-2">
                      {isAuthenticated && (
                        <Link href={`/agents/chat/${agent.id ?? agent.name}`}>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            Chat <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleDeploy(agent.id ?? agent.name)}
                        className={`text-xs h-7 px-2 ${isDeployed ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-cyan-500 to-purple-600 border-0"} text-white`}
                      >
                        {isDeployed ? "✓ Active" : "Deploy"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No agents found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
