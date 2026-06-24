import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Coins, TrendingUp, Shield, Clock, Users, Lock, Zap, CheckCircle, BarChart3, Globe, Flame } from "lucide-react";

const STAGES = [
  { name: "Seed Round",    price: 0.001, allocation: 5_000_000,  raised: 5_000_000,  cap: 5_000_000,  bonus: "50%", status: "completed", startDate: "Jan 2025", endDate: "Jun 2025" },
  { name: "Private Sale",  price: 0.005, allocation: 20_000_000, raised: 20_000_000, cap: 20_000_000, bonus: "30%", status: "completed", startDate: "Jul 2025", endDate: "Dec 2025" },
  { name: "Pre-Sale",      price: 0.01,  allocation: 50_000_000, raised: 34_500_000, cap: 50_000_000, bonus: "15%", status: "active",    startDate: "Jan 2026", endDate: "Apr 23, 2027" },
  { name: "Public ICO",    price: 0.02,  allocation: 100_000_000,raised: 0,          cap: 100_000_000,bonus: "0%",  status: "upcoming",  startDate: "Apr 24, 2027", endDate: "Dec 31, 2027" },
];

const TOKENOMICS = [
  { label: "Public Sale",        pct: 30, color: "bg-blue-500",    tokens: "300M" },
  { label: "Team & Advisors",    pct: 15, color: "bg-purple-500",  tokens: "150M" },
  { label: "Ecosystem Fund",     pct: 20, color: "bg-emerald-500", tokens: "200M" },
  { label: "Staking Rewards",    pct: 15, color: "bg-amber-500",   tokens: "150M" },
  { label: "Treasury",           pct: 10, color: "bg-rose-500",    tokens: "100M" },
  { label: "Liquidity",          pct: 5,  color: "bg-cyan-500",    tokens: "50M" },
  { label: "Charity Reserve",    pct: 5,  color: "bg-pink-500",    tokens: "50M" },
];

const VESTING = [
  { role: "Team",          cliff: "12 months", vesting: "36 months", tge: "0%" },
  { role: "Advisors",      cliff: "6 months",  vesting: "24 months", tge: "0%" },
  { role: "Seed Investors",cliff: "3 months",  vesting: "18 months", tge: "10%" },
  { role: "Private Sale",  cliff: "1 month",   vesting: "12 months", tge: "15%" },
  { role: "Pre-Sale",      cliff: "0 months",  vesting: "6 months",  tge: "20%" },
  { role: "Public Sale",   cliff: "0 months",  vesting: "3 months",  tge: "25%" },
];

