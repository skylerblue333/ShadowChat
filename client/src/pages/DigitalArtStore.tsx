import { useState, useMemo } from "react";
import { Palette, Star, Download, ShoppingCart, Crown, Search, Eye, Shield, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const SERIES_FILTERS = ["All", "Psychedelic Visions", "Crypto Dreams", "Shadow Protocol", "Digital Sovereignty", "The Chosen One", "Sky Kingdom", "Neon Genesis", "Void Walker", "Quantum Bloom", "Fractal Mind", "Acid Rain", "Ghost Signal"];

const GRADIENT_COLORS = [
  "from-purple-900 to-fuchsia-900",
  "from-blue-900 to-purple-900",
  "from-fuchsia-900 to-pink-900",
  "from-slate-800 to-purple-900",
  "from-indigo-900 to-blue-900",
  "from-rose-900 to-fuchsia-900",
  "from-violet-900 to-blue-900",
  "from-cyan-900 to-purple-900",
];

type CartItem = { id: string; title: string; price: number };

export default function DigitalArtStore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: prints, isLoading } = trpc.digitalArt.getPrints.useQuery({});
  const { data: series } = trpc.digitalArt.getSeries.useQuery();

  const checkoutMutation = trpc.digitalArt.checkout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        if (data.mock) {
          toast.info("Demo mode: Stripe not configured. Opening mock checkout.");
        } else {
          toast.success("Redirecting to Stripe checkout...");
        }
        window.open(data.url, "_blank");
        setCart([]);
      }
      setIsCheckingOut(false);
    },
    onError: (err) => {
      toast.error(err.message || "Checkout failed");
      setIsCheckingOut(false);
    },
  });

  const filtered = useMemo(() => {
    if (!prints) return [];
    return prints.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.series.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.series === category;
      return matchSearch && matchCat;
    });
  }, [prints, search, category]);

  const addToCart = (item: CartItem) => {
    if (cart.some((c) => c.id === item.id)) {
      toast.info("Already in cart");
      return;
    }
    setCart((c) => [...c, item]);
    toast.success("Added to cart");
  };

  const removeFromCart = (id: string) => {
    setCart((c) => c.filter((item) => item.id !== id));
    toast.info("Removed from cart");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    checkoutMutation.mutate({
      items: cart.map((item) => ({ id: item.id, title: item.title, price: item.price, quantity: 1 })),
      successUrl: `${window.location.origin}/digital-art-store?success=1`,
      cancelUrl: `${window.location.origin}/digital-art-store`,
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPrints = prints?.length ?? 144;

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050308]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <span className="font-black text-white">Digital Art Store</span>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-[10px]">
              by Skyler Blue Spillers
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/marketplace">
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs">
                Marketplace
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 text-white relative"
              onClick={() => cart.length > 0 && handleCheckout()}
              disabled={isCheckingOut || cart.length === 0}
            >
              {isCheckingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 rounded-full text-[9px] font-black flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shrink-0">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white mb-1">144 Signed Digital Creations</h1>
              <p className="text-slate-400 text-sm mb-3">
                Exclusive digital art, coded tools, and collectibles by Skyler Blue Spillers. Each signed print comes with a Certificate of Authenticity. Limited editions never reprint.
              </p>
              <div className="flex gap-4 text-sm flex-wrap">
                <span className="text-slate-400">
                  <span className="text-white font-bold">{totalPrints}</span> products
                </span>
                <span className="text-slate-400">
                  From <span className="text-purple-300 font-bold">$44</span>
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <Shield className="w-3.5 h-3.5" />COA Included
                </span>
                {series && (
                  <span className="text-slate-400">
                    <span className="text-white font-bold">{series.length}</span> series
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prints, series..."
              className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 flex-wrap mb-6">
          {SERIES_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-purple-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span>Loading catalog...</span>
          </div>
        )}

        {/* Products grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => {
              const inCart = cart.some((c) => c.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer"
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} relative flex items-center justify-center`}
                  >
                    <Palette className="w-10 h-10 text-white/20" />
                    {product.totalEdition <= 44 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-900/60 text-yellow-300 border-yellow-500/30 text-[9px] px-1.5">
                          <Star className="w-2.5 h-2.5 mr-0.5 fill-yellow-300" />Signed
                        </Badge>
                      </div>
                    )}
                    {product.totalEdition <= 14 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-900/60 text-red-300 border-red-500/30 text-[9px] px-1.5">
                          Limited
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-slate-500 mb-0.5">{product.series}</p>
                    <p className="text-sm font-semibold text-white truncate mb-1">{product.title}</p>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[9px] px-1.5">
                        {product.edition} of {product.totalEdition}
                      </Badge>
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[9px] px-1.5">
                        {product.medium}
                      </Badge>
                      {product.totalEdition <= 44 && (
                        <Badge className="bg-green-900/30 text-green-400 border-green-500/20 text-[9px] px-1.5">
                          COA
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-white">${product.price}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          inCart
                            ? removeFromCart(product.id)
                            : addToCart({ id: product.id, title: product.title, price: product.price })
                        }
                        className={`h-7 px-2.5 text-[10px] font-bold transition-all ${
                          inCart
                            ? "bg-green-700 hover:bg-red-700"
                            : "bg-purple-600 hover:bg-purple-500"
                        } text-white`}
                      >
                        {inCart ? (
                          <><Download className="w-3 h-3 mr-1" />In Cart</>
                        ) : (
                          <><ShoppingCart className="w-3 h-3 mr-1" />Buy</>
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {product.year} · {product.dimensions}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Palette className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No products match your search</p>
          </div>
        )}

        {/* Cart summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-purple-900/95 backdrop-blur border border-purple-500/30 text-white rounded-xl p-4 shadow-2xl shadow-purple-900/50 flex items-center gap-3 z-50 max-w-xs">
            <ShoppingCart className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">
                {cart.length} item{cart.length > 1 ? "s" : ""} in cart
              </p>
              <p className="text-xs text-purple-200">${cartTotal} total</p>
            </div>
            <Button
              size="sm"
              className="bg-white text-purple-700 hover:bg-purple-50 font-bold ml-2 shrink-0"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <><Zap className="w-3.5 h-3.5 mr-1" />Checkout</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
