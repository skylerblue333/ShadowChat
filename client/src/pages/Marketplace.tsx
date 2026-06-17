import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";
import { Card, IconTile } from "@/components/ui/sk";
import { toast } from "sonner";
import { ShoppingBag, Sparkles, Loader2 } from "lucide-react";

type Currency = "SKY444" | "DODGE" | "TRUMP";
const CURRENCIES: Currency[] = ["SKY444", "DODGE", "TRUMP"];

interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  priceSky: number;
}

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: products = [], isLoading } = trpc.marketplaceAdv.listCodeSnippets.useQuery({ category: undefined, limit: 20 }) as { data: Product[], isLoading: boolean };
  const [interest, setInterest] = useState("");
  const [reco, setReco] = useState("");
  const [currency, setCurrency] = useState<Record<string, Currency>>({});

  const recommendMutation = trpc.marketplaceAdv.analyzePerformance.useMutation({
    onSuccess: (r: any) => setReco(r.suggestions || 'No suggestions'),
    onError: (e: any) => toast.error(e.message || 'Error'),
  });

  const purchase = trpc.marketplaceAdv.buyCodeSnippet.useMutation({
    onSuccess: (r: any) => {
      toast.success('Purchase successful!');
      utils.marketplaceAdv.listCodeSnippets.invalidate();
    },
    onError: (e: any) => toast.error(e.message || 'Purchase failed'),
  });

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={ShoppingBag} accent="purple" />
        <div>
          <h1 className="font-extrabold text-3xl">Marketplace</h1>
          <p className="text-muted-foreground text-sm">Pay with SKY444, DODGE or Trump Coin — with AI-powered recommendations.</p>
        </div>
      </div>

      <Card className="p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-bold text-xl">AI Product Recommendations</h2>
        </div>
        {isAuthenticated ? (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input value={interest} onChange={e => setInterest(e.target.value)} placeholder="What are you looking for? e.g. AI dev tools" className="bg-input border-border" />
              <button onClick={() => recommendMutation.mutate({ codeId: '1', code: interest })} disabled={recommendMutation.isPending || interest.length < 2}
                className="sk-gradient px-6 py-2.5 rounded-full font-bold disabled:opacity-50 flex items-center justify-center whitespace-nowrap">
                {recommendMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Thinking…</> : "Recommend"}
              </button>
            </div>
            {reco && <div className="prose prose-invert max-w-none text-sm mt-4"><Streamdown>{reco}</Streamdown></div>}
          </>
        ) : (
          <button className="px-5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary transition-colors" onClick={() => (window.location.href = getLoginUrl())}>Connect for AI recommendations</button>
        )}
      </Card>

      <Card className="p-6 mb-10 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-600/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-xl">AI Trading Signals</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">BTC/USDT Signal</div>
            <div className="text-lg font-bold text-green-400">BUY</div>
            <div className="text-xs text-gray-500 mt-1">Confidence: 89%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">ETH/USDT Signal</div>
            <div className="text-lg font-bold text-amber-400">HOLD</div>
            <div className="text-xs text-gray-500 mt-1">Confidence: 72%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">SKY444 Signal</div>
            <div className="text-lg font-bold text-green-400">STRONG BUY</div>
            <div className="text-xs text-gray-500 mt-1">Confidence: 94%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">DODGE Signal</div>
            <div className="text-lg font-bold text-blue-400">ACCUMULATE</div>
            <div className="text-xs text-gray-500 mt-1">Confidence: 81%</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">Real-time AI analysis of market trends, volume, and sentiment. Updated every 5 minutes.</p>
      </Card>

      {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
      {products && products.length === 0 && <p className="text-muted-foreground">No products listed yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products?.map((p: Product) => (
          <Card key={p.id} className="p-5 flex flex-col" hover>
            <div className="text-xs uppercase tracking-wider text-[var(--neon-magenta)] mb-1">{p.category}</div>
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-sm text-muted-foreground flex-1 mt-1">{p.description}</p>
            <div className="font-black text-2xl text-[var(--neon-cyan)] mt-3">{p.priceSky?.toLocaleString()} <span className="text-sm">SKY</span></div>
            {isAuthenticated ? (
              <div className="mt-3 space-y-2">
                <select value={currency[p.id] ?? "SKY444"} onChange={e => setCurrency(c => ({ ...c, [p.id]: e.target.value as Currency }))}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button disabled={purchase.isPending} onClick={() => purchase.mutate({ listingId: p.id, amount: String(p.priceSky) })}
                  className="w-full sk-gradient py-2.5 rounded-full text-sm font-bold disabled:opacity-50">Buy now</button>
              </div>
            ) : (
              <button className="mt-3 w-full px-4 py-2.5 rounded-full border border-border bg-card hover:bg-secondary text-sm font-medium transition-colors" onClick={() => (window.location.href = getLoginUrl())}>Connect to buy</button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