export default function ICOLaunchpad() {
  const [tab, setTab] = useState<"overview"|"tokenomics"|"vesting"|"security">("overview");
  const [amount, setAmount] = useState("1000");
  const activeStage = STAGES.find(s => s.status === "active")!;
  const totalRaised = STAGES.reduce((a, s) => a + s.raised, 0);
  const totalCap = STAGES.reduce((a, s) => a + s.cap, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">SKY444 ICO Launchpad</h1>
              <p className="text-xs text-slate-500 mt-0.5">Token Sale · Tokenomics · Vesting · Security Audit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />PRE-SALE LIVE
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Raised", value: `$${(totalRaised/1000000).toFixed(1)}M`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Token Price", value: `$${activeStage.price}`, icon: Coins, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Total Supply", value: "1B SKY444", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Participants", value: "14,847", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border border-slate-800/60 p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-slate-500">{s.label}</span></div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1 w-fit mb-6 border border-slate-800/50 flex-wrap">
          {(["overview","tokenomics","vesting","security"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab===t?"bg-amber-600 text-white":"text-slate-400 hover:text-slate-200"}`}>
              {t==="overview"?"🚀 Sale Stages":t==="tokenomics"?"🪙 Tokenomics":t==="vesting"?"🔒 Vesting":"🛡️ Security"}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            {/* Buy widget */}
            <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/20 rounded-2xl border border-amber-800/30 p-6">
              <h3 className="font-bold text-white text-lg mb-4">Buy SKY444 Tokens — Pre-Sale</h3>
              {/* RULE: SKY444 cannot be used to purchase SKY444 ICO tokens - prevents circular token economics */}
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 p-3 flex items-start gap-2">
                <span className="text-red-400 text-lg">⛔</span>
                <div>
                  <p className="text-sm font-semibold text-red-400">SKY444 Cannot Be Used to Buy SKY444</p>
                  <p className="text-xs text-slate-400 mt-0.5">To prevent circular token economics and protect token value, SKY444 is not accepted as ICO payment. Accepted: USDT · USDC · ETH · BTC</p>
                </div>
              </div>
              <div className="mb-4 flex gap-2">
                {["USDT", "USDC", "ETH", "BTC"].map(m => (
                  <button key={m} className="flex-1 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all">{m}</button>
                ))}
                <div className="flex-1 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-center">
                  <span className="text-xs text-red-400 line-through opacity-50">SKY444</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Amount (USDT)</label>
                    <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-amber-500" />
                  </div>
                  <div className="bg-slate-950/40 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">You receive</span><span className="text-amber-400 font-bold">{(parseFloat(amount||"0") / activeStage.price).toLocaleString()} SKY444</span></div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Bonus (15%)</span><span className="text-emerald-400 font-bold">+{(parseFloat(amount||"0") / activeStage.price * 0.15).toLocaleString()} SKY444</span></div>
                    <div className="flex justify-between text-sm border-t border-slate-700 pt-2"><span className="text-white font-medium">Total</span><span className="text-amber-400 font-bold">{(parseFloat(amount||"0") / activeStage.price * 1.15).toLocaleString()} SKY444</span></div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 text-base">
                    <Rocket className="h-4 w-4 mr-2" />Connect Wallet & Buy
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-medium text-white mb-2">Pre-Sale Progress</div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{width:`${activeStage.raised/activeStage.cap*100}%`}} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>${(activeStage.raised/1000000).toFixed(1)}M raised</span>
                    <span>${(activeStage.cap/1000000).toFixed(0)}M cap</span>
                  </div>
                  {[{label:"Price",val:`$${activeStage.price}`},{label:"Bonus",val:activeStage.bonus},{label:"Min Buy",val:"$100"},{label:"Max Buy",val:"$50,000"},{label:"Ends",val:activeStage.endDate}].map(r => (
                    <div key={r.label} className="flex justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className="text-xs font-medium text-white">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Sale stages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STAGES.map(stage => (
                <div key={stage.name} className={`rounded-2xl border p-5 ${stage.status==="active"?"bg-amber-500/5 border-amber-500/30":stage.status==="completed"?"bg-emerald-500/5 border-emerald-500/20":"bg-slate-900/40 border-slate-800/60"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-white">{stage.name}</div>
                    <Badge className={`text-xs border-0 ${stage.status==="active"?"bg-amber-500/15 text-amber-400":stage.status==="completed"?"bg-emerald-500/10 text-emerald-400":"bg-slate-700 text-slate-400"}`}>
                      {stage.status==="active"?"🔴 LIVE":stage.status==="completed"?"✓ Completed":"Upcoming"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div><div className="text-sm font-bold text-amber-400">${stage.price}</div><div className="text-xs text-slate-600">Price</div></div>
                    <div><div className="text-sm font-bold text-blue-400">{stage.bonus}</div><div className="text-xs text-slate-600">Bonus</div></div>
                    <div><div className="text-sm font-bold text-purple-400">${(stage.cap/1000000).toFixed(0)}M</div><div className="text-xs text-slate-600">Cap</div></div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${stage.status==="completed"?"bg-emerald-500":stage.status==="active"?"bg-amber-500":"bg-slate-600"}`} style={{width:`${stage.raised/stage.cap*100}%`}} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{stage.startDate}</span><span>{stage.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "tokenomics" && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6">
              <h3 className="font-semibold text-white mb-4">Token Distribution — 1,000,000,000 SKY444</h3>
              <div className="space-y-3">
                {TOKENOMICS.map(t => (
                  <div key={t.label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${t.color} shrink-0`} />
                    <span className="text-sm text-slate-300 w-40 shrink-0">{t.label}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${t.color}`} style={{width:`${t.pct}%`}} />
                    </div>
                    <span className="text-xs text-slate-400 w-16 text-right">{t.tokens}</span>
                    <span className="text-xs text-slate-600 w-8 text-right">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Token Standard", value: "ERC-20 / BEP-20", icon: Coins },
                { label: "Total Supply", value: "1,000,000,000", icon: Globe },
                { label: "Burn Mechanism", value: "2% per transaction", icon: Flame },
              ].map(m => (
                <div key={m.label} className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4 text-center">
                  <m.icon className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-400 mb-1">{m.label}</div>
                  <div className="font-bold text-white">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "vesting" && (
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-purple-400" />Vesting Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-800">
                  {["Role","Cliff","Vesting","TGE Unlock"].map(h => <th key={h} className="text-left py-3 pr-4 text-xs text-slate-500 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {VESTING.map(v => (
                    <tr key={v.role} className="border-b border-slate-800/40 last:border-0">
                      <td className="py-3 pr-4 font-medium text-white">{v.role}</td>
                      <td className="py-3 pr-4 text-slate-400">{v.cliff}</td>
                      <td className="py-3 pr-4 text-slate-400">{v.vesting}</td>
                      <td className="py-3"><Badge className="bg-amber-500/10 text-amber-400 border-0 text-xs">{v.tge}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="space-y-4">
            {[
              { title: "Smart Contract Audit", status: "Completed", firm: "CertiK", score: "98/100", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { title: "KYC/AML Compliance", status: "Completed", firm: "Sumsub", score: "All participants verified", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { title: "Penetration Testing", status: "Completed", firm: "Trail of Bits", score: "0 critical findings", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { title: "Multi-sig Treasury", status: "Active", firm: "Gnosis Safe", score: "5-of-9 signers", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            ].map(a => (
              <div key={a.title} className={`rounded-2xl border p-5 ${a.bg} ${a.border}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white mb-1">{a.title}</div>
                    <div className="text-sm text-slate-400">Conducted by {a.firm}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${a.bg} ${a.color} border-0 text-xs mb-1`}>{a.status}</Badge>
                    <div className={`text-sm font-bold ${a.color}`}>{a.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
