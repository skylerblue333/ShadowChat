import { Link } from "wouter";
import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  ShoppingBag, Plus, Tag, Star, TrendingUp, Package, Gavel, Search,
  Filter, Shield, Clock, Coins, Loader2, ArrowUpRight, Flame, Eye,
  Heart, Sparkles, Lock, CheckCircle2, Truck, ExternalLink, X,
  ShoppingCart, RefreshCw, Watch, Footprints, Tablet, Layers
} from "lucide-react";

// ─── DHgate category config ──────────────────────────────────────────────────
const DHGATE_CATEGORIES = [
  { id: "all",         label: "All",         emoji: "🛍️" },
  { id: "bags",        label: "Bags",        emoji: "👜" },
  { id: "watches",     label: "Watches",     emoji: "⌚" },
  { id: "shoes",       label: "Shoes",       emoji: "👟" },
  { id: "pants",       label: "Pants",       emoji: "👖" },
  { id: "shirts",      label: "Shirts",      emoji: "👕" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
] as const;

type DhgateCat = typeof DHGATE_CATEGORIES[number]["id"];

// ─── DHgate product card ──────────────────────────────────────────────────────
function DHgateCard({ product, onClick }: { product: any; onClick: () => void }) {
  const discount = product.discountPercent || 0;
  return (
    <button onClick={onClick}
      className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all text-left w-full">
      <div className="relative aspect-square bg-black/20 overflow-hidden">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>}
        {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5">-{discount}%</Badge>}
        {product.isHot && <Badge className="absolute top-2 right-2 bg-orange-500/90 text-white text-[10px] px-1.5"><Flame className="w-2.5 h-2.5 mr-0.5" />HOT</Badge>}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-2 mb-1.5 leading-snug">{product.title}</p>
        <div className="flex items-center gap-1.5 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating||0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />)}
          <span className="text-[10px] text-muted-foreground">({(product.reviewCount||0).toLocaleString()})</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-base font-bold text-primary">${product.platformPrice?.toFixed(2)}</p>
            {discount > 0 && <p className="text-[10px] text-muted-foreground line-through">${(product.platformPrice/(1-discount/100)).toFixed(2)}</p>}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">{(product.soldCount||0).toLocaleString()} sold</p>
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Truck className="w-2.5 h-2.5" />{product.deliveryDays||"14-21 days"}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── DHgate product modal ─────────────────────────────────────────────────────
function DHgateModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [ordered, setOrdered] = useState(false);
  const placeOrder = trpc.dhgate.placeOrder.useMutation({
    onSuccess: (data) => {
      setOrdered(true);
      toast.success("Order placed! Redirecting to DHgate...");
      setTimeout(() => window.open(data.dhgateUrl, "_blank"), 1200);
    },
    onError: (e) => toast.error(e.message || "Order failed"),
  });
  const total = (product.platformPrice || 0) * qty;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-bold">Product Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover rounded-xl" />}
          <div>
            <h4 className="font-bold text-lg leading-snug">{product.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.rating||0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />)}
              <span className="text-sm text-muted-foreground">{product.rating} · {(product.reviewCount||0).toLocaleString()} reviews</span>
            </div>
          </div>
          {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Color: <span className="font-medium text-foreground">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: string) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedColor===c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}
          {product.sizes?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Size: <span className="font-medium text-foreground">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSize===s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">Qty:</p>
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-7 h-7 rounded-lg hover:bg-background/50 font-bold">−</button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(q => Math.min(99,q+1))} className="w-7 h-7 rounded-lg hover:bg-background/50 font-bold">+</button>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Shipping</span><span className="text-green-400">Free</span></div>
            <div className="border-t border-border/50 pt-1.5 flex justify-between"><span className="font-bold">Total</span><span className="font-bold">${total.toFixed(2)}</span></div>
          </div>
          {ordered ? (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />Order placed! Opening DHgate...
            </div>
          ) : (
            <Button className="w-full bg-primary hover:bg-primary/90 font-bold py-3" onClick={() => placeOrder.mutate({ productId: product.id, quantity: qty, selectedColor, selectedSize })} disabled={placeOrder.isPending}>
              {placeOrder.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><ShoppingCart className="w-4 h-4 mr-2" />Buy Now — ${total.toFixed(2)}</>}
            </Button>
          )}
          <p className="text-[10px] text-muted-foreground text-center">Powered by DHgate · Platform fee supports SKYCOIN4444</p>
        </div>
      </div>
    </div>
  );
}

