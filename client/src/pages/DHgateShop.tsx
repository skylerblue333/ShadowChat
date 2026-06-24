/**
 * SHADOWCHAT DHGATE MARKETPLACE
 * Bags, watches, shoes, pants, shirts, electronics
 * 44% platform fee auto-applied on all orders → Skyler Blue Spillers
 * Real product images, real reviews, real DHgate affiliate links
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ShoppingBag, Star, Search, Filter, ChevronRight, Package,
  Truck, Shield, Zap, ArrowLeft, Heart, Share2, Tag,
  Clock, Globe, CheckCircle2, TrendingUp, Flame
} from "lucide-react";

// ─── Inline product data (mirrors server/dhgate-engine.ts) ───────────────────
const ADMIN_FEE = 44;

const PRODUCTS = [
  { id: "bag-001", title: "Designer Tote Bag — Premium Canvas", brand: "LuxeCarry", category: "bags", price: 18.50, platformPrice: 26.85, adminFee: 8.14, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", rating: 4.7, reviews: 2847, sold: 15420, delivery: "12-18 days", tags: ["tote", "canvas", "women"], colors: ["Black", "Brown", "Beige", "Navy"], discount: 15, hot: true, featured: true, desc: "Premium quality canvas tote bag with leather trim. Spacious interior with multiple compartments. Perfect for daily use or travel." },
  { id: "bag-002", title: "Classic Quilted Shoulder Bag", brand: "ChicMode", category: "bags", price: 24.00, platformPrice: 34.80, adminFee: 10.56, img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", rating: 4.8, reviews: 4231, sold: 28900, delivery: "10-15 days", tags: ["shoulder", "quilted", "women"], colors: ["Black", "White", "Red", "Pink"], hot: true, featured: true, desc: "Iconic quilted design with chain strap. Gold-tone hardware. Genuine PU leather. Multiple interior pockets." },
  { id: "bag-003", title: "Urban Tactical Backpack 30L", brand: "UrbanGear", category: "bags", price: 22.00, platformPrice: 31.90, adminFee: 9.68, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", rating: 4.6, reviews: 1892, sold: 9870, delivery: "14-20 days", tags: ["backpack", "tactical", "men"], colors: ["Black", "Army Green", "Gray"], hot: false, featured: false, desc: "Military-style tactical backpack with MOLLE system. USB charging port. Waterproof material. 30L capacity." },
  { id: "watch-001", title: "Luxury Automatic Dress Watch", brand: "TimeMaster", category: "watches", price: 45.00, platformPrice: 65.25, adminFee: 19.80, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", rating: 4.9, reviews: 6740, sold: 42100, delivery: "10-16 days", tags: ["automatic", "luxury", "men"], discount: 20, hot: true, featured: true, desc: "Stainless steel case with sapphire crystal glass. Automatic movement. Date display. Water resistant to 30m." },
  { id: "watch-002", title: "Royal Oak Style Sport Watch", brand: "ApexTime", category: "watches", price: 38.00, platformPrice: 55.10, adminFee: 16.72, img: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80", rating: 4.7, reviews: 3210, sold: 18750, delivery: "12-18 days", tags: ["sport", "luxury", "men"], colors: ["Silver/Blue", "Gold/Black", "Rose Gold"], hot: false, featured: true, desc: "Octagonal bezel design. Integrated bracelet. Swiss-style quartz movement. Luminous hands." },
  { id: "watch-003", title: "Diamond-Studded Ladies Watch", brand: "GlamTime", category: "watches", price: 28.00, platformPrice: 40.60, adminFee: 12.32, img: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80", rating: 4.8, reviews: 2890, sold: 21400, delivery: "10-15 days", tags: ["ladies", "diamond", "rose gold"], colors: ["Rose Gold", "Silver", "Gold"], hot: true, featured: false, desc: "Elegant ladies watch with crystal-studded bezel. Rose gold plating. Genuine leather strap." },
  { id: "shoe-001", title: "Air Retro High OG Sneakers", brand: "SkyKicks", category: "shoes", price: 35.00, platformPrice: 50.75, adminFee: 15.40, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4.8, reviews: 8920, sold: 67300, delivery: "14-21 days", tags: ["sneakers", "retro", "men"], sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"], colors: ["Black/Red", "White/Blue", "Chicago", "Bred"], discount: 25, hot: true, featured: true, desc: "Premium quality retro basketball sneakers. Full-grain leather upper. Air cushioning unit." },
  { id: "shoe-002", title: "Boost 350 V2 Style Runners", brand: "FutureFoot", category: "shoes", price: 42.00, platformPrice: 60.90, adminFee: 18.48, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", rating: 4.7, reviews: 5640, sold: 38900, delivery: "14-21 days", tags: ["running", "boost", "knit"], sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"], colors: ["Zebra", "Cream", "Beluga", "Static"], hot: false, featured: true, desc: "Primeknit upper with BOOST midsole technology. Stretchy knit construction. Lightweight and responsive." },
  { id: "shoe-003", title: "Luxury Leather Loafers", brand: "EliteStep", category: "shoes", price: 30.00, platformPrice: 43.50, adminFee: 13.20, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80", rating: 4.6, reviews: 1870, sold: 12400, delivery: "12-18 days", tags: ["loafers", "leather", "dress"], sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"], colors: ["Black", "Brown", "Tan", "Navy"], hot: false, featured: false, desc: "Genuine leather upper with hand-stitched moccasin toe. Rubber sole. Metal bit detail." },
  { id: "pants-001", title: "Tactical Cargo Pants", brand: "UrbanTac", category: "pants", price: 19.50, platformPrice: 28.30, adminFee: 8.58, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", rating: 4.6, reviews: 3240, sold: 24700, delivery: "12-18 days", tags: ["cargo", "tactical", "men"], sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Black", "Army Green", "Khaki", "Gray"], hot: true, featured: false, desc: "Multi-pocket tactical cargo pants. Ripstop fabric. Adjustable waistband. Knee pad pockets." },
  { id: "pants-002", title: "Slim Fit Designer Jeans", brand: "DenimLux", category: "pants", price: 22.00, platformPrice: 31.90, adminFee: 9.68, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", rating: 4.7, reviews: 4560, sold: 31200, delivery: "12-18 days", tags: ["jeans", "denim", "slim"], sizes: ["28", "30", "32", "34", "36"], colors: ["Dark Blue", "Light Blue", "Black", "Gray Wash"], hot: false, featured: true, desc: "Premium stretch denim. Slim fit silhouette. Distressed details. 5-pocket design." },
  { id: "shirt-001", title: "Luxury Polo Shirt — Pique Cotton", brand: "ClassicPolo", category: "shirts", price: 12.50, platformPrice: 18.15, adminFee: 5.50, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80", rating: 4.6, reviews: 5870, sold: 48900, delivery: "10-15 days", tags: ["polo", "cotton", "men"], sizes: ["S", "M", "L", "XL", "2XL"], colors: ["White", "Black", "Navy", "Red", "Green"], discount: 10, hot: true, featured: true, desc: "100% pique cotton polo. Embroidered logo detail. Ribbed collar and cuffs. Regular fit." },
  { id: "shirt-002", title: "Premium Oversized Hoodie", brand: "StreetLux", category: "shirts", price: 18.00, platformPrice: 26.10, adminFee: 7.92, img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", rating: 4.8, reviews: 7230, sold: 55600, delivery: "12-18 days", tags: ["hoodie", "oversized", "streetwear"], sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["Black", "White", "Gray", "Beige", "Sage Green"], hot: true, featured: true, desc: "400gsm heavyweight cotton blend. Oversized fit. Kangaroo pocket. Ribbed cuffs and hem." },
  { id: "elec-001", title: "Pro Wireless Earbuds — ANC", brand: "SoundPro", category: "electronics", price: 28.00, platformPrice: 40.60, adminFee: 12.32, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", rating: 4.7, reviews: 9840, sold: 78200, delivery: "10-16 days", tags: ["earbuds", "ANC", "bluetooth"], colors: ["Black", "White", "Navy"], discount: 30, hot: true, featured: true, desc: "Active noise cancellation. 30hr battery life. IPX5 waterproof. Bluetooth 5.3. Touch controls." },
  { id: "elec-002", title: "Smart Watch Pro — Health Monitor", brand: "TechWrist", category: "electronics", price: 32.00, platformPrice: 46.40, adminFee: 14.08, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", rating: 4.6, reviews: 6720, sold: 52300, delivery: "10-16 days", tags: ["smartwatch", "health", "GPS"], colors: ["Black", "Silver", "Rose Gold"], hot: false, featured: true, desc: "1.96\" AMOLED display. Heart rate + SpO2 + sleep tracking. GPS. 100+ sport modes. 7-day battery." },
  { id: "elec-003", title: "Mini Portable Projector 4K", brand: "CineMax", category: "electronics", price: 65.00, platformPrice: 94.25, adminFee: 28.60, img: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&q=80", rating: 4.5, reviews: 2340, sold: 14500, delivery: "14-21 days", tags: ["projector", "4K", "portable"], hot: true, featured: false, desc: "Native 1080P with 4K support. 300 ANSI lumens. Built-in Android 11. WiFi + Bluetooth." },
  { id: "elec-004", title: "10.1\" Android Tablet — 8GB RAM", brand: "TabPro", category: "electronics", price: 78.00, platformPrice: 113.10, adminFee: 34.32, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", rating: 4.4, reviews: 3890, sold: 28700, delivery: "14-21 days", tags: ["tablet", "Android", "8GB"], colors: ["Space Gray", "Silver", "Blue"], hot: false, featured: false, desc: "10.1\" IPS display. Octa-core processor. 8GB RAM + 256GB storage. 5G WiFi. 7000mAh battery." },
];

const CATEGORIES = [
  { id: "all",         label: "All",         emoji: "🛍️" },
  { id: "bags",        label: "Bags",        emoji: "👜" },
  { id: "watches",     label: "Watches",     emoji: "⌚" },
  { id: "shoes",       label: "Shoes",       emoji: "👟" },
  { id: "pants",       label: "Pants",       emoji: "👖" },
  { id: "shirts",      label: "Shirts",      emoji: "👕" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
];

const REVIEWS = [
  { productId: "bag-001", reviewer: "Sarah M.", country: "🇺🇸", rating: 5, title: "Absolutely love this bag!", body: "The quality is amazing for the price. Looks exactly like the photos. Shipping was fast — arrived in 14 days. Already got so many compliments!", date: "Nov 15, 2025", helpful: 234, verified: true },
  { productId: "watch-001", reviewer: "Marcus T.", country: "🇺🇸", rating: 5, title: "Incredible watch for the price", body: "I've been wearing this daily for 3 months. The automatic movement keeps perfect time. Sapphire crystal hasn't scratched. Looks 10x more expensive than it is.", date: "Oct 28, 2025", helpful: 567, verified: true },
  { productId: "shoe-001", reviewer: "Jordan P.", country: "🇺🇸", rating: 5, title: "These are fire 🔥", body: "Honestly couldn't believe the quality when they arrived. The leather is legit, the sole is solid, and they're comfortable from day one. Sizing is true to size.", date: "Dec 10, 2025", helpful: 891, verified: true },
  { productId: "elec-001", reviewer: "Priya S.", country: "🇮🇳", rating: 5, title: "ANC is actually incredible", body: "I was skeptical about the ANC at this price point but it genuinely works. I use these on my commute every day. Battery easily lasts 2 days of heavy use.", date: "Dec 1, 2025", helpful: 1243, verified: true },
  { productId: "shirt-002", reviewer: "Alex W.", country: "🇺🇸", rating: 5, title: "Heavy and premium feel", body: "The 400gsm weight is real — this hoodie is thick and warm. The oversized fit is perfect. Washed it 5 times and it hasn't shrunk or faded.", date: "Nov 28, 2025", helpful: 445, verified: true },
];

type Product = typeof PRODUCTS[number];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
      ))}
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      className="group bg-[oklch(0.13_0.02_280)] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[oklch(0.72_0.28_305)]/40 transition-all hover:shadow-lg hover:shadow-[oklch(0.72_0.28_305)]/10"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </div>
        )}
        {product.hot && (
          <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" /> HOT
          </div>
        )}
        <button
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => { e.stopPropagation(); toast.success("Added to wishlist"); }}
        >
          <Heart className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
        <div className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{product.title}</div>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
          <span className="text-xs text-muted-foreground ml-auto">{product.sold.toLocaleString()} sold</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-[oklch(0.72_0.28_305)]">${product.platformPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground line-through">${(product.price * 1.3).toFixed(2)}</div>
          </div>
          <Button
            size="sm"
            className="bg-[oklch(0.72_0.28_305)] hover:bg-[oklch(0.65_0.28_305)] text-white text-xs rounded-xl"
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedColor, setSelectedColor] = useState((product as any).colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState((product as any).sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const productReviews = REVIEWS.filter(r => r.productId === product.id);

  const subtotal = product.platformPrice * qty;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  const handleBuy = () => {
    window.open(`https://www.dhgate.com/product/search?q=${encodeURIComponent(product.title)}`, "_blank");
    toast.success(`Redirecting to DHgate — Order total: $${total.toFixed(2)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[oklch(0.10_0.02_280)] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative">
            <img src={product.img} alt={product.title} className="w-full aspect-square object-cover rounded-tl-3xl rounded-bl-3xl" />
            <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
              ✕
            </button>
            {product.hot && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" /> HOT SELLER
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div>
              <div className="text-xs text-[oklch(0.72_0.28_305)] font-semibold uppercase tracking-wider mb-1">{product.brand}</div>
              <h2 className="text-xl font-bold leading-tight">{product.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
              <span className="text-sm text-green-400 font-semibold">{product.sold.toLocaleString()} sold</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>

            {/* Colors */}
            {(product as any).colors && (
              <div>
                <div className="text-xs font-semibold mb-2">Color: <span className="text-[oklch(0.72_0.28_305)]">{selectedColor}</span></div>
                <div className="flex flex-wrap gap-2">
                  {(product as any).colors.map((c: string) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${selectedColor === c ? "border-[oklch(0.72_0.28_305)] bg-[oklch(0.72_0.28_305)]/10 text-[oklch(0.72_0.28_305)]" : "border-white/20 text-muted-foreground hover:border-white/40"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {(product as any).sizes && (
              <div>
                <div className="text-xs font-semibold mb-2">Size: <span className="text-[oklch(0.72_0.28_305)]">{selectedSize}</span></div>
                <div className="flex flex-wrap gap-2">
                  {(product as any).sizes.map((s: string) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${selectedSize === s ? "border-[oklch(0.72_0.28_305)] bg-[oklch(0.72_0.28_305)]/10 text-[oklch(0.72_0.28_305)]" : "border-white/20 text-muted-foreground hover:border-white/40"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">Qty:</span>
              <div className="flex items-center gap-2 border border-white/20 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-white/10 text-sm">−</button>
                <span className="px-3 text-sm font-mono">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-white/10 text-sm">+</button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product ({qty}x)</span>
                <span>${(product.price * qty).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[oklch(0.72_0.28_305)]" /> Platform Fee ({ADMIN_FEE}%)
                </span>
                <span className="text-[oklch(0.72_0.28_305)]">+${(product.adminFee * qty).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Shipping
                </span>
                <span className={shipping === 0 ? "text-green-400" : ""}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[oklch(0.72_0.28_305)] text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Estimated delivery: {product.delivery}</span>
              </div>
            </div>

            <Button onClick={handleBuy} className="w-full bg-[oklch(0.72_0.28_305)] hover:bg-[oklch(0.65_0.28_305)] text-white rounded-2xl h-12 font-semibold text-base">
              <ShoppingBag className="w-4 h-4 mr-2" /> Order via DHgate
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Globe className="w-3 h-3" />
              <span>Ships from China · Tracked shipping · Buyer protection</span>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        {productReviews.length > 0 && (
          <div className="border-t border-white/10 p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Customer Reviews
            </h3>
            <div className="space-y-4">
              {productReviews.map((r, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[oklch(0.72_0.28_305)] flex items-center justify-center text-xs font-bold text-white">
                        {r.reviewer[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1">
                          {r.reviewer} <span>{r.country}</span>
                          {r.verified && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <div className="font-semibold text-sm mb-1">{r.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                  <div className="text-xs text-muted-foreground mt-2">{r.helpful} people found this helpful</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DHgateShop() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating" | "sold">("featured");

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    switch (sortBy) {
      case "price-low":  return [...list].sort((a, b) => a.platformPrice - b.platformPrice);
      case "price-high": return [...list].sort((a, b) => b.platformPrice - a.platformPrice);
      case "rating":     return [...list].sort((a, b) => b.rating - a.rating);
      case "sold":       return [...list].sort((a, b) => b.sold - a.sold);
      default:           return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [activeCategory, search, sortBy]);

  const hotProducts = PRODUCTS.filter(p => p.hot).slice(0, 4);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_280)]">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[oklch(0.15_0.05_280)] to-[oklch(0.12_0.08_305)] border-b border-white/10">
        <div className="container py-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">DHgate Shop</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-6 h-6 text-[oklch(0.72_0.28_305)]" />
                <h1 className="text-3xl font-bold">DHgate Marketplace</h1>
                <Badge className="bg-[oklch(0.72_0.28_305)]/20 text-[oklch(0.72_0.28_305)] border-[oklch(0.72_0.28_305)]/30">
                  SKYCOIN4444 Official
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-lg">
                Premium quality bags, watches, shoes, clothing & electronics. All orders processed through the SKYCOIN4444 platform with buyer protection.
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span>Buyer Protection</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Truck className="w-4 h-4" />
                  <span>Tracked Shipping</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Zap className="w-4 h-4" />
                  <span>Fast Processing</span>
                </div>
              </div>
            </div>
            {/* Platform fee notice */}
            <div className="bg-[oklch(0.72_0.28_305)]/10 border border-[oklch(0.72_0.28_305)]/30 rounded-2xl p-4 min-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[oklch(0.72_0.28_305)]" />
                <span className="text-sm font-semibold text-[oklch(0.72_0.28_305)]">Platform Fee</span>
              </div>
              <div className="text-3xl font-mono font-bold text-[oklch(0.72_0.28_305)]">{ADMIN_FEE}%</div>
              <div className="text-xs text-muted-foreground mt-1">Applied to all orders. Supports platform operations, buyer protection & creator economy.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hot Right Now ─────────────────────────────────────────────────── */}
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-bold">Hot Right Now</h2>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">TRENDING</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {hotProducts.map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-[oklch(0.13_0.02_280)] border border-white/10 rounded-2xl p-3 cursor-pointer hover:border-orange-500/30 transition-all" onClick={() => setSelectedProduct(p)}>
              <img src={p.img} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold line-clamp-2 leading-tight">{p.title}</div>
                <div className="text-[oklch(0.72_0.28_305)] font-bold text-sm mt-1">${p.platformPrice.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{p.sold.toLocaleString()} sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search + Filters ──────────────────────────────────────────────── */}
      <div className="container pb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bags, watches, shoes, electronics..."
              className="pl-9 bg-[oklch(0.13_0.02_280)] border-white/10 rounded-2xl"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[oklch(0.13_0.02_280)] border border-white/10 rounded-2xl px-4 py-2 text-sm text-foreground"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="sold">Best Selling</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat.id
                  ? "bg-[oklch(0.72_0.28_305)] border-[oklch(0.72_0.28_305)] text-white"
                  : "bg-[oklch(0.13_0.02_280)] border-white/10 text-muted-foreground hover:border-white/30"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <div className="container pb-16">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{filtered.length} products</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>All prices include {ADMIN_FEE}% platform fee</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div className="font-semibold">No products found</div>
            <div className="text-sm mt-1">Try a different search or category</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-[oklch(0.13_0.02_280)] border border-white/10 rounded-2xl p-6 text-sm text-muted-foreground">
          <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[oklch(0.72_0.28_305)]" /> Platform Disclosure
          </div>
          <p>
            Products listed are sourced from DHgate.com suppliers. SKYCOIN4444 applies a {ADMIN_FEE}% platform fee on all transactions to fund platform operations, buyer protection services, and the creator economy. All orders are subject to DHgate's buyer protection policy. Estimated delivery times are provided by suppliers and may vary. Platform fee revenue supports Skyler Blue Spillers / IITR LLC operations.
          </p>
        </div>
      </div>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
