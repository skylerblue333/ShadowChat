import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  label: string;
  category: "memory" | "skill" | "goal" | "relationship" | "achievement";
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  memory: "#eab308",
  skill: "#3b82f6",
  goal: "#a855f7",
  relationship: "#10b981",
  achievement: "#f97316",
};

function generateStars(count: number): Star[] {
  const categories: Star["category"][] = ["memory", "skill", "goal", "relationship", "achievement"];
  const labels: Record<string, string[]> = {
    memory: ["First Login", "First Trade", "First Vote", "Genesis Day", "Mission Complete"],
    skill: ["DeFi Basics", "Smart Contracts", "AI Prompting", "Governance", "Trading"],
    goal: ["Reach Level 10", "Earn 1000 SKY", "Build First App", "Join Council", "Mentor 5 Users"],
    relationship: ["HOPE AI", "ShadowChat", "Trading Partner", "Mentor", "Council Member"],
    achievement: ["Early Adopter", "First Stake", "Builder Badge", "Voter", "Legendary"],
  };

  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length];
    const labelList = labels[category];
    return {
      id: `star-${i}`,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.random() * 4,
      brightness: 0.4 + Math.random() * 0.6,
      label: labelList[i % labelList.length],
      category,
      color: CATEGORY_COLORS[category],
    };
  });
}

const STARS = generateStars(40);

export default function MemoryConstellation() {
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);

  const { data: memoryGraph } = trpc.enterprise.memoryGraph.snapshot.useQuery();
  const { data: predictions } = trpc.enterprise.memoryGraph.predictions.useQuery();

  const filteredStars = selectedCategory
    ? STARS.filter((s) => s.category === selectedCategory)
    : STARS;

  const stats = {
    total: STARS.length,
    memories: STARS.filter((s) => s.category === "memory").length,
    skills: STARS.filter((s) => s.category === "skill").length,
    goals: STARS.filter((s) => s.category === "goal").length,
    relationships: STARS.filter((s) => s.category === "relationship").length,
    achievements: STARS.filter((s) => s.category === "achievement").length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-gradient-to-r from-black via-purple-950/10 to-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
              ✨
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                MEMORY CONSTELLATION
              </h1>
              <p className="text-sm text-purple-400/80 mt-1">
                Your life as a star map — every memory, skill, and connection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`border-white/20 text-xs ${!selectedCategory ? "bg-white/20 text-white" : "text-white/50"}`}
          >
            ALL ({stats.total})
          </Button>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`border-white/20 text-xs capitalize ${selectedCategory === cat ? "bg-white/20" : "text-white/50"}`}
              style={{ borderColor: selectedCategory === cat ? color : undefined, color: selectedCategory === cat ? color : undefined }}
            >
              {cat}s ({stats[cat as keyof typeof stats] ?? 0})
            </Button>
          ))}
        </div>

        {/* Star Map */}
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-black via-purple-950/5 to-blue-950/10">
          <svg
            ref={canvasRef}
            viewBox="0 0 100 100"
            className="w-full"
            style={{ height: "500px" }}
          >
            {/* Background stars */}
            {Array.from({ length: 100 }, (_, i) => (
              <circle
                key={`bg-${i}`}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={0.15}
                fill="white"
                opacity={0.2 + Math.random() * 0.3}
              />
            ))}

            {/* Connection lines between nearby stars */}
            {filteredStars.slice(0, 20).map((star, i) => {
              const next = filteredStars[(i + 1) % filteredStars.length];
              const dist = Math.sqrt(Math.pow(star.x - next.x, 2) + Math.pow(star.y - next.y, 2));
              if (dist > 20) return null;
              return (
                <line
                  key={`line-${i}`}
                  x1={star.x}
                  y1={star.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={star.color}
                  strokeWidth={0.1}
                  opacity={0.2}
                />
              );
            })}

            {/* Stars */}
            {filteredStars.map((star) => (
              <g key={star.id}>
                {/* Glow */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * 1.5}
                  fill={star.color}
                  opacity={0.1}
                />
                {/* Star */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * 0.5}
                  fill={star.color}
                  opacity={star.brightness}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  style={{ filter: hoveredStar?.id === star.id ? `drop-shadow(0 0 4px ${star.color})` : undefined }}
                />
              </g>
            ))}
          </svg>

          {/* Hover tooltip */}
          {hoveredStar && (
            <div
              className="absolute pointer-events-none px-3 py-2 rounded-lg bg-black/90 border text-xs text-white"
              style={{
                left: `${hoveredStar.x}%`,
                top: `${hoveredStar.y}%`,
                borderColor: hoveredStar.color,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="font-bold" style={{ color: hoveredStar.color }}>{hoveredStar.label}</div>
              <div className="text-white/50 capitalize">{hoveredStar.category}</div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <Card key={cat} className="bg-black/60 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-black font-mono" style={{ color }}>
                  {stats[cat as keyof typeof stats] ?? 0}
                </div>
                <div className="text-xs text-white/40 capitalize mt-1">{cat}s</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Memory Graph Data */}
        {memoryGraph && (
          <Card className="bg-black/60 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm uppercase tracking-widest">
                MEMORY GRAPH INTELLIGENCE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Graph Nodes", value: memoryGraph?.nodeCount ?? "—" },
                  { label: "Connections", value: memoryGraph?.edgeCount ?? "—" },
                  { label: "Top Patterns", value: memoryGraph?.topPatterns?.length ?? "—" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 text-center">
                    <div className="text-2xl font-black text-purple-400 font-mono">{String(item.value)}</div>
                    <div className="text-xs text-white/40 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Predictions from Memory */}
        {predictions && Array.isArray(predictions) && predictions.length > 0 && (
          <Card className="bg-black/60 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                WHAT YOUR MEMORY PREDICTS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(predictions as unknown as Array<Record<string, unknown>>).slice(0, 5).map((pred, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-yellow-400 font-mono text-sm w-6">{i + 1}.</span>
                  <span className="text-sm text-white/70 flex-1">
                    {String(pred.prediction ?? pred.text ?? JSON.stringify(pred))}
                  </span>
                  {pred.confidence !== undefined && (
                    <Badge className="bg-yellow-500/10 text-yellow-400 text-xs border-0 shrink-0">
                      {Math.round(Number(pred.confidence) * 100)}%
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
