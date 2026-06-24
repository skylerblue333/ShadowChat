import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import {
  Bot, Send, Code, Shield, Zap, Play, Copy, Check,
  Terminal, CheckCircle, Rocket, Target, Code2, Brain, Activity,
  Database, Network, Globe, Lock, Cpu, Server, TrendingUp, Search,
  Filter, Users, GitBranch, Layers, Sparkles, RefreshCw, ChevronRight
} from "lucide-react";

type Language = "typescript"|"javascript"|"python"|"rust"|"go"|"solidity"|"sql"|"bash"|"yaml"|"json"|"css"|"html";
type CodeMode = "generate"|"review"|"refactor"|"test"|"document"|"audit";
type AgentCategory = "all"|"frontend"|"backend"|"ai"|"security"|"web3"|"devops"|"data"|"creative";

interface Agent {
  id: string;
  name: string;
  specialty: string;
  icon: string;
  color: string;
  desc: string;
  category: AgentCategory;
  level: number;
}

const AGENTS: Agent[] = [
  // Frontend
  { id:"PRISM",    name:"PRISM",    specialty:"Frontend UI",      icon:"🎨", color:"oklch(0.72 0.22 295)", desc:"React components & animations",       category:"frontend", level:5 },
  { id:"AURORA",   name:"AURORA",   specialty:"Design Systems",   icon:"✨", color:"oklch(0.76 0.18 320)", desc:"Tailwind, shadcn/ui, design tokens",   category:"frontend", level:4 },
  { id:"PIXEL",    name:"PIXEL",    specialty:"CSS/Animation",    icon:"🌈", color:"oklch(0.72 0.20 280)", desc:"Framer Motion, CSS animations",         category:"frontend", level:4 },
  { id:"BLADE",    name:"BLADE",    specialty:"Mobile-First",     icon:"📱", color:"oklch(0.72 0.18 260)", desc:"Responsive design, PWA, touch UX",     category:"frontend", level:3 },
  { id:"FLUX",     name:"FLUX",     specialty:"State Management", icon:"⚡", color:"oklch(0.76 0.19 185)", desc:"Zustand, React Query, tRPC hooks",     category:"frontend", level:4 },
  { id:"LUMEN",    name:"LUMEN",    specialty:"Data Visualization",icon:"📊", color:"oklch(0.78 0.16 65)", desc:"Recharts, D3, real-time charts",        category:"frontend", level:4 },
  { id:"WAVE",     name:"WAVE",     specialty:"Video/Media",      icon:"🎬", color:"oklch(0.72 0.16 200)", desc:"HLS, WebRTC, media pipelines",          category:"frontend", level:3 },
  // Backend
  { id:"FORGE",    name:"FORGE",    specialty:"Backend API",      icon:"🔧", color:"oklch(0.78 0.16 65)",  desc:"tRPC, Drizzle ORM, MySQL",             category:"backend",  level:5 },
  { id:"NOVA",     name:"NOVA",     specialty:"Full-Stack",       icon:"🌟", color:"oklch(0.76 0.19 185)", desc:"End-to-end feature generation",        category:"backend",  level:5 },
  { id:"PULSE",    name:"PULSE",    specialty:"Performance",      icon:"📈", color:"oklch(0.76 0.19 185)", desc:"Profiling, caching, optimization",     category:"backend",  level:4 },
  { id:"STREAM",   name:"STREAM",   specialty:"Real-Time",        icon:"🔄", color:"oklch(0.72 0.18 150)", desc:"WebSockets, SSE, Redis pub/sub",        category:"backend",  level:4 },
  { id:"VAULT",    name:"VAULT",    specialty:"Database",         icon:"🗄️", color:"oklch(0.72 0.16 240)", desc:"Schema design, migrations, queries",   category:"backend",  level:4 },
  { id:"QUEUE",    name:"QUEUE",    specialty:"Job Processing",   icon:"⏱️", color:"oklch(0.72 0.22 295)", desc:"BullMQ, cron jobs, background tasks",  category:"backend",  level:3 },
  { id:"PROXY",    name:"PROXY",    specialty:"API Gateway",      icon:"🌐", color:"oklch(0.72 0.16 240)", desc:"Rate limiting, routing, middleware",   category:"backend",  level:3 },
  // AI
  { id:"VECTOR",   name:"VECTOR",   specialty:"AI/ML",            icon:"🤖", color:"oklch(0.72 0.18 150)", desc:"LLM pipelines & AI features",          category:"ai",       level:5 },
  { id:"ORACLE",   name:"ORACLE",   specialty:"Code Review",      icon:"👁️", color:"oklch(0.72 0.22 295)", desc:"PR reviews & refactoring",             category:"ai",       level:4 },
  { id:"TITAN",    name:"TITAN",    specialty:"Orchestrator",     icon:"🧠", color:"oklch(0.82 0.16 80)",  desc:"Autonomous self-improvement",          category:"ai",       level:5 },
  { id:"SAGE",     name:"SAGE",     specialty:"RAG/Embeddings",   icon:"📚", color:"oklch(0.72 0.18 150)", desc:"Vector DBs, semantic search, RAG",     category:"ai",       level:4 },
  { id:"SYNTH",    name:"SYNTH",    specialty:"Content AI",       icon:"✍️", color:"oklch(0.76 0.19 185)", desc:"Copy generation, summarization, NLP",  category:"ai",       level:4 },
  { id:"MIND",     name:"MIND",     specialty:"Agent Framework",  icon:"🌀", color:"oklch(0.72 0.22 295)", desc:"Multi-agent coordination, planning",   category:"ai",       level:5 },
  { id:"ECHO",     name:"ECHO",     specialty:"Docs/Specs",       icon:"📝", color:"oklch(0.72 0.16 240)", desc:"OpenAPI, JSDoc, README generation",    category:"ai",       level:3 },
  { id:"LENS",     name:"LENS",     specialty:"Vision AI",        icon:"🔭", color:"oklch(0.72 0.18 150)", desc:"Image analysis, OCR, multimodal LLM",  category:"ai",       level:4 },
  // Security
  { id:"CIPHER",   name:"CIPHER",   specialty:"Security",         icon:"🔐", color:"oklch(0.62 0.22 25)",  desc:"Security audits & hardening",          category:"security", level:5 },
  { id:"SHIELD",   name:"SHIELD",   specialty:"Testing/QA",       icon:"🛡️", color:"oklch(0.72 0.18 150)", desc:"Vitest, coverage, TDD",                category:"security", level:4 },
  { id:"GHOST",    name:"GHOST",    specialty:"Penetration Test", icon:"👻", color:"oklch(0.62 0.22 25)",  desc:"Ethical hacking, OWASP, CVE scanning", category:"security", level:4 },
  { id:"WARD",     name:"WARD",     specialty:"Auth/Identity",    icon:"🔑", color:"oklch(0.72 0.16 240)", desc:"OAuth2, JWT, RBAC, MFA",               category:"security", level:4 },
  { id:"SCAN",     name:"SCAN",     specialty:"SAST/DAST",        icon:"🔍", color:"oklch(0.62 0.22 25)",  desc:"Static analysis, dependency audit",    category:"security", level:3 },
  // Web3
  { id:"NEXUS",    name:"NEXUS",    specialty:"Web3/DeFi",        icon:"⛓️", color:"oklch(0.72 0.22 295)", desc:"Smart contracts & DeFi protocols",     category:"web3",     level:5 },
  { id:"CHAIN",    name:"CHAIN",    specialty:"Smart Contracts",  icon:"📜", color:"oklch(0.72 0.22 295)", desc:"Solidity, Hardhat, Foundry, audits",   category:"web3",     level:4 },
  { id:"SWAP",     name:"SWAP",     specialty:"DEX/AMM",          icon:"🔀", color:"oklch(0.76 0.19 185)", desc:"Uniswap V3, liquidity pools, routing", category:"web3",     level:4 },
  { id:"TOKEN",    name:"TOKEN",    specialty:"Tokenomics",       icon:"🪙", color:"oklch(0.78 0.16 65)",  desc:"ERC-20/721/1155, vesting, staking",    category:"web3",     level:4 },
  { id:"BRIDGE",   name:"BRIDGE",   specialty:"Cross-Chain",      icon:"🌉", color:"oklch(0.72 0.16 240)", desc:"LayerZero, Wormhole, bridge design",   category:"web3",     level:3 },
  // DevOps
  { id:"ATLAS",    name:"ATLAS",    specialty:"DevOps",           icon:"🌐", color:"oklch(0.72 0.16 240)", desc:"CI/CD, Docker, Kubernetes",            category:"devops",   level:5 },
  { id:"INFRA",    name:"INFRA",    specialty:"Infrastructure",   icon:"🏗️", color:"oklch(0.72 0.16 240)", desc:"Terraform, AWS, GCP, CDN",             category:"devops",   level:4 },
  { id:"LOG",      name:"LOG",      specialty:"Observability",    icon:"📡", color:"oklch(0.72 0.18 150)", desc:"Grafana, Prometheus, Datadog",         category:"devops",   level:3 },
  // Data
  { id:"PRAXIS",   name:"PRAXIS",   specialty:"Data Engineering", icon:"🔬", color:"oklch(0.72 0.18 150)", desc:"ETL pipelines, data warehouses",       category:"data",     level:4 },
  { id:"METRIC",   name:"METRIC",   specialty:"Analytics",        icon:"📉", color:"oklch(0.76 0.19 185)", desc:"Business intelligence, KPIs, funnels", category:"data",     level:4 },
  { id:"GRAPH",    name:"GRAPH",    specialty:"Graph DB",         icon:"🕸️", color:"oklch(0.72 0.16 240)", desc:"Neo4j, knowledge graphs, relations",   category:"data",     level:3 },
  // Creative
  { id:"MUSE",     name:"MUSE",     specialty:"Creative AI",      icon:"🎭", color:"oklch(0.72 0.22 295)", desc:"Story generation, game design, UX",    category:"creative", level:4 },
  { id:"ARIA",     name:"ARIA",     specialty:"Voice/Audio",      icon:"🎵", color:"oklch(0.76 0.19 185)", desc:"TTS, STT, audio processing",           category:"creative", level:3 },
  { id:"CANVAS",   name:"CANVAS",   specialty:"Image AI",         icon:"🖼️", color:"oklch(0.72 0.22 295)", desc:"Image generation, editing, vision",    category:"creative", level:4 },
  { id:"STORY",    name:"STORY",    specialty:"Narrative",        icon:"📖", color:"oklch(0.72 0.16 240)", desc:"Onboarding flows, UX copy, tutorials", category:"creative", level:3 },
  { id:"BRAND",    name:"BRAND",    specialty:"Branding",         icon:"💎", color:"oklch(0.82 0.16 80)",  desc:"Logo, colors, identity systems",       category:"creative", level:3 },
  { id:"GAME",     name:"GAME",     specialty:"Game Dev",         icon:"🎮", color:"oklch(0.72 0.22 295)", desc:"Game logic, mechanics, leaderboards",  category:"creative", level:4 },
];

