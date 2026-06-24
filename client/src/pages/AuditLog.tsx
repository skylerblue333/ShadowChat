import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Eye, Filter, Download, User, Settings, Shield, DollarSign, MessageSquare } from "lucide-react";

const EVENTS = [
  { time: "2026-06-18 01:23:45", user: "skyler", action: "POST_CREATED", resource: "post:8821", ip: "192.168.1.1", status: "success" },
  { time: "2026-06-18 01:20:12", user: "admin", action: "USER_BANNED", resource: "user:4421", ip: "10.0.0.1", status: "success" },
  { time: "2026-06-18 01:15:33", user: "cryptodev", action: "STAKE_INITIATED", resource: "stake:9901", ip: "172.16.0.5", status: "success" },
  { time: "2026-06-18 01:10:08", user: "unknown", action: "LOGIN_FAILED", resource: "auth", ip: "203.0.113.5", status: "failed" },
  { time: "2026-06-18 01:05:55", user: "skyler", action: "SETTINGS_UPDATED", resource: "user:1001", ip: "192.168.1.1", status: "success" },
  { time: "2026-06-18 00:58:21", user: "nftcreator", action: "NFT_MINTED", resource: "nft:5512", ip: "10.0.0.8", status: "success" },
  { time: "2026-06-18 00:45:00", user: "defiwhale", action: "SWAP_EXECUTED", resource: "swap:3301", ip: "172.16.0.9", status: "success" },
  { time: "2026-06-18 00:30:14", user: "unknown", action: "RATE_LIMITED", resource: "api", ip: "198.51.100.3", status: "blocked" },
];

const ACTION_ICONS: Record<string, React.ElementType> = {
  POST_CREATED: MessageSquare, USER_BANNED: Shield, STAKE_INITIATED: DollarSign,
  LOGIN_FAILED: User, SETTINGS_UPDATED: Settings, NFT_MINTED: DollarSign,
  SWAP_EXECUTED: DollarSign, RATE_LIMITED: Shield,
};

export default function AuditLog() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? EVENTS : EVENTS.filter(e => e.status === filter);
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/security" icon={Eye} title="Audit Log" subtitle="Complete immutable trail of all platform actions and security events" />
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["all","success","failed","blocked"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
        <div className="ml-auto">
          <button className="btn-secondary text-xs flex items-center gap-1.5"><Download className="w-3 h-3" />Export CSV</button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-xs text-muted-foreground">
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3">Resource</th>
              <th className="text-left px-4 py-3">IP</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((e, i) => {
                const Icon = ACTION_ICONS[e.action] || Eye;
                return (
                  <tr key={i} className="border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.time}</td>
                    <td className="px-4 py-3 font-medium">{e.user}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-primary" />{e.action}</div></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.resource}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.ip}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "success" ? "bg-success/10 text-success" : e.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{e.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
