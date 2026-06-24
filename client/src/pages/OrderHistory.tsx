import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Package, Search, CheckCircle, Clock, XCircle, Truck, ShoppingBag,
  Star, RefreshCw, ChevronRight, DollarSign, Shield, AlertCircle,
  Repeat, Download, MessageSquare
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number }> = {
  pending:    { label: "Pending",    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",  progress: 15 },
  processing: { label: "Processing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30",        progress: 40 },
  shipped:    { label: "Shipped",    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",  progress: 70 },
  delivered:  { label: "Delivered",  color: "bg-green-500/20 text-green-400 border-green-500/30",     progress: 100 },
  cancelled:  { label: "Cancelled",  color: "bg-red-500/20 text-red-400 border-red-500/30",           progress: 0 },
  completed:  { label: "Completed",  color: "bg-green-500/20 text-green-400 border-green-500/30",     progress: 100 },
};

function OrderCard({ order }: { order: any }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className="bg-[#0e0a1a] border border-white/5 hover:border-purple-500/20 rounded-2xl p-4 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{order.listingTitle || "Marketplace Item"}</p>
            <p className="text-slate-500 text-xs">Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge className={`text-[10px] ${status.color}`}>{status.label}</Badge>
      </div>

      {order.status !== "cancelled" && (
        <div className="mb-3">
          <Progress value={status.progress} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>Ordered</span><span>Processing</span><span>Shipped</span><span>Delivered</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span className="text-white font-bold">{Number(order.totalPrice || 0).toLocaleString()} SKY444</span>
          </span>
          {order.escrowStatus && (
            <span className="flex items-center gap-1 text-cyan-400">
              <Shield className="w-3 h-3" />Escrow: {order.escrowStatus}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {(order.status === "delivered" || order.status === "completed") && (
            <Button size="sm" variant="outline" className="h-7 text-xs border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => toast.success("Review submitted!")}>
              <Star className="w-3 h-3 mr-1" />Review
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 text-slate-400"
            onClick={() => toast.info("Invoice download coming soon")}>
            <Download className="w-3 h-3 mr-1" />Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, isLoading, refetch } = trpc.marketplace.myOrders.useQuery(
    { role },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07050f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto" />
          <h2 className="text-xl font-bold text-white">Sign in to view orders</h2>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const filtered = (orders || []).filter((o: any) => {
    const matchSearch = !search || (o.listingTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders?.length || 0,
    active: orders?.filter((o: any) => ["pending", "processing", "shipped"].includes(o.status)).length || 0,
    completed: orders?.filter((o: any) => ["completed", "delivered"].includes(o.status)).length || 0,
    totalSpent: orders?.reduce((s: number, o: any) => s + Number(o.totalPrice || 0), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader icon={ShoppingBag} title="Order History" subtitle="Track your marketplace purchases and sales" backHref="/marketplace" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Orders", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.active, color: "text-yellow-400" },
            { label: "Completed", value: stats.completed, color: "text-green-400" },
            { label: "Total Spent", value: `${(stats.totalSpent / 1000).toFixed(1)}K SKY`, color: "text-purple-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0e0a1a] border border-white/5 rounded-xl p-3">
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {(["buyer", "seller"] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${role === r ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}>
                {r === "buyer" ? "My Purchases" : "My Sales"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..." className="pl-9 bg-white/5 border-white/10 text-white h-9" />
          </div>
          <Button size="sm" variant="outline" className="border-white/10 text-slate-400 h-9" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">{orders?.length === 0 ? "No orders yet" : "No matching orders"}</h3>
            {orders?.length === 0 && (
              <Link href="/marketplace">
                <Button className="mt-3 bg-purple-500/20 text-purple-300 border border-purple-500/30">Browse Marketplace</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: any) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
