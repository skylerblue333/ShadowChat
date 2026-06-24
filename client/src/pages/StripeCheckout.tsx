import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreditCard, Lock, ShoppingCart, CheckCircle, ArrowLeft, Zap, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";

const SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 4.99,
    period: "month",
    features: ["100 AI generations/mo", "Basic analytics", "Community access", "5 GB storage"],
    badge: null,
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    period: "month",
    features: ["Unlimited AI generations", "Advanced analytics", "Priority support", "50 GB storage", "Creator tools", "Custom domain"],
    badge: "Most Popular",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    period: "month",
    features: ["Everything in Pro", "White-label options", "API access", "Dedicated support", "500 GB storage", "Team management", "Custom integrations"],
    badge: "Best Value",
    color: "from-amber-600 to-orange-600",
  },
];

export default function StripeCheckout() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]);
  const [step, setStep] = useState<"select" | "checkout" | "success">("select");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const checkoutMut = trpc.payments.createStripeCheckout.useMutation({
    onSuccess: (data) => {
      if (data.mock) {
        toast.success("Demo checkout — Stripe not configured yet. Redirecting to success page...");
        setTimeout(() => setStep("success"), 1500);
      } else if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (e: any) => toast.error(e.message || "Checkout failed"),
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe");
      return;
    }
    checkoutMut.mutate({
      listingId: 0,
      amount: promoApplied ? selectedPlan.price * 0.8 : selectedPlan.price,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout`,
    });
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SKY444" || promoCode.toUpperCase() === "SKYCOIN") {
      setPromoApplied(true);
      toast.success("Promo code applied! 20% off your first month.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const finalPrice = promoApplied ? selectedPlan.price * 0.8 : selectedPlan.price;

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome to {selectedPlan.name}!</h1>
          <p className="text-muted-foreground mb-6">
            Your subscription is now active. Enjoy all {selectedPlan.name} features.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Upgrade Your Plan" subtitle="Unlock the full power of SKYCOIN4444" />
      <div className="container py-8 max-w-6xl">

        {/* Plan selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {SUBSCRIPTION_PLANS.map(plan => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all border-2 ${
                selectedPlan.id === plan.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.badge && (
                <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white border-0`}>
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {selectedPlan.id === plan.id && <CheckCircle className="w-5 h-5 text-purple-400" />}
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary + Checkout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{selectedPlan.name} Plan</span>
                <span>${selectedPlan.price}/mo</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-400">
                  <span>Promo (SKY444 — 20% off)</span>
                  <span>-${(selectedPlan.price * 0.2).toFixed(2)}</span>
                </div>
              )}
              <Separator className="bg-white/10" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Today</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Billed monthly. Cancel anytime. No hidden fees.
              </p>

              {/* Promo code */}
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Promo code (try SKY444)"
                  className="bg-white/5 border-white/10"
                  disabled={promoApplied}
                />
                <Button variant="outline" onClick={applyPromo} disabled={promoApplied || !promoCode}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Secured by Stripe</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to Stripe's secure checkout page to complete your payment.
                  Your card details are never stored on our servers.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption · PCI DSS compliant · 30-day money-back guarantee</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={checkoutMut.isPending || !isAuthenticated}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 h-12 text-base"
              >
                {checkoutMut.isPending ? (
                  <><Zap className="w-5 h-5 mr-2 animate-spin" />Processing...</>
                ) : (
                  <><CreditCard className="w-5 h-5 mr-2" />Subscribe for ${finalPrice.toFixed(2)}/mo</>
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-amber-400">
                  Please log in to subscribe
                </p>
              )}

              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/"><ArrowLeft className="w-4 h-4 mr-1" />Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-muted-foreground">
          {["✓ Cancel anytime", "✓ 30-day money-back", "✓ Instant activation", "✓ 24/7 support", "✓ No contracts"].map(b => (
            <span key={b} className="flex items-center gap-1">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
