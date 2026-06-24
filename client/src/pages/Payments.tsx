import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CreditCard, Coins, Zap, Shield, CheckCircle, ArrowRight, Lock,
  RefreshCw, Globe, Loader2, Star, Crown, Rocket, Package, Gift
} from "lucide-react";

const SUBSCRIPTION_PLANS = [
  {
    id: "starter", name: "Starter", price: 4.99, icon: Zap,
    color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5",
    features: ["100 AI messages/month","Basic social features","5 marketplace listings","Standard support"],
  },
  {
    id: "pro", name: "Pro Creator", price: 19.99, icon: Star,
    color: "text-primary", border: "border-primary/30", bg: "bg-primary/5", badge: "Most Popular",
    features: ["Unlimited AI messages","Creator monetization tools","50 marketplace listings","Priority support","Advanced analytics","Custom channel branding"],
  },
  {
    id: "enterprise", name: "Enterprise", price: 99.99, icon: Crown,
    color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5",
    features: ["Everything in Pro","White-label options","Unlimited listings","Dedicated account manager","API access","Custom integrations","SLA guarantee"],
  },
];

const PAYMENT_METHODS = [
  { icon: Coins, label: "SKY444 Token", desc: "Pay with native platform token — 0% fee", badge: "Recommended", color: "text-primary" },
  { icon: Globe, label: "Crypto (BTC/ETH/USDT)", desc: "Pay with any major cryptocurrency — 0.5% fee", badge: "Popular", color: "text-amber-400" },
  { icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex — 2.9% + $0.30", badge: null, color: "text-blue-400" },
  { icon: RefreshCw, label: "Bank Transfer (ACH)", desc: "US bank accounts — 1% fee, 1–3 business days", badge: null, color: "text-purple-400" },
];

export default function Payments() {
  const { isAuthenticated } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const createCheckout = trpc.payments.createCheckout.useMutation({
    onSuccess: (data: any) => {
      if (data?.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
      setCheckoutLoading(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create checkout session");
      setCheckoutLoading(null);
    },
  });

  const handleCheckout = (planId: string) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setCheckoutLoading(planId);
    createCheckout.mutate({
      planId: planId as "starter" | "pro" | "enterprise",
      successUrl: `${window.location.origin}/payments?success=true`,
      cancelUrl: `${window.location.origin}/payments?canceled=true`,
    });
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.15_0.05_280)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <CreditCard className="h-3 w-3 text-primary" />
            <span className="text-xs font-mono text-primary">PAYMENTS & SUBSCRIPTIONS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upgrade Your <span className="text-primary">Experience</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Choose a plan that fits your needs. All plans include access to the SKYCOIN4444 ecosystem, AI tools, and creator features.</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[{icon:Shield,label:"256-bit SSL encryption"},{icon:Lock,label:"Stripe-secured payments"},{icon:RefreshCw,label:"Cancel anytime"},{icon:Gift,label:"30-day money back"}].map(({icon:Icon,label})=>(
              <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-green-400" /><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="subscriptions">
          <TabsList className="mb-8">
            <TabsTrigger value="subscriptions"><Rocket className="w-3.5 h-3.5 mr-1.5" />Subscriptions</TabsTrigger>
            <TabsTrigger value="methods"><CreditCard className="w-3.5 h-3.5 mr-1.5" />Payment Methods</TabsTrigger>
            <TabsTrigger value="history"><Package className="w-3.5 h-3.5 mr-1.5" />Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id} className={`relative p-6 rounded-xl border ${plan.border} ${plan.bg} backdrop-blur transition-all hover:scale-[1.02]`}>
                    {(plan as any).badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">{(plan as any).badge}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${plan.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-bold font-mono ${plan.color}`}>${plan.price}</span>
                          <span className="text-xs text-muted-foreground">/month</span>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full font-semibold" variant={(plan as any).badge ? "default" : "outline"} onClick={() => handleCheckout(plan.id)} disabled={checkoutLoading === plan.id}>
                      {checkoutLoading === plan.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      Subscribe — ${plan.price}/mo
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><Coins className="w-6 h-6 text-primary" /></div>
                <div>
                  <h3 className="font-bold">Pay with SKY444 — Save 20%</h3>
                  <p className="text-sm text-muted-foreground">Use your SKYCOIN4444 tokens for any subscription and get 20% off. Tokens are burned on payment.</p>
                </div>
              </div>
              <Button variant="outline" className="shrink-0" onClick={() => toast.info("SKY444 payment coming soon")}>
                <Coins className="w-4 h-4 mr-2" /> Use SKY444 Tokens
              </Button>
            </div>
            <div className="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <p className="text-xs text-yellow-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <strong>Test Mode:</strong> Use card <span className="font-mono">4242 4242 4242 4242</span> with any future expiry and CVC to test payments.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="methods">
            <div className="grid md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((m) => (
                <div key={m.label} className="p-5 rounded-xl border border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><m.icon className={`w-5 h-5 ${m.color}`} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{m.label}</span>
                        {m.badge && <Badge variant="outline" className="text-xs">{m.badge}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{m.desc}</p>
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.info("Payment method setup coming soon")}>Add Method <ArrowRight className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign In to View Orders</h3>
                <p className="text-muted-foreground mb-6">Connect your account to see your payment history.</p>
                <a href={getLoginUrl()}><Button>Sign In</Button></a>
              </div>
            ) : (
              <OrderHistory />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderHistory() {
  const { data: orders, isLoading } = trpc.payments.orderHistory.useQuery();
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!orders || orders.length === 0) return (
    <div className="text-center py-16">
      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
      <p className="text-muted-foreground">Your payment history will appear here once you make a purchase.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {(orders as any[]).map((order) => (
        <div key={order.id} className="p-4 rounded-xl border border-border/50 bg-card/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="font-semibold text-sm">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold">${(order.totalAmount / 100).toFixed(2)}</span>
            <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">{order.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
