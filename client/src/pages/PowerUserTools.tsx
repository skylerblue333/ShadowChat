/**
 * PowerUserTools — Unhidden Mode: Power User Toolkit
 * Keyboard shortcuts, bulk actions, data export, advanced filters, dev tools
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  Wrench, ArrowLeft, Keyboard, Download, Filter, Zap, ChevronRight,
  Copy, RefreshCw, Settings, Shield, BarChart2, Users, Activity,
  CheckSquare, Square, AlertTriangle
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const KEYBOARD_SHORTCUTS = [
  { category: "Navigation",  shortcuts: [
    { keys: ["G", "H"],   action: "Go to Home"          },
    { keys: ["G", "F"],   action: "Go to Feed"          },
    { keys: ["G", "W"],   action: "Go to Wallet"        },
    { keys: ["G", "P"],   action: "Go to Profile"       },
    { keys: ["G", "S"],   action: "Go to Settings"      },
    { keys: ["/"],         action: "Focus search"        },
    { keys: ["?"],         action: "Show shortcuts"      },
  ]},
  { category: "Actions",     shortcuts: [
    { keys: ["N"],         action: "New post"            },
    { keys: ["C"],         action: "Compose DM"          },
    { keys: ["L"],         action: "Like focused post"   },
    { keys: ["R"],         action: "Reply to post"       },
    { keys: ["B"],         action: "Bookmark post"       },
    { keys: ["Shift","S"], action: "Share post"          },
  ]},
  { category: "OS Shell",    shortcuts: [
    { keys: ["Ctrl","K"],  action: "Open command bar"   },
    { keys: ["Ctrl","M"],  action: "Toggle mic"         },
    { keys: ["Esc"],       action: "Close overlay"      },
    { keys: ["Tab"],       action: "Switch shell mode"  },
  ]},
];

const EXPORT_OPTIONS = [
  { label: "My Posts",         key: "posts",         icon: "📝" },
  { label: "My Followers",     key: "followers",     icon: "👥" },
  { label: "Transaction History", key: "txns",       icon: "💸" },
  { label: "Staking Positions",key: "staking",       icon: "🔒" },
  { label: "AI Chat History",  key: "ai_chat",       icon: "🤖" },
  { label: "Referral Data",    key: "referrals",     icon: "🔗" },
];

const FEATURE_FLAGS = [
  { label: "Experimental Feed Ranking", key: "exp_feed",       enabled: false },
  { label: "Beta DM Encryption",        key: "beta_dm_enc",    enabled: true  },
  { label: "AI Post Suggestions",       key: "ai_suggestions", enabled: true  },
  { label: "Voice Nav (Global)",        key: "voice_nav",      enabled: true  },
  { label: "World Simulation",          key: "world_sim",      enabled: true  },
  { label: "Dark Pattern Detection",    key: "dark_pattern",   enabled: false },
  { label: "Reels Auto-Play",           key: "reels_auto",     enabled: true  },
  { label: "NFT Lazy Minting",          key: "nft_lazy",       enabled: false },
];

export default function PowerUserTools() {
  const [flags, setFlags] = useState(
    Object.fromEntries(FEATURE_FLAGS.map(f => [f.key, f.enabled]))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState<string | null>(null);

  const { data: me } = trpc.auth.me.useQuery();

  const toggleFlag = (key: string) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    const flag = FEATURE_FLAGS.find(f => f.key === key);
    toast.success(`${flag?.label} ${flags[key] ? "disabled" : "enabled"}`);
  };

  const toggleExport = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleExport = async () => {
    if (selected.size === 0) { toast.error("Select at least one data type"); return; }
    setExporting("running");
    await new Promise(r => setTimeout(r, 1200));
    const data = {
      exportedAt: new Date().toISOString(),
      user: me?.name ?? "unknown",
      datasets: Array.from(selected),
      note: "Data export from ShadowChat Power Tools",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `shadowchat-export-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
    toast.success(`Exported ${selected.size} dataset(s)`);
  };

  const copyUID = () => {
    if (me?.id) {
      navigator.clipboard.writeText(String(me.id));
      toast.success("User ID copied");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/unhidden">
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-400" />
            Power User Tools
          </h1>
          <p className="text-xs text-muted-foreground">Shortcuts, exports, feature flags, dev tools</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        {me && (
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{me.name}</p>
              <p className="text-xs text-muted-foreground">@{me.username} · {me.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-xs font-mono text-foreground">{me.id}</p>
              </div>
              <button onClick={copyUID} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Keyboard Shortcuts</h2>
          </div>
          <div className="divide-y divide-border/30">
            {KEYBOARD_SHORTCUTS.map(cat => (
              <div key={cat.category} className="px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cat.category}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {cat.shortcuts.map(sc => (
                    <div key={sc.action} className="flex items-center justify-between py-1">
                      <span className="text-xs text-foreground/80">{sc.action}</span>
                      <div className="flex items-center gap-0.5">
                        {sc.keys.map((k, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-secondary border border-border rounded text-xs font-mono">{k}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Feature Flags</h2>
            <span className="ml-auto text-xs text-muted-foreground">{Object.values(flags).filter(Boolean).length} enabled</span>
          </div>
          <div className="divide-y divide-border/30">
            {FEATURE_FLAGS.map(flag => (
              <div key={flag.key} className="px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div>
                  <p className="text-sm">{flag.label}</p>
                  {!flag.enabled && <p className="text-xs text-yellow-400/70">Experimental</p>}
                </div>
                <button onClick={() => toggleFlag(flag.key)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${flags[flag.key] ? "bg-primary" : "bg-secondary"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${flags[flag.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Download className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Data Export</h2>
          </div>
          <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EXPORT_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => toggleExport(opt.key)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors text-left ${
                  selected.has(opt.key) ? "border-primary/50 bg-primary/10" : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
                }`}>
                {selected.has(opt.key)
                  ? <CheckSquare className="w-3.5 h-3.5 text-primary shrink-0" />
                  : <Square className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <span className="text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-3">
            <button onClick={handleExport} disabled={exporting === "running" || selected.size === 0}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              {exporting === "running" ? "Preparing export…" : `Export ${selected.size > 0 ? `(${selected.size})` : ""} as JSON`}
            </button>
          </div>
        </div>

        {/* Quick Links to other power tools */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "System Observability", path: "/system-observability", icon: Activity  },
            { label: "Automation Engine",     path: "/automation-engine",    icon: Zap       },
            { label: "Security Dashboard",    path: "/security-dashboard",   icon: Shield    },
            { label: "Unhidden Mode",         path: "/unhidden",             icon: Wrench    },
          ].map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
