/**
 * MatchSpace — Dating as Match Space Layer
 * People appear as interactive nodes in a relationship graph.
 * Compatibility is visualized as energy lines between nodes.
 * AI suggests emotional + behavioral matches.
 * Two views: Graph (relationship map) + Cards (swipe interface).
 */
import { useState, useRef, useCallback } from "react";
import { Heart, X, Star, Brain, Zap, MessageCircle, ChevronRight, Sparkles, Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MatchNode {
  id: number;
  name: string;
  initial: string;
  color: string;
  age: number;
  role: string;
  compatibility: number;
  trustScore: number;
  behaviorScore: number;
  emotionalMatch: number;
  distance: string;
  interests: string[];
  aiReason: string;
  x: number; // percentage position in graph
  y: number;
  isOnline: boolean;
  isSuperMatch: boolean;
}

const MATCH_NODES: MatchNode[] = [
  {
    id: 1, name: "Alex R.", initial: "A", color: "#a855f7",
    age: 28, role: "Product Designer",
    compatibility: 94, trustScore: 91, behaviorScore: 88, emotionalMatch: 96,
    distance: "2.1 mi", interests: ["AI", "Design", "Music"],
    aiReason: "Exceptional emotional alignment. Shared values in creativity and tech.",
    x: 50, y: 30, isOnline: true, isSuperMatch: true,
  },
  {
    id: 2, name: "Jordan K.", initial: "J", color: "#06b6d4",
    age: 26, role: "Software Engineer",
    compatibility: 87, trustScore: 89, behaviorScore: 92, emotionalMatch: 83,
    distance: "4.5 mi", interests: ["Web3", "Gaming", "Travel"],
    aiReason: "Strong behavioral compatibility. Both action-oriented and goal-driven.",
    x: 75, y: 55, isOnline: true, isSuperMatch: false,
  },
  {
    id: 3, name: "Morgan L.", initial: "M", color: "#ec4899",
    age: 30, role: "Entrepreneur",
    compatibility: 82, trustScore: 94, behaviorScore: 87, emotionalMatch: 79,
    distance: "1.8 mi", interests: ["Startups", "Fitness", "Art"],
    aiReason: "High trust alignment. Complementary ambition profiles.",
    x: 25, y: 55, isOnline: false, isSuperMatch: false,
  },
  {
    id: 4, name: "Casey T.", initial: "C", color: "#22c55e",
    age: 27, role: "Content Creator",
    compatibility: 78, trustScore: 85, behaviorScore: 83, emotionalMatch: 81,
    distance: "6.2 mi", interests: ["Content", "Crypto", "Yoga"],
    aiReason: "Creative synergy. Shared interest in digital economy.",
    x: 15, y: 30, isOnline: true, isSuperMatch: false,
  },
  {
    id: 5, name: "Riley S.", initial: "R", color: "#f59e0b",
    age: 29, role: "Data Scientist",
    compatibility: 75, trustScore: 88, behaviorScore: 90, emotionalMatch: 71,
    distance: "8.0 mi", interests: ["Data", "AI", "Hiking"],
    aiReason: "Analytical minds. Strong intellectual compatibility.",
    x: 80, y: 25, isOnline: false, isSuperMatch: false,
  },
];

// SVG-based relationship graph
function RelationshipGraph({ nodes, onNodeClick, selectedId }: {
  nodes: MatchNode[];
  onNodeClick: (node: MatchNode) => void;
  selectedId: number | null;
}) {
  const CENTER = { x: 50, y: 50 };

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Energy lines from center to each node */}
        {nodes.map(node => {
          const opacity = node.compatibility / 100;
          const strokeWidth = (node.compatibility / 100) * 0.8 + 0.2;
          return (
            <g key={`line-${node.id}`}>
              {/* Glow line */}
              <line
                x1={CENTER.x} y1={CENTER.y}
                x2={node.x} y2={node.y}
                stroke={node.color}
                strokeWidth={strokeWidth * 2}
                opacity={opacity * 0.2}
              />
              {/* Main line */}
              <line
                x1={CENTER.x} y1={CENTER.y}
                x2={node.x} y2={node.y}
                stroke={node.color}
                strokeWidth={strokeWidth}
                opacity={opacity * 0.7}
                strokeDasharray={node.isSuperMatch ? "none" : "2 1"}
              />
              {/* Compatibility label on line */}
              <text
                x={(CENTER.x + node.x) / 2}
                y={(CENTER.y + node.y) / 2 - 1}
                fontSize="2.5"
                fill={node.color}
                textAnchor="middle"
                opacity="0.8"
              >
                {node.compatibility}%
              </text>
            </g>
          );
        })}

        {/* Center node — "You" */}
        <circle cx={CENTER.x} cy={CENTER.y} r="6" fill="#1e1e2e" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx={CENTER.x} cy={CENTER.y} r="8" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.4" />
        <text x={CENTER.x} y={CENTER.y + 0.8} fontSize="3.5" fill="white" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
          YOU
        </text>

        {/* Match nodes */}
        {nodes.map(node => (
          <g
            key={`node-${node.id}`}
            onClick={() => onNodeClick(node)}
            className="cursor-pointer"
          >
            {/* Selection ring */}
            {selectedId === node.id && (
              <circle cx={node.x} cy={node.y} r="7.5" fill="none" stroke={node.color} strokeWidth="1" opacity="0.8" />
            )}
            {/* Super match pulse ring */}
            {node.isSuperMatch && (
              <circle cx={node.x} cy={node.y} r="6.5" fill="none" stroke={node.color} strokeWidth="0.5" opacity="0.5" />
            )}
            {/* Node circle */}
            <circle cx={node.x} cy={node.y} r="5" fill={node.color} opacity="0.9" />
            {/* Online indicator */}
            {node.isOnline && (
              <circle cx={node.x + 3.5} cy={node.y - 3.5} r="1.2" fill="#22c55e" />
            )}
            {/* Initial */}
            <text x={node.x} y={node.y + 0.8} fontSize="3.5" fill="white" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
              {node.initial}
            </text>
            {/* Name below */}
            <text x={node.x} y={node.y + 8} fontSize="2.5" fill="white" textAnchor="middle" opacity="0.8">
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Swipe card component
function SwipeCard({ node, onLike, onPass, onSuperLike }: {
  node: MatchNode;
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
}) {
  return (
    <div className="card overflow-hidden max-w-sm mx-auto">
      {/* Card header with gradient */}
      <div className="h-48 relative" style={{ background: `linear-gradient(135deg, ${node.color}33, ${node.color}11)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: node.color }}>
            {node.initial}
          </div>
        </div>
        {node.isSuperMatch && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">Super Match</span>
          </div>
        )}
        {node.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/40">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        )}
        {/* Compatibility ring overlay */}
        <div className="absolute bottom-3 right-3 w-12 h-12">
          <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20"
              fill="none" stroke={node.color} strokeWidth="3"
              strokeDasharray={`${(node.compatibility / 100) * 125.7} 125.7`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <span className="text-xs font-bold text-white">{node.compatibility}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-bold">{node.name}</h2>
            <span className="text-muted-foreground text-sm">{node.age}</span>
            <span className="text-xs text-muted-foreground ml-auto">{node.distance}</span>
          </div>
          <p className="text-sm text-muted-foreground">{node.role}</p>
        </div>

        {/* AI reason */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
          <p className="text-xs text-purple-300">{node.aiReason}</p>
        </div>

        {/* Score bars */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: "Trust", score: node.trustScore, color: "#22c55e" },
            { label: "Behavior", score: node.behaviorScore, color: "#a855f7" },
            { label: "Emotional", score: node.emotionalMatch, color: "#ec4899" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-bold" style={{ color: s.color }}>{s.score}</div>
              <div className="text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5">
          {node.interests.map(interest => (
            <span key={interest} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
              {interest}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onPass}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-red-500/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={onSuperLike}
            className="flex items-center justify-center p-2.5 rounded-xl border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 transition-all"
          >
            <Star className="w-5 h-5" />
          </button>
          <button
            onClick={onLike}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white transition-all"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MatchSpace() {
  const [view, setView] = useState<"graph" | "cards">("graph");
  const [selectedNode, setSelectedNode] = useState<MatchNode | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const handleLike = () => {
    const node = MATCH_NODES[cardIndex];
    setLikedIds(prev => [...prev, node.id]);
    toast.success(`Liked ${node.name}! 💜`);
    setCardIndex(prev => (prev + 1) % MATCH_NODES.length);
  };

  const handlePass = () => {
    toast(`Passed on ${MATCH_NODES[cardIndex].name}`);
    setCardIndex(prev => (prev + 1) % MATCH_NODES.length);
  };

  const handleSuperLike = () => {
    const node = MATCH_NODES[cardIndex];
    toast.success(`Super liked ${node.name}! ⭐`);
    setCardIndex(prev => (prev + 1) % MATCH_NODES.length);
  };

  const currentCard = MATCH_NODES[cardIndex % MATCH_NODES.length];

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            Match Space
          </h1>
          <p className="text-xs text-muted-foreground">Relationship graph · AI compatibility</p>
        </div>
        <div className="flex gap-1 p-0.5 bg-secondary/50 rounded-lg">
          <button
            onClick={() => setView("graph")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${view === "graph" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
          >
            Graph
          </button>
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${view === "cards" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { label: `${MATCH_NODES.length} matches`, color: "text-pink-400" },
          { label: `${likedIds.length} liked`, color: "text-purple-400" },
          { label: "94% top match", color: "text-yellow-400" },
          { label: "AI-ranked", color: "text-cyan-400" },
        ].map(s => (
          <div key={s.label} className={`shrink-0 px-2.5 py-1 rounded-full bg-secondary/50 text-xs ${s.color}`}>
            {s.label}
          </div>
        ))}
      </div>

      {/* Graph view */}
      {view === "graph" && (
        <div className="space-y-3">
          <div className="card p-4">
            <p className="text-xs text-muted-foreground mb-3 text-center">Tap a node to see compatibility details</p>
            <RelationshipGraph
              nodes={MATCH_NODES}
              onNodeClick={setSelectedNode}
              selectedId={selectedNode?.id ?? null}
            />
          </div>

          {/* Selected node detail */}
          {selectedNode && (
            <div className="card p-4 space-y-3" style={{ borderColor: `${selectedNode.color}40` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: selectedNode.color }}>
                  {selectedNode.initial}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{selectedNode.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedNode.role} · {selectedNode.distance}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: selectedNode.color }}>{selectedNode.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">compatible</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Brain className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                <p className="text-xs text-purple-300">{selectedNode.aiReason}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Trust", score: selectedNode.trustScore, color: "#22c55e" },
                  { label: "Behavior", score: selectedNode.behaviorScore, color: "#a855f7" },
                  { label: "Emotional", score: selectedNode.emotionalMatch, color: "#ec4899" },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-lg bg-secondary/50">
                    <div className="text-base font-bold" style={{ color: s.color }}>{s.score}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2 text-sm"
                  style={{ background: `linear-gradient(135deg, ${selectedNode.color}, ${selectedNode.color}cc)` }}
                  onClick={() => { setLikedIds(prev => [...prev, selectedNode.id]); toast.success(`Liked ${selectedNode.name}! 💜`); }}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Like
                </Button>
                <Button variant="outline" className="flex-1 gap-2 text-sm" onClick={() => toast("Opening chat...")}>
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cards view */}
      {view === "cards" && (
        <div className="space-y-3">
          <SwipeCard
            node={currentCard}
            onLike={handleLike}
            onPass={handlePass}
            onSuperLike={handleSuperLike}
          />
          <div className="flex justify-center gap-1.5">
            {MATCH_NODES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === cardIndex % MATCH_NODES.length ? "w-6 bg-pink-500" : "w-1.5 bg-secondary"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