const CATEGORIES: { id: AgentCategory; label: string; icon: React.ReactNode }[] = [
  { id:"all",      label:"All 44",    icon:<Users className="w-3.5 h-3.5"/> },
  { id:"frontend", label:"Frontend",  icon:<Layers className="w-3.5 h-3.5"/> },
  { id:"backend",  label:"Backend",   icon:<Server className="w-3.5 h-3.5"/> },
  { id:"ai",       label:"AI/ML",     icon:<Brain className="w-3.5 h-3.5"/> },
  { id:"security", label:"Security",  icon:<Shield className="w-3.5 h-3.5"/> },
  { id:"web3",     label:"Web3",      icon:<Network className="w-3.5 h-3.5"/> },
  { id:"devops",   label:"DevOps",    icon:<Globe className="w-3.5 h-3.5"/> },
  { id:"data",     label:"Data",      icon:<Database className="w-3.5 h-3.5"/> },
  { id:"creative", label:"Creative",  icon:<Sparkles className="w-3.5 h-3.5"/> },
];

const LANGUAGES: Language[] = ["typescript","javascript","python","rust","go","solidity","sql","bash","yaml","json","css","html"];
const MODES: {value:CodeMode;label:string}[] = [
  {value:"generate",label:"Generate"},{value:"review",label:"Review"},
  {value:"refactor",label:"Refactor"},{value:"test",label:"Write Tests"},
  {value:"document",label:"Document"},{value:"audit",label:"Security Audit"},
];

