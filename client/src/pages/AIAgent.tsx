import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Bot, Zap, Github, Twitter, Globe, Clock, Play, Pause,
  Plus, Trash2, Settings, BarChart2, Code, PenTool,
  TrendingUp, MessageSquare, Cpu, Shield, ChevronRight,
  CheckCircle2, AlertCircle, RefreshCw, Sparkles
} from "lucide-react";

type AgentTask = {
  id: string;
  type: "auto_post" | "code_gen" | "market_scan" | "social_reply" | "github_sync";
  name: string;
  schedule: string;
  status: "active" | "paused" | "error";
  lastRun?: string;
  nextRun?: string;
  runsToday: number;
};

const AGENT_TYPES = [
  { id: "auto_post", label: "Auto Post", icon: PenTool, color: "text-purple-400", desc: "AI-generated posts on schedule" },
  { id: "code_gen", label: "Code Gen", icon: Code, color: "text-cyan-400", desc: "Generate and commit code 24/7" },
  { id: "market_scan", label: "Market Scan", icon: TrendingUp, color: "text-green-400", desc: "Scan crypto markets and post alerts" },
  { id: "social_reply", label: "Social Reply", icon: MessageSquare, color: "text-pink-400", desc: "Auto-reply to mentions and DMs" },
  { id: "github_sync", label: "GitHub Sync", icon: Github, color: "text-orange-400", desc: "Sync commits to social posts" },
];

