import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

const MOCK_KEYS = [
  { id: 1, name: "Production API", key: "sky_live_4444xxxxxxxxxxxxxxxxxxxx", created: "Jun 1, 2026", lastUsed: "2 min ago", permissions: ["read", "write"], status: "active" },
  { id: 2, name: "Analytics Bot", key: "sky_live_8888xxxxxxxxxxxxxxxxxxxx", created: "May 15, 2026", lastUsed: "1 hr ago", permissions: ["read"], status: "active" },
  { id: 3, name: "Test Key", key: "sky_test_1234xxxxxxxxxxxxxxxxxxxx", created: "Apr 20, 2026", lastUsed: "3 days ago", permissions: ["read", "write", "admin"], status: "inactive" },
];

export default function APIKeys() {
  const [visible, setVisible] = useState<number | null>(null);
  return (
    <div className="container py-8 max-w-3xl animate-page-in">
      <PageHeader backHref="/security" icon={Key} title="API Keys" subtitle="Manage developer API keys for programmatic platform access" />
      <div className="card p-4 mb-6 flex items-start gap-3 bg-warning/5 border-warning/20">
        <Shield className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">Keep your API keys secret. Never expose them in client-side code or public repositories. Rotate keys immediately if compromised.</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Your API Keys</h3>
        <button className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" />New Key</button>
      </div>
      <div className="space-y-3">
        {MOCK_KEYS.map(k => (
          <div key={k.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-sm">{k.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  {k.permissions.map(p => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{p}</span>)}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${k.status === "active" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>{k.status}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 font-mono text-xs">
              <span className="flex-1 truncate">{visible === k.id ? k.key : k.key.slice(0, 12) + "••••••••••••••••"}</span>
              <button onClick={() => setVisible(visible === k.id ? null : k.id)} className="text-muted-foreground hover:text-foreground">{visible === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success("API key copied!"); }} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Created {k.created}</span>
              <span>Last used: {k.lastUsed}</span>
              <button className="ml-auto text-destructive hover:text-destructive/80 flex items-center gap-1"><Trash2 className="w-3 h-3" />Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
