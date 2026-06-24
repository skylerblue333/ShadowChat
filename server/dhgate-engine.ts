/**
 * SHADOWCHAT DHGATE MARKETPLACE ENGINE v1.0
 * DHgate affiliate + dropship integration with 44% admin fee routing
 * All orders flow through SKYCOIN4444 platform — fee auto-applied
 * "I'm not a slave to robots — I have robots as slaves." — Skyler Blue Spillers
 */

export const ADMIN_FEE_PERCENT = 44; // 44% platform fee on all DHgate orders
export const ADMIN_WALLET = "skyler.blue.spillers@iitr.llc"; // Fee destination

export type ProductCategory = "bags" | "watches" | "shoes" | "pants" | "shirts" | "electronics" | "accessories" | "jewelry" | "sunglasses" | "sneakers";

export interface DHgateProduct {
  id: string;
  dhgateId: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  price: number;           // DHgate base price (USD)
  platformPrice: number;   // Price shown to users (includes 44% fee)
  adminFee: number;        // 44% of base price
  adminFeePercent: number;  // always 44
  images: string[];
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  inStock: boolean;
  shipsFrom: string;
  estimatedDelivery: string;
  affiliateUrl: string;
  tags: string[];
  sizes?: string[];
  colors?: string[];
  specs?: Record<string, string>;
  isFeatured: boolean;
  isHot: boolean;
  discount?: number;
}

export interface DHgateReview {
  id: string;
  productId: string;
  reviewer: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verified: boolean;
  helpful: number;
  date: string;
  country: string;
}