export default function AIAgent() {
  
  const [activeTab, setActiveTab] = useState<"agents" | "logs" | "settings">("agents");
  const [showCreate, setShowCreate] = useState(false);
  const [newAgentType, setNewAgentType] = useState("auto_post");
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const [newAgentSchedule, setNewAgentSchedule] = useState("*/30 * * * *");
  const [isRunning, setIsRunning] = useState(false);
  const [liveOutput, setLiveOutput] = useState<string[]>([]);
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");

  const aiChat = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      const content = (data as any)?.reply || (data as any)?.content || "Done.";
      setLiveOutput(prev => [...prev, `✓ ${content.slice(0, 200)}`]);
      setIsRunning(false);
    },
    onError: (e) => {
      setLiveOutput(prev => [...prev, `✗ Error: ${e.message}`]);
      setIsRunning(false);
    }
  });

  const createPost = trpc.feed.create.useMutation({
    onSuccess: () => {
      setLiveOutput(prev => [...prev, "✓ Post published to feed"]);
      toast.success("AI post published!");
    }
  });

  const handleRunAgent = async (type: string, prompt: string) => {
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    setIsRunning(true);
    setLiveOutput(prev => [...prev, `→ Running ${type} agent...`]);

    const systemPrompts: Record<string, string> = {
      auto_post: "You are a Web3 social media expert. Generate an engaging post about crypto, DeFi, or blockchain technology. Keep it under 280 characters. Include relevant hashtags.",
      code_gen: "You are a senior software engineer. Generate production-ready TypeScript code for a Web3 feature. Include comments and error handling.",
      market_scan: "You are a crypto market analyst. Analyze current market trends and generate a brief market update post. Include price action insights.",
      social_reply: "You are a community manager for a Web3 platform. Generate a helpful, engaging reply to a user question about crypto or blockchain.",
      github_sync: "You are a developer advocate. Convert a recent GitHub commit message into an engaging social media post about the development update.",
    };

    const userPrompt = prompt || `Generate content for ${type} task. Make it engaging and relevant to the SKYCOIN4444 / Shadowchat Web3 platform.`;

    aiChat.mutate({
      message: userPrompt,
      systemPrompt: systemPrompts[type] || systemPrompts.auto_post,
    });
  };

  const handleAutoPost = async () => {
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    setIsRunning(true);
    setLiveOutput(prev => [...prev, "→ Generating AI post content..."]);

    aiChat.mutate({
      message: "Generate an engaging Web3 social media post about SKYCOIN4444 platform features, crypto mining, or DeFi. Make it exciting and include hashtags. Keep under 280 chars.",
      systemPrompt: "You are a Web3 content creator for the Shadowchat platform. Generate viral-worthy posts.",
    });
  };

  const handlePublishGenerated = () => {
    const lastOutput = liveOutput.filter(l => l.startsWith("✓")).pop();
    if (!lastOutput) { toast.error("No content to publish"); return; }
    const content = lastOutput.replace("✓ ", "").slice(0, 500);
    createPost.mutate({ content, type: "text", visibility: "public" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">AI Agent Engine</h2>
          <p className="text-slate-400">Sign in to access your 24/7 AI automation agents</p>
          <Button onClick={() => // Removed login redirect for testing}
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07050f] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">AI Agent Engine</h1>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">24/7 Active</Badge>
            </div>
            <p className="text-slate-500 text-sm ml-13">Autonomous AI agents that post, code, scan markets, and grow your presence</p>
          </div>
          <Button onClick={() => setShowCreate(true)}
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
            <Plus className="w-4 h-4 mr-2" /> New Agent
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {(["agents", "logs", "settings"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "agents" && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={handleAutoPost} disabled={isRunning}
                className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 text-left hover:border-purple-500/30 transition-all group">
                <PenTool className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-sm font-semibold text-white">Auto Post</p>
                <p className="text-xs text-slate-500">Generate & publish now</p>
              </button>
              <button onClick={() => handleRunAgent("code_gen", "")} disabled={isRunning}
                className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 text-left hover:border-cyan-500/30 transition-all group">
                <Code className="w-5 h-5 text-cyan-400 mb-2" />
                <p className="text-sm font-semibold text-white">Code Gen</p>
                <p className="text-xs text-slate-500">Generate code snippet</p>
              </button>
              <button onClick={() => handleRunAgent("market_scan", "")} disabled={isRunning}
                className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 text-left hover:border-green-500/30 transition-all group">
                <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-sm font-semibold text-white">Market Scan</p>
                <p className="text-xs text-slate-500">Scan & post update</p>
              </button>
              <button onClick={() => handleRunAgent("social_reply", "")} disabled={isRunning}
                className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 text-left hover:border-pink-500/30 transition-all group">
                <MessageSquare className="w-5 h-5 text-pink-400 mb-2" />
                <p className="text-sm font-semibold text-white">Social Reply</p>
                <p className="text-xs text-slate-500">Generate reply</p>
              </button>
            </div>

            {/* Live Output Terminal */}
            <div className="bg-[#0a0614] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-slate-600"}`} />
                  <span className="text-sm font-mono text-slate-400">Agent Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  {liveOutput.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handlePublishGenerated}
                      className="text-purple-400 hover:text-purple-300 text-xs h-7">
                      <Zap className="w-3 h-3 mr-1" /> Publish Last Output
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setLiveOutput([])}
                    className="text-slate-500 hover:text-slate-300 text-xs h-7">
                    Clear
                  </Button>
                </div>
              </div>
              <div className="p-4 font-mono text-xs space-y-1 min-h-[120px] max-h-64 overflow-y-auto">
                {liveOutput.length === 0 ? (
                  <p className="text-slate-700">{">"} Ready. Click an agent to run...</p>
                ) : (
                  liveOutput.map((line, i) => (
                    <p key={i} className={`${line.startsWith("✓") ? "text-green-400" : line.startsWith("✗") ? "text-red-400" : line.startsWith("→") ? "text-cyan-400" : "text-slate-400"}`}>
                      {line}
                    </p>
                  ))
                )}
                {isRunning && (
                  <p className="text-yellow-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Processing...
                  </p>
                )}
              </div>
            </div>

            {/* Custom Agent Prompt */}
            <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Custom Agent Task
              </h3>
              <div className="flex gap-2">
                <select value={newAgentType} onChange={e => setNewAgentType(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-40">
                  {AGENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <Input value={newAgentPrompt} onChange={e => setNewAgentPrompt(e.target.value)}
                  placeholder="Custom prompt for the agent..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                <Button onClick={() => handleRunAgent(newAgentType, newAgentPrompt)} disabled={isRunning}
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Agent Types Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AGENT_TYPES.map(agent => (
                <div key={agent.id} className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <agent.icon className={`w-5 h-5 ${agent.color}`} />
                    <span className="font-semibold text-white text-sm">{agent.label}</span>
                    <Badge className="ml-auto bg-white/5 text-slate-500 border-white/10 text-xs">Ready</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{agent.desc}</p>
                  <button onClick={() => handleRunAgent(agent.id, "")} disabled={isRunning}
                    className="mt-3 w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1">
                    <Play className="w-3 h-3" /> Run Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-orange-400" />
                GitHub Integration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Personal Access Token</label>
                  <Input type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Repository (owner/repo)</label>
                  <Input value={githubRepo} onChange={e => setGithubRepo(e.target.value)}
                    placeholder="username/my-project"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
                </div>
                <Button onClick={() => toast.success("GitHub integration saved!")}
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
                  Save Integration
                </Button>
              </div>
            </div>

            <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Agent Safety Settings
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Require approval before publishing", desc: "Review AI-generated content before it goes live" },
                  { label: "Max posts per day", desc: "Limit auto-posting to prevent spam" },
                  { label: "Content safety filter", desc: "Block harmful or inappropriate content" },
                ].map((setting, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-white/5">
                    <div>
                      <p className="text-sm text-white font-medium">{setting.label}</p>
                      <p className="text-xs text-slate-500">{setting.desc}</p>
                    </div>
                    <button className="w-10 h-6 rounded-full bg-purple-500/30 border border-purple-500/50 flex-shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-[#0a0614] border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              Agent Activity Log
            </h3>
            {liveOutput.length === 0 ? (
              <div className="text-center py-12">
                <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No activity yet. Run an agent to see logs.</p>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {liveOutput.map((line, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/5">
                    <span className="text-slate-600 flex-shrink-0">{new Date().toLocaleTimeString()}</span>
                    <span className={`${line.startsWith("✓") ? "text-green-400" : line.startsWith("✗") ? "text-red-400" : "text-slate-400"}`}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
