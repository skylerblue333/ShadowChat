// Shared primitives for the Mission Control intelligence hub.
// Keeps each section component small and consistent (dark-luxury: black/gold/white).
import { Loader2 } from "lucide-react";

export const GOLD = "#d4af37";

export function SectionLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-white/50">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
      <p className="text-white/70 font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-white/40">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-8 text-center">
      <p className="text-red-300 font-medium">Something went wrong</p>
      <p className="mt-1 text-sm text-red-300/60">{message ?? "Please try again in a moment."}</p>
    </div>
  );
}

// Format a SKY444 coin amount (listings store integer "cents"; 100 == 1 SKY444).
export function formatCoin(cents: number): string {
  const coin = cents / 100;
  return coin === 0 ? "Free" : `${coin.toLocaleString(undefined, { maximumFractionDigits: 2 })} SKY444`;
}

export function avg(sum: number, count: number): string {
  if (!count) return "—";
  return (sum / count).toFixed(1);
}
