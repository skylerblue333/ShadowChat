import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, ChevronLeft, DollarSign, Package, TrendingUp, FileText, CheckCircle, Clock, XCircle, AlertCircle, ShoppingCart, CreditCard, Globe, Zap } from "lucide-react";

const ORDERS = [
  { id: "ORD-001", buyer: "CryptoKing_X", product: "Wireless Earbuds Pro X", category: "Electronics", amount: 18.99, fee: 2.85, tax: 1.52, net: 14.62, status: "completed", method: "SKY444", date: "2026-06-18 04:12", country: "US", sku: "DHG-001" },
  { id: "ORD-002", buyer: "TechLover99", product: "AI Content Generator Pro", category: "AI Tools", amount: 9.99, fee: 1.50, tax: 0.80, net: 7.69, status: "completed", method: "USDT", date: "2026-06-18 03:58", country: "UK", sku: "AI-001" },
  { id: "ORD-003", buyer: "Web3Builder", product: "SKYCOIN4444 Pro Monthly", category: "Subscription", amount: 9.99, fee: 0.50, tax: 0.80, net: 8.69, status: "completed", method: "SKY444", date: "2026-06-18 03:45", country: "DE", sku: "SUB-001" },
  { id: "ORD-004", buyer: "NFTCollector", product: "Smart Watch Series 8", category: "Wearables", amount: 24.50, fee: 3.68, tax: 1.96, net: 18.86, status: "pending", method: "ETH", date: "2026-06-18 03:30", country: "JP", sku: "DHG-002" },
  { id: "ORD-005", buyer: "DeFiTrader", product: "AI Trading Signals Bot", category: "AI Tools", amount: 19.99, fee: 3.00, tax: 1.60, net: 15.39, status: "completed", method: "BTC", date: "2026-06-18 03:15", country: "SG", sku: "AI-003" },
  { id: "ORD-006", buyer: "SkyFan2024", product: "Netflix Premium 1yr", category: "Digital", amount: 12.00, fee: 1.80, tax: 0.96, net: 9.24, status: "completed", method: "SKY444", date: "2026-06-18 03:00", country: "CA", sku: "DIG-001" },
  { id: "ORD-007", buyer: "BlockchainDev", product: "AI Code Assistant Annual", category: "AI Tools", amount: 29.99, fee: 4.50, tax: 2.40, net: 23.09, status: "processing", method: "USDC", date: "2026-06-18 02:45", country: "AU", sku: "AI-005" },
  { id: "ORD-008", buyer: "CryptoMom", product: "LED Strip Lights 10m", category: "Home", amount: 12.99, fee: 1.95, tax: 1.04, net: 10.00, status: "completed", method: "SKY444", date: "2026-06-18 02:30", country: "US", sku: "DHG-006" },
  { id: "ORD-009", buyer: "GameFiKing", product: "Mechanical Gaming Keyboard", category: "Gaming", amount: 32.00, fee: 4.80, tax: 2.56, net: 24.64, status: "refunded", method: "ETH", date: "2026-06-18 02:15", country: "BR", sku: "DHG-003" },
  { id: "ORD-010", buyer: "AIEnthusiast", product: "AI Image Studio Credits", category: "AI Tools", amount: 4.99, fee: 0.75, tax: 0.40, net: 3.84, status: "completed", method: "SKY444", date: "2026-06-18 02:00", country: "IN", sku: "AI-002" },
  { id: "ORD-011", buyer: "PrivacyFirst", product: "VPN Service 3 Years", category: "Digital", amount: 2.99, fee: 0.45, tax: 0.24, net: 2.30, status: "completed", method: "BTC", date: "2026-06-18 01:45", country: "RU", sku: "DIG-003" },
  { id: "ORD-012", buyer: "CreatorElite", product: "Creator Pro Bundle", category: "Subscription", amount: 24.99, fee: 1.25, tax: 2.00, net: 21.74, status: "completed", method: "SKY444", date: "2026-06-18 01:30", country: "US", sku: "SUB-002" },
];

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  processing: { label: "Processing", icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  refunded: { label: "Refunded", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filtered = ORDERS.filter(o => {
    const matchSearch = !search || o.buyer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = ORDERS.filter(o => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const totalFees = ORDERS.filter(o => o.status === "completed").reduce((s, o) => s + o.fee, 0);
  const totalTax = ORDERS.filter(o => o.status === "completed").reduce((s, o) => s + o.tax, 0);
  const totalNet = ORDERS.filter(o => o.status === "completed").reduce((s, o) => s + o.net, 0);

  const exportCSV = () => {
    const headers = "Order ID,Buyer,Product,Category,Amount,Platform Fee,Tax,Net,Status,Method,Date,Country,SKU";
    const rows = ORDERS.map(o => `${o.id},${o.buyer},"${o.product}",${o.category},${o.amount},${o.fee},${o.tax},${o.net},${o.status},${o.method},${o.date},${o.country},${o.sku}`);
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "skycoin4444-orders-tax.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/mega-marketplace">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Marketplace</Button>
        </Link>
        <span className="font-bold">Admin Order Management</span>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Tax Compliant</Badge>
        <div className="flex-1" />
        <Button onClick={exportCSV} variant="outline" size="sm" className="gap-1 border-purple-500/30 text-purple-400">
          <Download className="h-4 w-4" />Export CSV (Tax)
        </Button>
        <Link href="/profitability">
          <Button size="sm" className="gap-1"><TrendingUp className="h-4 w-4" />Revenue Engine</Button>
        </Link>
      </div>

      <div className="container py-8">
        {/* Revenue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Gross Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/20" },
            { label: "Platform Fees (15%)", value: `$${totalFees.toFixed(2)}`, icon: Zap, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
            { label: "Tax Collected", value: `$${totalTax.toFixed(2)}`, icon: FileText, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            { label: "Net to Sellers", value: `$${totalNet.toFixed(2)}`, icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tax Summary Box */}
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-yellow-400 mb-1">📋 Tax Compliance Summary</p>
              <p className="text-xs text-muted-foreground">All transactions are logged with buyer country, tax rate, and SKU for IRS/VAT reporting. Export CSV for your accountant.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "US Orders", value: "38%", sub: "Federal + State" },
                { label: "EU Orders", value: "20%", sub: "VAT" },
                { label: "Other", value: "8%", sub: "Avg rate" },
              ].map(t => (
                <div key={t.label}>
                  <p className="text-sm font-bold text-yellow-400">{t.value}</p>
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground/60">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, buyers, products..." className="pl-10 h-10 bg-card/30 border-border/50" />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "pending", "processing", "refunded"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all capitalize ${statusFilter === s ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-card/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Buyer</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Product</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Amount</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Fee</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Tax</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Method</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Country</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr key={order.id} className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="p-3 font-mono text-xs text-primary">{order.id}</td>
                      <td className="p-3 font-medium text-xs">{order.buyer}</td>
                      <td className="p-3 text-xs">
                        <div>{order.product}</div>
                        <div className="text-muted-foreground">{order.sku}</div>
                      </td>
                      <td className="p-3 font-bold text-purple-400">${order.amount}</td>
                      <td className="p-3 text-primary text-xs">${order.fee}</td>
                      <td className="p-3 text-yellow-400 text-xs">${order.tax}</td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{order.method}</Badge></td>
                      <td className="p-3">
                        <div className="flex items-center gap-1"><Globe className="h-3 w-3 text-muted-foreground" /><span className="text-xs">{order.country}</span></div>
                      </td>
                      <td className="p-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${status.bg}`}>
                          <status.icon className={`h-3 w-3 ${status.color}`} />
                          <span className={status.color}>{status.label}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">Showing {filtered.length} of {ORDERS.length} orders · All orders are logged for tax compliance · Export CSV for accounting</p>
      </div>
    </div>
  );
}
