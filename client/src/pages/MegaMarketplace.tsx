import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ShoppingCart, Zap, Heart, Shield, Brain, Gamepad2, Package, Sparkles, TrendingUp, Filter, ChevronRight, Lock, Eye, Globe, DollarSign, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: Globe, color: "text-foreground" },
  { id: "products", label: "Products", icon: Package, color: "text-blue-400" },
  { id: "ai-tools", label: "AI Tools", icon: Brain, color: "text-purple-400" },
  { id: "digital", label: "Digital Goods", icon: Zap, color: "text-yellow-400" },
  { id: "games", label: "Charity Games", icon: Gamepad2, color: "text-purple-400" },
  { id: "adult", label: "18+ Tools", icon: Lock, color: "text-red-400" },
  { id: "subscriptions", label: "Subscriptions", icon: Sparkles, color: "text-pink-400" },
];

const FEATURED_PRODUCTS = [
  // Physical Products (DHgate-style)
  { id: 1, category: "products", name: "Wireless Earbuds Pro X", price: 18.99, originalPrice: 89.99, rating: 4.7, reviews: 12847, sold: 45230, image: "🎧", badge: "Best Seller", tag: "Electronics", sku: "DHG-001", description: "True wireless, 30hr battery, ANC, IPX5 waterproof. Compatible with all devices." },
  { id: 2, category: "products", name: "Smart Watch Series 8 Clone", price: 24.50, originalPrice: 199.00, rating: 4.5, reviews: 8934, sold: 32100, image: "⌚", badge: "Hot", tag: "Wearables", sku: "DHG-002", description: "1.9\" AMOLED display, health monitoring, 100+ sport modes, 7-day battery." },
  { id: 3, category: "products", name: "Mechanical Gaming Keyboard RGB", price: 32.00, originalPrice: 120.00, rating: 4.8, reviews: 6721, sold: 18900, image: "⌨️", badge: "Top Rated", tag: "Gaming", sku: "DHG-003", description: "Blue switches, per-key RGB, aluminum frame, anti-ghosting, USB-C." },
  { id: 4, category: "products", name: "Portable Power Bank 30000mAh", price: 22.99, originalPrice: 79.99, rating: 4.6, reviews: 15203, sold: 67800, image: "🔋", badge: "Best Seller", tag: "Accessories", sku: "DHG-004", description: "65W PD fast charge, 3 USB-A + 1 USB-C, LED display, airline approved." },
  { id: 5, category: "products", name: "Drone Mini 4K Camera", price: 89.00, originalPrice: 350.00, rating: 4.4, reviews: 4521, sold: 9800, image: "🚁", badge: "New", tag: "Drones", sku: "DHG-005", description: "4K/60fps, 3-axis gimbal, 30min flight, obstacle avoidance, 5km range." },
  { id: 6, category: "products", name: "LED Strip Lights 10m Smart", price: 12.99, originalPrice: 45.00, rating: 4.9, reviews: 23451, sold: 89000, image: "💡", badge: "Top Seller", tag: "Home", sku: "DHG-006", description: "RGB+IC, app controlled, music sync, voice control, 16M colors." },
  { id: 7, category: "products", name: "Tactical Backpack 45L", price: 28.00, originalPrice: 95.00, rating: 4.6, reviews: 7832, sold: 24500, image: "🎒", badge: "Popular", tag: "Bags", sku: "DHG-007", description: "Molle system, laptop compartment, waterproof, USB charging port, military grade." },
  { id: 8, category: "products", name: "Luxury Perfume Set (6 pcs)", price: 19.99, originalPrice: 120.00, rating: 4.3, reviews: 5621, sold: 31200, image: "🌸", badge: "Gift Set", tag: "Beauty", sku: "DHG-008", description: "6x30ml designer-inspired fragrances, gift box, long lasting 8-12hrs." },
  { id: 9, category: "products", name: "Carbon Fiber Phone Case", price: 8.99, originalPrice: 29.99, rating: 4.7, reviews: 19823, sold: 102000, image: "📱", badge: "Best Value", tag: "Accessories", sku: "DHG-009", description: "Real carbon fiber, MagSafe compatible, military drop protection, ultra-thin." },
  { id: 10, category: "products", name: "Stainless Steel Watch Men", price: 15.50, originalPrice: 89.00, rating: 4.5, reviews: 11234, sold: 43200, image: "🕐", badge: "Classic", tag: "Watches", sku: "DHG-010", description: "Sapphire crystal, 50m water resistant, automatic movement, date display." },
  // AI Tools
  { id: 11, category: "ai-tools", name: "AI Content Generator Pro", price: 9.99, originalPrice: 29.99, rating: 4.8, reviews: 3421, sold: 12800, image: "✍️", badge: "AI", tag: "Writing", sku: "AI-001", description: "Generate 10,000 words/month. Blog posts, ads, emails, social captions. GPT-5 powered." },
  { id: 12, category: "ai-tools", name: "AI Image Studio Credits", price: 4.99, originalPrice: 14.99, rating: 4.9, reviews: 8932, sold: 45600, image: "🎨", badge: "Credits", tag: "Design", sku: "AI-002", description: "500 HD image generations. Stable Diffusion + DALL-E 3. Commercial license included." },
  { id: 13, category: "ai-tools", name: "AI Trading Signals Bot", price: 19.99, originalPrice: 79.99, rating: 4.6, reviews: 2341, sold: 7800, image: "📈", badge: "Finance", tag: "Crypto", sku: "AI-003", description: "Real-time buy/sell signals for 200+ crypto pairs. 78% accuracy rate. Telegram alerts." },
  { id: 14, category: "ai-tools", name: "AI Voice Clone Pack", price: 14.99, originalPrice: 49.99, rating: 4.7, reviews: 1823, sold: 5400, image: "🎙️", badge: "Voice", tag: "Audio", sku: "AI-004", description: "Clone any voice in 30 seconds. 50 voice generations/month. Multi-language." },
  { id: 15, category: "ai-tools", name: "AI Code Assistant Annual", price: 29.99, originalPrice: 120.00, rating: 4.9, reviews: 5621, sold: 18900, image: "💻", badge: "Dev", tag: "Coding", sku: "AI-005", description: "Full-stack code completion, bug detection, refactoring. Supports 50+ languages." },
  // Digital Goods
  { id: 16, category: "digital", name: "Netflix Premium Account 1yr", price: 12.00, originalPrice: 215.88, rating: 4.2, reviews: 34521, sold: 123000, image: "🎬", badge: "Streaming", tag: "Entertainment", sku: "DIG-001", description: "4K UHD, 4 screens, downloads. Shared account. Instant delivery." },
  { id: 17, category: "digital", name: "Spotify Premium 12 Months", price: 7.99, originalPrice: 119.88, rating: 4.4, reviews: 28932, sold: 98000, image: "🎵", badge: "Music", tag: "Entertainment", sku: "DIG-002", description: "Ad-free, offline downloads, high quality audio. Individual plan." },
  { id: 18, category: "digital", name: "VPN Service 3 Years", price: 2.99, originalPrice: 107.64, rating: 4.7, reviews: 12341, sold: 56000, image: "🔐", badge: "Privacy", tag: "Security", sku: "DIG-003", description: "5 devices, 90+ countries, no logs, kill switch, P2P allowed." },
  { id: 19, category: "digital", name: "Adobe Creative Suite Key", price: 24.99, originalPrice: 599.88, rating: 4.3, reviews: 7823, sold: 23400, image: "🖼️", badge: "Design", tag: "Software", sku: "DIG-004", description: "Photoshop, Illustrator, Premiere Pro, After Effects. 1 year license." },
  { id: 20, category: "digital", name: "Minecraft Java Edition", price: 14.99, originalPrice: 26.95, rating: 4.9, reviews: 45231, sold: 234000, image: "⛏️", badge: "Gaming", tag: "Games", sku: "DIG-005", description: "Official Minecraft Java Edition key. Instant delivery. Lifetime license." },
  // Charity Games (link to game pages)
  { id: 21, category: "games", name: "Crypto Quiz Blitz", price: 0, originalPrice: 0, rating: 4.9, reviews: 8421, sold: 45230, image: "🧠", badge: "Free", tag: "Quiz", sku: "GAME-001", description: "Answer 10 blockchain questions. Every correct answer donates SKY444 to Education Fund.", link: "/games/crypto-quiz" },
  { id: 22, category: "games", name: "Token Tap Frenzy", price: 0, originalPrice: 0, rating: 4.8, reviews: 15203, sold: 67800, image: "👆", badge: "Free", tag: "Arcade", sku: "GAME-002", description: "Tap as fast as you can for 30 seconds. Every tap = 1 SKY444 to Clean Water Initiative.", link: "/games/token-tap" },
  { id: 23, category: "games", name: "Block Builder", price: 0, originalPrice: 0, rating: 4.7, reviews: 6782, sold: 24500, image: "🏗️", badge: "Free", tag: "Puzzle", sku: "GAME-003", description: "Stack blockchain blocks as high as possible. Each block = 1 SKY444 to Hunger Relief.", link: "/games/block-builder" },
  // 18+ Adult Grey-Area (age-gated)
  { id: 24, category: "adult", name: "AI Companion Chat Pro", price: 9.99, originalPrice: 29.99, rating: 4.6, reviews: 23451, sold: 89000, image: "💬", badge: "18+", tag: "AI Chat", sku: "ADL-001", description: "Uncensored AI conversation partner. Custom personas, memory, roleplay. Adults only.", ageGated: true },
  { id: 25, category: "adult", name: "AI Art Generator Uncensored", price: 14.99, originalPrice: 49.99, rating: 4.5, reviews: 12341, sold: 45600, image: "🎨", badge: "18+", tag: "AI Art", sku: "ADL-002", description: "Generate any style of AI art with no content filters. 1000 generations/month.", ageGated: true },
  { id: 26, category: "adult", name: "Privacy VPN + Tor Bundle", price: 4.99, originalPrice: 19.99, rating: 4.8, reviews: 8932, sold: 34200, image: "🕵️", badge: "Privacy", tag: "Security", sku: "ADL-003", description: "Maximum anonymity bundle. VPN + Tor routing + encrypted DNS. Zero logs.", ageGated: true },
  // Subscriptions
  { id: 27, category: "subscriptions", name: "SKYCOIN4444 Pro Monthly", price: 9.99, originalPrice: 19.99, rating: 4.9, reviews: 5621, sold: 18900, image: "⚡", badge: "Pro", tag: "Platform", sku: "SUB-001", description: "Ad-free, 2x XP, exclusive content, priority support, creator tools, 500 AI credits/mo." },
  { id: 28, category: "subscriptions", name: "Creator Pro Bundle", price: 24.99, originalPrice: 79.99, rating: 4.8, reviews: 3421, sold: 8900, image: "🌟", badge: "Creator", tag: "Creator", sku: "SUB-002", description: "Monetization tools, analytics, custom channel, merch store, 2000 AI credits/mo." },
  { id: 29, category: "subscriptions", name: "Enterprise API Access", price: 99.99, originalPrice: 299.99, rating: 4.7, reviews: 234, sold: 890, image: "🏢", badge: "Enterprise", tag: "API", sku: "SUB-003", description: "Full API access, 1M requests/mo, dedicated support, SLA, white-label options." },
];

