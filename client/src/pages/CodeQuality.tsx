import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Code2, CheckCircle, AlertTriangle, Bug, Shield, Zap, BarChart3, GitBranch, TestTube, RefreshCw } from "lucide-react";

export default function CodeQuality() {
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/developer" icon={Code2} title="Code Quality Dashboard" subtitle="Real-time code health, test coverage, security audits, and technical debt tracking"
        actions={<Button className="btn-primary gap-2"><RefreshCw className="w-4 h-4" />Run Audit</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TestTube} label="Test Coverage" value="78%" change={5.2} color="success" />
        <StatCard icon={Bug} label="Open Bugs" value="3" change={-40} color="warning" />
        <StatCard icon={Shield} label="Security Score" value="A+" color="primary" />
        <StatCard icon={Zap} label="Performance" value="98/100" change={2.1} color="accent" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Code Health</h3>
          {[{label:"TypeScript Coverage",val:94},{label:"ESLint Pass Rate",val:98},{label:"Bundle Size Optimized",val:87},{label:"Dependency Security",val:100}].map(m => (
            <div key={m.label} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span>{m.label}</span><span className="font-mono text-muted-foreground">{m.val}%</span></div>
              <div className="h-2 bg-secondary rounded-full"><div className={`h-full rounded-full ${m.val > 95 ? "bg-success" : m.val > 80 ? "bg-primary" : "bg-warning"}`} style={{width:`${m.val}%`}} /></div>
            </div>
          ))}
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><GitBranch className="w-5 h-5 text-primary" />Recent Audits</h3>
          {[{label:"Dependency Audit",status:"pass",time:"2h ago"},{label:"Security Scan",status:"pass",time:"6h ago"},{label:"Performance Test",status:"warn",time:"12h ago"},{label:"Type Check",status:"pass",time:"1h ago"}].map(a => (
            <div key={a.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-sm">{a.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{a.time}</span>
                <Badge variant={a.status === "pass" ? "default" : "secondary"} className="text-xs">{a.status}</Badge>
              </div>
            </div>
          ))}
          <Link href="/ai-engineer"><Button size="sm" className="btn-primary mt-4 w-full gap-2"><Zap className="w-4 h-4" />Run Full Audit</Button></Link>
        </div>
      </div>
    </div>
  );
}