export interface DHgateOrder {
  orderId: string;
  userId: string;
  product: DHgateProduct;
  quantity: number;
  size?: string;
  color?: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  adminFee: number;
  shippingCost: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  trackingNumber?: string;
  createdAt: number;
  estimatedDelivery: string;
  paymentMethod: string;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

// ─── Product Catalog ─────────────────────────────────────────────────────────
// Real DHgate product categories with affiliate-style links and platform pricing

export const DHGATE_PRODUCTS: DHgateProduct[] = [
  // ── BAGS ──────────────────────────────────────────────────────────────────
  {
    id: "bag-001", dhgateId: "dh-bag-lv-001", title: "Designer Tote Bag — Premium Canvas", brand: "LuxeCarry", category: "bags", subcategory: "tote",
    description: "Premium quality canvas tote bag with leather trim. Spacious interior with multiple compartments. Perfect for daily use or travel. Ships from verified DHgate supplier.",
    price: 18.50, platformPrice: 26.85, adminFee: 8.14, adminFeePercent: 44,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
    rating: 4.7, reviewCount: 2847, soldCount: 15420, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/bags/tote-canvas",
    tags: ["tote", "canvas", "designer", "luxury", "women"], sizes: ["One Size"],
    colors: ["Black", "Brown", "Beige", "Navy"], isFeatured: true, isHot: true, discount: 15,
  },
  {
    id: "bag-002", dhgateId: "dh-bag-chanel-001", title: "Classic Quilted Shoulder Bag", brand: "ChicMode", category: "bags", subcategory: "shoulder",
    description: "Iconic quilted design with chain strap. Gold-tone hardware. Genuine PU leather. Multiple interior pockets.",
    price: 24.00, platformPrice: 34.80, adminFee: 10.56, adminFeePercent: 44,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80",
    rating: 4.8, reviewCount: 4231, soldCount: 28900, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-15 days",
    affiliateUrl: "https://www.dhgate.com/product/bags/quilted-shoulder",
    tags: ["shoulder", "quilted", "chain", "classic", "women"], colors: ["Black", "White", "Red", "Pink"],
    isFeatured: true, isHot: true,
  },
  {
    id: "bag-003", dhgateId: "dh-bag-backpack-001", title: "Urban Tactical Backpack 30L", brand: "UrbanGear", category: "bags", subcategory: "backpack",
    description: "Military-style tactical backpack with MOLLE system. USB charging port. Waterproof material. 30L capacity.",
    price: 22.00, platformPrice: 31.90, adminFee: 9.68, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    rating: 4.6, reviewCount: 1892, soldCount: 9870, inStock: true,
    shipsFrom: "China", estimatedDelivery: "14-20 days",
    affiliateUrl: "https://www.dhgate.com/product/bags/tactical-backpack",
    tags: ["backpack", "tactical", "urban", "travel", "men"], colors: ["Black", "Army Green", "Gray"],
    isFeatured: false, isHot: false,
  },
  // ── WATCHES ───────────────────────────────────────────────────────────────
  {
    id: "watch-001", dhgateId: "dh-watch-rolex-001", title: "Luxury Automatic Dress Watch", brand: "TimeMaster", category: "watches", subcategory: "automatic",
    description: "Stainless steel case with sapphire crystal glass. Automatic movement. Date display. Water resistant to 30m. Oyster-style bracelet.",
    price: 45.00, platformPrice: 65.25, adminFee: 19.80, adminFeePercent: 44,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    rating: 4.9, reviewCount: 6740, soldCount: 42100, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-16 days",
    affiliateUrl: "https://www.dhgate.com/product/watches/automatic-dress",
    tags: ["watch", "automatic", "luxury", "dress", "men", "stainless"],
    specs: { "Case Material": "316L Stainless Steel", "Movement": "Automatic", "Water Resistance": "30m", "Crystal": "Sapphire" },
    isFeatured: true, isHot: true, discount: 20,
  },
  {
    id: "watch-002", dhgateId: "dh-watch-ap-001", title: "Royal Oak Style Sport Watch", brand: "ApexTime", category: "watches", subcategory: "sport",
    description: "Octagonal bezel design. Integrated bracelet. Swiss-style quartz movement. Luminous hands. Scratch-resistant case.",
    price: 38.00, platformPrice: 55.10, adminFee: 16.72, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=300&q=80",
    rating: 4.7, reviewCount: 3210, soldCount: 18750, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/watches/sport-royal",
    tags: ["watch", "sport", "luxury", "men", "quartz"], colors: ["Silver/Blue", "Gold/Black", "Rose Gold"],
    isFeatured: true, isHot: false,
  },
  {
    id: "watch-003", dhgateId: "dh-watch-ladies-001", title: "Diamond-Studded Ladies Watch", brand: "GlamTime", category: "watches", subcategory: "ladies",
    description: "Elegant ladies watch with crystal-studded bezel. Rose gold plating. Genuine leather strap. Japanese quartz movement.",
    price: 28.00, platformPrice: 40.60, adminFee: 12.32, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=300&q=80",
    rating: 4.8, reviewCount: 2890, soldCount: 21400, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-15 days",
    affiliateUrl: "https://www.dhgate.com/product/watches/ladies-diamond",
    tags: ["watch", "ladies", "diamond", "rose gold", "elegant"], colors: ["Rose Gold", "Silver", "Gold"],
    isFeatured: false, isHot: true,
  },
  // ── SHOES ─────────────────────────────────────────────────────────────────
  {
    id: "shoe-001", dhgateId: "dh-shoe-jordan-001", title: "Air Retro High OG Sneakers", brand: "SkyKicks", category: "shoes", subcategory: "sneakers",
    description: "Premium quality retro basketball sneakers. Full-grain leather upper. Air cushioning unit. Rubber outsole with herringbone pattern.",
    price: 35.00, platformPrice: 50.75, adminFee: 15.40, adminFeePercent: 44,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    rating: 4.8, reviewCount: 8920, soldCount: 67300, inStock: true,
    shipsFrom: "China", estimatedDelivery: "14-21 days",
    affiliateUrl: "https://www.dhgate.com/product/shoes/retro-high-sneakers",
    tags: ["sneakers", "basketball", "retro", "high-top", "men"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"],
    colors: ["Black/Red", "White/Blue", "Chicago", "Bred", "Royal"],
    isFeatured: true, isHot: true, discount: 25,
  },
  {
    id: "shoe-002", dhgateId: "dh-shoe-yeezy-001", title: "Boost 350 V2 Style Runners", brand: "FutureFoot", category: "shoes", subcategory: "running",
    description: "Primeknit upper with BOOST midsole technology. Stretchy knit construction. Rubber outsole. Lightweight and responsive.",
    price: 42.00, platformPrice: 60.90, adminFee: 18.48, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80",
    rating: 4.7, reviewCount: 5640, soldCount: 38900, inStock: true,
    shipsFrom: "China", estimatedDelivery: "14-21 days",
    affiliateUrl: "https://www.dhgate.com/product/shoes/boost-runners",
    tags: ["sneakers", "running", "boost", "knit", "men", "women"],
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Zebra", "Cream", "Beluga", "Static", "Carbon"],
    isFeatured: true, isHot: false,
  },
  {
    id: "shoe-003", dhgateId: "dh-shoe-loafer-001", title: "Luxury Leather Loafers", brand: "EliteStep", category: "shoes", subcategory: "dress",
    description: "Genuine leather upper with hand-stitched moccasin toe. Rubber sole. Metal bit detail. Available in multiple colors.",
    price: 30.00, platformPrice: 43.50, adminFee: 13.20, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&q=80",
    rating: 4.6, reviewCount: 1870, soldCount: 12400, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/shoes/leather-loafers",
    tags: ["loafers", "leather", "dress", "men", "luxury"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Black", "Brown", "Tan", "Navy"],
    isFeatured: false, isHot: false,
  },
  // ── PANTS ─────────────────────────────────────────────────────────────────
  {
    id: "pants-001", dhgateId: "dh-pants-cargo-001", title: "Tactical Cargo Pants", brand: "UrbanTac", category: "pants", subcategory: "cargo",
    description: "Multi-pocket tactical cargo pants. Ripstop fabric. Adjustable waistband. Knee pad pockets. Available in multiple colors.",
    price: 19.50, platformPrice: 28.30, adminFee: 8.58, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&q=80",
    rating: 4.6, reviewCount: 3240, soldCount: 24700, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/pants/tactical-cargo",
    tags: ["cargo", "tactical", "men", "outdoor", "military"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Black", "Army Green", "Khaki", "Gray"],
    isFeatured: false, isHot: true,
  },
  {
    id: "pants-002", dhgateId: "dh-pants-jeans-001", title: "Slim Fit Designer Jeans", brand: "DenimLux", category: "pants", subcategory: "jeans",
    description: "Premium stretch denim. Slim fit silhouette. Distressed details. 5-pocket design. Authentic washed finish.",
    price: 22.00, platformPrice: 31.90, adminFee: 9.68, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80",
    rating: 4.7, reviewCount: 4560, soldCount: 31200, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/pants/slim-jeans",
    tags: ["jeans", "denim", "slim", "men", "designer"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Light Blue", "Black", "Gray Wash"],
    isFeatured: true, isHot: false,
  },
  // ── SHIRTS ────────────────────────────────────────────────────────────────
  {
    id: "shirt-001", dhgateId: "dh-shirt-polo-001", title: "Luxury Polo Shirt — Pique Cotton", brand: "ClassicPolo", category: "shirts", subcategory: "polo",
    description: "100% pique cotton polo. Embroidered logo detail. Ribbed collar and cuffs. Regular fit. Machine washable.",
    price: 12.50, platformPrice: 18.15, adminFee: 5.50, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&q=80",
    rating: 4.6, reviewCount: 5870, soldCount: 48900, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-15 days",
    affiliateUrl: "https://www.dhgate.com/product/shirts/luxury-polo",
    tags: ["polo", "cotton", "men", "casual", "luxury"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["White", "Black", "Navy", "Red", "Green", "Yellow"],
    isFeatured: true, isHot: true, discount: 10,
  },
  {
    id: "shirt-002", dhgateId: "dh-shirt-hoodie-001", title: "Premium Oversized Hoodie", brand: "StreetLux", category: "shirts", subcategory: "hoodie",
    description: "400gsm heavyweight cotton blend. Oversized fit. Kangaroo pocket. Ribbed cuffs and hem. Embroidered logo.",
    price: 18.00, platformPrice: 26.10, adminFee: 7.92, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80",
    rating: 4.8, reviewCount: 7230, soldCount: 55600, inStock: true,
    shipsFrom: "China", estimatedDelivery: "12-18 days",
    affiliateUrl: "https://www.dhgate.com/product/shirts/oversized-hoodie",
    tags: ["hoodie", "oversized", "streetwear", "men", "women", "cotton"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Black", "White", "Gray", "Beige", "Sage Green", "Brown"],
    isFeatured: true, isHot: true,
  },
  // ── ELECTRONICS ───────────────────────────────────────────────────────────
  {
    id: "elec-001", dhgateId: "dh-elec-earbuds-001", title: "Pro Wireless Earbuds — ANC", brand: "SoundPro", category: "electronics", subcategory: "audio",
    description: "Active noise cancellation. 30hr battery life. IPX5 waterproof. Bluetooth 5.3. Touch controls. Hi-Fi sound with deep bass.",
    price: 28.00, platformPrice: 40.60, adminFee: 12.32, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80",
    rating: 4.7, reviewCount: 9840, soldCount: 78200, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-16 days",
    affiliateUrl: "https://www.dhgate.com/product/electronics/anc-earbuds",
    tags: ["earbuds", "wireless", "ANC", "bluetooth", "audio"],
    colors: ["Black", "White", "Navy"],
    specs: { "Bluetooth": "5.3", "Battery": "30hr total", "Water Resistance": "IPX5", "ANC": "Yes", "Driver": "12mm" },
    isFeatured: true, isHot: true, discount: 30,
  },
  {
    id: "elec-002", dhgateId: "dh-elec-smartwatch-001", title: "Smart Watch Pro — Health Monitor", brand: "TechWrist", category: "electronics", subcategory: "smartwatch",
    description: "1.96\" AMOLED display. Heart rate + SpO2 + sleep tracking. GPS. 100+ sport modes. 7-day battery. IP68 waterproof.",
    price: 32.00, platformPrice: 46.40, adminFee: 14.08, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    rating: 4.6, reviewCount: 6720, soldCount: 52300, inStock: true,
    shipsFrom: "China", estimatedDelivery: "10-16 days",
    affiliateUrl: "https://www.dhgate.com/product/electronics/smart-watch-pro",
    tags: ["smartwatch", "health", "GPS", "fitness", "AMOLED"],
    colors: ["Black", "Silver", "Rose Gold"],
    specs: { "Display": "1.96\" AMOLED", "Battery": "7 days", "Water Resistance": "IP68", "GPS": "Built-in" },
    isFeatured: true, isHot: false,
  },
  {
    id: "elec-003", dhgateId: "dh-elec-phone-001", title: "Mini Portable Projector 4K", brand: "CineMax", category: "electronics", subcategory: "projector",
    description: "Native 1080P with 4K support. 300 ANSI lumens. Built-in Android 11. WiFi + Bluetooth. Auto keystone correction. 3hr battery.",
    price: 65.00, platformPrice: 94.25, adminFee: 28.60, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=300&q=80",
    rating: 4.5, reviewCount: 2340, soldCount: 14500, inStock: true,
    shipsFrom: "China", estimatedDelivery: "14-21 days",
    affiliateUrl: "https://www.dhgate.com/product/electronics/mini-projector",
    tags: ["projector", "4K", "portable", "home theater", "Android"],
    specs: { "Resolution": "1080P native / 4K support", "Brightness": "300 ANSI", "OS": "Android 11", "Battery": "3hr" },
    isFeatured: false, isHot: true,
  },
  {
    id: "elec-004", dhgateId: "dh-elec-tablet-001", title: "10.1\" Android Tablet — 8GB RAM", brand: "TabPro", category: "electronics", subcategory: "tablet",
    description: "10.1\" IPS display. Octa-core processor. 8GB RAM + 256GB storage. 5G WiFi. 7000mAh battery. Dual cameras.",
    price: 78.00, platformPrice: 113.10, adminFee: 34.32, adminFeePercent: 44,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
    thumbnailUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    rating: 4.4, reviewCount: 3890, soldCount: 28700, inStock: true,
    shipsFrom: "China", estimatedDelivery: "14-21 days",
    affiliateUrl: "https://www.dhgate.com/product/electronics/android-tablet",
    tags: ["tablet", "Android", "8GB", "10 inch", "5G WiFi"],
    colors: ["Space Gray", "Silver", "Blue"],
    specs: { "Display": "10.1\" IPS", "RAM": "8GB", "Storage": "256GB", "Battery": "7000mAh", "WiFi": "5G" },
    isFeatured: false, isHot: false,
  },
];

// ─── Review Catalog ───────────────────────────────────────────────────────────
export const DHGATE_REVIEWS: DHgateReview[] = [
  { id: "rev-001", productId: "bag-001", reviewer: "Sarah M.", rating: 5, title: "Absolutely love this bag!", body: "The quality is amazing for the price. Looks exactly like the photos. Shipping was fast — arrived in 14 days. Already got so many compliments!", images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80"], verified: true, helpful: 234, date: "2025-11-15", country: "US" },
  { id: "rev-002", productId: "bag-001", reviewer: "Jennifer K.", rating: 4, title: "Great quality, minor issue", body: "Really happy with this purchase. The leather trim is high quality and the stitching is solid. Docked one star because the zipper was slightly stiff at first but loosened up.", images: [], verified: true, helpful: 89, date: "2025-12-02", country: "UK" },
  { id: "rev-003", productId: "watch-001", reviewer: "Marcus T.", rating: 5, title: "Incredible watch for the price", body: "I've been wearing this daily for 3 months. The automatic movement keeps perfect time. Sapphire crystal hasn't scratched. Looks 10x more expensive than it is.", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"], verified: true, helpful: 567, date: "2025-10-28", country: "US" },
  { id: "rev-004", productId: "watch-001", reviewer: "David L.", rating: 5, title: "Best purchase I've made", body: "Bought this as a gift for my dad and he absolutely loves it. The weight feels premium, the bracelet clasp is smooth. Highly recommend.", images: [], verified: true, helpful: 312, date: "2025-11-20", country: "CA" },
  { id: "rev-005", productId: "shoe-001", reviewer: "Jordan P.", rating: 5, title: "These are fire 🔥", body: "Honestly couldn't believe the quality when they arrived. The leather is legit, the sole is solid, and they're comfortable from day one. Sizing is true to size.", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80"], verified: true, helpful: 891, date: "2025-12-10", country: "US" },
  { id: "rev-006", productId: "shoe-001", reviewer: "Kevin R.", rating: 4, title: "Great kicks, slight color difference", body: "Really happy overall. The quality is excellent. The colorway is slightly different from the photos but still looks great. Shipping took 18 days.", images: [], verified: true, helpful: 234, date: "2025-11-05", country: "AU" },
  { id: "rev-007", productId: "elec-001", reviewer: "Priya S.", rating: 5, title: "ANC is actually incredible", body: "I was skeptical about the ANC at this price point but it genuinely works. I use these on my commute every day. Battery easily lasts 2 days of heavy use.", images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80"], verified: true, helpful: 1243, date: "2025-12-01", country: "IN" },
  { id: "rev-008", productId: "shirt-002", reviewer: "Alex W.", rating: 5, title: "Heavy and premium feel", body: "The 400gsm weight is real — this hoodie is thick and warm. The oversized fit is perfect. Washed it 5 times and it hasn't shrunk or faded.", images: [], verified: true, helpful: 445, date: "2025-11-28", country: "US" },
];

// ─── Fee Calculation Engine ───────────────────────────────────────────────────
export function calculateOrderFees(basePrice: number, quantity: number): {
  subtotal: number;
  adminFee: number;
  shippingCost: number;
  total: number;
  adminFeePercent: number;
  adminDestination: string;
} {
  const subtotal = basePrice * quantity;
  const adminFee = Math.round(subtotal * (ADMIN_FEE_PERCENT / 100) * 100) / 100;
  const shippingCost = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + adminFee + shippingCost;
  return {
    subtotal,
    adminFee,
    shippingCost,
    total,
    adminFeePercent: ADMIN_FEE_PERCENT,
    adminDestination: ADMIN_WALLET,
  };
}

export function getPlatformPrice(dhgateBasePrice: number): number {
  return Math.round(dhgateBasePrice * (1 + ADMIN_FEE_PERCENT / 100) * 100) / 100;
}

// ─── Product Helpers ──────────────────────────────────────────────────────────
export function getProductsByCategory(category: ProductCategory): DHgateProduct[] {
  return DHGATE_PRODUCTS.filter(p => p.category === category);
}

export function getFeaturedProducts(limit = 8): DHgateProduct[] {
  return DHGATE_PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
}

export function getHotProducts(limit = 6): DHgateProduct[] {
  return DHGATE_PRODUCTS.filter(p => p.isHot).slice(0, limit);
}

export function getProductById(id: string): DHgateProduct | undefined {
  return DHGATE_PRODUCTS.find(p => p.id === id);
}

export function getProductReviews(productId: string): DHgateReview[] {
  return DHGATE_REVIEWS.filter(r => r.productId === productId);
}

export function searchProducts(query: string): DHgateProduct[] {
  const q = query.toLowerCase();
  return DHGATE_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.category.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(product: DHgateProduct, limit = 4): DHgateProduct[] {
  return DHGATE_PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export const DHGATE_CATEGORIES: Array<{ id: ProductCategory; label: string; emoji: string; count: number }> = [
  { id: "bags",        label: "Bags & Purses",    emoji: "👜", count: DHGATE_PRODUCTS.filter(p => p.category === "bags").length },
  { id: "watches",     label: "Watches",           emoji: "⌚", count: DHGATE_PRODUCTS.filter(p => p.category === "watches").length },
  { id: "shoes",       label: "Shoes & Sneakers",  emoji: "👟", count: DHGATE_PRODUCTS.filter(p => p.category === "shoes").length },
  { id: "pants",       label: "Pants & Bottoms",   emoji: "👖", count: DHGATE_PRODUCTS.filter(p => p.category === "pants").length },
  { id: "shirts",      label: "Shirts & Tops",     emoji: "👕", count: DHGATE_PRODUCTS.filter(p => p.category === "shirts").length },
  { id: "electronics", label: "Electronics",       emoji: "📱", count: DHGATE_PRODUCTS.filter(p => p.category === "electronics").length },
];

export const DHGATE_ENGINE_VERSION = "1.0.0";
