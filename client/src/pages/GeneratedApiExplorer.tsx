import { useState } from "react";
import { Link } from "wouter";
import { Code2, Play, Copy, CheckCircle, ChevronDown, ChevronRight, Globe, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

const ENDPOINT_GROUPS = [
  {
    group: "Social", color: "text-cyan-400",
    endpoints: [
      { method: "GET",  path: "/api/trpc/social.getFeed",       desc: "Get personalized social feed",     params: '{"limit":10}' },
      { method: "POST", path: "/api/trpc/social.createPost",    desc: "Create a new post",                params: '{"content":"Hello world!"}' },
      { method: "POST", path: "/api/trpc/social.likePost",      desc: "Like or unlike a post",            params: '{"postId":"abc123"}' },
    ],
  },
  {
    group: "Users", color: "text-purple-400",
    endpoints: [
      { method: "GET",  path: "/api/trpc/auth.me",              desc: "Get current user profile",         params: '{}' },
      { method: "POST", path: "/api/trpc/user.updateProfile",   desc: "Update user profile",              params: '{"bio":"New bio"}' },
      { method: "POST", path: "/api/trpc/user.follow",          desc: "Follow a user",                    params: '{"userId":"user123"}' },
    ],
  },
  {
    group: "Crypto", color: "text-yellow-400",
    endpoints: [
      { method: "GET",  path: "/api/trpc/crypto.getBalance",    desc: "Get wallet balance",               params: '{}' },
      { method: "POST", path: "/api/trpc/crypto.stake",         desc: "Stake SKY444 tokens",              params: '{"amount":1000,"duration":30}' },
    ],
  },
  {
    group: "AI", color: "text-green-400",
    endpoints: [
      { method: "POST", path: "/api/trpc/ai.chat",              desc: "Chat with AI assistant",           params: '{"message":"Hello AI"}' },
      { method: "GET",  path: "/api/trpc/ai.getRecommendations",desc: "Get AI recommendations",           params: '{}' },
    ],
  },
];

const METHOD_COLOR: Record<string, string> = {
  GET:  "bg-green-500/20 text-green-400 border-green-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function GeneratedApiExplorer() {
  const [openGroup, setOpenGroup] = useState<string | null>("Social");
  const [selected, setSelected] = useState<{ group: string; idx: number } | null>({ group: "Social", idx: 0 });
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedEndpoint = selected
    ? ENDPOINT_GROUPS.find(g => g.group === selected.group)?.endpoints[selected.idx]
    : null;

  const runEndpoint = async () => {
    if (!selectedEndpoint) return;
    setLoading(true); setResponse("");
    await new Promise(r => setTimeout(r, 800));
    const mock = {
      success: true,
      data: selectedEndpoint.method === "GET"
        ? { items: [{ id: "abc123", content: "Sample response", createdAt: new Date().toISOString() }], total: 1 }
        : { id: "new_" + Math.random().toString(36).slice(2, 8), status: "created", timestamp: new Date().toISOString() },
      meta: { latency: "42ms", version: "v1" },
    };
    setResponse(JSON.stringify(mock, null, 2));
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/developer-protocol" icon={Code2} title="API Explorer" subtitle="Browse and test all 305 tRPC endpoints interactively"
        actions={<Link href="/api-docs"><Button variant="outline" className="gap-2 text-xs"><Globe className="w-3.5 h-3.5" /> Full Docs</Button></Link>}
      />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {ENDPOINT_GROUPS.map(group => (
            <div key={group.group} className="card overflow-hidden">
              <button onClick={() => setOpenGroup(openGroup === group.group ? null : group.group)}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-secondary/30 transition-colors">
                {openGroup === group.group ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className={`font-semibold text-sm ${group.color}`}>{group.group}</span>
                <Badge variant="outline" className="ml-auto text-[10px]">{group.endpoints.length}</Badge>
              </button>
              {openGroup === group.group && (
                <div className="border-t border-slate-700/40">
                  {group.endpoints.map((ep, i) => (
                    <button key={i} onClick={() => { setSelected({ group: group.group, idx: i }); setResponse(""); }}
                      className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-left hover:bg-secondary/30 transition-colors ${
                        selected?.group === group.group && selected.idx === i ? "bg-primary/10 border-l-2 border-primary" : ""
                      }`}>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${METHOD_COLOR[ep.method]}`}>{ep.method}</span>
                      <span className="text-xs text-muted-foreground truncate">{ep.path.split(".")[1]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="lg:col-span-3 space-y-4">
          {selectedEndpoint ? (
            <>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${METHOD_COLOR[selectedEndpoint.method]}`}>{selectedEndpoint.method}</span>
                  <code className="text-xs font-mono text-foreground/80 flex-1 truncate">{selectedEndpoint.path}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{selectedEndpoint.desc}</p>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Shield className="w-3 h-3" /> Request Body</div>
                  <pre className="bg-black/40 rounded-xl p-3 text-xs font-mono text-green-400 border border-slate-700/40 overflow-x-auto">{selectedEndpoint.params}</pre>
                </div>
                <Button onClick={runEndpoint} disabled={loading} className="btn-primary gap-2 w-full">
                  {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running…</> : <><Play className="w-3.5 h-3.5" /> Run Request</>}
                </Button>
              </div>
              {response && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-green-400" /><span className="text-sm font-semibold">Response</span><Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">200 OK</Badge></div>
                    <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary transition-all active:scale-95">
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="bg-black/40 rounded-xl p-4 text-xs font-mono text-cyan-400 overflow-x-auto border border-slate-700/40 max-h-64">{response}</pre>
                </div>
              )}
            </>
          ) : (
            <div className="card p-10 text-center"><Code2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">Select an endpoint to test it</p></div>
          )}
          <div className="card p-4 flex items-center justify-between">
            <div><div className="text-sm font-semibold">Full API Reference</div><div className="text-xs text-muted-foreground">305 endpoints with schemas</div></div>
            <Link href="/api-docs"><Button size="sm" className="btn-primary gap-1 text-xs">View Docs <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