interface ChatMsg { role:"user"|"assistant"; content:string; timestamp:Date; agentId?: string; }

function CopyBtn({ text }: { text:string }) {
  const [copied,setCopied] = useState(false);
  return (
    <button onClick={() => {navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3.5 h-3.5 text-purple-400"/> : <Copy className="w-3.5 h-3.5"/>}
    </button>
  );
}

function ChatPanel({ agent }: { agent: Agent }) {
  const [msgs,setMsgs] = useState<ChatMsg[]>([]);
  const [input,setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMut = trpc.ai.chat.useMutation({
    onSuccess: (d) => {
      setMsgs(prev => [...prev, { role:"assistant", content:d.reply, timestamp:new Date(), agentId: agent.id }]);
      setTimeout(() => scrollRef.current?.scrollTo({top:99999,behavior:"smooth"}), 50);
    }
  });
  const send = useCallback(() => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    setMsgs(prev => [...prev, { role:"user", content:msg, timestamp:new Date() }]);
    chatMut.mutate({ message:`[${agent.name} - ${agent.specialty}] ${msg}`, systemPrompt:`You are ${agent.name}, an AI coding agent specializing in ${agent.specialty}. ${agent.desc}. Provide expert, production-ready code and advice.` });
    setTimeout(() => scrollRef.current?.scrollTo({top:99999,behavior:"smooth"}), 50);
  }, [input, chatMut, agent]);

  return (
    <div className="flex flex-col h-[520px]">
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <span className="text-2xl">{agent.icon}</span>
        <div>
          <div className="font-bold text-sm" style={{color:agent.color}}>{agent.name}</div>
          <div className="text-xs text-muted-foreground">{agent.specialty} · Level {agent.level}</div>
        </div>
        <Badge className="ml-auto text-xs" style={{backgroundColor:`${agent.color}20`,color:agent.color,border:`1px solid ${agent.color}40`}}>
          {agent.category.toUpperCase()}
        </Badge>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {msgs.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <span className="text-3xl block mb-2">{agent.icon}</span>
            <p className="font-medium">{agent.name} ready</p>
            <p className="text-xs mt-1">{agent.desc}</p>
          </div>
        )}
        {msgs.map((m,i) => (
          <div key={i} className={`flex gap-2 ${m.role==="user"?"justify-end":""}`}>
            {m.role==="assistant" && <span className="text-lg shrink-0 mt-0.5">{agent.icon}</span>}
            <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${m.role==="user"?"bg-purple-600/30 text-foreground":"bg-white/5 text-foreground"}`}>
              <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              {m.role==="assistant" && <CopyBtn text={m.content}/>}
            </div>
          </div>
        ))}
        {chatMut.isPending && (
          <div className="flex gap-2">
            <span className="text-lg">{agent.icon}</span>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                {[0,1,2].map(i=><span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <Textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={`Ask ${agent.name} anything about ${agent.specialty}...`}
          className="min-h-[44px] max-h-[120px] resize-none bg-white/5 border-white/10 text-sm"/>
        <Button onClick={send} disabled={chatMut.isPending||!input.trim()} size="sm" className="self-end shrink-0" style={{backgroundColor:agent.color}}>
          <Send className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  );
}

function SprintPanel() {
  const [goal, setGoal] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["NOVA","FORGE","SHIELD"]);
  const [result, setResult] = useState("");
  const [running, setRunning] = useState(false);
  const chatMut = trpc.ai.chat.useMutation();

  const runSprint = async () => {
    if (!goal.trim() || selectedAgents.length === 0) return;
    setRunning(true);
    setResult("");
    const agentList = selectedAgents.map(id => AGENTS.find(a=>a.id===id)!).filter(Boolean);
    const plan = `Multi-Agent Sprint Plan:\nGoal: ${goal}\nAgents: ${agentList.map(a=>`${a.name}(${a.specialty})`).join(", ")}\n\nProvide a detailed implementation plan with each agent's specific tasks, code snippets, and integration points. Format as a structured sprint plan.`;
    try {
      const res = await chatMut.mutateAsync({ message: plan, systemPrompt: "You are TITAN, the orchestrator AI. Coordinate a multi-agent sprint and provide a comprehensive implementation plan." });
      setResult(res.reply);
    } finally {
      setRunning(false);
    }
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(a=>a!==id) : [...prev, id]);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400"/>
          <span className="font-bold text-purple-300">Multi-Agent Sprint Mode</span>
          <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">TITAN Orchestrated</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select agents and define a sprint goal. TITAN will coordinate all selected agents into a unified implementation plan.</p>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">Sprint Goal</label>
          <Textarea value={goal} onChange={e=>setGoal(e.target.value)}
            placeholder="e.g. Build a real-time crypto trading dashboard with WebSocket price feeds, candlestick charts, and automated alerts..."
            className="bg-white/5 border-white/10 text-sm min-h-[80px]"/>
        </div>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">Select Agents ({selectedAgents.length} selected)</label>
          <div className="flex flex-wrap gap-2">
            {AGENTS.slice(0,20).map(a => (
              <button key={a.id} onClick={()=>toggleAgent(a.id)}
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${selectedAgents.includes(a.id)?"ring-1":"opacity-50"}`}
                style={{backgroundColor:`${a.color}20`,color:a.color}}>
                {a.icon} {a.name}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={runSprint} disabled={running||!goal.trim()||selectedAgents.length===0}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
          {running ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin"/>Running Sprint...</> : <><Rocket className="w-4 h-4 mr-2"/>Launch Sprint</>}
        </Button>
      </div>
      {result && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400"/>
              <span className="text-sm font-medium text-green-300">Sprint Plan Generated</span>
            </div>
            <CopyBtn text={result}/>
          </div>
          <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}

function CodePanel() {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [lang, setLang] = useState<Language>("typescript");
  const [mode, setMode] = useState<CodeMode>("generate");
  const [output, setOutput] = useState("");
  const [activeAgent, setActiveAgent] = useState("NOVA");
  const genMut = trpc.ai.generateCode.useMutation({ onSuccess: d => setOutput(d.code) });
  const reviewMut = trpc.ai.reviewCode.useMutation({ onSuccess: (d: any) => setOutput(d.review || JSON.stringify(d)) });
  const refactorMut = trpc.ai.chat.useMutation({ onSuccess: d => setOutput(d.reply) });
  const testMut = trpc.ai.chat.useMutation({ onSuccess: d => setOutput(d.reply) });
  const auditMut = trpc.ai.chat.useMutation({ onSuccess: d => setOutput(d.reply) });

  const run = () => {
    const agent = AGENTS.find(a=>a.id===activeAgent);
    const ctx = agent ? `You are ${agent.name}, specializing in ${agent.specialty}. ${agent.desc}.` : undefined;
    if (mode==="generate") genMut.mutate({ prompt, language:lang });
    else if (mode==="review") reviewMut.mutate({ code });
    else if (mode==="refactor") refactorMut.mutate({ message:`Refactor this ${lang} code. Goal: ${prompt}\n\n${code}`, systemPrompt:ctx });
    else if (mode==="test") testMut.mutate({ message:`Write comprehensive tests for this ${lang} code:\n\n${code}`, systemPrompt:ctx });
    else if (mode==="audit") auditMut.mutate({ message:`Security audit this ${lang} code. List all vulnerabilities with severity and fixes:\n\n${code}`, systemPrompt:ctx });
    else genMut.mutate({ prompt:`Document this code:\n${code}`, language:lang });
  };

  const isPending = genMut.isPending||reviewMut.isPending||refactorMut.isPending||testMut.isPending||auditMut.isPending;

  const agent = AGENTS.find(a=>a.id===activeAgent);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select value={mode} onValueChange={v=>setMode(v as CodeMode)}>
          <SelectTrigger className="w-36 bg-white/5 border-white/10 text-sm"><SelectValue/></SelectTrigger>
          <SelectContent>{MODES.map(m=><SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={lang} onValueChange={v=>setLang(v as Language)}>
          <SelectTrigger className="w-36 bg-white/5 border-white/10 text-sm"><SelectValue/></SelectTrigger>
          <SelectContent>{LANGUAGES.map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={activeAgent} onValueChange={setActiveAgent}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-sm">
            <SelectValue placeholder="Agent"/>
          </SelectTrigger>
          <SelectContent>
            {AGENTS.slice(0,20).map(a=><SelectItem key={a.id} value={a.id}>{a.icon} {a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {agent && <Badge style={{backgroundColor:`${agent.color}20`,color:agent.color,border:`1px solid ${agent.color}40`}} className="text-xs">{agent.specialty}</Badge>}
      </div>
      {(mode==="generate"||mode==="refactor"||mode==="document") && (
        <Textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe what to generate..." className="bg-white/5 border-white/10 text-sm min-h-[80px]"/>
      )}
      {mode!=="generate" && (
        <Textarea value={code} onChange={e=>setCode(e.target.value)} placeholder="Paste your code here..." className="bg-white/5 border-white/10 font-mono text-xs min-h-[160px]"/>
      )}
      <Button onClick={run} disabled={isPending} className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
        {isPending ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin"/>Processing...</> : <><Play className="w-4 h-4 mr-2"/>{MODES.find(m=>m.value===mode)?.label}</>}
      </Button>
      {output && (
        <div className="rounded-xl bg-black/40 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {agent && <span>{agent.icon}</span>}
              <span className="text-xs text-muted-foreground font-mono">{mode.toUpperCase()} OUTPUT</span>
            </div>
            <CopyBtn text={output}/>
          </div>
          <pre className="text-xs text-green-300 whitespace-pre-wrap overflow-x-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default function AIEngineer() {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState<AgentCategory>("all");
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [activeTab, setActiveTab] = useState("agents");

  const filtered = AGENTS.filter(a => {
    const matchCat = category === "all" || a.category === category;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">AI Engineer Studio</h2>
          <p className="text-muted-foreground mb-6">44 specialized AI agents at your command</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-500">
            <a href={getLoginUrl()}>Login to Access</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="AI Engineer Studio" subtitle="44 Specialized Agents · Multi-Agent Sprints · Production Code"/>
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="agents"><Users className="w-4 h-4 mr-1.5"/>Agent Panel</TabsTrigger>
            <TabsTrigger value="code"><Code2 className="w-4 h-4 mr-1.5"/>Code Studio</TabsTrigger>
            <TabsTrigger value="sprint"><Rocket className="w-4 h-4 mr-1.5"/>Sprint Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Agent Selector */}
              <div className="lg:col-span-1 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                  <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents..." className="pl-9 bg-white/5 border-white/10 text-sm"/>
                </div>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={()=>setCategory(cat.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${category===cat.id?"bg-purple-600 text-white":"bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                      {cat.icon}{cat.label}
                    </button>
                  ))}
                </div>
                {/* Agent List */}
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {filtered.map(agent => (
                    <button key={agent.id} onClick={()=>setSelectedAgent(agent)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${selectedAgent.id===agent.id?"ring-1 ring-purple-500 bg-white/10":"bg-white/5 hover:bg-white/8"}`}>
                      <span className="text-xl">{agent.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold" style={{color:agent.color}}>{agent.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{agent.specialty}</div>
                      </div>
                      <div className="flex">
                        {Array.from({length:5}).map((_,i)=>(
                          <span key={i} className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i<agent.level?"bg-current opacity-80":"bg-white/20"}`} style={{color:agent.color}}/>
                        ))}
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No agents found</p>}
                </div>
                <div className="text-xs text-muted-foreground text-center">{filtered.length} of {AGENTS.length} agents</div>
              </div>
              {/* Right: Chat with selected agent */}
              <div className="lg:col-span-2 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <ChatPanel agent={selectedAgent}/>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5 text-purple-400"/>
                  <h3 className="font-bold">Code Studio</h3>
                  <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">Real LLM</Badge>
                </div>
                <CodePanel/>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sprint">
            <div className="max-w-3xl mx-auto">
              <SprintPanel/>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Total Agents", value:"44", color:"text-purple-400" },
            { label:"Categories", value:"8", color:"text-cyan-400" },
            { label:"Languages", value:"12", color:"text-green-400" },
            { label:"Sprint Mode", value:"Active", color:"text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
              <div className={`${s.color} mx-auto mb-2 flex justify-center`}><Bot className="w-4 h-4"/></div>
              <div className="text-2xl font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
