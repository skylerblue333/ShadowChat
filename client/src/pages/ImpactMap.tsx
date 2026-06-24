/**
 * ImpactMap — Charity campaign geographic impact visualization
 * Shows donation flows, campaign locations, and beneficiary stats
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Globe, Heart, TrendingUp, Users, ChevronLeft, MapPin, Zap, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

const REGIONS = [
  { id: 1, name: "Sub-Saharan Africa", country: "Kenya", lat: -1.2, lng: 36.8, raised: 128000, goal: 200000, campaigns: 12, beneficiaries: 4400, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  { id: 2, name: "South Asia", country: "Bangladesh", lat: 23.7, lng: 90.4, raised: 87000, goal: 150000, campaigns: 8, beneficiaries: 3100, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  { id: 3, name: "Southeast Asia", country: "Philippines", lat: 14.6, lng: 121.0, raised: 64000, goal: 100000, campaigns: 6, beneficiaries: 2200, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
  { id: 4, name: "Latin America", country: "Colombia", lat: 4.7, lng: -74.1, raised: 43000, goal: 80000, campaigns: 5, beneficiaries: 1800, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  { id: 5, name: "Middle East", country: "Jordan", lat: 31.9, lng: 35.9, raised: 95000, goal: 120000, campaigns: 9, beneficiaries: 3600, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30" },
  { id: 6, name: "Eastern Europe", country: "Ukraine", lat: 50.4, lng: 30.5, raised: 210000, goal: 300000, campaigns: 15, beneficiaries: 8900, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
];

export default function ImpactMap() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<typeof REGIONS[0] | null>(null);

  const { data: campaigns = [] } = trpc.charity.campaigns.useQuery({ limit: 20, offset: 0 });

  const totalRaised = REGIONS.reduce((s, r) => s + r.raised, 0);
  const totalBeneficiaries = REGIONS.reduce((s, r) => s + r.beneficiaries, 0);
  const totalCampaigns = REGIONS.reduce((s, r) => s + r.campaigns, 0);

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-950/40 via-[#050508] to-teal-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 bg-green-500/15 top-0 right-1/4" />
          <div className="glow-orb w-48 h-48 bg-teal-500/10 bottom-0 left-1/4" />
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black rainbow-text">Impact Map</h1>
              <p className="text-muted-foreground metallic-shimmer text-sm">Real-time global charity impact — where your donations are changing lives</p>
            </div>
          </div>

          {/* Global stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Total Raised", value: `$${(totalRaised / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-green-400" },
              { label: "Beneficiaries", value: totalBeneficiaries.toLocaleString(), icon: Users, color: "text-blue-400" },
              { label: "Active Campaigns", value: totalCampaigns, icon: Heart, color: "text-rose-400" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/3 p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map visualization (SVG world map placeholder with region dots) */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-white/3 p-6 relative overflow-hidden" style={{ minHeight: 360 }}>
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <h2 className="text-lg font-bold text-white mb-4 relative z-10">Global Donation Flows</h2>

              {/* SVG world map simplified */}
              <div className="relative z-10 w-full" style={{ height: 280 }}>
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                  {/* Simplified world outline */}
                  <ellipse cx="400" cy="200" rx="380" ry="180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  {/* Grid lines */}
                  {[-60, -30, 0, 30, 60].map(lat => (
                    <line key={lat} x1="20" y1={200 - lat * 1.5} x2="780" y2={200 - lat * 1.5} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                  {[-120, -60, 0, 60, 120].map(lng => (
                    <line key={lng} x1={400 + lng * 2.5} y1="20" x2={400 + lng * 2.5} y2="380" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                </svg>

                {/* Region dots overlaid */}
                {REGIONS.map(r => {
                  const x = ((r.lng + 180) / 360) * 100;
                  const y = ((90 - r.lat) / 180) * 100;
                  const pct = r.raised / r.goal;
                  const size = 8 + pct * 16;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelected(selected?.id === r.id ? null : r)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      title={r.country}
                    >
                      <div
                        className={`rounded-full border-2 ${r.border} animate-pulse`}
                        style={{ width: size, height: size, background: `rgba(${r.color.includes("green") ? "34,197,94" : r.color.includes("blue") ? "59,130,246" : r.color.includes("rose") ? "244,63,94" : r.color.includes("amber") ? "245,158,11" : r.color.includes("purple") ? "168,85,247" : "6,182,212"},0.4)` }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-2 relative z-10">
                {REGIONS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(selected?.id === r.id ? null : r)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${selected?.id === r.id ? `${r.bg} ${r.border} border` : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
                  >
                    <MapPin className={`w-3 h-3 ${r.color}`} />
                    <span className={r.color}>{r.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Region detail panel */}
          <div className="space-y-4">
            {selected ? (
              <div className={`rounded-xl border ${selected.border} ${selected.bg} p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className={`w-5 h-5 ${selected.color}`} />
                  <div>
                    <div className="font-bold text-white">{selected.country}</div>
                    <div className="text-xs text-muted-foreground">{selected.name}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Raised</span>
                      <span className={`font-bold ${selected.color}`}>${selected.raised.toLocaleString()} / ${selected.goal.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className={`h-2 rounded-full ${selected.bg.replace("bg-", "bg-").replace("/20", "/60")}`} style={{ width: `${(selected.raised / selected.goal) * 100}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <div className={`text-lg font-black ${selected.color}`}>{selected.campaigns}</div>
                      <div className="text-xs text-muted-foreground">Campaigns</div>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <div className={`text-lg font-black ${selected.color}`}>{selected.beneficiaries.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Helped</div>
                    </div>
                  </div>
                  <a href="/charity" className={`block text-center text-xs font-bold py-2 rounded-lg ${selected.bg} ${selected.border} border ${selected.color} hover:opacity-80 transition-opacity`}>
                    View Campaigns →
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/3 p-5 text-center">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click a region on the map to see detailed impact stats</p>
              </div>
            )}

            {/* Live donations feed */}
            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-green-400">Live Donations</span>
              </div>
              <div className="space-y-2">
                {(campaigns as any[]).slice(0, 5).map((c: any, i: number) => (
                  <div key={c.id ?? i} className="flex items-center gap-2 text-xs">
                    <Heart className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span className="text-white truncate">{c.title ?? "Anonymous donation"}</span>
                    <span className="ml-auto text-green-400 font-bold flex-shrink-0">${(c.currentAmount ?? 50).toLocaleString()}</span>
                  </div>
                ))}
                {(campaigns as any[]).length === 0 && (
                  <>
                    {["Clean Water Kenya", "Education BD", "Food Relief UA", "Medical PH", "Housing CO"].map((n, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Heart className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span className="text-white truncate">{n}</span>
                        <span className="ml-auto text-green-400 font-bold flex-shrink-0">${(50 + i * 25).toLocaleString()}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Region cards grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 neon-drip">All Regions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONS.map(r => (
              <div key={r.id} className={`rounded-xl border ${r.border} ${r.bg} p-4 cursor-pointer hover:scale-[1.02] transition-transform`} onClick={() => setSelected(r)}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={`w-4 h-4 ${r.color}`} />
                  <span className="font-bold text-white text-sm">{r.country}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{r.name}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 mb-2">
                  <div className="h-1.5 rounded-full bg-current transition-all" style={{ width: `${(r.raised / r.goal) * 100}%`, color: r.color.replace("text-", "") }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={`font-bold ${r.color}`}>${(r.raised / 1000).toFixed(0)}K raised</span>
                  <span className="text-muted-foreground">{r.beneficiaries.toLocaleString()} helped</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
