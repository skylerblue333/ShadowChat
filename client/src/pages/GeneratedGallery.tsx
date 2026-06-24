import { useState } from "react";
import { Link } from "wouter";
import { Images, ExternalLink, ArrowRight, Sparkles, Code2, Globe, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

const SCREEN_CATEGORIES = [
  { cat: "Social",    count: 48, color: "from-cyan-500 to-blue-500",    icon: "💬", href: "/social"         },
  { cat: "Crypto",   count: 52, color: "from-yellow-500 to-orange-500", icon: "💎", href: "/crypto-hub"     },
  { cat: "AI",       count: 41, color: "from-purple-500 to-pink-500",   icon: "🤖", href: "/ai-brain"       },
  { cat: "Streaming",count: 34, color: "from-red-500 to-pink-500",      icon: "📺", href: "/streaming"      },
  { cat: "Gaming",   count: 29, color: "from-green-500 to-teal-500",    icon: "🎮", href: "/arcade"         },
  { cat: "Creator",  count: 38, color: "from-indigo-500 to-purple-500", icon: "🎨", href: "/creator-studio" },
  { cat: "Charity",  count: 22, color: "from-green-500 to-emerald-500", icon: "💚", href: "/charity"        },
  { cat: "Admin",    count: 43, color: "from-slate-500 to-gray-500",    icon: "⚙️", href: "/admin"          },
];

const STATS = [
  { label: "Total Screens", val: "307", icon: Images },
  { label: "Categories",    val: "8",   icon: Layers },
  { label: "Live Pages",    val: "120+",icon: Globe  },
  { label: "Components",    val: "340+",icon: Code2  },
];

export default function GeneratedGallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader
        backHref="/developer-protocol"
        icon={Images}
        title="Screen Gallery"
        subtitle="307 AI-generated UI screens across all platform modules"
      />

      {/* Hero banner */}
      <div className="card p-5 mb-6 bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold mb-1">AI-Generated Screen Library</h3>
            <p className="text-sm text-muted-foreground">
              Every screen was designed by AI and reviewed for production readiness.
              Click any category to navigate to the live version of that module.
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="card p-4 text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-xl font-black">{s.val}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SCREEN_CATEGORIES.map(cat => (
          <Link key={cat.cat} href={cat.href}>
            <div
              className={`card p-5 hover:border-slate-700/60 active:scale-[0.98] transition-all cursor-pointer group ${
                selected === cat.cat ? "border-primary/40 bg-primary/5" : ""
              }`}
              onClick={() => setSelected(cat.cat)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shrink-0`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{cat.cat}</h3>
                    <Badge variant="outline" className="text-[10px]">{cat.count} screens</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    View live {cat.cat.toLowerCase()} screens
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Download CTA */}
      <div className="mt-6 card p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Download Full Codebase</div>
          <div className="text-xs text-muted-foreground">All 307 screens + source code</div>
        </div>
        <a
          href="https://drive.google.com/file/d/1HKXHGjYNu2FUa41b4aiPelf75ThRZ_Za/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="btn-primary gap-2 text-xs">
            <ExternalLink className="w-3.5 h-3.5" /> Download ZIP
          </Button>
        </a>
      </div>
    </div>
  );
}
