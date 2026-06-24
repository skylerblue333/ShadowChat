/**
 * PricingEngine — Phase 30 Pricing + Conversion Engine
 * Action price matrix, value gap engine, AI upsell, conversion triggers
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, DollarSign, Lock, Zap, TrendingUp, RefreshCw, Crown, CheckCircle2 } from "lucide-react";

const ACTION_TIERS = [
  {
    tier: "A",
    name: "Basic Actions",
    price: "Free",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    desc: "Hook users with partial value",
    examples: ["Preview output", "Partial result", "Suggestions only"],
    conversion: "Creates desire for full result",
  },
  {
    tier: "B",
    name: "Standard Actions",
    price: "$0.99 – $4.99",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    desc: "Full AI output + usable asset",
    examples: ["Full AI output", "Downloadable result", "Usable asset"],
    conversion: "Low friction, high volume",
  },
  {
    tier: "C",
    name: "Premium Actions",
    price: "$5 – $20",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    desc: "Multi-step execution + automation",
    examples: ["Multi-step execution", "AI does the work", "Optimization + refinement"],
    conversion: "Power users, creators",
  },
  {
    tier: "D",
    name: "Power Actions",
    price: "$20+",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    desc: "Full workflows + agent execution",
    examples: ["Full workflows", "Agent execution", "Multi-system actions"],
    conversion: "Enterprise, high-value users",
  },
];

const VALUE_GAP_EXAMPLES = [
  {
    prompt: "Find me a job",
    free: "3 generic job search tips",
    paid: "AI applies to 20 jobs + optimizes resume + sends personalized pitches",
    paidPrice: "$12.99",
  },
  {
    prompt: "Help me sell something",
    free: "Basic selling tips template",
    paid: "SEO listing + pricing analysis + 10 photo prompts + marketplace comparison",
    paidPrice: "$9.99",
  },
  {
    prompt: "Make me a logo",
    free: "3 generic logo ideas described in text",
    paid: "10 custom concepts + SVG files + brand palette + usage guidelines",
    paidPrice: "$9.99",
  },
  {
    prompt: "Write my bio",
    free: "Generic bio template with your name",
    paid: "5 platform-specific bios + headline variations + keyword optimization",
    paidPrice: "$6.99",
  },
];

const UPSELL_CHAIN = [
  { step: 1, action: "User asks for logo", trigger: "AI generates free preview" },
  { step: 2, action: "User unlocks full logo ($9.99)", trigger: "AI suggests: 'Want a brand kit?'" },
  { step: 3, action: "User buys brand kit ($24.99)", trigger: "AI suggests: 'Want social media templates?'" },
  { step: 4, action: "User buys templates ($14.99)", trigger: "AI suggests: 'Want me to post for you?'" },
  { step: 5, action: "User subscribes ($25/mo)", trigger: "Recurring revenue locked in" },
];

const CONVERSION_FLOW = [
  "User enters",
  "AI welcome prompt",
  "Instant suggestion",
  "Paid action offer",
  "1-click payment",
  "Result delivered",
  "Upsell next action",
];

export default function PricingEngine() {
  const [activeTab, setActiveTab] = useState<"matrix" | "gap" | "upsell" | "flow">("matrix");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Pricing Engine
          </h1>
          <p className="text-xs text-muted-foreground">Phase 30 — Every interaction is a monetizable action</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="card p-4 bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20">
          <h3 className="font-bold text-sm mb-1">Core Thesis</h3>
          <p className="text-sm">"A value extraction system where every interaction is a monetizable action."</p>
          <p className="text-xs text-muted-foreground mt-1">You don't wait for users. You design triggers that force value decisions immediately.</p>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["matrix", "gap", "upsell", "flow"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "matrix" ? "Price Matrix" : t === "gap" ? "Value Gap" : t === "upsell" ? "Upsell Chain" : "Conv. Flow"}
            </button>
          ))}
        </div>

        {activeTab === "matrix" && (
          <div className="space-y-3">
            {ACTION_TIERS.map(tier => (
              <div key={tier.tier} className={`card p-4 border ${tier.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${tier.color}`}>{tier.tier}</span>
                    <span className="font-semibold text-sm">{tier.name}</span>
                  </div>
                  <span className={`font-bold text-sm ${tier.color}`}>{tier.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tier.desc}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {tier.examples.map(ex => (
                    <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">{ex}</span>
                  ))}
                </div>
                <div className="text-xs text-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  {tier.conversion}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "gap" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">The gap between free and paid is where revenue lives. Design it deliberately.</p>
            {VALUE_GAP_EXAMPLES.map((ex, i) => (
              <div key={i} className="card p-4">
                <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-primary">"{ex.prompt}"</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="text-xs font-medium text-green-400 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Free
                    </div>
                    <p className="text-xs text-muted-foreground">{ex.free}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Paid {ex.paidPrice}
                    </div>
                    <p className="text-xs">{ex.paid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "upsell" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">One action = chain of monetization. AI always suggests the next paid step.</p>
            {UPSELL_CHAIN.map((step, i) => (
              <div key={i} className="card p-3 flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === UPSELL_CHAIN.length - 1 ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.action}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {step.trigger}
                  </div>
                </div>
              </div>
            ))}
            <div className="card p-3 bg-green-500/10 border border-green-500/20 text-center">
              <Crown className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-sm font-bold">Total from one logo request: $74.97</div>
              <div className="text-xs text-muted-foreground">+ $25/mo recurring</div>
            </div>
          </div>
        )}

        {activeTab === "flow" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">First-time user monetization flow — designed to convert on first visit.</p>
            {CONVERSION_FLOW.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === 0 ? "bg-blue-500/20 text-blue-400" : i === CONVERSION_FLOW.length - 1 ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"}`}>
                  {i + 1}
                </div>
                <div className={`flex-1 p-3 rounded-lg border ${i === 4 ? "bg-primary/5 border-primary/20 font-medium" : "bg-secondary/20 border-border/30"}`}>
                  <span className="text-sm">{step}</span>
                  {i === 4 && <span className="text-xs text-primary ml-2">← Revenue moment</span>}
                </div>
                {i < CONVERSION_FLOW.length - 1 && (
                  <div className="text-muted-foreground text-xs">↓</div>
                )}
              </div>
            ))}
            <div className="card p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 mt-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold">Continuous Loop</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">After result delivery, AI immediately suggests next paid action. Loop never ends.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
