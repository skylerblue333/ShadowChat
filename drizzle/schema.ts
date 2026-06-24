import { int, bigint, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, index, uniqueIndex } from "drizzle-orm/mysql-core";

// ═══════════════════════════════════════════════════════════════
// USERS & PROFILES
// ═══════════════════════════════════════════════════════════════

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "creator", "moderator"]).default("user").notNull(),
  verified: boolean("verified").default(false).notNull(),
  avatar: text("avatar"),
  banner: text("banner"),
  bio: text("bio"),
  displayName: varchar("displayName", { length: 100 }),
  username: varchar("username", { length: 50 }),
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  reputation: int("reputation").default(0).notNull(),
  walletAddress: varchar("walletAddress", { length: 128 }),
  website: varchar("website", { length: 255 }),
  location: varchar("location", { length: 100 }),
  twitter: varchar("twitter", { length: 100 }),
  instagram: varchar("instagram", { length: 100 }),
  youtube: varchar("youtube", { length: 255 }),
  isCreator: boolean("isCreator").default(false).notNull(),
  isStreamer: boolean("isStreamer").default(false).notNull(),
  followerCount: int("followerCount").default(0).notNull(),
  followingCount: int("followingCount").default(0).notNull(),
  postCount: int("postCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  shadowId: varchar("shadowId", { length: 20 }),
  identityMode: mysqlEnum("identityMode", ["shadow", "semi", "social", "public"]).default("social").notNull(),
  behaviorScore: int("behaviorScore").default(50).notNull(),
  toxicityScore: int("toxicityScore").default(0).notNull(),
  contributionScore: int("contributionScore").default(0).notNull(),
  reliabilityScore: int("reliabilityScore").default(50).notNull(),
  verifiedReveal: boolean("verifiedReveal").default(false).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// SOCIAL: FOLLOWS
// ═══════════════════════════════════════════════════════════════

export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL: POSTS (Feed, Stories, Reels)
// ═══════════════════════════════════════════════════════════════

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  type: mysqlEnum("type", ["text", "image", "video", "reel", "story", "article", "poll"]).default("text").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  hashtags: json("hashtags"),
  mentions: json("mentions"),
  visibility: mysqlEnum("visibility", ["public", "followers", "private", "community"]).default("public").notNull(),
  communityId: int("communityId"),
  parentId: int("parentId"), // for reposts/quote posts
  isRepost: boolean("isRepost").default(false).notNull(),
  isQuote: boolean("isQuote").default(false).notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  commentCount: int("commentCount").default(0).notNull(),
  repostCount: int("repostCount").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  shareCount: int("shareCount").default(0).notNull(),
  aiScore: decimal("aiScore", { precision: 5, scale: 2 }).default("0"),
  expiresAt: timestamp("expiresAt"), // for stories
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL: COMMENTS
// ═══════════════════════════════════════════════════════════════

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  parentId: int("parentId"), // threaded replies
  content: text("content").notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL: LIKES
// ═══════════════════════════════════════════════════════════════

export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL: HASHTAGS & TRENDS
// ═══════════════════════════════════════════════════════════════

export const hashtags = mysqlTable("hashtags", {
  id: int("id").autoincrement().primaryKey(),
  tag: varchar("tag", { length: 100 }).notNull().unique(),
  postCount: int("postCount").default(0).notNull(),
  trendScore: decimal("trendScore", { precision: 10, scale: 2 }).default("0"),
  isTrending: boolean("isTrending").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// COMMUNITIES (Discord-level)
// ═══════════════════════════════════════════════════════════════

export const communities = mysqlTable("communities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  avatar: text("avatar"),
  banner: text("banner"),
  ownerId: int("ownerId").notNull(),
  type: mysqlEnum("type", ["public", "private", "token_gated", "premium", "dao"]).default("public").notNull(),
  category: varchar("category", { length: 50 }),
  memberCount: int("memberCount").default(0).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  tokenGateAddress: varchar("tokenGateAddress", { length: 128 }),
  tokenGateMinBalance: decimal("tokenGateMinBalance", { precision: 18, scale: 4 }),
  settings: json("settings"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const communityMembers = mysqlTable("community_members", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["member", "moderator", "admin", "owner"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const channels = mysqlTable("channels", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["text", "voice", "video", "announcements", "stage"]).default("text").notNull(),
  description: text("description"),
  isPrivate: boolean("isPrivate").default(false).notNull(),
  position: int("position").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const channelMessages = mysqlTable("channel_messages", {
  id: int("id").autoincrement().primaryKey(),
  channelId: int("channelId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  replyToId: int("replyToId"),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// STREAMING
// ═══════════════════════════════════════════════════════════════

export const streams = mysqlTable("streams", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnailUrl"),
  status: mysqlEnum("status", ["scheduled", "live", "ended", "archived"]).default("scheduled").notNull(),
  category: varchar("category", { length: 50 }),
  viewerCount: int("viewerCount").default(0).notNull(),
  peakViewers: int("peakViewers").default(0).notNull(),
  totalViews: int("totalViews").default(0).notNull(),
  duration: int("duration").default(0), // seconds
  isCoStream: boolean("isCoStream").default(false).notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  streamKey: varchar("streamKey", { length: 64 }),
  hlsUrl: text("hlsUrl"),
  rtmpUrl: text("rtmpUrl"),
  archiveUrl: text("archiveUrl"),
  scheduledAt: timestamp("scheduledAt"),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const streamChat = mysqlTable("stream_chat", {
  id: int("id").autoincrement().primaryKey(),
  streamId: int("streamId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["chat", "donation", "subscription", "raid", "system"]).default("chat").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const streamDonations = mysqlTable("stream_donations", {
  id: int("id").autoincrement().primaryKey(),
  streamId: int("streamId").notNull(),
  donorId: int("donorId").notNull(),
  streamerId: int("streamerId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SKY444").notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const streamMemberships = mysqlTable("stream_memberships", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["basic", "premium", "vip"]).default("basic").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isGifted: boolean("isGifted").default(false).notNull(),
  giftedBy: int("giftedBy"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// WALLETS & CRYPTO
// ═══════════════════════════════════════════════════════════════

export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  address: varchar("address", { length: 128 }).notNull(),
  chain: varchar("chain", { length: 20 }).default("ethereum").notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tokenBalances = mysqlTable("token_balances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 20 }).notNull(), // SKY444, DODGE, TRUMP, BTC, USDT, MONERO
  balance: decimal("balance", { precision: 24, scale: 8 }).default("0").notNull(),
  stakedBalance: decimal("stakedBalance", { precision: 24, scale: 8 }).default("0").notNull(),
  pendingRewards: decimal("pendingRewards", { precision: 24, scale: 8 }).default("0").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const stakingPositions = mysqlTable("staking_positions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 20 }).default("SKY444").notNull(),
  amount: decimal("amount", { precision: 24, scale: 8 }).notNull(),
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(),
  lockDays: int("lockDays").notNull(), // 30, 90, 365
  rewardsEarned: decimal("rewardsEarned", { precision: 24, scale: 8 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "completed", "withdrawn"]).default("active").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  unlocksAt: timestamp("unlocksAt").notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["transfer", "stake", "unstake", "reward", "donation", "purchase", "swap", "tip", "payout"]).notNull(),
  token: varchar("token", { length: 20 }).notNull(),
  amount: decimal("amount", { precision: 24, scale: 8 }).notNull(),
  fromAddress: varchar("fromAddress", { length: 128 }),
  toAddress: varchar("toAddress", { length: 128 }),
  txHash: varchar("txHash", { length: 128 }),
  status: mysqlEnum("status", ["pending", "confirmed", "failed"]).default("pending").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// GAMEFI
// ═══════════════════════════════════════════════════════════════

export const quests = mysqlTable("quests", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["daily", "weekly", "achievement", "seasonal", "special"]).notNull(),
  xpReward: int("xpReward").default(0).notNull(),
  tokenReward: decimal("tokenReward", { precision: 18, scale: 4 }).default("0"),
  requirements: json("requirements"),
  maxCompletions: int("maxCompletions").default(1).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  seasonId: int("seasonId"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const questProgress = mysqlTable("quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questId: int("questId").notNull(),
  progress: int("progress").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: text("icon"),
  category: varchar("category", { length: 50 }),
  xpReward: int("xpReward").default(0).notNull(),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]).default("common").notNull(),
  requirement: json("requirement"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export const tournaments = mysqlTable("tournaments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["pvp", "guild_war", "community", "stream_battle", "charity"]).notNull(),
  status: mysqlEnum("status", ["upcoming", "active", "completed", "cancelled"]).default("upcoming").notNull(),
  prizePool: decimal("prizePool", { precision: 18, scale: 4 }).default("0"),
  prizeToken: varchar("prizeToken", { length: 20 }).default("SKY444"),
  maxParticipants: int("maxParticipants"),
  participantCount: int("participantCount").default(0).notNull(),
  winnerId: int("winnerId"),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tournamentParticipants = mysqlTable("tournament_participants", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  userId: int("userId").notNull(),
  score: int("score").default(0).notNull(),
  rank: int("rank"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const seasons = mysqlTable("seasons", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  number: int("number").notNull(),
  status: mysqlEnum("status", ["upcoming", "active", "completed"]).default("upcoming").notNull(),
  xpMultiplier: decimal("xpMultiplier", { precision: 3, scale: 1 }).default("1.0"),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// MARKETPLACE
// ═══════════════════════════════════════════════════════════════

export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["nft", "digital_asset", "merch", "subscription", "service", "gaming_item"]).notNull(),
  price: decimal("price", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 20 }).default("SKY444").notNull(),
  imageUrl: text("imageUrl"),
  mediaUrls: json("mediaUrls"),
  category: varchar("category", { length: 50 }),
  status: mysqlEnum("status", ["active", "sold", "cancelled", "expired"]).default("active").notNull(),
  isAuction: boolean("isAuction").default(false).notNull(),
  auctionEndsAt: timestamp("auctionEndsAt"),
  highestBid: decimal("highestBid", { precision: 18, scale: 4 }),
  highestBidderId: int("highestBidderId"),
  viewCount: int("viewCount").default(0).notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  listingId: int("listingId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pending", "escrow", "completed", "refunded", "disputed"]).default("pending").notNull(),
  txHash: varchar("txHash", { length: 128 }),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  sellerId: int("sellerId").notNull(),
  rating: int("rating").notNull(), // 1-5
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// CREATOR SUBSCRIPTIONS & MONETIZATION
// ═══════════════════════════════════════════════════════════════

export const creatorSubscriptions = mysqlTable("creator_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  subscriberId: int("subscriberId").notNull(),
  tier: mysqlEnum("tier", ["supporter", "premium", "vip"]).default("supporter").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 20 }).default("SKY444").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tips = mysqlTable("tips", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 20 }).default("SKY444").notNull(),
  message: text("message"),
  postId: int("postId"),
  streamId: int("streamId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 20 }).notNull(),
  type: mysqlEnum("type", ["subscription", "tip", "donation", "marketplace", "ad_revenue", "tournament"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  txHash: varchar("txHash", { length: 128 }),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// CHARITY
// ═══════════════════════════════════════════════════════════════

export const charityCampaigns = mysqlTable("charity_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  goalAmount: decimal("goalAmount", { precision: 18, scale: 4 }).notNull(),
  raisedAmount: decimal("raisedAmount", { precision: 18, scale: 4 }).default("0").notNull(),
  currency: varchar("currency", { length: 20 }).default("SKY444").notNull(),
  category: varchar("category", { length: 50 }),
  walletAddress: varchar("walletAddress", { length: 128 }),
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active").notNull(),
  donorCount: int("donorCount").default(0).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  endsAt: timestamp("endsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const charityDonations = mysqlTable("charity_donations", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  donorId: int("donorId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 20 }).default("SKY444").notNull(),
  message: text("message"),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const charityVotes = mysqlTable("charity_votes", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  vote: mysqlEnum("vote", ["approve", "reject"]).notNull(),
  weight: decimal("weight", { precision: 18, scale: 4 }).default("1").notNull(), // token-weighted
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["follow", "like", "comment", "mention", "repost", "donation", "achievement", "stream_live", "tournament", "system"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message"),
  actorId: int("actorId"),
  targetType: varchar("targetType", { length: 50 }),
  targetId: int("targetId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// AI: MODERATION & ANALYTICS
// ═══════════════════════════════════════════════════════════════

export const moderationLogs = mysqlTable("moderation_logs", {
  id: int("id").autoincrement().primaryKey(),
  targetType: mysqlEnum("targetType", ["post", "comment", "user", "stream", "listing", "message"]).notNull(),
  targetId: int("targetId").notNull(),
  action: mysqlEnum("action", ["flag", "remove", "warn", "ban", "approve"]).notNull(),
  reason: text("reason"),
  moderatorId: int("moderatorId"), // null = AI moderation
  isAiAction: boolean("isAiAction").default(false).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const aiAnalytics = mysqlTable("ai_analytics", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["trend", "sentiment", "prediction", "recommendation", "fraud_alert"]).notNull(),
  category: varchar("category", { length: 50 }),
  data: json("data").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// PLATFORM METRICS (Real Data)
// ═══════════════════════════════════════════════════════════════

export const platformMetrics = mysqlTable("platform_metrics", {
  id: int("id").autoincrement().primaryKey(),
  metric: varchar("metric", { length: 50 }).notNull(),
  value: decimal("value", { precision: 24, scale: 8 }).notNull(),
  category: varchar("category", { length: 50 }),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

// ─── COMMANDMENT ALIASES ──────────────────────────────────────────────────────
// Re-export with the exact names expected by the commandments test suite

export const messages = channelMessages;          // channel_messages covers DMs/channel messages
export const marketplaceListings = listings;      // listings table
export const charityProjects = charityCampaigns;  // charity_campaigns covers projects
export const subscriptions = creatorSubscriptions; // creator_subscriptions

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — BOOKMARKS & COLLECTIONS
// ═══════════════════════════════════════════════════════════════
export const bookmarks = mysqlTable("bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId").notNull(),
  collectionName: varchar("collectionName", { length: 100 }).default("Saved"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — POLLS
// ═══════════════════════════════════════════════════════════════
export const polls = mysqlTable("polls", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(),
  endsAt: timestamp("endsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pollVotes = mysqlTable("poll_votes", {
  id: int("id").autoincrement().primaryKey(),
  pollId: int("pollId").notNull(),
  userId: int("userId").notNull(),
  optionIndex: int("optionIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — REACTIONS (multi-emoji)
// ═══════════════════════════════════════════════════════════════
export const reactions = mysqlTable("reactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  messageId: int("messageId"),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — EVENTS CALENDAR
// ═══════════════════════════════════════════════════════════════
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  coverImage: text("coverImage"),
  location: varchar("location", { length: 300 }),
  isOnline: boolean("isOnline").default(false).notNull(),
  streamUrl: text("streamUrl"),
  visibility: mysqlEnum("visibility", ["public", "private", "followers"]).default("public").notNull(),
  maxAttendees: int("maxAttendees"),
  rsvpCount: int("rsvpCount").default(0).notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const eventRsvps = mysqlTable("event_rsvps", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["going", "maybe", "not_going"]).default("going").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — POST DRAFTS & SCHEDULING
// ═══════════════════════════════════════════════════════════════
export const postDrafts = mysqlTable("post_drafts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  hashtags: json("hashtags"),
  scheduledAt: timestamp("scheduledAt"),
  isScheduled: boolean("isScheduled").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — BLOCKS & MUTES
// ═══════════════════════════════════════════════════════════════
export const userBlocks = mysqlTable("user_blocks", {
  id: int("id").autoincrement().primaryKey(),
  blockerId: int("blockerId").notNull(),
  blockedId: int("blockedId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userMutes = mysqlTable("user_mutes", {
  id: int("id").autoincrement().primaryKey(),
  muterId: int("muterId").notNull(),
  mutedId: int("mutedId"),
  mutedKeyword: varchar("mutedKeyword", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — CONTENT REPORTS
// ═══════════════════════════════════════════════════════════════
export const contentReports = mysqlTable("content_reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  targetUserId: int("targetUserId"),
  reason: mysqlEnum("reason", ["spam", "harassment", "hate_speech", "misinformation", "copyright", "violence", "other"]).notNull(),
  details: text("details"),
  status: mysqlEnum("status", ["pending", "reviewed", "actioned", "dismissed"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — STORY HIGHLIGHTS
// ═══════════════════════════════════════════════════════════════
export const storyHighlights = mysqlTable("story_highlights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 50 }).notNull(),
  coverImage: text("coverImage"),
  storyIds: json("storyIds").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — BROADCAST CHANNELS (one-to-many)
// ═══════════════════════════════════════════════════════════════
export const broadcastChannels = mysqlTable("broadcast_channels", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  avatar: text("avatar"),
  subscriberCount: int("subscriberCount").default(0).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const broadcastSubscriptions = mysqlTable("broadcast_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  channelId: int("channelId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const broadcastMessages = mysqlTable("broadcast_messages", {
  id: int("id").autoincrement().primaryKey(),
  channelId: int("channelId").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  reactionCount: int("reactionCount").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — SOCIAL AUDIO ROOMS
// ═══════════════════════════════════════════════════════════════
export const audioRooms = mysqlTable("audio_rooms", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  topic: varchar("topic", { length: 100 }),
  status: mysqlEnum("status", ["scheduled", "live", "ended"]).default("scheduled").notNull(),
  listenerCount: int("listenerCount").default(0).notNull(),
  speakerIds: json("speakerIds"),
  scheduledAt: timestamp("scheduledAt"),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — DIRECT MESSAGES (private)
// ═══════════════════════════════════════════════════════════════
export const directMessages = mysqlTable("direct_messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  mediaType: mysqlEnum("mediaType", ["image", "video", "audio", "file"]),
  isDisappearing: boolean("isDisappearing").default(false).notNull(),
  disappearsAt: timestamp("disappearsAt"),
  readAt: timestamp("readAt"),
  deletedBySender: boolean("deletedBySender").default(false).notNull(),
  deletedByRecipient: boolean("deletedByRecipient").default(false).notNull(),
  isEncrypted: boolean("isEncrypted").default(false).notNull(),
  encryptedContent: text("encryptedContent"),
  encryptionKeyHint: varchar("encryptionKeyHint", { length: 64 }),
  burnAfterRead: boolean("burnAfterRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dmGroups = mysqlTable("dm_groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }),
  avatar: text("avatar"),
  creatorId: int("creatorId").notNull(),
  memberIds: json("memberIds").notNull(),
  adminIds: json("adminIds").notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dmGroupMessages = mysqlTable("dm_group_messages", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  replyToId: int("replyToId"),
  reactions: json("reactions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — CREATOR ANALYTICS
// ═══════════════════════════════════════════════════════════════
export const creatorAnalytics = mysqlTable("creator_analytics", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  profileViews: int("profileViews").default(0).notNull(),
  postImpressions: int("postImpressions").default(0).notNull(),
  newFollowers: int("newFollowers").default(0).notNull(),
  engagementRate: decimal("engagementRate", { precision: 5, scale: 2 }).default("0"),
  reachCount: int("reachCount").default(0).notNull(),
  watchTimeMinutes: int("watchTimeMinutes").default(0).notNull(),
  revenueEarned: decimal("revenueEarned", { precision: 18, scale: 8 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — AD REVENUE SHARING
// ═══════════════════════════════════════════════════════════════
export const adRevenueShares = mysqlTable("ad_revenue_shares", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  period: varchar("period", { length: 7 }).notNull(),
  impressions: int("impressions").default(0).notNull(),
  revenue: decimal("revenue", { precision: 18, scale: 8 }).default("0"),
  paidOut: boolean("paidOut").default(false).notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL 44 — NATIVE STOREFRONTS
// ═══════════════════════════════════════════════════════════════
export const storefronts = mysqlTable("storefronts", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  banner: text("banner"),
  isActive: boolean("isActive").default(true).notNull(),
  totalSales: int("totalSales").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storefrontProducts = mysqlTable("storefront_products", {
  id: int("id").autoincrement().primaryKey(),
  storefrontId: int("storefrontId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SKY444"),
  stock: int("stock").default(-1),
  soldCount: int("soldCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// AUTONOMOUS SPRINT ENGINE
// ═══════════════════════════════════════════════════════════════
export const codebaseSprints = mysqlTable("codebase_sprints", {
  id: int("id").autoincrement().primaryKey(),
  sprintNumber: int("sprintNumber").notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  status: mysqlEnum("status", ["scheduled", "running", "completed", "failed"]).default("scheduled").notNull(),
  totalLinesAdded: int("totalLinesAdded").default(0).notNull(),
  totalFilesModified: int("totalFilesModified").default(0).notNull(),
  languagesUsed: json("languagesUsed"), // string[]
  botsActivated: json("botsActivated"), // string[]
  featuresBuilt: json("featuresBuilt"), // string[]
  testsAdded: int("testsAdded").default(0).notNull(),
  securityIssuesFixed: int("securityIssuesFixed").default(0).notNull(),
  performanceGainPct: decimal("performanceGainPct", { precision: 5, scale: 2 }).default("0"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  cronExpression: varchar("cronExpression", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sprintTasks = mysqlTable("sprint_tasks", {
  id: int("id").autoincrement().primaryKey(),
  sprintId: int("sprintId").notNull(),
  botId: varchar("botId", { length: 20 }).notNull(),
  taskType: varchar("taskType", { length: 50 }).notNull(),
  language: varchar("language", { length: 20 }).notNull(),
  description: text("description").notNull(),
  linesGenerated: int("linesGenerated").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "running", "done", "failed"]).default("pending").notNull(),
  output: text("output"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sprintMetrics = mysqlTable("sprint_metrics", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  totalLines: int("totalLines").default(0).notNull(),
  tsLines: int("tsLines").default(0).notNull(),
  solidityLines: int("solidityLines").default(0).notNull(),
  rustLines: int("rustLines").default(0).notNull(),
  pythonLines: int("pythonLines").default(0).notNull(),
  sqlLines: int("sqlLines").default(0).notNull(),
  shellLines: int("shellLines").default(0).notNull(),
  testCoverage: decimal("testCoverage", { precision: 5, scale: 2 }).default("0"),
  sprintsCompleted: int("sprintsCompleted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 38 — UNIFIED OS DATA MODEL
// OS Actions, AI Events, Simulation Entities, AI Memory
// ═══════════════════════════════════════════════════════════════

// OS Actions — every action executed through the chat OS
export const osActions = mysqlTable("os_actions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  actionType: varchar("actionType", { length: 50 }).notNull(),
  intentText: text("intentText").notNull(),
  parsedPayload: json("parsedPayload"),
  status: mysqlEnum("status", ["pending", "executing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  confidence: decimal("confidence", { precision: 4, scale: 3 }).default("0"),
  resultData: json("resultData"),
  errorMessage: text("errorMessage"),
  executionMs: int("executionMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

// AI Events — all AI interactions for training + analytics
export const aiEvents = mysqlTable("ai_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 100 }),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }),
  inputTokens: int("inputTokens").default(0),
  outputTokens: int("outputTokens").default(0),
  latencyMs: int("latencyMs"),
  costUsd: decimal("costUsd", { precision: 10, scale: 6 }).default("0"),
  inputText: text("inputText"),
  outputText: text("outputText"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Simulation Entities — AI personas in the living world
export const simulationEntities = mysqlTable("simulation_entities", {
  id: int("id").autoincrement().primaryKey(),
  personaId: varchar("personaId", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  archetype: varchar("archetype", { length: 50 }).notNull(),
  personalityTraits: json("personalityTraits"),
  interests: json("interests"),
  trustScore: int("trustScore").default(70).notNull(),
  followersCount: int("followersCount").default(0).notNull(),
  activityLevel: mysqlEnum("activityLevel", ["low", "medium", "high", "viral"]).default("medium").notNull(),
  lastTickAt: timestamp("lastTickAt"),
  memorySnapshot: json("memorySnapshot"),
  relationshipGraph: json("relationshipGraph"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// AI Memory — per-user context memory for personalization
export const aiMemory = mysqlTable("ai_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  memoryType: varchar("memoryType", { length: 50 }).notNull(),
  key: varchar("key", { length: 100 }).notNull(),
  value: json("value").notNull(),
  confidence: decimal("confidence", { precision: 4, scale: 3 }).default("1"),
  source: varchar("source", { length: 50 }),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Trust Scores — dynamic user trust tracking
export const trustScores = mysqlTable("trust_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  overallScore: int("overallScore").default(70).notNull(),
  paymentScore: int("paymentScore").default(70).notNull(),
  contentScore: int("contentScore").default(70).notNull(),
  reportScore: int("reportScore").default(100).notNull(),
  transactionScore: int("transactionScore").default(70).notNull(),
  aiScore: int("aiScore").default(70).notNull(),
  tier: mysqlEnum("tier", ["new", "trusted", "verified", "elite"]).default("new").notNull(),
  flags: json("flags"),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Action Pricing — configurable price matrix per action type
export const actionPricing = mysqlTable("action_pricing", {
  id: int("id").autoincrement().primaryKey(),
  actionType: varchar("actionType", { length: 50 }).notNull().unique(),
  basePriceUsd: decimal("basePriceUsd", { precision: 10, scale: 4 }).notNull(),
  platformFeePercent: decimal("platformFeePercent", { precision: 5, scale: 2 }).default("10"),
  creatorSharePercent: decimal("creatorSharePercent", { precision: 5, scale: 2 }).default("70"),
  isActive: boolean("isActive").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── NSFW Creator Platform ────────────────────────────────────────────────────

export const ageVerifications = mysqlTable("ageVerifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  method: varchar("method", { length: 50 }).notNull().default("self_declaration"), // self_declaration | id_upload | credit_card
  verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  consentGiven: boolean("consentGiven").default(true).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

export const creatorProfiles = mysqlTable("creatorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull().unique(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  bannerUrl: text("bannerUrl"),
  isNsfwEnabled: boolean("isNsfwEnabled").default(false).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  subscriptionPrice: decimal("subscriptionPrice", { precision: 10, scale: 2 }).default("9.99"),
  subscriptionPriceMonthly: decimal("subscriptionPriceMonthly", { precision: 10, scale: 2 }).default("9.99"),
  subscriptionPrice3Month: decimal("subscriptionPrice3Month", { precision: 10, scale: 2 }).default("24.99"),
  subscriptionPriceYearly: decimal("subscriptionPriceYearly", { precision: 10, scale: 2 }).default("79.99"),
  totalEarnings: decimal("totalEarnings", { precision: 14, scale: 2 }).default("0"),
  totalSubscribers: int("totalSubscribers").default(0).notNull(),
  totalPosts: int("totalPosts").default(0).notNull(),
  totalLikes: int("totalLikes").default(0).notNull(),
  stripeConnectId: varchar("stripeConnectId", { length: 255 }),
  payoutEmail: varchar("payoutEmail", { length: 255 }),
  platformFeePercent: decimal("platformFeePercent", { precision: 5, scale: 2 }).default("20"),
  welcomeMessage: text("welcomeMessage"),
  tags: text("tags"), // JSON array
  socialLinks: text("socialLinks"), // JSON object
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const nsfwContent = mysqlTable("nsfwContent", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contentType: varchar("contentType", { length: 50 }).notNull(), // photo | video | audio | text | bundle
  mediaUrls: text("mediaUrls").notNull(), // JSON array of S3 keys
  thumbnailUrl: text("thumbnailUrl"),
  previewUrl: text("previewUrl"), // blurred/watermarked preview
  accessType: varchar("accessType", { length: 50 }).notNull().default("subscription"), // free | subscription | ppv | tip_unlock
  ppvPrice: decimal("ppvPrice", { precision: 10, scale: 2 }),
  tipUnlockAmount: decimal("tipUnlockAmount", { precision: 10, scale: 2 }),
  isNsfw: boolean("isNsfw").default(true).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  isScheduled: boolean("isScheduled").default(false),
  scheduledAt: timestamp("scheduledAt"),
  viewCount: int("viewCount").default(0).notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  purchaseCount: int("purchaseCount").default(0).notNull(),
  tags: text("tags"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const nsfwSubscriptions = mysqlTable("nsfwSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  subscriberId: varchar("subscriberId", { length: 255 }).notNull(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull().default("monthly"), // monthly | quarterly | yearly
  priceAtSubscription: decimal("priceAtSubscription", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active | cancelled | expired | paused
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart").defaultNow().notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const nsfwPurchases = mysqlTable("nsfwPurchases", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: varchar("buyerId", { length: 255 }).notNull(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  contentId: int("contentId").notNull(),
  purchaseType: varchar("purchaseType", { length: 50 }).notNull(), // ppv | bundle | tip_unlock
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(),
  creatorEarnings: decimal("creatorEarnings", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).default("stripe"), // stripe | sky444 | usdt
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const nsfwTips = mysqlTable("nsfwTips", {
  id: int("id").autoincrement().primaryKey(),
  senderId: varchar("senderId", { length: 255 }).notNull(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  contentId: int("contentId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 20 }).default("USD").notNull(),
  message: text("message"),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  unlocksContent: boolean("unlocksContent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const creatorPayouts = mysqlTable("creatorPayouts", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull().default("stripe"), // stripe | paypal | crypto | bank
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending | processing | completed | failed
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  notes: text("notes"),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export const dmMessages = mysqlTable("dmMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: varchar("senderId", { length: 255 }).notNull(),
  receiverId: varchar("receiverId", { length: 255 }).notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  mediaType: varchar("mediaType", { length: 50 }), // image | video | audio
  isPaid: boolean("isPaid").default(false).notNull(),
  paidAmount: decimal("paidAmount", { precision: 10, scale: 2 }),
  isUnlocked: boolean("isUnlocked").default(false).notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DHgate Marketplace ───────────────────────────────────────────────────────
export const dhgateProducts = mysqlTable("dhgateProducts", {
  id: varchar("id", { length: 128 }).primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  category: varchar("category", { length: 100 }),
  subCategory: varchar("subCategory", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  images: json("images"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  soldCount: int("soldCount").default(0),
  stock: int("stock").default(0),
  supplier: varchar("supplier", { length: 255 }),
  supplierRating: decimal("supplierRating", { precision: 3, scale: 2 }).default("0"),
  shippingFrom: varchar("shippingFrom", { length: 100 }),
  shippingDays: int("shippingDays").default(7),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
  tags: json("tags"),
  isActive: boolean("isActive").default(true),
  adminFeePercent: decimal("adminFeePercent", { precision: 5, scale: 2 }).default("44.00"),
  dhgateSearchQuery: varchar("dhgateSearchQuery", { length: 255 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull().default(0),
});

export const dhgateReviews = mysqlTable("dhgateReviews", {
  id: varchar("id", { length: 128 }).primaryKey(),
  productId: varchar("productId", { length: 128 }).notNull(),
  reviewerName: varchar("reviewerName", { length: 255 }),
  reviewerCountry: varchar("reviewerCountry", { length: 100 }),
  rating: int("rating").notNull().default(5),
  title: varchar("title", { length: 500 }),
  body: text("body"),
  helpful: int("helpful").default(0),
  verified: boolean("verified").default(true),
  images: json("images"),
  createdAt: bigint("createdAt", { mode: "number" }).notNull().default(0),
});

export const dhgateOrders = mysqlTable("dhgateOrders", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("userId", { length: 128 }),
  productId: varchar("productId", { length: 128 }).notNull(),
  productTitle: varchar("productTitle", { length: 500 }),
  quantity: int("quantity").notNull().default(1),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull().default("0"),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull().default("0"),
  adminFee: decimal("adminFee", { precision: 10, scale: 2 }).default("0"),
  supplierPayout: decimal("supplierPayout", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: varchar("status", { length: 50 }).default("pending"),
  shippingAddress: json("shippingAddress"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  dhgateOrderRef: varchar("dhgateOrderRef", { length: 100 }),
  notes: text("notes"),
  createdAt: bigint("createdAt", { mode: "number" }).notNull().default(0),
});

// ─── HopeAI Chat History ──────────────────────────────────────────────────────
export const hopeAIChatHistory = mysqlTable("hope_ai_chat_history", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  tone: varchar("tone", { length: 64 }),
  emotionalState: varchar("emotionalState", { length: 64 }),
  sessionId: varchar("sessionId", { length: 128 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull().default(0),
});

// ═══════════════════════════════════════════════════════════════
// SKY SCHOOL — Courses, Enrollments, Progress, Quizzes
// ═══════════════════════════════════════════════════════════════
export const skySchoolCourses = mysqlTable("sky_school_courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).default("general"),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner"),
  instructorId: int("instructor_id"),
  instructorName: varchar("instructor_name", { length: 100 }).default("HOPE AI"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  totalLessons: int("total_lessons").default(0),
  durationMinutes: int("duration_minutes").default(60),
  rewardSky: decimal("reward_sky", { precision: 18, scale: 8 }).default("0"),
  enrolledCount: int("enrolled_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  isFree: boolean("is_free").default(true),
  price: decimal("price", { precision: 18, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("published"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const skySchoolLessons = mysqlTable("sky_school_lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("course_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  videoUrl: varchar("video_url", { length: 500 }),
  durationMinutes: int("duration_minutes").default(10),
  orderIndex: int("order_index").default(0),
  type: mysqlEnum("type", ["video", "text", "quiz", "code"]).default("text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skySchoolEnrollments = mysqlTable("sky_school_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  courseId: int("course_id").notNull(),
  progress: int("progress").default(0),
  completedLessons: int("completed_lessons").default(0),
  lastLessonId: int("last_lesson_id"),
  completedAt: timestamp("completed_at"),
  rewardClaimed: boolean("reward_claimed").default(false),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const skySchoolCertificates = mysqlTable("sky_school_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  courseId: int("course_id").notNull(),
  certificateHash: varchar("certificate_hash", { length: 100 }).notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// GAMING — Sessions, Scores, Achievements
// ═══════════════════════════════════════════════════════════════
export const gameSessions = mysqlTable("game_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  gameId: varchar("game_id", { length: 50 }).notNull(),
  gameName: varchar("game_name", { length: 100 }).notNull(),
  score: int("score").default(0),
  level: int("level").default(1),
  duration: int("duration").default(0),
  rewardEarned: decimal("reward_earned", { precision: 18, scale: 8 }).default("0"),
  rewardToken: varchar("reward_token", { length: 20 }).default("SKY444"),
  rewardClaimed: boolean("reward_claimed").default(false),
  status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("completed"),
  metadata: text("metadata"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const gameAchievements = mysqlTable("game_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  achievementId: varchar("achievement_id", { length: 100 }).notNull(),
  achievementName: varchar("achievement_name", { length: 200 }).notNull(),
  description: text("description"),
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary"]).default("common"),
  rewardSky: decimal("reward_sky", { precision: 18, scale: 8 }).default("0"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const gameLeaderboardEntries = mysqlTable("game_leaderboard_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  gameId: varchar("game_id", { length: 50 }).notNull(),
  score: int("score").default(0),
  rank: int("rank").default(0),
  period: varchar("period", { length: 20 }).default("all_time"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// AI AGENT MARKET ENGINE
// Named AI agents that drive ICO momentum, market signals, and
// investor activity — powering the live investor dashboard.
// ═══════════════════════════════════════════════════════════════

// ICO global stats — single row updated by agents
export const icoInvestorStats = mysqlTable("ico_investor_stats", {
  id: int("id").autoincrement().primaryKey(),
  totalRaisedUsd: decimal("total_raised_usd", { precision: 18, scale: 2 }).default("500000.00").notNull(),
  totalInvestors: int("total_investors").default(1247).notNull(),
  tokenPriceUsd: decimal("token_price_usd", { precision: 18, scale: 6 }).default("0.005000").notNull(),
  tokensSold: decimal("tokens_sold", { precision: 28, scale: 8 }).default("100000000.00000000").notNull(),
  tokensRemaining: decimal("tokens_remaining", { precision: 28, scale: 8 }).default("900000000.00000000").notNull(),
  hardCapUsd: decimal("hard_cap_usd", { precision: 18, scale: 2 }).default("9500000.00").notNull(),
  softCapUsd: decimal("soft_cap_usd", { precision: 18, scale: 2 }).default("500000.00").notNull(),
  softCapReached: boolean("soft_cap_reached").default(true).notNull(),
  currentRound: varchar("current_round", { length: 30 }).default("Seed Round").notNull(),
  roundBonus: int("round_bonus").default(40).notNull(), // percent bonus
  rarityStatus: mysqlEnum("rarity_status", ["common", "uncommon", "rare", "epic", "legendary"]).default("rare").notNull(),
  rarityLabel: varchar("rarity_label", { length: 100 }).default("Rare Opportunity").notNull(),
  rarityScore: int("rarity_score").default(72).notNull(), // 0-100
  momentumScore: int("momentum_score").default(68).notNull(), // 0-100 — agent-driven
  sentimentScore: int("sentiment_score").default(74).notNull(), // 0-100
  trendDirection: mysqlEnum("trend_direction", ["up", "down", "sideways"]).default("up").notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 8, scale: 4 }).default("0.0000").notNull(),
  volumeUsd24h: decimal("volume_usd_24h", { precision: 18, scale: 2 }).default("0.00").notNull(),
  rewardPoolSky: decimal("reward_pool_sky", { precision: 28, scale: 8 }).default("50000000.00000000").notNull(),
  rewardDistributed: decimal("reward_distributed", { precision: 28, scale: 8 }).default("0.00000000").notNull(),
  rewardApy: decimal("reward_apy", { precision: 8, scale: 2 }).default("44.00").notNull(),
  lastAgentCycleAt: timestamp("last_agent_cycle_at").defaultNow().notNull(),
  lastRarityUpdateAt: timestamp("last_rarity_update_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// AI Agents — the 5 named market agents
export const aiMarketAgents = mysqlTable("ai_market_agents", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agent_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  persona: text("persona").notNull(),
  avatarEmoji: varchar("avatar_emoji", { length: 10 }).notNull(),
  accentColor: varchar("accent_color", { length: 30 }).notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  totalSignals: int("total_signals").default(0).notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }).default("0.00").notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Market signals generated by agents
export const marketSignals = mysqlTable("market_signals", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agent_id", { length: 50 }).notNull(),
  signalType: mysqlEnum("signal_type", ["buy", "sell", "hold", "accumulate", "watch", "alert"]).notNull(),
  strength: mysqlEnum("strength", ["weak", "moderate", "strong", "critical"]).default("moderate").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  commentary: text("commentary").notNull(),
  targetAsset: varchar("target_asset", { length: 50 }).default("SKY444").notNull(),
  priceTarget: decimal("price_target", { precision: 18, scale: 6 }),
  confidenceScore: int("confidence_score").default(70).notNull(), // 0-100
  momentumDelta: decimal("momentum_delta", { precision: 8, scale: 4 }).default("0.0000"),
  tags: json("tags").$type<string[]>().default([]),
  isPublic: boolean("is_public").default(true).notNull(),
  postedToFeed: boolean("posted_to_feed").default(false).notNull(),
  feedPostId: int("feed_post_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent activity log — every action an agent takes
export const aiAgentActivity = mysqlTable("ai_agent_activity", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agent_id", { length: 50 }).notNull(),
  activityType: mysqlEnum("activity_type", [
    "signal_generated", "stat_updated", "feed_posted",
    "rarity_evaluated", "momentum_calculated", "sentiment_analyzed",
    "investor_welcomed", "trend_detected", "alert_raised"
  ]).notNull(),
  summary: varchar("summary", { length: 500 }).notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  impactScore: int("impact_score").default(0).notNull(), // how much this changed momentum
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily rarity status snapshots
export const dailyRaritySnapshots = mysqlTable("daily_rarity_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  rarityStatus: mysqlEnum("rarity_status", ["common", "uncommon", "rare", "epic", "legendary"]).notNull(),
  rarityLabel: varchar("rarity_label", { length: 100 }).notNull(),
  rarityScore: int("rarity_score").notNull(),
  momentumScore: int("momentum_score").notNull(),
  sentimentScore: int("sentiment_score").notNull(),
  totalRaisedUsd: decimal("total_raised_usd", { precision: 18, scale: 2 }).notNull(),
  totalInvestors: int("total_investors").notNull(),
  tokenPriceUsd: decimal("token_price_usd", { precision: 18, scale: 6 }).notNull(),
  agentSummary: text("agent_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// ═══════════════════════════════════════════════════════════════
// LANGUAGE EXCHANGE SYSTEM
// ═══════════════════════════════════════════════════════════════

export const languagePartners = mysqlTable("language_partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  nativeLanguage: varchar("native_language", { length: 50 }).notNull(),
  learningLanguages: json("learning_languages").notNull(), // array of languages
  proficiencyLevel: mysqlEnum("proficiency_level", ["beginner", "intermediate", "advanced", "fluent", "native"]).default("beginner").notNull(),
  bio: text("bio"),
  interests: json("interests"), // array of interests
  availability: varchar("availability", { length: 255 }),
  timezone: varchar("timezone", { length: 50 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("review_count").default(0).notNull(),
  sessionCount: int("session_count").default(0).notNull(),
  totalHours: int("total_hours").default(0).notNull(),
  isTeacher: boolean("is_teacher").default(false).notNull(),
  teacherRate: int("teacher_rate"), // hourly rate in cents
  certifications: json("certifications"), // array of certifications
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const languagePartnerFavorites = mysqlTable("language_partner_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  partnerId: int("partner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const practiceSessions = mysqlTable("practice_sessions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  teacherId: int("teacher_id").notNull(),
  sourceLanguage: varchar("source_language", { length: 50 }).notNull(),
  targetLanguage: varchar("target_language", { length: 50 }).notNull(),
  topic: varchar("topic", { length: 255 }),
  notes: text("notes"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  duration: int("duration"), // in minutes
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  rating: int("rating"), // 1-5 stars
  feedback: text("feedback"),
  recordingUrl: text("recording_url"),
  transcriptUrl: text("transcript_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const progressTracking = mysqlTable("progress_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  dailyStreak: int("daily_streak").default(0).notNull(),
  totalMinutes: int("total_minutes").default(0).notNull(),
  sessionsCompleted: int("sessions_completed").default(0).notNull(),
  wordsLearned: int("words_learned").default(0).notNull(),
  skillLevel: mysqlEnum("skill_level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "mastery"]).default("beginner").notNull(),
  lastActivityAt: timestamp("last_activity_at"),
  milestones: json("milestones"), // array of milestone achievements
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const translationBounties = mysqlTable("translation_bounties", {
  id: int("id").autoincrement().primaryKey(),
  createdBy: int("created_by").notNull(),
  sourceLanguage: varchar("source_language", { length: 50 }).notNull(),
  targetLanguage: varchar("target_language", { length: 50 }).notNull(),
  content: text("content").notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  reward: int("reward").notNull(), // in cents or tokens
  status: mysqlEnum("status", ["open", "in_progress", "completed", "cancelled"]).default("open").notNull(),
  completedBy: int("completed_by"),
  completedAt: timestamp("completed_at"),
  translation: text("translation"),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const teacherProfiles = mysqlTable("teacher_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  language: varchar("language", { length: 50 }).notNull(),
  proficiency: mysqlEnum("proficiency", ["native", "fluent", "advanced", "intermediate"]).default("fluent").notNull(),
  hourlyRate: int("hourly_rate").notNull(), // in cents
  bio: text("bio"),
  specialties: json("specialties"), // array of teaching specialties
  certifications: json("certifications"), // array of certifications
  availability: varchar("availability", { length: 255 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("review_count").default(0).notNull(),
  totalStudents: int("total_students").default(0).notNull(),
  totalHoursTaught: int("total_hours_taught").default(0).notNull(),
  totalEarnings: int("total_earnings").default(0).notNull(), // in cents
  stripeAccountId: varchar("stripe_account_id", { length: 255 }),
  responseTime: varchar("response_time", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const teacherReviews = mysqlTable("teacher_reviews", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacher_id").notNull(),
  studentId: int("student_id").notNull(),
  sessionId: int("session_id"),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teacherBookings = mysqlTable("teacher_bookings", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  teacherId: int("teacher_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  duration: int("duration").notNull(), // in minutes
  topic: varchar("topic", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "refunded"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  amount: int("amount").notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const translationCache = mysqlTable("translation_cache", {
  id: int("id").autoincrement().primaryKey(),
  sourceText: text("source_text").notNull(),
  sourceLanguage: varchar("source_language", { length: 50 }).notNull(),
  targetLanguage: varchar("target_language", { length: 50 }).notNull(),
  translatedText: text("translated_text").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(),
  accuracy: int("accuracy"), // 0-100
  fluency: int("fluency"), // 0-100
  terminology: int("terminology"), // 0-100
  hitCount: int("hit_count").default(1).notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const languageExchangeStats = mysqlTable("language_exchange_stats", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  totalPartners: int("total_partners").default(0).notNull(),
  totalSessions: int("total_sessions").default(0).notNull(),
  totalMinutes: int("total_minutes").default(0).notNull(),
  totalBounties: int("total_bounties").default(0).notNull(),
  totalTeachers: int("total_teachers").default(0).notNull(),
  totalEarnings: int("total_earnings").default(0).notNull(), // in cents
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  topLanguages: json("top_languages"), // array of top languages
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type LanguagePartner = typeof languagePartners.$inferSelect;
export type InsertLanguagePartner = typeof languagePartners.$inferInsert;

export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertPracticeSession = typeof practiceSessions.$inferInsert;

export type ProgressTracking = typeof progressTracking.$inferSelect;
export type InsertProgressTracking = typeof progressTracking.$inferInsert;

export type TranslationBounty = typeof translationBounties.$inferSelect;
export type InsertTranslationBounty = typeof translationBounties.$inferInsert;

export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type InsertTeacherProfile = typeof teacherProfiles.$inferInsert;

export type TeacherBooking = typeof teacherBookings.$inferSelect;
export type InsertTeacherBooking = typeof teacherBookings.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// HOPE AI INTELLIGENCE LAYER (Phase 2 — connective intelligence)
// ═══════════════════════════════════════════════════════════════

// Persistent HOPE AI Digital Twin memory — one row per user holding the
// structured, durable context the twin reasons over.
export const twinMemory = mysqlTable("twin_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  summary: text("summary"), // rolling natural-language summary of the user
  goals: json("goals").$type<Array<{ id: string; title: string; status: string; target?: string; createdAt: number }>>(),
  projects: json("projects").$type<Array<{ id: string; name: string; status: string; note?: string; createdAt: number }>>(),
  preferences: json("preferences").$type<Record<string, string>>(),
  finances: json("finances").$type<{ currency?: string; monthlyTarget?: number; notes?: string }>(),
  learning: json("learning").$type<Array<{ id: string; topic: string; progress: number; createdAt: number }>>(),
  lastInteractionAt: timestamp("lastInteractionAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TwinMemory = typeof twinMemory.$inferSelect;

// Atomic memory facts — append-only, traceable (source + confidence) so the
// twin's knowledge is auditable/replayable per HOPE AI rules.
export const twinFacts = mysqlTable("twin_facts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  kind: mysqlEnum("kind", ["goal", "project", "preference", "finance", "learning", "fact", "event"]).default("fact").notNull(),
  content: text("content").notNull(),
  source: varchar("source", { length: 64 }).default("chat").notNull(),
  confidence: int("confidence").default(80).notNull(), // 0-100
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TwinFact = typeof twinFacts.$inferSelect;

// Reputation Economy — portable per-user scores aggregated from activity.
export const reputationScores = mysqlTable("reputation_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  learningScore: int("learningScore").default(0).notNull(),
  builderScore: int("builderScore").default(0).notNull(),
  teachingScore: int("teachingScore").default(0).notNull(),
  communityScore: int("communityScore").default(0).notNull(),
  trustScore: int("trustScore").default(50).notNull(),
  overall: int("overall").default(0).notNull(),
  breakdown: json("breakdown").$type<Record<string, number>>(),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
});
export type ReputationScore = typeof reputationScores.$inferSelect;

// Global Opportunity Engine — jobs, projects, co-founders, mentors, partners.
export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  postedBy: int("postedBy"),
  type: mysqlEnum("type", ["job", "project", "investor", "cofounder", "mentor", "study_partner", "language_partner", "gig"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  skills: json("skills").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  location: varchar("location", { length: 120 }),
  remote: boolean("remote").default(true).notNull(),
  compensation: varchar("compensation", { length: 120 }),
  status: mysqlEnum("status", ["open", "closed", "filled"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Opportunity = typeof opportunities.$inferSelect;

// AI-computed match scores between a user and an opportunity.
export const opportunityMatches = mysqlTable("opportunity_matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  opportunityId: int("opportunityId").notNull(),
  score: int("score").default(0).notNull(), // 0-100
  reasoning: text("reasoning"),
  status: mysqlEnum("status", ["suggested", "saved", "applied", "dismissed"]).default("suggested").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type OpportunityMatch = typeof opportunityMatches.$inferSelect;

// Global Learning Missions — outcome-oriented guided journeys.
export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["skill", "language", "startup", "career", "fitness", "custom"]).default("skill").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["active", "completed", "paused", "abandoned"]).default("active").notNull(),
  progress: int("progress").default(0).notNull(), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Mission = typeof missions.$inferSelect;

export const missionSteps = mysqlTable("mission_steps", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  ordinal: int("ordinal").default(0).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  detail: text("detail"),
  done: boolean("done").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MissionStep = typeof missionSteps.$inferSelect;

// AI Startup Builder — generated startup operating systems.
export const startupBlueprints = mysqlTable("startup_blueprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  idea: text("idea").notNull(),
  name: varchar("name", { length: 160 }),
  tagline: varchar("tagline", { length: 240 }),
  businessPlan: json("businessPlan").$type<Record<string, unknown>>(),
  branding: json("branding").$type<Record<string, unknown>>(),
  marketing: json("marketing").$type<Record<string, unknown>>(),
  mvpRoadmap: json("mvpRoadmap").$type<Array<{ phase: string; items: string[] }>>(),
  teamPlan: json("teamPlan").$type<Array<{ role: string; focus: string }>>(),
  status: mysqlEnum("status", ["draft", "generated", "launched"]).default("generated").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StartupBlueprint = typeof startupBlueprints.$inferSelect;

// AI Marketplace — user-listed agents, prompts, workflows, templates, automations.
export const aiMarketListings = mysqlTable("ai_market_listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  kind: mysqlEnum("kind", ["agent", "prompt", "workflow", "template", "automation"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  content: text("content"), // the prompt/workflow definition delivered on purchase
  priceCents: int("priceCents").default(0).notNull(),
  tags: json("tags").$type<string[]>(),
  sales: int("sales").default(0).notNull(),
  ratingSum: int("ratingSum").default(0).notNull(),
  ratingCount: int("ratingCount").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AiMarketListing = typeof aiMarketListings.$inferSelect;

export const aiMarketPurchases = mysqlTable("ai_market_purchases", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  buyerId: int("buyerId").notNull(),
  pricePaidCents: int("pricePaidCents").default(0).notNull(),
  rated: boolean("rated").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AiMarketPurchase = typeof aiMarketPurchases.$inferSelect;

// ═══════════════════════════════════════════════════════════════
// ENTERPRISE ENGINE LAYER — EVENT BUS + ECONOMY ENGINE
// ═══════════════════════════════════════════════════════════════

/** Immutable audit ledger — every platform event persisted here */
export const auditLedger = mysqlTable("audit_ledger", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 80 }).notNull(),
  userId: int("userId"),
  payload: json("payload").$type<Record<string, unknown>>(),
  traceId: varchar("traceId", { length: 128 }).notNull(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
});
export type AuditLedgerRow = typeof auditLedger.$inferSelect;

/** Per-token daily emission caps and current usage */
export const tokenEmissionCaps = mysqlTable("token_emission_caps", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 20 }).notNull(),
  dailyCap: decimal("dailyCap", { precision: 24, scale: 8 }).notNull(),
  emittedToday: decimal("emittedToday", { precision: 24, scale: 8 }).default("0").notNull(),
  totalSupply: decimal("totalSupply", { precision: 24, scale: 8 }).default("0").notNull(),
  supplyCap: decimal("supplyCap", { precision: 24, scale: 8 }),
  lastResetAt: timestamp("lastResetAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TokenEmissionCap = typeof tokenEmissionCaps.$inferSelect;

/** Internal market price state per token */
export const tokenMarketState = mysqlTable("token_market_state", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 20 }).notNull().unique(),
  baseValue: decimal("baseValue", { precision: 24, scale: 8 }).default("1").notNull(),
  currentPrice: decimal("currentPrice", { precision: 24, scale: 8 }).default("1").notNull(),
  demandIndex: decimal("demandIndex", { precision: 10, scale: 4 }).default("1").notNull(),
  supplyIndex: decimal("supplyIndex", { precision: 10, scale: 4 }).default("1").notNull(),
  stabilityFactor: decimal("stabilityFactor", { precision: 5, scale: 4 }).default("0.9500").notNull(),
  volatilityScore: decimal("volatilityScore", { precision: 5, scale: 4 }).default("0.1000").notNull(),
  volume24h: decimal("volume24h", { precision: 24, scale: 8 }).default("0").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TokenMarketState = typeof tokenMarketState.$inferSelect;

/** User behavior signals for archetype classification */
export const userBehaviorSignals = mysqlTable("user_behavior_signals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  signalType: varchar("signalType", { length: 60 }).notNull(),
  value: decimal("value", { precision: 10, scale: 4 }).default("1").notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});
export type UserBehaviorSignal = typeof userBehaviorSignals.$inferSelect;

/** Computed user archetypes */
export const userArchetypes = mysqlTable("user_archetypes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  primary: mysqlEnum("primary", ["investor", "creator", "gamer", "builder", "speculator", "learner", "ambassador"]).default("learner").notNull(),
  secondary: varchar("secondary", { length: 30 }),
  scores: json("scores").$type<Record<string, number>>(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }).default("0.5000").notNull(),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
});
export type UserArchetype = typeof userArchetypes.$inferSelect;

/** Fraud detection signals */
export const fraudSignals = mysqlTable("fraud_signals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  signalType: varchar("signalType", { length: 60 }).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("low").notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  resolved: boolean("resolved").default(false).notNull(),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
});
export type FraudSignal = typeof fraudSignals.$inferSelect;

/** Rate limit tracking per user+action */
export const rateLimitBuckets = mysqlTable("rate_limit_buckets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 60 }).notNull(),
  count: int("count").default(0).notNull(),
  windowStart: timestamp("windowStart").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RateLimitBucket = typeof rateLimitBuckets.$inferSelect;

// ═══════════════════════════════════════════════════════════════
// BLOCKCHAIN CUSTODY LAYER
// Non-custodial HD wallet registry + on-chain transaction log
// Private keys are NEVER stored — only public addresses and
// encrypted derivation metadata (encrypted client-side).
// ═══════════════════════════════════════════════════════════════

export const custodyWallets = mysqlTable("custody_wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  // EVM address (checksummed, 42 chars)
  address: varchar("address", { length: 42 }).notNull(),
  // BIP-44 derivation path used to derive this address
  derivationPath: varchar("derivation_path", { length: 64 }).notNull(),
  // Chain identifier: 1=Ethereum, 137=Polygon, 56=BSC, 8453=Base
  chainId: int("chain_id").default(1).notNull(),
  chainName: varchar("chain_name", { length: 32 }).default("ethereum").notNull(),
  // Wallet type
  walletType: mysqlEnum("wallet_type", ["hd", "imported", "multisig"]).default("hd").notNull(),
  // Label for UI
  label: varchar("label", { length: 64 }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  // Nonce cache for gas optimization
  lastKnownNonce: int("last_known_nonce").default(0).notNull(),
  // Balance cache (updated on each tx)
  cachedBalanceWei: varchar("cached_balance_wei", { length: 78 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  userIdx: index("custody_wallets_user_idx").on(t.userId),
  addressIdx: uniqueIndex("custody_wallets_address_idx").on(t.address),
}));

export const onChainTransactions = mysqlTable("on_chain_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  walletId: int("wallet_id").notNull(),
  // On-chain tx hash (66 chars for EVM)
  txHash: varchar("tx_hash", { length: 66 }),
  chainId: int("chain_id").notNull(),
  fromAddress: varchar("from_address", { length: 42 }).notNull(),
  toAddress: varchar("to_address", { length: 42 }).notNull(),
  // Value in wei (string to preserve precision)
  valueWei: varchar("value_wei", { length: 78 }).default("0").notNull(),
  // Gas fields
  gasLimit: varchar("gas_limit", { length: 20 }),
  gasPrice: varchar("gas_price", { length: 30 }),
  maxFeePerGas: varchar("max_fee_per_gas", { length: 30 }),
  maxPriorityFeePerGas: varchar("max_priority_fee_per_gas", { length: 30 }),
  nonce: int("nonce"),
  // ERC-20 token transfer fields (null = native ETH)
  tokenContract: varchar("token_contract", { length: 42 }),
  tokenSymbol: varchar("token_symbol", { length: 20 }),
  tokenAmount: varchar("token_amount", { length: 78 }),
  tokenDecimals: int("token_decimals"),
  // Status lifecycle
  status: mysqlEnum("status", ["unsigned", "signed", "broadcast", "confirmed", "failed", "dropped"]).default("unsigned").notNull(),
  blockNumber: int("block_number"),
  blockTimestamp: timestamp("block_timestamp"),
  confirmations: int("confirmations").default(0).notNull(),
  // Raw signed tx (hex) — stored temporarily until broadcast, then cleared
  signedTxHex: text("signed_tx_hex"),
  // Error message if failed
  errorMessage: varchar("error_message", { length: 500 }),
  // Internal metadata
  internalNote: varchar("internal_note", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  userIdx: index("on_chain_tx_user_idx").on(t.userId),
  txHashIdx: index("on_chain_tx_hash_idx").on(t.txHash),
  statusIdx: index("on_chain_tx_status_idx").on(t.status),
}));

export type CustodyWallet = typeof custodyWallets.$inferSelect;
export type OnChainTransaction = typeof onChainTransactions.$inferSelect;
