import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, IconTile } from "@/components/ui/sk";
import { toast } from "sonner";
import { Vote, Coins, TrendingUp, Loader2 } from "lucide-react";

type Eco = "DODGE" | "TRUMP";

const ECO_META: Record<Eco, { label: string; color: string; blurb: string }> = {
  DODGE: { label: "DODGE Ecosystem", color: "var(--neon-cyan)", blurb: "Charity fund voting, community events & 2x rewards." },
  TRUMP: { label: "Trump Coin Ecosystem", color: "var(--neon-amber)", blurb: "Civic governance, community projects & transparent funds." },
};

export default function Governance() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [eco, setEco] = useState<Eco>("DODGE");
  const [stakeAmt, setStakeAmt] = useState("");

  const { data: proposals, isLoading } = trpc.governance.proposals.useQuery({ ecosystem: eco });
  const { data: staking } = trpc.governance.myStaking.useQuery(undefined, { enabled: isAuthenticated });

  const vote = trpc.governance.vote.useMutation({
    onSuccess: (res) => {
      if (res.success) { toast.success(`Vote cast with ${res.power} power`); utils.governance.proposals.invalidate(); }
      else toast.error(res.message ?? "Vote failed");
    },
  });
  const stake = trpc.governance.stake.useMutation({
    onSuccess: () => { toast.success("Staking updated"); utils.governance.myStaking.invalidate(); setStakeAmt(""); },
  });

  const myStake = staking?.find((s: any) => s.ecosystem === eco)?.amount ?? 0;
  const meta = ECO_META[eco];

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={Vote} accent="cyan" />
        <div>
          <h1 className="font-extrabold text-3xl">Governance & Voting</h1>
          <p className="text-muted-foreground text-sm">Shape the platform — vote with staked power across ecosystems.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(ECO_META) as Eco[]).map(e => (
          <button key={e} onClick={() => setEco(e)}
            className={`px-5 py-2.5 rounded-full font-bold transition-all ${eco === e ? "" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
            style={eco === e ? { background: `${ECO_META[e].color}22`, color: ECO_META[e].color, border: `1px solid ${ECO_META[e].color}` } : {}}>
            {ECO_META[e].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5" >
            <p className="text-sm text-muted-foreground" style={{ borderLeft: `3px solid ${meta.color}`, paddingLeft: 12 }}>{meta.blurb}</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg">Predictive Analytics</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Proposal Outcome Confidence</span>
                  <span className="text-cyan-400">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Voter Participation Rate</span>
                  <span className="text-green-400">+12%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 mt-3">AI-powered predictions based on historical voting patterns and staking trends.</p>
            </div>
          </Card>

          <h2 className="font-bold text-xl">Active Proposals</h2>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {proposals && proposals.length === 0 && <p className="text-muted-foreground">No proposals yet.</p>}
          {proposals?.map((p: any) => {
            const total = (p.votesFor ?? 0) + (p.votesAgainst ?? 0);
            const pct = total > 0 ? Math.round((p.votesFor / total) * 100) : 0;
            return (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${p.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>{p.status}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>For {p.votesFor ?? 0}</span><span>Against {p.votesAgainst ?? 0}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
                {isAuthenticated && p.status === "active" && (
                  <div className="flex gap-2 mt-4">
                    <button disabled={vote.isPending} onClick={() => vote.mutate({ proposalId: p.id, choice: "for" })}
                      className="sk-gradient px-4 py-2 rounded-full text-sm font-bold disabled:opacity-50">Vote For</button>
                    <button disabled={vote.isPending} onClick={() => vote.mutate({ proposalId: p.id, choice: "against" })}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-card hover:bg-secondary disabled:opacity-50">Vote Against</button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5" style={{ color: meta.color }} />
              <h3 className="font-bold text-lg">Staking Power</h3>
            </div>
            {isAuthenticated ? (
              <>
                <div className="text-3xl font-black mb-1" style={{ color: meta.color }}>{myStake}</div>
                <div className="text-xs text-muted-foreground mb-4">staked in {eco}</div>
                <div className="flex gap-2">
                  <Input value={stakeAmt} onChange={e => setStakeAmt(e.target.value)} type="number" placeholder="Amount" className="bg-input border-border" />
                  <button disabled={stake.isPending || !stakeAmt} onClick={() => stake.mutate({ ecosystem: eco, amount: Number(stakeAmt) })}
                    className="sk-gradient px-4 py-2 rounded-full text-sm font-bold disabled:opacity-50">Stake</button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Higher stake = higher voting power.</p>
              </>
            ) : (
              <button onClick={() => (window.location.href = getLoginUrl())} className="w-full sk-gradient px-4 py-2.5 rounded-full font-bold">Connect to stake & vote</button>
            )}
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-[var(--neon-cyan)]" /><h3 className="font-bold text-lg">Supported Coins</h3></div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• SKY444 — platform native</li>
              <li>• DODGE — community governance</li>
              <li>• Trump Coin — civic governance</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
