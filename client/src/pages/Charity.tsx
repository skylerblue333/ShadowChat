import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Card, IconTile, StatCard } from "@/components/ui/sk";
import { toast } from "sonner";
import { Heart, TreePine, Percent, Loader2 } from "lucide-react";

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: campaigns, isLoading } = trpc.charity.campaigns.useQuery();
  const { data: total } = trpc.charity.totalDonated.useQuery();
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  const donate = trpc.charity.donate.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your donation");
      utils.charity.campaigns.invalidate();
      utils.charity.totalDonated.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={Heart} accent="magenta" />
        <div>
          <h1 className="font-extrabold text-3xl">Charity & Impact</h1>
          <p className="text-muted-foreground text-sm">Every signup plants a tree. 1% of platform fees fund verified charities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Heart} accent="magenta" label="Total Donated (SKY)" value={<AnimatedCounter value={total ?? 0} />} />
        <StatCard icon={TreePine} accent="green" label="Active Campaigns" value={<AnimatedCounter value={campaigns?.length ?? 0} />} />
        <StatCard icon={Percent} accent="cyan" label="Platform Fees Donated" value="1%" />
      </div>

      {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns?.map((c: any) => {
          const pct = c.goalAmount > 0 ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
          return (
            <Card key={c.id} className="p-6" hover>
              <h3 className="font-bold text-xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--neon-magenta)] font-bold">{c.raisedAmount.toLocaleString()}</span>
                  <span className="text-muted-foreground">of {c.goalAmount.toLocaleString()}</span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">{pct}% funded</div>
              </div>
              {isAuthenticated ? (
                <div className="flex gap-2 mt-4">
                  <Input type="number" placeholder="Amount" value={amounts[c.id] ?? ""}
                    onChange={e => setAmounts(a => ({ ...a, [c.id]: e.target.value }))} className="bg-input border-border" />
                  <button disabled={donate.isPending || !amounts[c.id]}
                    onClick={() => donate.mutate({ campaignId: c.id, amount: Number(amounts[c.id]) })}
                    className="sk-gradient px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50 whitespace-nowrap">Donate</button>
                </div>
              ) : (
                <button className="mt-4 w-full px-4 py-2.5 rounded-full border border-border bg-card hover:bg-secondary text-sm font-medium transition-colors" onClick={() => (window.location.href = getLoginUrl())}>Connect to donate</button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
