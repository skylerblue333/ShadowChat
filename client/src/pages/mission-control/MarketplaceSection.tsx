import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Store, Coins, Star, Plus, Loader2 } from "lucide-react";
import { GOLD, SectionLoading, EmptyState, formatCoin, avg } from "./shared";

const KINDS = ["agent", "prompt", "workflow", "template"] as const;

function PurchaseDialog({ listingId, title }: { listingId: number; title: string }) {
  const [content, setContent] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const purchase = trpc.hopeIntelligence.aiMarketplace.purchase.useMutation({
    onSuccess(d) {
      setContent(d.content);
      toast.success("Purchased — content unlocked.");
      utils.hopeIntelligence.aiMarketplace.balance.invalidate();
      utils.hopeIntelligence.aiMarketplace.list.invalidate();
      utils.hopeIntelligence.aiMarketplace.myPurchases.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });
  const rate = trpc.hopeIntelligence.aiMarketplace.rate.useMutation({
    onSuccess() { toast.success("Thanks for rating."); utils.hopeIntelligence.aiMarketplace.list.invalidate(); },
    onError(e) { toast.error(e.message); },
  });

  return (
    <DialogContent className="bg-[#0a0a14] border-white/10 text-white max-w-lg">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      {content == null ? (
        <div className="space-y-4">
          <p className="text-sm text-white/60">Purchase to unlock the full content. Payment settles instantly in SKY444.</p>
          <Button className="w-full" style={{ backgroundColor: GOLD, color: "#000" }} disabled={purchase.isPending} onClick={() => purchase.mutate({ listingId })}>
            {purchase.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Purchase"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white/80 max-h-72 overflow-auto">{content}</pre>
          <div className="flex items-center gap-1">
            <span className="text-sm text-white/50 mr-2">Rate:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => rate.mutate({ listingId, stars: s })} disabled={rate.isPending} className="text-white/30 hover:text-amber-400 transition-colors">
                <Star className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </DialogContent>
  );
}

function CreateListing() {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ kind: "prompt" as (typeof KINDS)[number], title: "", description: "", content: "", priceCoin: "0" });
  const create = trpc.hopeIntelligence.aiMarketplace.create.useMutation({
    onSuccess() {
      toast.success("Listing published.");
      setForm({ kind: "prompt", title: "", description: "", content: "", priceCoin: "0" });
      utils.hopeIntelligence.aiMarketplace.list.invalidate();
    },
    onError(e) { toast.error(e.message); },
  });
  const submit = () => {
    const priceCents = Math.round(parseFloat(form.priceCoin || "0") * 100);
    if (form.title.trim().length < 3 || form.content.trim().length < 3) { toast.error("Add a title and content."); return; }
    create.mutate({ kind: form.kind, title: form.title.trim(), description: form.description.trim() || undefined, content: form.content, priceCents: isNaN(priceCents) ? 0 : Math.max(0, priceCents) });
  };

  return (
    <DialogContent className="bg-[#0a0a14] border-white/10 text-white">
      <DialogHeader><DialogTitle>Publish a Listing</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Select value={form.kind} onValueChange={(v) => setForm((f) => ({ ...f, kind: v as typeof f.kind }))}>
          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
          <SelectContent>{KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="bg-white/5 border-white/10" />
        <Input placeholder="Short description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="bg-white/5 border-white/10" />
        <Textarea placeholder="The paid content (prompt text, workflow JSON, agent config…)" rows={5} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="bg-white/5 border-white/10" />
        <Input type="number" min="0" step="0.01" placeholder="Price in SKY444 (0 = free)" value={form.priceCoin} onChange={(e) => setForm((f) => ({ ...f, priceCoin: e.target.value }))} className="bg-white/5 border-white/10" />
        <Button className="w-full" style={{ backgroundColor: GOLD, color: "#000" }} disabled={create.isPending} onClick={submit}>
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
        </Button>
      </div>
    </DialogContent>
  );
}

export function MarketplaceSection() {
  const list = trpc.hopeIntelligence.aiMarketplace.list.useQuery({ limit: 50 });
  const balance = trpc.hopeIntelligence.aiMarketplace.balance.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70">
          <Coins className="h-4 w-4" style={{ color: GOLD }} />
          <span className="text-sm">Balance:</span>
          <span className="font-semibold text-white">{balance.data ? `${balance.data.balance.toLocaleString()} SKY444` : "…"}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" style={{ backgroundColor: GOLD, color: "#000" }}><Plus className="h-4 w-4 mr-1" />Sell</Button>
          </DialogTrigger>
          <CreateListing />
        </Dialog>
      </div>

      {list.isLoading ? <SectionLoading /> : !list.data || list.data.length === 0 ? (
        <EmptyState title="No listings yet" hint="Be the first to publish a prompt, agent, workflow, or template." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.data.map((l) => (
            <Card key={l.id} className="border-white/10 bg-white/[0.02] flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/20 text-white/50 text-[10px] capitalize">{l.kind}</Badge>
                  <span className="flex items-center gap-1 text-xs text-white/50"><Star className="h-3 w-3" style={{ color: GOLD }} />{avg(l.ratingSum, l.ratingCount)} ({l.ratingCount})</span>
                </div>
                <CardTitle className="text-white text-base mt-1">{l.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-white/50 line-clamp-2 flex-1">{l.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold" style={{ color: GOLD }}>{formatCoin(l.priceCents)}</span>
                  <span className="text-xs text-white/40">{l.sales} sold</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="mt-3 border-white/20 text-white/80"><Store className="h-3.5 w-3.5 mr-1" />View</Button>
                  </DialogTrigger>
                  <PurchaseDialog listingId={l.id} title={l.title} />
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
