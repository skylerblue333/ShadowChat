/**
 * AIPersonaSystem — Phase 22 AI Persona System
 * The "living world" engine — AI social actors with memory, goals, relationships
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Users, Activity, Zap, Heart, Swords, Handshake, Star } from "lucide-react";
import { personaEngine, type BehaviorOutput, type Persona, SEED_PERSONAS } from "@/core/personas/personaEngine";

const TRENDING = ["AI agents", "SKY444 moon", "Web3 social", "creator economy", "DeFi summer"];

const RELATIONSHIP_ICONS: Record<string, { icon: typeof Heart; color: string; label: string }> = {
  rival: { icon: Swords, color: "text-red-400", label: "Rivals" },
  friend: { icon: Heart, color: "text-pink-400", label: "Friends" },
  collaborator: { icon: Handshake, color: "text-green-400", label: "Collaborators" },
  competitor: { icon: Zap, color: "text-yellow-400", label: "Competitors" },
  fan: { icon: Star, color: "text-blue-400", label: "Fan" },
  enemy: { icon: Swords, color: "text-red-600", label: "Enemies" },
  mentor: { icon: Brain, color: "text-purple-400", label: "Mentor" },
  student: { icon: Brain, color: "text-cyan-400", label: "Student" },
};

const ACTION_COLORS: Record<string, string> = {
  post: "text-blue-400",
  reply: "text-green-400",
  debate: "text-red-400",
  collaborate: "text-purple-400",
  react: "text-yellow-400",
  tip: "text-pink-400",
  promote: "text-cyan-400",
  challenge: "text-orange-400",
};

export default function AIPersonaSystem() {
  const [tab, setTab] = useState<"world" | "personas" | "relationships" | "behavior">("world");
  const [behaviorLog, setBehaviorLog] = useState<BehaviorOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const personas = SEED_PERSONAS;

  const runTick = () => {
    const outputs = personaEngine.tick(TRENDING);
    setBehaviorLog(personaEngine.getBehaviorLog(30));
    return outputs;
  };

  const toggleSimulation = () => {
    if (isRunning) {
      if (tickRef.current) clearInterval(tickRef.current);
      setIsRunning(false);
    } else {
      runTick();
      tickRef.current = setInterval(runTick, 3000);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    // Run one initial tick on mount
    runTick();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Persona System
          </h1>
          <p className="text-xs text-muted-foreground">Living world engine — Phase 22</p>
        </div>
        <button onClick={toggleSimulation}
          className={`ml-auto text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${isRunning ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>
          {isRunning ? "⏸ Pause" : "▶ Run World"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* World status */}
        <div className="card p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-secondary"}`} />
            <span className="text-sm font-semibold">{isRunning ? "World is alive" : "World paused"}</span>
            <span className="text-xs text-muted-foreground ml-auto">{behaviorLog.length} events logged</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {personas.length} AI personas are active. They post, debate, collaborate, and react — creating a living social world before real users arrive.
          </p>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 overflow-x-auto">
          {(["world", "personas", "relationships", "behavior"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* World Feed */}
        {tab === "world" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TRENDING.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">#{t.replace(/ /g, "")}</span>
              ))}
            </div>
            {behaviorLog.length === 0 ? (
              <div className="card p-8 text-center text-muted-foreground">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Press "Run World" to start the simulation</p>
              </div>
            ) : (
              behaviorLog.map((event, i) => {
                const persona = personas.find(p => p.id === event.metadata.personaId as string);
                return (
                  <div key={i} className="card p-3 flex items-start gap-3" style={{ animation: i === 0 ? "fadeIn 300ms ease-out" : undefined }}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {persona?.avatar || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold">{persona?.handle || "unknown"}</span>
                        <span className={`text-xs font-mono ${ACTION_COLORS[event.action] || "text-muted-foreground"}`}>{event.action}</span>
                      </div>
                      <p className="text-sm text-foreground">{event.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {Math.round((Date.now() - event.timestamp) / 1000)}s ago
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Personas */}
        {tab === "personas" && (
          <div className="space-y-3">
            {personas.map(p => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.handle} · {p.class}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.bio}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold">{(p.followerCount / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">followers</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.personalityTraits.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-secondary/50 rounded-lg text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Goals: {p.goals.map(g => g.replace(/_/g, " ")).join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(p.reputationScore / 10000) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-primary">{p.reputationScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Relationships */}
        {tab === "relationships" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Relationship graph creates natural conflict, collaboration, and drama.</p>
            {[
              { a: "Skyler.eth", b: "Nova Builds", type: "rival" },
              { a: "Skyler.eth", b: "Luna Creates", type: "collaborator" },
              { a: "Nova Builds", b: "Luna Creates", type: "competitor" },
            ].map((rel, i) => {
              const relInfo = RELATIONSHIP_ICONS[rel.type];
              return (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <div className="font-medium text-sm">{rel.a}</div>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="h-px flex-1 bg-border/50" />
                    <div className={`flex items-center gap-1 ${relInfo.color}`}>
                      <relInfo.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{relInfo.label}</span>
                    </div>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="font-medium text-sm">{rel.b}</div>
                </div>
              );
            })}
            <div className="card p-4 bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              Relationships drive behavior: rivals debate, collaborators create together, competitors undercut each other. This creates organic social motion.
            </div>
          </div>
        )}

        {/* Behavior Log */}
        {tab === "behavior" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Raw behavior event log</p>
              <span className="text-xs text-muted-foreground">{behaviorLog.length} events</span>
            </div>
            {behaviorLog.map((event, i) => (
              <div key={i} className="card p-2.5 flex items-center gap-2 text-xs">
                <span className={`font-mono font-bold ${ACTION_COLORS[event.action] || "text-muted-foreground"}`}>{event.action.toUpperCase()}</span>
                <span className="text-muted-foreground truncate flex-1">{event.content}</span>
                <span className="text-muted-foreground shrink-0">{Math.round((Date.now() - event.timestamp) / 1000)}s</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
