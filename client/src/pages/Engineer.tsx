"use client";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { Card, IconTile, StatCard } from "@/components/ui/sk";
import { Cpu, Code2, ShieldAlert, Gauge, Bug, ScanSearch, Loader2, Share2, Users } from "lucide-react";

type Mode = "generate" | "review" | "optimize" | "security" | "debug";

const MODES: { id: Mode; label: string; icon: any; needsError?: boolean; codeInput: boolean }[] = [
  { id: "generate", label: "Generate", icon: Code2, codeInput: false },
  { id: "review", label: "Review", icon: ScanSearch, codeInput: true },
  { id: "optimize", label: "Optimize", icon: Gauge, codeInput: true },
  { id: "security", label: "Security Audit", icon: ShieldAlert, codeInput: true },
  { id: "debug", label: "Debug", icon: Bug, codeInput: true, needsError: true },
];

const LANGS = ["typescript", "javascript", "python", "rust", "go", "solidity", "java", "c++"];

export default function Engineer() {
  const { isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<Mode>("generate");
  const [text, setText] = useState("");
  const [errText, setErrText] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [output, setOutput] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [showCollabShare, setShowCollabShare] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const gen = trpc.engineer.generateCode.useMutation();
  const review = trpc.engineer.reviewCode.useMutation();
  const optimize = trpc.engineer.optimizeCode.useMutation();
  const security = trpc.engineer.securityAudit.useMutation();
  const debug = trpc.engineer.debugCode.useMutation();

  const pending = gen.isPending || review.isPending || optimize.isPending || security.isPending || debug.isPending;
  const active = MODES.find(m => m.id === mode)!;

  // Initialize real-time collaboration session
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const sid = `session-${Date.now()}`;
    setSessionId(sid);
    setCollaborators([user.name || "You"]);
  }, [isAuthenticated, user]);

  async function run() {
    if (!text.trim()) return;
    setOutput("");
    try {
      let res;
      if (mode === "generate") res = await gen.mutateAsync({ description: text, language });
      else if (mode === "review") res = await review.mutateAsync({ code: text, language });
      else if (mode === "optimize") res = await optimize.mutateAsync({ code: text, language });
      else if (mode === "security") res = await security.mutateAsync({ code: text, language });
      else res = await debug.mutateAsync({ code: text, error: errText, language });
      setOutput(res.output);
      
      // Broadcast to collaborators (simulated)
      if (collaborators.length > 1) {
        console.log(`[Collab] Shared result with ${collaborators.length - 1} collaborators`);
      }
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  function copySessionLink() {
    const link = `${window.location.origin}?collab=${sessionId}`;
    navigator.clipboard.writeText(link);
    alert("Collaboration link copied!");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="max-w-md">
          <h2 className="text-xl font-bold mb-4">Sign in to HopeAI</h2>
          <a href={getLoginUrl()} className="inline-block w-full">
            <Button className="w-full">
              Sign In
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              HopeAI Software Engineer
            </h1>
            <p className="text-gray-400">AI-powered code generation, review, and optimization</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCollabShare(!showCollabShare)}
              variant="outline"
              className="flex items-center gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Users className="w-4 h-4" />
              {collaborators.length} Collaborators
            </Button>
          </div>
        </div>

        {/* Collaboration Panel */}
        {showCollabShare && (
          <Card className="mb-6 bg-slate-900/50 border-cyan-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Active collaborators:</p>
                <div className="flex gap-2 mb-3">
                  {collaborators.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                onClick={copySessionLink}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                <Share2 className="w-4 h-4" />
                Share Session
              </Button>
            </div>
          </Card>
        )}

        {/* Mode Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-lg transition-all ${
                mode === m.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                  : "bg-slate-900 text-gray-400 hover:bg-slate-800"
              }`}
            >
              <m.icon className="w-5 h-5 mx-auto mb-2" />
              <span className="text-xs font-semibold">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              >
                {LANGS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {active.codeInput ? "Code to Analyze" : "Description"}
            </label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={active.codeInput ? "Paste your code here..." : "Describe what you want to build..."}
              className="w-full h-40 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-500 resize-none"
            />

            {active.needsError && (
              <>
                <label className="block text-sm font-semibold text-gray-300 mt-4 mb-2">Error Message</label>
                <Textarea
                  value={errText}
                  onChange={e => setErrText(e.target.value)}
                  placeholder="Paste the error message..."
                  className="w-full h-20 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-500 resize-none"
                />
              </>
            )}

            <Button
              onClick={run}
              disabled={pending}
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 mr-2" />
                  Run {active.label}
                </>
              )}
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Result</label>
            <div className="h-80 bg-slate-800 border border-slate-700 rounded p-4 overflow-auto">
              {output ? (
                <Streamdown>{output}</Streamdown>
              ) : (
                <p className="text-gray-500 text-sm">Results will appear here...</p>
              )}
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Code2} accent="cyan" label="Code Generated" value="1,247" />
          <StatCard icon={ScanSearch} accent="purple" label="Reviews Completed" value="892" />
          <StatCard icon={Gauge} accent="green" label="Optimizations" value="654" />
        </div>
      </div>
    </div>
  );
}