const REVIEWS_MAP: Record<number, Array<{user: string; rating: number; text: string; date: string; verified: boolean}>> = {
  1: [
    { user: "TechReviewer99", rating: 5, text: "Amazing sound quality for the price. ANC actually works well.", date: "2 days ago", verified: true },
    { user: "MusicLover2024", rating: 5, text: "Best budget earbuds I've owned. Battery lasts forever.", date: "1 week ago", verified: true },
    { user: "CryptoTrader_X", rating: 4, text: "Good quality, slight delay on calls but great for music.", date: "2 weeks ago", verified: false },
  ],
  11: [
    { user: "ContentCreator_K", rating: 5, text: "Saved me 10 hours a week on content creation. Worth every penny.", date: "3 days ago", verified: true },
    { user: "MarketingPro", rating: 5, text: "The AI writes better than most humans I know.", date: "1 week ago", verified: true },
  ],
};

export default function MegaMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price_low" | "price_high" | "rating">("popular");
  const [cart, setCart] = useState<number[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [pendingAdultProduct, setPendingAdultProduct] = useState<number | null>(null);

  const filtered = FEATURED_PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.sold - a.sold;
  });

  const addToCart = (productId: number, isAdult?: boolean) => {
    if (isAdult && !ageVerified) {
      setPendingAdultProduct(productId);
      setShowAgeGate(true);
      return;
    }
    setCart(p => p.includes(productId) ? p : [...p, productId]);
  };

  const confirmAge = () => {
    setAgeVerified(true);
    setShowAgeGate(false);
    if (pendingAdultProduct) {
      setCart(p => [...p, pendingAdultProduct]);
      setPendingAdultProduct(null);
    }
  };

  const totalRevenue = FEATURED_PRODUCTS.reduce((sum, p) => sum + p.price * p.sold, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Age Gate Modal */}
      {showAgeGate && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">🔞</div>
            <h2 className="text-xl font-bold mb-2">Age Verification Required</h2>
            <p className="text-muted-foreground text-sm mb-6">This content is for adults 18+ only. By continuing you confirm you are at least 18 years old and agree to our Terms of Service.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowAgeGate(false); setPendingAdultProduct(null); }}>Cancel</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={confirmAge}>I am 18+</Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="border-b border-border/50 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-10">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">MEGA MARKETPLACE</Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">● LIVE</Badge>
          </div>
          <h1 className="text-4xl font-black mb-3">One Marketplace.<br /><span className="text-primary">Everything You Need.</span></h1>
          <p className="text-muted-foreground max-w-xl mb-6">Products, AI tools, digital goods, charity games, and exclusive content — all in one place. Every purchase supports the ecosystem.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Products Listed", value: "50,000+", color: "text-blue-400" },
              { label: "Total Revenue", value: `$${(totalRevenue / 1000000).toFixed(1)}M`, color: "text-purple-400" },
              { label: "Active Buyers", value: "124K+", color: "text-purple-400" },
              { label: "Charity Donated", value: "66K SKY444", color: "text-yellow-400" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Search */}
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products, AI tools, games..." className="pl-10 h-11 bg-card/50 border-border/50" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="h-11 px-3 rounded-xl border border-border/50 bg-card/50 text-sm">
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <Link href="/admin-orders">
              <Button variant="outline" className="h-11 gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                <Shield className="h-4 w-4" />Admin
              </Button>
            </Link>
            {cart.length > 0 && (
              <Button className="h-11 gap-2 bg-primary text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />{cart.length}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Nav */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${activeCategory === cat.id ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}>
              <cat.icon className={`h-4 w-4 ${cat.color}`} />{cat.label}
              {cat.id === "adult" && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">18+</span>}
            </button>
          ))}
        </div>

        {/* Revenue Banner */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5 p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-purple-400 mb-1">💰 Platform Revenue Engine</p>
            <p className="text-xs text-muted-foreground">15% marketplace fee · 20% creator rev-share · 2.5% transaction fee · All orders tracked for tax compliance</p>
          </div>
          <Link href="/profitability">
            <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 gap-1">
              <TrendingUp className="h-3.5 w-3.5" />View Revenue Dashboard <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className={`rounded-2xl border bg-card/30 overflow-hidden hover:border-primary/30 transition-all group ${product.ageGated && !ageVerified ? "border-red-500/20" : "border-border/50"}`}>
              {/* Product Image Area */}
              <div className={`relative h-40 flex items-center justify-center text-6xl ${product.category === "products" ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10" : product.category === "ai-tools" ? "bg-gradient-to-br from-purple-500/10 to-violet-500/10" : product.category === "games" ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10" : product.category === "adult" ? "bg-gradient-to-br from-red-500/10 to-pink-500/10" : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"}`}>
                {product.ageGated && !ageVerified ? (
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-10 w-10 text-red-400" />
                    <span className="text-xs text-red-400 font-semibold">Age Verified Only</span>
                  </div>
                ) : (
                  <span>{product.image}</span>
                )}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                  <Badge className="text-xs bg-primary/80 text-primary-foreground">{product.badge}</Badge>
                  {product.ageGated && <Badge className="text-xs bg-red-500/80 text-white">18+</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">{product.tag}</Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
                  <span className="text-xs text-muted-foreground ml-auto">{product.sold.toLocaleString()} sold</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  {product.price === 0 ? (
                    <span className="text-lg font-black text-purple-400">FREE</span>
                  ) : (
                    <>
                      <span className="text-lg font-black text-primary">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                {/* Actions */}
                {product.link ? (
                  <Link href={product.link}>
                    <Button className="w-full h-9 bg-purple-600 hover:bg-purple-600 text-white text-xs gap-1">
                      <Gamepad2 className="h-3.5 w-3.5" />Play & Donate
                    </Button>
                  </Link>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => addToCart(product.id, product.ageGated)} className={`flex-1 h-9 text-xs gap-1 ${cart.includes(product.id) ? "bg-purple-600 hover:bg-purple-600" : "bg-primary hover:bg-primary/90"} text-primary-foreground`}>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {cart.includes(product.id) ? "Added ✓" : "Add to Cart"}
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* Expanded Reviews */}
                {expandedProduct === product.id && REVIEWS_MAP[product.id] && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Top Reviews</p>
                    {REVIEWS_MAP[product.id].map((r, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-medium">{r.user}</span>
                          {r.verified && <Badge className="text-xs bg-purple-600/20 text-purple-400 border-purple-500/30 py-0">✓ Verified</Badge>}
                          <span className="text-muted-foreground ml-auto">{r.date}</span>
                        </div>
                        <div className="flex mb-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />)}
                        </div>
                        <p className="text-muted-foreground">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-20 right-4 z-40">
            <div className="rounded-2xl border border-primary/30 bg-card/95 backdrop-blur p-4 shadow-2xl min-w-[200px]">
              <p className="text-sm font-semibold mb-2">Cart ({cart.length} items)</p>
              <p className="text-xs text-muted-foreground mb-3">
                Total: ${cart.reduce((sum, id) => sum + (FEATURED_PRODUCTS.find(p => p.id === id)?.price || 0), 0).toFixed(2)}
              </p>
              <Link href="/admin-orders">
                <Button className="w-full h-9 text-xs gap-1">
                  <DollarSign className="h-3.5 w-3.5" />Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Become a Marketplace Seller</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">List your products, digital goods, or AI tools. Keep 85% of every sale. Access 124K+ buyers.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/creator-onboarding">
              <Button className="gap-2"><Package className="h-4 w-4" />Start Selling</Button>
            </Link>
            <Link href="/profitability">
              <Button variant="outline" className="gap-2"><TrendingUp className="h-4 w-4" />Revenue Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
