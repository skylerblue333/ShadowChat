import { useState } from "react";
import { Bot, Code, Zap, Save, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentBuilder() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tools, setTools] = useState(["web_search", "code_exec"]);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Agent Builder</h1>
            <p className="text-slate-400">Design and deploy your own AI agent</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 gap-2"><Play className="h-4 w-4" /> Test</Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white gap-2"><Save className="h-4 w-4" /> Deploy</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="font-bold text-white mb-4">Agent Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Agent Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. TradingBot Pro"
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this agent do?"
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none h-20" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="font-bold text-white mb-4">System Prompt</h2>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="You are an expert AI agent that..."
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none h-40 font-mono text-sm" />
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Tools & Capabilities</h2>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 gap-1"><Plus className="h-3 w-3" /> Add Tool</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map(t => (
                <div key={t} className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-1.5">
                  <Code className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{t}</span>
                  <button onClick={() => setTools(tools.filter(x => x !== t))}><Trash2 className="h-3 w-3 text-slate-500 hover:text-red-400" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