// ─── Embedded DHgate tab content ─────────────────────────────────────────────
function DHgateTabContent() {
  const { isAuthenticated } = useAuth();
  const [cat, setCat] = useState<DhgateCat>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured"|"price_asc"|"price_desc"|"rating"|"sold">("featured");
  const [selected, setSelected] = useState<any|null>(null);
  const { data: products, isLoading, refetch } = trpc.dhgate.getProducts.useQuery(
    { category: cat, search: search||undefined, sort, limit: 24, offset: 0 },
    { refetchOnWindowFocus: false }
  );
  const { data: hotProducts } = trpc.dhgate.getHot.useQuery(undefined, { retry: false });
  const list = (products as any[]) || [];
  return (
    <div className="space-y-4">
      {selected && <DHgateModal product={selected} onClose={() => setSelected(null)} />}
      {/* Hot deals */}
      {hotProducts && (hotProducts as any[]).length > 0 && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3"><Flame className="w-4 h-4 text-orange-400" /><span className="font-bold text-sm">🔥 Hot Deals</span></div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {(hotProducts as any[]).slice(0,5).map((p: any) => (
              <button key={p.id} onClick={() => setSelected(p)} className="flex-shrink-0 w-32 bg-black/20 rounded-xl overflow-hidden hover:ring-1 hover:ring-orange-500/40 transition-all text-left">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-20 object-cover" />}
                <div className="p-2"><p className="text-xs line-clamp-1 font-medium">{p.title}</p><p className="text-sm font-bold text-primary">${p.platformPrice?.toFixed(2)}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <select value={sort} onChange={e => setSort(e.target.value as any)} className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm">
          <option value="featured">Featured</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option><option value="rating">Top Rated</option><option value="sold">Best Selling</option>
        </select>
      </div>
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {DHGATE_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${cat===c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i) => <div key={i} className="bg-card rounded-xl overflow-hidden"><div className="aspect-square bg-secondary animate-pulse" /><div className="p-3 space-y-2"><div className="h-3 bg-secondary rounded animate-pulse" /><div className="h-4 bg-secondary rounded animate-pulse w-1/2" /></div></div>)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground">No products loaded yet.</p>

        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p: any) => <DHgateCard key={p.id} product={p} onClick={() => setSelected(p)} />)}
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground py-2">Products sourced from DHgate · Platform earns 44% on every order · <a href="https://www.dhgate.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit DHgate ↗</a></p>
    </div>
  );
}

const CATEGORIES = [
  { name: "All", icon: Sparkles, color: "oklch(0.7_0.2_180)" },
  { name: "NFTs", icon: Star, color: "oklch(0.7_0.2_280)" },
  { name: "Digital Assets", icon: Package, color: "oklch(0.7_0.15_200)" },
  { name: "Services", icon: Tag, color: "oklch(0.72 0.28 305)" },
  { name: "Gaming Items", icon: Gavel, color: "oklch(0.8_0.15_90)" },
  { name: "Subscriptions", icon: TrendingUp, color: "oklch(0.7_0.2_30)" },
  { name: "Merch", icon: ShoppingBag, color: "oklch(0.7_0.15_330)" },
];

const FEATURED_ITEMS = [
  {
    id: "feat-1",
    title: "Cyber Samurai #0001",
    type: "NFT",
    price: 25000,
    currency: "SKY444",
    seller: "SkylerDev",
    isAuction: true,
    bids: 12,
    endsIn: "2h 34m",
    rarity: "Legendary",
    views: 847,
  },
  {
    id: "feat-2",
    title: "AI Trading Bot License",
    type: "Digital Asset",
    price: 5000,
    currency: "SKY444",
    seller: "AITrader",
    isAuction: false,
    bids: 0,
    endsIn: "",
    rarity: "",
    views: 234,
  },
  {
    id: "feat-3",
    title: "Shadow Arena Beta Key",
    type: "Gaming Item",
    price: 1500,
    currency: "SKY444",
    seller: "NeonPlay",
    isAuction: false,
    bids: 0,
    endsIn: "",
    rarity: "Rare",
    views: 1203,
  },
];

function CreateListingDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("nft");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { upload, uploading } = useFileUpload();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await upload(file);
      if (result) setImageUrl(result.url);
    } catch { toast.error("Image upload failed"); }
  };

  const createListing = trpc.marketplace.create.useMutation({
    onSuccess: () => {
      toast.success("Listing created successfully!");
      setOpen(false);
      setTitle("");
      setPrice("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to create listing"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Plus className="w-4 h-4 mr-2" /> List Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
            <Input
              placeholder="e.g., Cyber Samurai NFT #0042"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border/30"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {["nft", "digital", "service", "gaming", "subscription", "merch"].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all ${type === t ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-background/50 text-muted-foreground hover:border-border"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Price (SKY444)</label>
            <Input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-background/50 border-border/30 font-mono"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Image</label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => imgInputRef.current?.click()} disabled={uploading}>
                {uploading ? "Uploading..." : imageUrl ? "✓ Attached" : "Upload Image"}
              </Button>
              <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imageUrl && <img src={imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-border/30" />}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Escrow protection: Funds held until buyer confirms delivery</span>
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={!title || !price || createListing.isPending}
            onClick={() => createListing.mutate({ title, price: parseFloat(price), type: type as "nft" | "digital_asset" | "merch" | "subscription" | "service" | "gaming_item", currency: "SKY444", imageUrl: imageUrl || undefined })}
          >
            {createListing.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Create Listing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeaturedCard({ item }: { item: typeof FEATURED_ITEMS[0] }) {
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-card/80 backdrop-blur hover:border-primary/30 transition-all group relative">
      {item.isAuction && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-[10px]">
            <Gavel className="w-3 h-3 mr-0.5" /> AUCTION
          </Badge>
        </div>
      )}
      {item.rarity && (
        <div className="absolute top-3 left-3">
          <Badge className={`text-[10px] ${item.rarity === "Legendary" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
            {item.rarity}
          </Badge>
        </div>
      )}

      {/* Image placeholder */}
      <div className="h-36 rounded-lg bg-gradient-to-br from-primary/10 to-[oklch(0.15_0.03_280)] flex items-center justify-center mb-4 overflow-hidden">
        <Package className="w-10 h-10 text-primary/30 group-hover:scale-110 transition-transform" />
      </div>

      <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">{item.title}</h3>
      <p className="text-xs text-muted-foreground mb-3">by {item.seller}</p>

      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-bold text-primary">{item.price.toLocaleString()} {item.currency}</span>
        {item.isAuction && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {item.endsIn}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {item.views}</span>
          {item.isAuction && <span className="flex items-center gap-0.5"><Gavel className="w-3 h-3" /> {item.bids} bids</span>}
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7">
          {item.isAuction ? "Bid" : "Buy"}
        </Button>
      </div>
    </div>
  );
}

function ListingBuyButton({ listing }: { listing: any }) {
  const { isAuthenticated } = useAuth();
  const checkout = trpc.payments.createStripeCheckout.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        toast.success("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (e: any) => toast.error(e.message || "Checkout failed"),
  });
  if (!isAuthenticated) return (
    <a href={getLoginUrl()}><Button size="sm" variant="outline" className="text-xs h-7">Sign In to Buy</Button></a>
  );
  return (
    <Button
      size="sm"
      className="text-xs h-7 bg-primary hover:bg-primary/90"
      disabled={checkout.isPending}
      onClick={() => checkout.mutate({
        listingId: listing.id,
        amount: Math.round(Number(listing.price) * 100),
        successUrl: window.location.origin + "/marketplace?payment=success",
        cancelUrl: window.location.origin + "/marketplace?payment=cancelled",
      })}
    >
      {checkout.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy Now"}
    </Button>
  );
}

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: listings, isLoading } = trpc.marketplace.listings.useQuery({});

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.2_0.05_280)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
                <ShoppingBag className="h-3 w-3 text-[oklch(0.7_0.2_280)]" />
                <span className="text-xs font-mono text-[oklch(0.7_0.2_280)]">DECENTRALIZED MARKETPLACE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-rainbow">
                <span className="text-primary">Marketplace</span>
              </h1>
              <p className="text-muted-foreground">Buy, sell, and auction digital assets with escrow protection in the SKYCOIN4444 ecosystem.</p>
            </div>
            {isAuthenticated && <CreateListingDialog />}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-primary">{listings?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Active Listings</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-purple-400">$2.4M</div>
              <div className="text-xs text-muted-foreground mt-1">Total Volume</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_280)]">1,247</div>
              <div className="text-xs text-muted-foreground mt-1">Unique Sellers</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_60)]">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Escrow Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="pb-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs, items, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/80 border-border/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat.name
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/30 bg-card/80 text-muted-foreground hover:border-border"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="bg-card/80 border border-border/50 mb-6">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="auctions">Live Auctions</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="dhgate">🛍️ DHgate</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 animate-pulse">
                      <div className="h-36 bg-muted/20 rounded-lg mb-3" />
                      <div className="h-4 bg-muted/20 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-muted/20 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : listings && listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing: any) => (
                    <div key={listing.id} className="p-5 rounded-xl border border-border/50 bg-card/80 hover:border-primary/30 transition-all group">
                      <div className="h-36 rounded-lg bg-gradient-to-br from-primary/10 to-[oklch(0.15_0.03_280)] flex items-center justify-center mb-4 overflow-hidden">
                        {listing.imageUrl ? (
                          <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-10 h-10 text-primary/30" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px]">{listing.type}</Badge>
                        {listing.isAuction && (
                          <Badge className="text-[10px] bg-orange-500/10 text-orange-400 border-orange-500/30">
                            <Gavel className="w-2.5 h-2.5 mr-0.5" /> Auction
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">{listing.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{listing.description || "No description"}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-primary">{Number(listing.price).toLocaleString()} {listing.currency}</span>
                        <ListingBuyButton listing={listing} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Listings Yet</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    Be the first to list a digital asset, NFT, or service in the SKYCOIN4444 marketplace!
                  </p>
                  {isAuthenticated ? (
                    <CreateListingDialog />
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button variant="outline">Sign In to Start Selling</Button>
                    </a>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="auctions">
              <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 mb-6 flex items-start gap-3">
                <Gavel className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">Live Auctions</h4>
                  <p className="text-xs text-muted-foreground">Bid on exclusive items. Highest bidder wins when the timer expires. All bids are secured via escrow.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_ITEMS.filter(i => i.isAuction).map(item => (
                  <FeaturedCard key={item.id} item={item} />
                ))}
              </div>
              {FEATURED_ITEMS.filter(i => i.isAuction).length === 0 && (
                <div className="text-center py-12">
                  <Gavel className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No live auctions at the moment.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_ITEMS.map(item => (
                  <FeaturedCard key={item.id} item={item} />
                ))}
              </div>
                        </TabsContent>
            <TabsContent value="dhgate">
              <DHgateTabContent />
            </TabsContent>
          </Tabs>
          {/* Escrow & Trust Section */}
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-6 text-center">Secure Trading Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-border/50 bg-card/80 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Escrow Protection</h4>
                <p className="text-xs text-muted-foreground">Funds held securely until buyer confirms delivery. Dispute resolution available.</p>
              </div>
              <div className="p-5 rounded-xl border border-border/50 bg-card/80 text-center">
                <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Verified Sellers</h4>
                <p className="text-xs text-muted-foreground">All sellers undergo verification. Reputation system ensures quality.</p>
              </div>
              <div className="p-5 rounded-xl border border-border/50 bg-card/80 text-center">
                <Lock className="w-8 h-8 text-[oklch(0.7_0.2_280)] mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Smart Contract Powered</h4>
                <p className="text-xs text-muted-foreground">Automated settlement via audited smart contracts. No intermediaries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
