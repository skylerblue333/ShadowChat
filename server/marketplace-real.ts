// SKYCOIN4444 - Real Marketplace with Stripe Payments
import Stripe from "stripe";

let stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export async function createCheckoutSession(
  userId: string,
  items: Array<{ productId: string; quantity: number; price: number }>
) {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) throw new Error("Stripe not configured");
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: `Product ${item.productId}` },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `https://skycoin4444.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://skycoin4444.com/checkout/cancel`,
      metadata: { userId },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("[Marketplace] Checkout failed:", error);
    throw error;
  }
}

export async function handlePaymentWebhook(event: Stripe.Event) {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // Update order status in database
      console.log(`[Marketplace] Payment completed for user ${session.metadata?.userId}`);
    }
  } catch (error) {
    console.error("[Marketplace] Webhook handling failed:", error);
    throw error;
  }
}
