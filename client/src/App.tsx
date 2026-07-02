import { Suspense, lazy } from "react";
import { Navigation } from "@/components/Navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { PriceTicker } from "@/components/PriceTicker";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAppStore } from "./shared/state/appStore";
import { OSShell } from "./shells/os/OSShell";
import { QuickLaunchBar } from "./shells/os/QuickLaunchBar";
import { AlwaysOnVoice } from "./components/AlwaysOnVoice";
import { HopeCompanion } from "./components/HopeCompanion";
import { AchievementToastContainer } from "./components/AchievementToast";
import BottomSidebar from "./components/BottomSidebar";

// Lazy-loaded pages — each becomes its own chunk, preventing OOM at build time
// Core
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationsHub = lazy(() => import("./pages/NotificationsHub"));
const Messages = lazy(() => import("./pages/Messages"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/Signin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Social
const Social = lazy(() => import("./pages/Social"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const Community = lazy(() => import("./pages/Community"));
const Guilds = lazy(() => import("./pages/Guilds"));
const Stories = lazy(() => import("./pages/Stories"));
const Explore = lazy(() => import("./pages/Explore"));
const Discover = lazy(() => import("./pages/Discover"));

// Streaming & Video
const Streaming = lazy(() => import("./pages/Streaming"));
const VideoArea = lazy(() => import("./pages/VideoArea"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorStudio = lazy(() => import("./pages/CreatorStudio"));
const Live = lazy(() => import("./pages/Live"));

// Marketplace & Commerce
const Marketplace = lazy(() => import("./pages/Marketplace"));
const EscrowShop = lazy(() => import("./pages/EscrowShop"));
const Payments = lazy(() => import("./pages/Payments"));
const SkyStore = lazy(() => import("./pages/SkyStore"));

// Crypto & DeFi
const Crypto = lazy(() => import("./pages/Crypto"));
const TokenDashboard = lazy(() => import("./pages/TokenDashboard"));
const TokenSwap = lazy(() => import("./pages/TokenSwap"));
const StakingPortal = lazy(() => import("./pages/StakingPortal"));
const Farming = lazy(() => import("./pages/Farming"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Trading = lazy(() => import("./pages/Trading"));
const AITrading = lazy(() => import("./pages/AITrading"));
const DayTradeRoom = lazy(() => import("./pages/DayTradeRoom"));

// GameFi
const Arcade = lazy(() => import("./pages/Arcade"));
const Gaming = lazy(() => import("./pages/Gaming"));
const GameCrash = lazy(() => import("./pages/GameCrash"));
const GameSlots = lazy(() => import("./pages/GameSlots"));
const GameBlackjack = lazy(() => import("./pages/GameBlackjack"));
const GameDice = lazy(() => import("./pages/GameDice"));
const GameRoulette = lazy(() => import("./pages/GameRoulette"));
const GamePlinko = lazy(() => import("./pages/GamePlinko"));
const TrumpMining = lazy(() => import("./pages/TrumpMining"));
const HopeAI = lazy(() => import("./pages/HopeAI"));
const HopeAIMeta = lazy(() => import("./pages/HopeAIMeta"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const GlobalOperationsCenter = lazy(() => import("./pages/GlobalOperationsCenter"));
const AIToolsHub = lazy(() => import("./pages/AIToolsHub"));
const SkySchool = lazy(() => import("./pages/SkySchool"));
const TradingTerminal = lazy(() => import("./pages/TradingTerminal"));
const SocialFeedV2 = lazy(() => import("./pages/SocialFeedV2"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
// AI
const AIBrain = lazy(() => import("./pages/AIBrain"));
const AICore = lazy(() => import("./pages/AICore"));
const AIEngineer = lazy(() => import("./pages/AIEngineer"));
const AICodeStudio = lazy(() => import("./pages/AICodeStudio"));
const AICopyStudio = lazy(() => import("./pages/AICopyStudio"));
const AIAgent = lazy(() => import("./pages/AIAgent"));
const CodeIntelligence = lazy(() => import("./pages/CodeIntelligence"));
const AIIntelligenceHub = lazy(() => import("./pages/AIIntelligenceHub"));

// Governance & Community
const Governance = lazy(() => import("./pages/Governance"));
const Charity = lazy(() => import("./pages/Charity"));
const Leaderboards = lazy(() => import("./pages/Leaderboards"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Referrals = lazy(() => import("./pages/Referrals"));
const PlatformStatus = lazy(() => import("./pages/PlatformStatus"));
const TwoFactorSetup = lazy(() => import("./pages/TwoFactorSetup"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const TokenMetrics = lazy(() => import("./pages/TokenMetrics"));
const VestingSchedule = lazy(() => import("./pages/VestingSchedule"));

// Analytics & Business
const Analytics = lazy(() => import("./pages/Analytics"));
const DMInbox = lazy(() => import("@/pages/DMInbox"));
const NFTGallery = lazy(() => import("@/pages/NFTGallery"));
const Reels = lazy(() => import("@/pages/Reels"));
const YieldFarming = lazy(() => import("@/pages/YieldFarming"));
const WhaleMonitor = lazy(() => import("@/pages/WhaleMonitor"));
const InvestorRoom = lazy(() => import("./pages/InvestorRoom"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const Economics = lazy(() => import("./pages/Economics"));
const Growth = lazy(() => import("./pages/Growth"));
const Retention = lazy(() => import("./pages/Retention"));

// Admin & Dev
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminWalletManager = lazy(() => import("./pages/AdminWalletManager"));
const CryptoResearchHub = lazy(() => import("./pages/CryptoResearchHub"));
const MiningCalculator = lazy(() => import("./pages/MiningCalculator"));
const MinerDashboard = lazy(() => import("./pages/MinerDashboard"));
const MiningDashboard = lazy(() => import("./pages/MiningDashboard"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AIModerationQueue = lazy(() => import("./pages/AIModerationQueue"));
const Security = lazy(() => import("./pages/Security"));
const CodeQuality = lazy(() => import("./pages/CodeQuality"));
const CodeQualityDashboard = lazy(() => import("./pages/CodeQualityDashboard"));
const DeveloperArea = lazy(() => import("./pages/DeveloperArea"));
const Engineer = lazy(() => import("./pages/Engineer"));
const Beta = lazy(() => import("./pages/Beta"));
const GeneratedApiExplorer = lazy(() => import("./pages/GeneratedApiExplorer"));
const GeneratedGallery = lazy(() => import("./pages/GeneratedGallery"));

// Education & Features
const School = lazy(() => import("./pages/School"));
const Learning = lazy(() => import("./pages/Learning"));
const Features = lazy(() => import("./pages/Features"));
const ProofVault = lazy(() => import("./pages/ProofVault"));

// Additional pages from merged codebases
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));
const AnomalyDetection = lazy(() => import("./pages/AnomalyDetection"));
const DevOps = lazy(() => import("./pages/DevOps"));
const LogisticsOptimizer = lazy(() => import("./pages/LogisticsOptimizer"));
const SentimentPipeline = lazy(() => import("./pages/SentimentPipeline"));
const ICOLaunchpad = lazy(() => import("./pages/ICOLaunchpad"));
const DeveloperMarketplace = lazy(() => import("./pages/DeveloperMarketplace"));
const InvestorPitch = lazy(() => import("./pages/InvestorPitch"));
const EventPlanner = lazy(() => import("./pages/EventPlanner"));
const UniversalSearch = lazy(() => import("./pages/UniversalSearch"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const TournamentBracketPage = lazy(() => import("./pages/TournamentBracket"));
const GovernanceWizard = lazy(() => import("./pages/GovernanceWizard"));
const VODArchive = lazy(() => import("./pages/VODArchive"));
const CharityLeaderboard = lazy(() => import("./pages/CharityLeaderboard"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

// Strategic Engines (Ecosystem Integration Layer)
const FeedbackHub = lazy(() => import("./pages/FeedbackHub"));
const AdaptiveRoadmap = lazy(() => import("./pages/AdaptiveRoadmap"));
const AgentDebate = lazy(() => import("./pages/AgentDebate"));
const CompetitiveRadar = lazy(() => import("./pages/CompetitiveRadar"));
const BehavioralIntelligence = lazy(() => import("./pages/BehavioralIntelligence"));
const ExperimentFactory = lazy(() => import("./pages/ExperimentFactory"));
const NarrativeEngine = lazy(() => import("./pages/NarrativeEngine"));
const ConnectorIntelligence = lazy(() => import("./pages/ConnectorIntelligence"));
const ProductBrain = lazy(() => import("./pages/ProductBrain"));
const CompanySimulator = lazy(() => import("./pages/CompanySimulator"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const APIDocs = lazy(() => import("./pages/APIDocs"));
const AdvancedAdminPanel = lazy(() => import("./pages/AdvancedAdminPanel"));

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// The OS shell owns only its three self-contained surfaces ( "/", and the
// discover/execute/identity home). Every other path is an explicit feature
// route that must render through the legacy router — even while the OS shell is
// the active experience. This keeps the OS home intact AND makes deep routes
// like /mission-control reachable without forcing users into legacy mode.
const OS_HOME_PATHS = new Set(["/", "/discover", "/execute", "/identity"]);
function Router() {
  const { shell } = useAppStore();
  const [location] = useLocation();
  if (shell === "os" && OS_HOME_PATHS.has(location)) return <OSShell />;
  return <LegacyRouter />;
}
function LegacyRouter() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <QuickLaunchBar />
      <BottomTabBar />
      <PriceTicker />
      <BottomSidebar />
      <main className="pt-16 pb-20 lg:pb-0">
    <Suspense fallback={<PageLoader />}>
      <ErrorBoundary>
      <Switch>
        {/* Core */}
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/notifications-hub">{() => <Redirect to="/notifications" />}</Route>
        <Route path="/messages" component={Messages} />
        <Route path="/dm" component={Messages} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />

        {/* Social */}
        <Route path="/social" component={Social} />
        <Route path="/feed" component={SocialMedia} />
        <Route path="/social-media">{() => <Redirect to="/social" />}</Route>
        <Route path="/community" component={Community} />
        <Route path="/guilds" component={Guilds} />
        <Route path="/stories" component={Stories} />
        <Route path="/explore" component={Explore} />
        <Route path="/discover" component={Discover} />

        {/* Streaming & Video */}
        <Route path="/streaming" component={Streaming} />
        <Route path="/live" component={Live} />
        <Route path="/video" component={VideoArea} />
        <Route path="/creator" component={CreatorDashboard} />
        <Route path="/creator-dashboard" component={CreatorDashboard} />
        <Route path="/creator-studio" component={CreatorStudio} />

        {/* Marketplace */}
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/shop">{() => <Redirect to="/marketplace" />}</Route>
        <Route path="/escrow-shop">{() => <Redirect to="/marketplace" />}</Route>
        <Route path="/sky-store" component={SkyStore} />
        <Route path="/store">{() => <Redirect to="/sky-store" />}</Route>
        <Route path="/payments" component={Payments} />

        {/* Crypto & DeFi */}
        <Route path="/crypto" component={Crypto} />
        <Route path="/token" component={TokenDashboard} />
        <Route path="/token-dashboard" component={TokenDashboard} />
        <Route path="/swap" component={TokenSwap} />
        <Route path="/token-swap" component={TokenSwap} />
        <Route path="/staking" component={StakingPortal} />
        <Route path="/farming" component={Farming} />
        <Route path="/launchpad" component={Farming} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/trading" component={Trading} />
        <Route path="/ai-trading" component={AITrading} />
        <Route path="/day-trade" component={DayTradeRoom} />

        {/* GameFi */}
        <Route path="/arcade" component={Arcade} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/games" component={Gaming} />
        <Route path="/game/crash" component={GameCrash} />
        <Route path="/game/slots" component={GameSlots} />
        <Route path="/game/blackjack" component={GameBlackjack} />
        <Route path="/game/dice" component={GameDice} />
        <Route path="/game/roulette" component={GameRoulette} />
        <Route path="/game/plinko" component={GamePlinko} />
        <Route path="/trump-mining" component={TrumpMining} />
        <Route path="/hope-ai" component={HopeAI} />
        <Route path="/hope-ai-meta" component={HopeAIMeta} />
        <Route path="/mission-control" component={MissionControl} />
        <Route path="/command-center">{() => <Redirect to="/mission-control" />}</Route>
        <Route path="/global-ops" component={GlobalOperationsCenter} />
        <Route path="/global-operations-center">{() => <Redirect to="/global-ops" />}</Route>
        <Route path="/ai-tools" component={AIToolsHub} />
        <Route path="/ai-agent" component={AIAgent} />
        <Route path="/sky-school">{() => <Redirect to="/school" />}</Route>
        <Route path="/trading-terminal" component={TradingTerminal} />
        <Route path="/social-v2">{() => <Redirect to="/social" />}</Route>
        <Route path="/tournaments" component={Tournaments} />

        {/* AI */}
        <Route path="/ai-brain" component={AIBrain} />
        <Route path="/ai" component={AIBrain} />
        <Route path="/ai-core" component={AICore} />
        <Route path="/ai-engineer" component={AIEngineer} />
        <Route path="/ai-code-studio" component={AICodeStudio} />
        <Route path="/ai-copy-studio" component={AICopyStudio} />

        {/* Governance & Community */}
        <Route path="/governance" component={Governance} />
        <Route path="/charity" component={Charity} />
        <Route path="/leaderboards">{() => <Redirect to="/leaderboard" />}</Route>
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/status" component={PlatformStatus} />
          <Route path="/security" component={SecurityDashboard} />
          <Route path="/security-panel" component={Security} />
          <Route path="/audit-log" component={AuditLog} />
          <Route path="/api-keys" component={APIKeys} />
          <Route path="/token-metrics" component={TokenMetrics} />
          <Route path="/vesting" component={VestingSchedule} />
          <Route path="/api-docs" component={APIDocs} />
          <Route path="/admin-advanced" component={AdvancedAdminPanel} />

        {/* Analytics & Business */}
        <Route path="/analytics" component={Analytics} />
        <Route path="/investor" component={InvestorPortal} />
        <Route path="/investor-portal" component={InvestorPortal} />
        <Route path="/ai-market-agents" component={AIMarketAgents} />
        <Route path="/ai-agents-market" component={AIMarketAgents} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/platform-map" component={PlatformMap} />
        <Route path="/economics" component={Economics} />
        <Route path="/growth" component={Growth} />
        <Route path="/retention" component={Retention} />

        {/* Strategic Engines */}
        <Route path="/feedback-hub" component={FeedbackHub} />
        <Route path="/adaptive-roadmap" component={AdaptiveRoadmap} />
        <Route path="/agent-debate" component={AgentDebate} />
        <Route path="/competitive-radar" component={CompetitiveRadar} />
        <Route path="/behavioral-intelligence" component={BehavioralIntelligence} />
        <Route path="/experiment-factory" component={ExperimentFactory} />
        <Route path="/narrative-engine" component={NarrativeEngine} />
        <Route path="/connector-intelligence" component={ConnectorIntelligence} />
        <Route path="/product-brain" component={ProductBrain} />
        <Route path="/company-simulator" component={CompanySimulator} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/advanced-analytics" component={AdvancedAnalytics} />

        {/* Admin & Dev */}
        <Route path="/admin" component={Admin} />
        <Route path="/admin-dashboard">{() => <Redirect to="/admin" />}</Route>
        <Route path="/admin/wallet" component={AdminWalletManager} />
        <Route path="/crypto-research" component={CryptoResearchHub} />
        <Route path="/mining-calculator" component={MiningCalculator} />
        <Route path="/miner-dashboard" component={MinerDashboard} />
        <Route path="/mining" component={MiningDashboard} />
        <Route path="/admin-panel">{() => <Redirect to="/admin" />}</Route>
        <Route path="/admin/moderation" component={AIModerationQueue} />
          <Route path="/2fa" component={TwoFactorSetup} />
        <Route path="/code-quality" component={CodeQuality} />
        <Route path="/code-quality-dashboard" component={CodeQualityDashboard} />
        <Route path="/developer" component={DeveloperArea} />
        <Route path="/engineer" component={Engineer} />
        <Route path="/beta" component={Beta} />
        <Route path="/api-explorer" component={GeneratedApiExplorer} />
        <Route path="/gallery" component={GeneratedGallery} />

        {/* Education & Features */}
        <Route path="/school" component={School} />
        <Route path="/learning" component={Learning} />
        <Route path="/features" component={Features} />
        <Route path="/proof-vault" component={ProofVault} />
        <Route path="/components" component={ComponentShowcase} />
        <Route path="/language-partners" component={LanguagePartnerDiscovery} />
        <Route path="/practice-sessions" component={PracticeSessions} />
        <Route path="/progress-tracking" component={ProgressTracking} />
        <Route path="/bounty-system" component={BountySystem} />
        <Route path="/messaging" component={UnifiedMessaging} />
        <Route path="/video-chat" component={VideoChat} />
        <Route path="/video-chat/:partnerId" component={VideoChat} />
        <Route path="/translation-social" component={TranslationEnabledSocialFeed} />
        <Route path="/translation-community" component={TranslationEnabledCommunity} />
        <Route path="/platform-dashboard" component={UnifiedPlatformDashboard} />
        <Route path="/teaching-opportunities" component={TeachingOpportunities} />
        <Route path="/language-exchange-admin" component={LanguageExchangeAdmin} />

        {/* Fallback */}
        {/* New Enterprise & DevOps Pages */}
        <Route path="/anomaly-detection" component={AnomalyDetection} />
        <Route path="/devops" component={DevOps} />
        <Route path="/logistics" component={LogisticsOptimizer} />
        <Route path="/sentiment" component={SentimentPipeline} />
        <Route path="/ico" component={InvestorPortal} />
        <Route path="/404" component={NotFound} />
        <Route path="/developer-marketplace" component={DeveloperMarketplace} />
        <Route path="/investor-pitch" component={InvestorPitch} />
        <Route path="/event-planner" component={EventPlanner} />
        <Route path="/search" component={UniversalSearch} />
        <Route path="/enterprise" component={Enterprise} />
                  <Route path="/webhooks" component={WebhookManager} />
          <Route path="/rate-limits" component={RateLimitDashboard} />
          <Route path="/clips" component={StreamClip} />
          <Route path="/quests" component={GameFiQuestBoard} />
                    <Route path="/affiliate" component={AffiliateDashboard} />
                    <Route path="/mega-marketplace">{() => <Redirect to="/marketplace" />}</Route>
                    <Route path="/admin-orders" component={AdminOrders} />
                    <Route path="/profitability" component={Profitability} />
          <Route path="/vod-archive" component={VODArchive} />
          <Route path="/charity-leaderboard" component={CharityLeaderboard} />
          <Route path="/gaming-for-charity" component={GamingForCharity} />
          <Route path="/games/crypto-quiz" component={GameCryptoQuiz} />
          <Route path="/games/token-tap" component={GameTokenTap} />
          <Route path="/games/block-builder" component={GameBlockBuilder} />
          <Route path="/creator-onboarding" component={CreatorOnboarding} />
          <Route path="/create/article" component={CreateArticle} />
          <Route path="/create/audio" component={CreateAudio} />
          <Route path="/create/live" component={CreateLiveStream} />
          <Route path="/create/drop" component={CreateDrop} />
          <Route path="/create-reel" component={CreateReel} />
          <Route path="/communities/create" component={CommunityCreate} />
          <Route path="/shadow-identity" component={ShadowIdentity} />
          <Route path="/notification-intelligence" component={NotificationIntelligence} />
          <Route path="/compliance-center" component={ComplianceCenter} />
          <Route path="/ai-persona-feed" component={AIPersonaFeed} />
          <Route path="/economic-layer" component={EconomicLayer} />
          <Route path="/trust-safety" component={TrustSafetyDashboard} />
          <Route path="/code-intelligence" component={CodeIntelligence} />
          <Route path="/ai-intelligence" component={AIIntelligenceHub} />
          <Route path="/governance-wizard" component={GovernanceWizard} />
          <Route path="/tournament-bracket" component={TournamentBracketPage} />
          <Route path="/order-history" component={OrderHistory} />
          <Route path="/agents" component={AgentsDashboard} />
          <Route path="/agents/builder" component={AgentBuilder} />
          <Route path="/agents/marketplace" component={AgentMarketplace} />
          <Route path="/agents/sprint" component={AgentSprint} />
          <Route path="/agents/:id" component={AgentDetail} />
          <Route path="/creator-analytics" component={CreatorAnalytics} />
          <Route path="/creator-monetization" component={CreatorMonetization} />
          <Route path="/shadowfans" component={NSFWPlatform} />
          <Route path="/nsfw" component={NSFWPlatform} />
          <Route path="/adult" component={NSFWPlatform} />
          <Route path="/profile-edit" component={ProfileEdit} />
          <Route path="/school/dashboard" component={SchoolDashboard} />
          <Route path="/school/course/:id" component={SchoolCourse} />
          <Route path="/school/lesson/:id" component={SchoolLesson} />
          <Route path="/school/quiz/:id" component={SchoolQuiz} />
          <Route path="/school/certificate/:id" component={SchoolCertificate} />
          <Route path="/mining" component={Mining} />
          <Route path="/crypto-mine" component={CryptoMine} />
          <Route path="/earn" component={EarnHub} />
          <Route path="/earn-hub" component={EarnHub} />
          <Route path="/watch-earn" component={WatchEarn} />
          <Route path="/about" component={About} />
          <Route path="/live-gifting" component={LiveGifting} />
          <Route path="/dex" component={DEXDepthChart} />
          <Route path="/stream-gifting" component={StreamGifting} />
          <Route path="/checkout" component={StripeCheckout} />
          <Route path="/checkout/success" component={StripeCheckout} />
          {/* YC MVP Surfaces */}
          <Route path="/chat" component={ChatMVP} />
          <Route path="/action-panel" component={ActionPanel} />
          <Route path="/profile-wallet" component={ProfileWallet} />
          {/* Phase 9 — Intelligence Layer */}
          <Route path="/agent-coordination" component={AgentCoordinationHub} />
          <Route path="/memory-system" component={MemorySystem} />
          <Route path="/predictive-systems" component={PredictiveSystems} />
          <Route path="/self-healing" component={SelfHealingInfra} />
          <Route path="/adaptive-personalization" component={AdaptivePersonalization} />
          {/* Phase 10 — Data Economy */}
          <Route path="/data-lake" component={DataLake} />
          <Route path="/analytics-products" component={AnalyticsProducts} />
          <Route path="/reputation-system" component={ReputationSystem} />
          <Route path="/creator-intelligence" component={CreatorIntelligence} />
          <Route path="/ai-training-loops" component={AITrainingLoops} />
          {/* Phase 12 — Sovereign Network */}
          <Route path="/decentralized-identity" component={DecentralizedIdentity} />
          <Route path="/token-governance" component={TokenGovernance} />
          <Route path="/cross-chain" component={CrossChainInterop} />
          <Route path="/protocol-layer" component={ProtocolLayer} />
          <Route path="/ai-personas" component={AIPersonaSystem} />
          <Route path="/defensibility" component={DefensibilityMoat} />
          <Route path="/retention-engine" component={RetentionEngine} />
          <Route path="/system-architecture" component={SystemArchitecture} />
          <Route path="/gtm-strategy" component={GTMStrategy} />
          <Route path="/ai-agents" component={AIAgentMarket} />
          <Route path="/build-roadmap" component={BuildRoadmap} />
          <Route path="/pricing-engine" component={PricingEngine} />
          <Route path="/payment-infra" component={PaymentInfra} />
          <Route path="/security-compliance">{() => <Redirect to="/security" />}</Route>
          <Route path="/production-architecture" component={ProductionArchitecture} />
          <Route path="/build-order" component={BuildOrder} />
          <Route path="/master-architecture" component={MasterArchitecture} />
          <Route path="/dating" component={DatingHome} />
          <Route path="/dating/matches" component={MatchFeed} />
          <Route path="/dating/chat/:id" component={MatchChat} />
          <Route path="/dating/matchmaker" component={AIMatchmaker} />
          <Route path="/dating/premium" component={DatingPremium} />
          <Route path="/ambient-feed">{() => <Redirect to="/social" />}</Route>
          <Route path="/entity-profile/:id" component={EntityProfile} />
          <Route path="/match-space" component={MatchSpace} />
          <Route path="/world-brain" component={WorldBrain} />
          <Route path="/actions" component={ActionObjects} />
          <Route path="/unhidden" component={UnhiddenMode} />
          <Route path="/system-observability" component={SystemObservability} />
          <Route path="/automation-engine" component={AutomationEngine} />
          <Route path="/world-simulation" component={WorldSimulationControl} />
          <Route path="/economy-control" component={EconomyControl} />
          <Route path="/hope-ai-control" component={HOPEAIControl} />
          <Route path="/unhidden-interface" component={UnhiddenInterface} />
          <Route path="/power-tools" component={PowerUserTools} />
          <Route path="/legendary" component={LegendaryStatus} />
          <Route path="/founder" component={LegendaryStatus} />
          <Route path="/crypto-hub">{() => <Redirect to="/wallet" />}</Route>
          <Route path="/dm" component={DMInbox} />
          <Route path="/nft-gallery" component={NFTGallery} />
          <Route path="/reels" component={Reels} />
          <Route path="/yield-farming" component={YieldFarming} />
          <Route path="/whale-monitor" component={WhaleMonitor} />
          <Route path="/trust-system" component={TrustSystem} />
          <Route path="/dhgate">{() => <Redirect to="/marketplace" />}</Route>
          <Route path="/dhgate-shop">{() => <Redirect to="/marketplace" />}</Route>
          <Route path="/privacy" component={PrivacyVault} />
          <Route path="/privacy-vault" component={PrivacyVault} />
          <Route path="/ghost-mode" component={GhostMode} />
          <Route path="/shadow-relay" component={ShadowRelay} />
          <Route path="/tor-bridge" component={TorBridge} />
          <Route path="/anti-surveillance" component={AntiSurveillance} />
          <Route path="/voice-commands" component={VoiceCommandsRegistry} />
          <Route path="/mobile-app" component={MobileApp} />
          <Route path="/browser-extension" component={BrowserExtension} />
          <Route path="/embed-sdk" component={EmbedSDK} />
          <Route path="/developer-protocol" component={DeveloperProtocol} />
          <Route path="/crm" component={CRM} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/help" component={KnowledgeBase} />
          <Route path="/agent-coordination" component={AgentCoordination} />
          <Route path="/unified-feed">{() => <Redirect to="/social" />}</Route>
          <Route path="/automation-workflows" component={AutomationWorkflows} />
          <Route path="/unified-identity" component={UnifiedIdentity} />
          <Route path="/payment-ledger" component={UnifiedPaymentLedger} />
          <Route path="/system-status">{() => <Redirect to="/status" />}</Route>
          <Route path="/status" component={SystemStatus} />
          <Route path="/trending" component={Trending} />
          <Route path="/channels" component={Channels} />
          <Route path="/events" component={Events} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/defi" component={DeFiPage} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/spin" component={SpinWheel} />
          <Route path="/battle-pass" component={BattlePass} />
          <Route path="/bookmarks" component={Bookmarks} />
          <Route path="/hashtags" component={HashtagExplorer} />
          <Route path="/social-graph" component={SocialGraph} />
          <Route path="/clan-wars" component={ClanWars} />
          <Route path="/p2e-shop" component={P2EShop} />
          <Route path="/shop" component={P2EShop} />
          <Route path="/subscriptions" component={Subscriptions} />

          <Route path="/tip-jar" component={TipJar} />
          <Route path="/tips" component={TipJar} />
          <Route path="/content-scheduler" component={ContentScheduler} />
          <Route path="/scheduler" component={ContentScheduler} />
          <Route path="/live-reactions" component={LiveReactions} />
          <Route path="/reactions" component={LiveReactions} />
          <Route path="/server-installer" component={ServerInstaller} />
          <Route path="/self-host" component={ServerInstaller} />
          <Route path="/creator-spotlight" component={CreatorSpotlight} />
          <Route path="/book" component={BookPage} />
          <Route path="/the-chosen-one" component={BookPage} />
          <Route path="/nsfw-feed" component={NSFWFeed} />
          <Route path="/18plus" component={NSFWFeed} />
          <Route path="/content-vault" component={ContentVault} />
          <Route path="/vault" component={ContentVault} />
          <Route path="/payout" component={PayoutDashboard} />
          <Route path="/payout-dashboard" component={PayoutDashboard} />
          <Route path="/server-health" component={ServerHealth} />
          <Route path="/health" component={ServerHealth} />
          <Route path="/art-store" component={DigitalArtStore} />
          <Route path="/digital-art" component={DigitalArtStore} />
          <Route path="/creator/:handle" component={CreatorProfile} />
          <Route path="/age-gate" component={AgeGate} />
          {/* ─── New Engine Routes ─────────────────────────────────────────── */}
          <Route path="/blockchain-custody" component={BlockchainCustody} />
          <Route path="/free-will" component={FreeWillDashboard} />
          <Route path="/digital-nation" component={DigitalNationMode} />
          <Route path="/enterprise-analytics" component={EnterpriseAnalytics} />
          <Route path="/situation-room" component={SituationRoom} />
          <Route path="/life-command" component={LifeCommand} />
          <Route path="/destiny-engine" component={DestinyEngine} />
          <Route path="/central-bank" component={SKY444CentralBank} />
          <Route path="/citizen-passport" component={CitizenPassport} />
          <Route path="/memory-constellation" component={MemoryConstellation} />
          <Route path="/agent-city" component={AgentCity} />
          <Route path="/civilization" component={CivilizationSimulator} />
          <Route path="/investor-metrics" component={InvestorMetrics} />
          <Route component={NotFound} />
      
        </Switch>
      </ErrorBoundary>
    </Suspense>
      </main>
      <MobileBottomNav />
    </div>
  );
}

const WebhookManager = lazy(() => import("@/pages/WebhookManager"));
const GamingForCharity = lazy(() => import("./pages/GamingForCharity"));
const GameCryptoQuiz = lazy(() => import("./pages/GameCryptoQuiz"));
const GameTokenTap = lazy(() => import("./pages/GameTokenTap"));
const GameBlockBuilder = lazy(() => import("./pages/GameBlockBuilder"));
const CreatorOnboarding = lazy(() => import("./pages/CreatorOnboarding"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const CreateReel = lazy(() => import("./pages/CreateReel"));
const CommunityCreate = lazy(() => import("./pages/CommunityCreate"));
const CreateAudio = lazy(() => import("./pages/CreateAudio"));
const CreateLiveStream = lazy(() => import("./pages/CreateLiveStream"));
const CreateDrop = lazy(() => import("./pages/CreateDrop"));
const RateLimitDashboard = lazy(() => import("@/pages/RateLimitDashboard"));
const StreamClip = lazy(() => import("@/pages/StreamClip"));
const GameFiQuestBoard = lazy(() => import("@/pages/GameFiQuestBoard"));

const AffiliateDashboard = lazy(() => import("@/pages/AffiliateDashboard"));
const CryptoMine = lazy(() => import("./pages/CryptoMine"));
const MegaMarketplace = lazy(() => import("./pages/MegaMarketplace"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Profitability = lazy(() => import("./pages/Profitability"));
const AgentBuilder = lazy(() => import("@/pages/AgentBuilder"));
const AgentDetail = lazy(() => import("@/pages/AgentDetail"));
const AgentMarketplace = lazy(() => import("@/pages/AgentMarketplace"));
const AgentSprint = lazy(() => import("@/pages/AgentSprint"));
const AgentsDashboard = lazy(() => import("@/pages/AgentsDashboard"));
const CreatorAnalytics = lazy(() => import("@/pages/CreatorAnalytics"));
const LiveGifting = lazy(() => import("./pages/LiveGifting"));
const CreatorMonetization = lazy(() => import("@/pages/CreatorMonetization"));
const ProfileEdit = lazy(() => import("@/pages/ProfileEdit"));
const SchoolCertificate = lazy(() => import("@/pages/SchoolCertificate"));
const SchoolCourse = lazy(() => import("@/pages/SchoolCourse"));
const SchoolDashboard = lazy(() => import("@/pages/SchoolDashboard"));
const SchoolLesson = lazy(() => import("@/pages/SchoolLesson"));
const SchoolQuiz = lazy(() => import("@/pages/SchoolQuiz"));

const Mining = lazy(() => import("@/pages/Mining"));
const WatchEarn = lazy(() => import("@/pages/WatchEarn"));
const About = lazy(() => import("@/pages/About"));
const DEXDepthChart = lazy(() => import("@/pages/DEXDepthChart"));
const StreamGifting = lazy(() => import("@/pages/StreamGifting"));
const StripeCheckout = lazy(() => import("@/pages/StripeCheckout"));
// YC MVP Surfaces
const ChatMVP = lazy(() => import("@/pages/ChatMVP"));
const ActionPanel = lazy(() => import("@/pages/ActionPanel"));
const ProfileWallet = lazy(() => import("@/pages/ProfileWallet"));
// Phase 9 — Intelligence Layer
const AgentCoordinationHub = lazy(() => import("@/pages/AgentCoordinationHub"));
const MemorySystem = lazy(() => import("@/pages/MemorySystem"));
const PredictiveSystems = lazy(() => import("@/pages/PredictiveSystems"));
const SelfHealingInfra = lazy(() => import("@/pages/SelfHealingInfra"));
const AdaptivePersonalization = lazy(() => import("@/pages/AdaptivePersonalization"));
// Phase 10 — Data Economy
const DataLake = lazy(() => import("@/pages/DataLake"));
const AnalyticsProducts = lazy(() => import("@/pages/AnalyticsProducts"));
const ReputationSystem = lazy(() => import("@/pages/ReputationSystem"));
const CreatorIntelligence = lazy(() => import("@/pages/CreatorIntelligence"));
const AITrainingLoops = lazy(() => import("@/pages/AITrainingLoops"));
// Phase 12 — Sovereign Network
const DecentralizedIdentity = lazy(() => import("@/pages/DecentralizedIdentity"));
const TokenGovernance = lazy(() => import("@/pages/TokenGovernance"));
const CrossChainInterop = lazy(() => import("@/pages/CrossChainInterop"));
const ProtocolLayer = lazy(() => import("@/pages/ProtocolLayer"));
const AIPersonaSystem = lazy(() => import("@/pages/AIPersonaSystem"));
const DefensibilityMoat = lazy(() => import("@/pages/DefensibilityMoat"));
const RetentionEngine = lazy(() => import("@/pages/RetentionEngine"));
const SystemArchitecture = lazy(() => import("@/pages/SystemArchitecture"));
const GTMStrategy = lazy(() => import("@/pages/GTMStrategy"));
const AIAgentMarket = lazy(() => import("@/pages/AIAgentMarket"));
const BuildRoadmap = lazy(() => import("@/pages/BuildRoadmap"));
const PricingEngine = lazy(() => import("@/pages/PricingEngine"));
const PaymentInfra = lazy(() => import("@/pages/PaymentInfra"));
const SecurityCompliance = lazy(() => import("@/pages/SecurityCompliance"));
const ProductionArchitecture = lazy(() => import("@/pages/ProductionArchitecture"));
const BuildOrder = lazy(() => import("@/pages/BuildOrder"));
const MasterArchitecture = lazy(() => import("@/pages/MasterArchitecture"));
const DatingHome = lazy(() => import("@/pages/DatingHome"));
const MatchFeed = lazy(() => import("@/pages/MatchFeed"));
const MatchChat = lazy(() => import("@/pages/MatchChat"));
const AIMatchmaker = lazy(() => import("@/pages/AIMatchmaker"));
const DatingPremium = lazy(() => import("@/pages/DatingPremium"));
const AmbientFeed = lazy(() => import("@/pages/AmbientFeed"));
const EntityProfile = lazy(() => import("@/pages/EntityProfile"));
const MatchSpace = lazy(() => import("@/pages/MatchSpace"));
const WorldBrain = lazy(() => import("@/pages/WorldBrain"));
const ActionObjects = lazy(() => import("@/pages/ActionObjects"));
const UnhiddenMode = lazy(() => import("@/pages/UnhiddenMode"));
const SystemObservability = lazy(() => import("@/pages/SystemObservability"));
const AutomationEngine = lazy(() => import("@/pages/AutomationEngine"));
const WorldSimulationControl = lazy(() => import("@/pages/WorldSimulationControl"));
const EconomyControl = lazy(() => import("@/pages/EconomyControl"));
const HOPEAIControl = lazy(() => import("@/pages/HOPEAIControl"));
const UnhiddenInterface = lazy(() => import("@/pages/UnhiddenInterface"));
const PowerUserTools = lazy(() => import("@/pages/PowerUserTools"));
const CryptoHub = lazy(() => import("@/pages/CryptoHub"));
const TrustSystem = lazy(() => import("@/pages/TrustSystem"));
const LegendaryStatus = lazy(() => import("@/pages/LegendaryStatus"));
const DHgateShop = lazy(() => import("@/pages/DHgateShop"));
const PrivacyVault = lazy(() => import("@/pages/PrivacyVault"));
const GhostMode = lazy(() => import("@/pages/GhostMode"));
const ShadowRelay = lazy(() => import("@/pages/ShadowRelay"));
const TorBridge = lazy(() => import("@/pages/TorBridge"));
const AntiSurveillance = lazy(() => import("@/pages/AntiSurveillance"));
const VoiceCommandsRegistry = lazy(() => import("@/pages/VoiceCommandsRegistry"));
const MobileApp = lazy(() => import("@/pages/MobileApp"));
const BrowserExtension = lazy(() => import("@/pages/BrowserExtension"));
const EmbedSDK = lazy(() => import("@/pages/EmbedSDK"));
const DeveloperProtocol = lazy(() => import("@/pages/DeveloperProtocol"));
const CRM = lazy(() => import("@/pages/CRM"));
const KnowledgeBase = lazy(() => import("@/pages/KnowledgeBase"));
const AgentCoordination = lazy(() => import("@/pages/AgentCoordination"));
const UnifiedFeed = lazy(() => import("@/pages/UnifiedFeed"));
const AutomationWorkflows = lazy(() => import("@/pages/AutomationWorkflows"));
const UnifiedIdentity = lazy(() => import("@/pages/UnifiedIdentity"));
const UnifiedPaymentLedger = lazy(() => import("@/pages/UnifiedPaymentLedger"));
const SystemStatus = lazy(() => import("@/pages/SystemStatus"));
const NSFWPlatform = lazy(() => import("@/pages/NSFWPlatform"));
const Trending = lazy(() => import("@/pages/Trending"));
const Channels = lazy(() => import("@/pages/Channels"));
const Events = lazy(() => import("@/pages/Events"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const DeFiPage = lazy(() => import("@/pages/DeFi"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Subscriptions = lazy(() => import("@/pages/Subscriptions"));

const TipJar = lazy(() => import("@/pages/TipJar"));
const ContentScheduler = lazy(() => import("@/pages/ContentScheduler"));
const LiveReactions = lazy(() => import("@/pages/LiveReactions"));
const ServerInstaller = lazy(() => import("@/pages/ServerInstaller"));
const CreatorSpotlight = lazy(() => import("@/pages/CreatorSpotlight"));
const BookPage = lazy(() => import("@/pages/BookPage"));
const NSFWFeed = lazy(() => import("@/pages/NSFWFeed"));
const ContentVault = lazy(() => import("@/pages/ContentVault"));
const PayoutDashboard = lazy(() => import("@/pages/PayoutDashboard"));
const ServerHealth = lazy(() => import("@/pages/ServerHealth"));
const DigitalArtStore = lazy(() => import("@/pages/DigitalArtStore"));
const CreatorProfile = lazy(() => import("@/pages/CreatorProfile"));
const AgeGate = lazy(() => import("@/pages/AgeGate"));
const ShadowIdentity = lazy(() => import("@/pages/ShadowIdentity"));
const NotificationIntelligence = lazy(() => import("@/pages/NotificationIntelligence"));
const ComplianceCenter = lazy(() => import("@/pages/ComplianceCenter"));
const AIPersonaFeed = lazy(() => import("@/pages/AIPersonaFeed"));
const EconomicLayer = lazy(() => import("@/pages/EconomicLayer"));
const TrustSafetyDashboard = lazy(() => import("@/pages/TrustSafetyDashboard"));
const EarnHub = lazy(() => import("./pages/EarnHub"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const PlatformMap = lazy(() => import("./pages/PlatformMap"));
const AIMarketAgents = lazy(() => import("./pages/AIMarketAgents"));
const SpinWheel = lazy(() => import("./pages/SpinWheel"));
const BattlePass = lazy(() => import("./pages/BattlePass"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const HashtagExplorer = lazy(() => import("./pages/HashtagExplorer"));
const SocialGraph = lazy(() => import("./pages/SocialGraph"));
const ClanWars = lazy(() => import("./pages/ClanWars"));
const P2EShop = lazy(() => import("./pages/P2EShop"));
const TeamWorkspace = lazy(() => import("./pages/TeamWorkspace"));
const ChinaEdition = lazy(() => import("./pages/ChinaEdition"));
const MultiCryptoMine = lazy(() => import("./pages/MultiCryptoMine"));
const ImpactMap = lazy(() => import("./pages/ImpactMap"));
const LanguagePartnerDiscovery = lazy(() => import("./pages/LanguagePartnerDiscovery"));
const PracticeSessions = lazy(() => import("./pages/PracticeSessions"));
const ProgressTracking = lazy(() => import("./pages/ProgressTracking"));
const BountySystem = lazy(() => import("./pages/BountySystem"));
const UnifiedMessaging = lazy(() => import("./pages/UnifiedMessaging"));
const VideoChat = lazy(() => import("./pages/VideoChat"));
const TranslationEnabledSocialFeed = lazy(() => import("./pages/TranslationEnabledSocialFeed"));
const TranslationEnabledCommunity = lazy(() => import("./pages/TranslationEnabledCommunity"));
const UnifiedPlatformDashboard = lazy(() => import("./pages/UnifiedPlatformDashboard"));
const TeachingOpportunities = lazy(() => import("./pages/TeachingOpportunities"));
const LanguageExchangeAdmin = lazy(() => import("./pages/LanguageExchangeAdmin"));
// ─── New Engine Pages ─────────────────────────────────────────────────────────
const BlockchainCustody = lazy(() => import("./pages/BlockchainCustody"));
const FreeWillDashboard = lazy(() => import("./pages/FreeWillDashboard"));
const DigitalNationMode = lazy(() => import("./pages/DigitalNationMode"));
const EnterpriseAnalytics = lazy(() => import("./pages/EnterpriseAnalytics"));
const SituationRoom = lazy(() => import("./pages/SituationRoom"));
const LifeCommand = lazy(() => import("./pages/LifeCommand"));
const DestinyEngine = lazy(() => import("./pages/DestinyEngine"));
const SKY444CentralBank = lazy(() => import("./pages/SKY444CentralBank"));
const CitizenPassport = lazy(() => import("./pages/CitizenPassport"));
const MemoryConstellation = lazy(() => import("./pages/MemoryConstellation"));
const AgentCity = lazy(() => import("./pages/AgentCity"));
const CivilizationSimulator = lazy(() => import("./pages/CivilizationSimulator"));
const InvestorMetrics = lazy(() => import("./pages/InvestorMetrics"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
          <AlwaysOnVoice />
          <HopeCompanion />
          <AchievementToastContainer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
