/**
 * SKYCOIN4444 China Edition V4.4
 * 中国版 — AI数字生态平台
 * Bilingual landing page: Chinese + English
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Brain, BookOpen, Users, Radio, Star, Building2,
  Code2, Shield, Globe, Zap, ChevronRight, Play,
  MessageSquare, Video, Mic, Search, Briefcase, Award,
  Layers, Heart, TrendingUp, CheckCircle, ArrowRight
} from "lucide-react";

const LANG_ZH = "zh";
const LANG_EN = "en";

const T = {
  hero_title_zh: "SKYCOIN4444",
  hero_subtitle_zh: "AI数字生态平台",
  hero_tagline_zh: "一个平台，无限可能。",
  hero_desc_zh: "连接人工智能、教育、开发者工具、创作者经济与数字社区。帮助每个人学习、创造、协作和成长。",
  hero_cta_zh: "立即开始",
  hero_cta2_zh: "了解更多",
  hero_title_en: "SKYCOIN4444",
  hero_subtitle_en: "AI Digital Ecosystem Platform",
  hero_tagline_en: "One Platform. Infinite Possibilities.",
  hero_desc_en: "Connecting AI, education, developer tools, creator economy, and digital communities. Helping everyone learn, create, collaborate, and grow.",
  hero_cta_en: "Get Started",
  hero_cta2_en: "Learn More",
  mission_zh: "我们的使命",
  mission_en: "Our Mission",
  mission_desc_zh: "让人工智能服务每一个人。打造开放、安全、创新的数字生态系统。连接全球开发者、学习者、创作者与企业。",
  mission_desc_en: "Making AI accessible to everyone. Building an open, secure, and innovative digital ecosystem. Connecting global developers, learners, creators, and enterprises.",
  modules_title_zh: "核心模块",
  modules_title_en: "Core Modules",
  integrations_zh: "生态合作伙伴",
  integrations_en: "Ecosystem Partners",
  features_zh: "44项核心功能",
  features_en: "44 Advanced Features",
  advantages_zh: "核心优势",
  advantages_en: "Core Advantages",
};

const MODULES = [
  {
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    gradient: "from-cyan-500/20 to-blue-500/10",
    zh: "Hope AI 超级助手",
    en: "Hope AI Super Assistant",
    desc_zh: "语音AI · 视频AI · 编程AI · 商业AI · 教育AI · 翻译AI · 研究AI · 智能体市场",
    desc_en: "Voice AI · Video AI · Coding AI · Business AI · Education AI · Translation AI · Research AI · Agent Marketplace",
    route: "/hope-ai",
    features_zh: ["Hope AI 对话", "语音助手", "AI编程", "AI研究", "AI写作", "AI翻译", "AI视觉", "智能体"],
    features_en: ["Hope AI Chat", "Voice Assistant", "AI Coding", "AI Research", "AI Writing", "AI Translation", "AI Vision", "AI Agents"],
  },
  {
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    gradient: "from-purple-500/20 to-fuchsia-500/10",
    zh: "教育中心",
    en: "Education Center",
    desc_zh: "AI学习 · 编程学校 · 网络安全实验室 · 创业学院 · 英语/中文学习 · 认证路径",
    desc_en: "AI Learning · Programming School · Cybersecurity Labs · Entrepreneurship Academy · Language Learning · Certification Paths",
    route: "/sky-school",
    features_zh: ["课程", "认证", "编程实验室", "模拟考试", "学习路径", "知识库"],
    features_en: ["Courses", "Certifications", "Coding Labs", "Practice Exams", "Learning Paths", "Knowledge Base"],
  },
  {
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    gradient: "from-green-500/20 to-teal-500/10",
    zh: "社交生态",
    en: "Social Ecosystem",
    desc_zh: "社区动态 · 创作者主页 · 群组 · 实时聊天 · 活动 · AI社区 · 开发者社区 · 学生社区",
    desc_en: "Community Feed · Creator Profiles · Groups · Live Chat · Events · AI Communities · Developer Communities · Student Communities",
    route: "/social",
    features_zh: ["个人主页", "消息", "群组", "社区", "论坛", "直播", "互动", "创作者页面"],
    features_en: ["Profiles", "Messaging", "Groups", "Communities", "Forums", "Livestreaming", "Reactions", "Creator Pages"],
  },
  {
    icon: Radio,
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    gradient: "from-red-500/20 to-rose-500/10",
    zh: "直播平台",
    en: "Streaming Platform",
    desc_zh: "多主播直播 · AI字幕 · 翻译叠加 · 打赏 · 会员 · 社区房间 · 屏幕共享 · 教育直播",
    desc_en: "Multi-host Livestreams · AI Captions · Translation Overlays · Donations · Memberships · Community Rooms · Screen Sharing · Educational Broadcasts",
    route: "/streaming",
    features_zh: ["创作者工作室", "视频发布", "数字产品", "订阅社区"],
    features_en: ["Creator Studio", "Video Publishing", "Digital Products", "Subscription Communities"],
  },
  {
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    gradient: "from-amber-500/20 to-orange-500/10",
    zh: "创作者经济",
    en: "Creator Economy",
    desc_zh: "创作者仪表板 · 课程 · 数字产品 · AI内容工具 · 视频编辑 · 发布工具 · 数据分析 · 社区变现",
    desc_en: "Creator Dashboard · Courses · Digital Products · AI Content Tools · Video Editor · Publishing Tools · Analytics · Community Monetization",
    route: "/creator-studio",
    features_zh: ["创作者工作室", "视频发布", "数字产品", "订阅社区"],
    features_en: ["Creator Studio", "Video Publishing", "Digital Products", "Subscription Communities"],
  },
  {
    icon: Building2,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    gradient: "from-blue-500/20 to-indigo-500/10",
    zh: "企业功能",
    en: "Enterprise Features",
    desc_zh: "组织管理 · 团队工作区 · 权限管理 · 数据分析 · 项目管理 · 知识库 · AI智能体 · 工作流自动化",
    desc_en: "Organization Management · Team Workspaces · Permissions · Analytics · Project Management · Knowledge Base · AI Agents · Workflow Automation",
    route: "/enterprise",
    features_zh: ["CRM", "项目管理", "数据分析", "团队工作区", "自动化"],
    features_en: ["CRM", "Project Management", "Analytics", "Team Workspace", "Automation"],
  },
];

const INTEGRATIONS = [
  { name: "微信", en: "WeChat", icon: "💬", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", desc: "Login · Pay · Share" },
  { name: "支付宝", en: "Alipay", icon: "💳", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Payments · Wallet" },
  { name: "哔哩哔哩", en: "Bilibili", icon: "📺", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", desc: "Video · Community" },
  { name: "抖音", en: "Douyin", icon: "🎵", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", desc: "Short Video · Creator" },
  { name: "小红书", en: "Xiaohongshu", icon: "📖", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", desc: "Lifestyle · Creator" },
  { name: "钉钉", en: "DingTalk", icon: "🔔", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Enterprise · Teams" },
  { name: "腾讯云", en: "Tencent Cloud", icon: "☁️", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Infrastructure · AI" },
  { name: "阿里云", en: "Alibaba Cloud", icon: "🌐", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", desc: "Cloud · Storage" },
];

const ADVANTAGES = [
  { icon: Brain, zh: "Hope AI 智能助手", en: "Hope AI Assistant", color: "text-cyan-400" },
  { icon: Code2, zh: "开发者平台", en: "Developer Platform", color: "text-purple-400" },
  { icon: BookOpen, zh: "学习中心", en: "Learning Center", color: "text-green-400" },
  { icon: Star, zh: "创作者工具", en: "Creator Tools", color: "text-amber-400" },
  { icon: Globe, zh: "全球社区", en: "Global Community", color: "text-blue-400" },
  { icon: Building2, zh: "企业服务", en: "Enterprise Services", color: "text-rose-400" },
];

const FEATURE_GROUPS = [
  {
    icon: Brain,
    zh: "AI 功能",
    en: "AI Features",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    items_zh: ["Hope AI 对话", "语音助手", "AI编程", "AI研究", "AI写作", "AI翻译", "AI视觉", "AI智能体"],
    items_en: ["Hope AI Chat", "Voice Assistant", "AI Coding", "AI Research", "AI Writing", "AI Translation", "AI Vision", "AI Agents"],
  },
  {
    icon: Users,
    zh: "社交功能",
    en: "Social Features",
    color: "text-green-400",
    bg: "bg-green-500/10",
    items_zh: ["个人主页", "消息", "群组", "社区", "论坛", "直播", "互动", "创作者页面"],
    items_en: ["Profiles", "Messaging", "Groups", "Communities", "Forums", "Livestreaming", "Reactions", "Creator Pages"],
  },
  {
    icon: BookOpen,
    zh: "教育功能",
    en: "Education Features",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    items_zh: ["课程", "认证", "编程实验室", "模拟考试", "学习路径", "知识库"],
    items_en: ["Courses", "Certifications", "Coding Labs", "Practice Exams", "Learning Paths", "Knowledge Base"],
  },
  {
    icon: Briefcase,
    zh: "商业功能",
    en: "Business Features",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    items_zh: ["CRM", "项目管理", "数据分析", "团队工作区", "工作流自动化"],
    items_en: ["CRM", "Project Management", "Analytics", "Team Workspace", "Automation"],
  },
  {
    icon: Code2,
    zh: "开发者功能",
    en: "Developer Features",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    items_zh: ["API市场", "SDK中心", "开放集成", "开发者主页", "文档中心"],
    items_en: ["API Marketplace", "SDK Center", "Open Integrations", "Developer Profiles", "Documentation Hub"],
  },
  {
    icon: Star,
    zh: "创作者功能",
    en: "Creator Features",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    items_zh: ["创作者工作室", "视频发布", "数字产品", "订阅社区"],
    items_en: ["Creator Studio", "Video Publishing", "Digital Products", "Subscription Communities"],
  },
  {
    icon: Shield,
    zh: "安全功能",
    en: "Security Features",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    items_zh: ["实名认证", "多因素认证", "审计日志", "隐私控制"],
    items_en: ["Identity Verification", "Multi-Factor Auth", "Audit Logs", "Privacy Controls"],
  },
  {
    icon: Layers,
    zh: "生态功能",
    en: "Ecosystem Features",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    items_zh: ["市场", "活动平台", "社区治理", "生态奖励"],
    items_en: ["Marketplace", "Events Platform", "Community Governance", "Ecosystem Rewards"],
  },
];

export default function ChinaEdition() {
  const [lang, setLang] = useState<"zh" | "en">(LANG_ZH);
  const [, navigate] = useLocation();
  const isZh = lang === LANG_ZH;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Language toggle + top bar */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#050508]/95 backdrop-blur px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black rainbow-text">SKYCOIN4444</span>
          <span className="text-xs text-muted-foreground">China Edition V4.4</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang("zh")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${lang === "zh" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-muted-foreground hover:text-white"}`}
          >
            中文
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${lang === "en" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-muted-foreground hover:text-white"}`}
          >
            EN
          </button>
          <button onClick={() => navigate("/")} className="px-3 py-1 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors border border-white/10">
            {isZh ? "全球版" : "Global"}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-950/30 via-[#050508] to-cyan-950/20 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-96 h-96 bg-red-500/10 top-0 right-0" />
          <div className="glow-orb w-64 h-64 bg-cyan-500/10 bottom-0 left-1/4" />
          <div className="glow-orb w-48 h-48 bg-purple-500/8 top-1/2 left-1/2" />
          <div className="absolute inset-0 cyber-grid opacity-5" />
        </div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">
          {/* Flag + badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-3xl">🇨🇳</span>
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
              {isZh ? "中国版 V4.4" : "China Edition V4.4"}
            </div>
            <span className="text-3xl">🌏</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black rainbow-text mb-2">
            {isZh ? T.hero_title_zh : T.hero_title_en}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-white/80 mb-3 metallic-shimmer">
            {isZh ? T.hero_subtitle_zh : T.hero_subtitle_en}
          </h2>
          <p className="text-xl font-medium text-cyan-400 mb-4">
            {isZh ? T.hero_tagline_zh : T.hero_tagline_en}
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {isZh ? T.hero_desc_zh : T.hero_desc_en}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              onClick={() => navigate("/hope-ai")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-base hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" />
              {isZh ? T.hero_cta_zh : T.hero_cta_en}
            </button>
            <button
              onClick={() => navigate("/sky-school")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {isZh ? T.hero_cta2_zh : T.hero_cta2_en}
            </button>
          </div>

          {/* Advantages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-4xl mx-auto">
            {ADVANTAGES.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.en} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs">
                  <CheckCircle className={`w-3 h-3 ${a.color} flex-shrink-0`} />
                  <span className="text-white/80">{isZh ? a.zh : a.en}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Core Modules */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black rainbow-text mb-2">
            {isZh ? T.modules_title_zh : T.modules_title_en}
          </h2>
          <p className="text-muted-foreground">{isZh ? "六大核心模块，覆盖您的所有数字需求" : "Six core modules covering all your digital needs"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.en}
                onClick={() => navigate(m.route)}
                className={`rounded-xl border ${m.border} ${m.bg} p-5 text-left hover:scale-[1.02] transition-all group`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center border ${m.border}`}>
                    <Icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div>
                    <div className={`font-black text-white text-sm`}>{isZh ? m.zh : m.en}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${m.color} ml-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {isZh ? m.desc_zh : m.desc_en}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(isZh ? m.features_zh : m.features_en).map(f => (
                    <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${m.bg} ${m.color} border ${m.border}`}>
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chinese Integrations */}
      <div className="bg-white/2 border-y border-white/5 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-1">
              {isZh ? T.integrations_zh : T.integrations_en}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isZh ? "无缝集成中国主流平台" : "Seamlessly integrated with China's leading platforms"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {INTEGRATIONS.map(i => (
              <div key={i.name} className={`rounded-xl border ${i.border} ${i.bg} p-3 text-center`}>
                <div className="text-2xl mb-1">{i.icon}</div>
                <div className={`text-xs font-bold ${i.color}`}>{isZh ? i.name : i.en}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 44 Features Grid */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black rainbow-text mb-2">
            {isZh ? T.features_zh : T.features_en}
          </h2>
          <p className="text-muted-foreground">
            {isZh ? "涵盖AI、社交、教育、商业、开发者、创作者、安全与生态" : "Covering AI, Social, Education, Business, Developer, Creator, Security & Ecosystem"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_GROUPS.map(g => {
            const Icon = g.icon;
            const items = isZh ? g.items_zh : g.items_en;
            return (
              <div key={g.en} className={`rounded-xl border border-white/10 ${g.bg} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${g.color}`} />
                  <span className={`text-sm font-bold ${g.color}`}>{isZh ? g.zh : g.en}</span>
                </div>
                <div className="space-y-1.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                      <CheckCircle className={`w-3 h-3 ${g.color} flex-shrink-0`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950/30 via-[#050508] to-cyan-950/20 py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 bg-red-500/10 top-0 left-1/4" />
          <div className="glow-orb w-48 h-48 bg-cyan-500/8 bottom-0 right-1/4" />
        </div>
        <div className="container max-w-3xl mx-auto px-4 text-center relative z-10">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-4">
            {isZh ? T.mission_zh : T.mission_en}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            {isZh ? T.mission_desc_zh : T.mission_desc_en}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/hope-ai")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity"
            >
              <Brain className="w-4 h-4" />
              {isZh ? "体验 Hope AI" : "Try Hope AI"}
            </button>
            <button
              onClick={() => navigate("/sky-school")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {isZh ? "开始学习" : "Start Learning"}
            </button>
            <button
              onClick={() => navigate("/enterprise")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              {isZh ? "企业方案" : "Enterprise"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-white/5 bg-white/2 py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { zh: "44+", en: "44+", label_zh: "核心功能", label_en: "Core Features", color: "text-cyan-400" },
              { zh: "8", en: "8", label_zh: "AI模式", label_en: "AI Modes", color: "text-purple-400" },
              { zh: "8", en: "8", label_zh: "平台集成", label_en: "Platform Integrations", color: "text-green-400" },
              { zh: "全球", en: "Global", label_zh: "覆盖范围", label_en: "Coverage", color: "text-amber-400" },
            ].map(s => (
              <div key={s.label_en}>
                <div className={`text-3xl font-black ${s.color} stat-number`}>{isZh ? s.zh : s.en}</div>
                <div className="text-xs text-muted-foreground mt-1">{isZh ? s.label_zh : s.label_en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
