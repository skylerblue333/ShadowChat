import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen, Star, Zap, Award, Clock, Users, Search,
  GraduationCap, Brain, Coins, Shield, Code, Rocket,
  Bug, Cloud, Cpu, CheckCircle, Terminal, Play
} from "lucide-react";

const COURSES = [
  // Web3
  { id:"blockchain-101", track:"web3", category:"Blockchain", level:"Beginner", icon:"⛓️", title:"Blockchain Fundamentals", description:"Distributed ledgers, consensus, hash functions.", lessons:12, duration:"4h 30m", xpReward:500, skyReward:50, students:28400, rating:4.9, color:"oklch(0.72 0.20 200)", topics:["What is Blockchain?","Distributed Ledgers","Consensus Mechanisms","Hash Functions","Merkle Trees","Smart Contracts Intro","Public vs Private Chains","Layer 1 vs Layer 2","Blockchain Use Cases","Security Fundamentals","Wallets & Keys","Final Assessment"] },
  { id:"defi-mastery", track:"web3", category:"DeFi", level:"Intermediate", icon:"💰", title:"DeFi Mastery", description:"AMMs, yield farming, liquidity pools, protocol mechanics.", lessons:15, duration:"6h 15m", xpReward:800, skyReward:80, students:19200, rating:4.8, color:"oklch(0.72 0.20 140)", topics:["DeFi Overview","Uniswap V3","Curve Finance","Aave & Compound","Yield Strategies","Impermanent Loss","MEV & Arbitrage","Cross-chain Bridges","Risk Management","Portfolio Optimization","Tax Considerations","Advanced Strategies","Protocol Governance","Security Audits","Final Project"] },
  { id:"smart-contracts", track:"web3", category:"Development", level:"Advanced", icon:"📜", title:"Smart Contract Engineering", description:"Write, audit, and deploy production Solidity contracts.", lessons:20, duration:"9h 45m", xpReward:1500, skyReward:150, students:11800, rating:4.9, color:"oklch(0.72 0.20 305)", topics:["Solidity Deep Dive","ERC-20 Tokens","ERC-721 NFTs","ERC-1155","Access Control","Upgradeable Contracts","Gas Optimization","Security Patterns","Reentrancy Attacks","Flash Loan Exploits","Testing with Hardhat","Foundry Framework","Formal Verification","Audit Methodology","Deployment Strategies","Mainnet Forking","Protocol Design","Tokenomics Engineering","DAO Contracts","Final Audit Project"] },
  { id:"web3-security", track:"web3", category:"Security", level:"Advanced", icon:"🛡️", title:"Web3 Security & Auditing", description:"Find and fix vulnerabilities in DeFi protocols.", lessons:18, duration:"8h 20m", xpReward:1400, skyReward:140, students:8900, rating:4.9, color:"oklch(0.72 0.20 30)", topics:["Attack Taxonomy","Reentrancy","Integer Overflow","Access Control Bugs","Oracle Manipulation","Flash Loan Attacks","Front-running","Signature Replay","Proxy Vulnerabilities","Bridge Exploits","Audit Tools","Slither & Mythril","Manual Review","CTF Challenges","Bug Bounty Strategy","Report Writing","Responsible Disclosure","Real Exploit Case Studies"] },
  // Coding Languages
  { id:"python-dev", track:"coding", category:"Python", level:"Beginner", icon:"🐍", title:"Python for Builders", description:"From zero to production — scripts, APIs, automation, data pipelines.", lessons:24, duration:"10h 00m", xpReward:900, skyReward:90, students:45200, rating:4.9, color:"oklch(0.72 0.20 250)", topics:["Python Basics","Data Types & Structures","Functions & Closures","OOP in Python","File I/O","Error Handling","Modules & Packages","Virtual Environments","pip & Poetry","REST APIs with FastAPI","Database with SQLAlchemy","Async/Await","Web Scraping","Data Analysis with Pandas","Visualization","Testing with pytest","Docker for Python","CI/CD Pipelines","CLI Tools","Automation Scripts","Crypto APIs","Bot Development","Deployment","Final Project"] },
  { id:"js-ts-dev", track:"coding", category:"JavaScript/TypeScript", level:"Beginner", icon:"⚡", title:"JavaScript & TypeScript Mastery", description:"Modern JS/TS from fundamentals to full-stack React + Node apps.", lessons:28, duration:"12h 30m", xpReward:1000, skyReward:100, students:52100, rating:4.9, color:"oklch(0.80 0.20 70)", topics:["JS Fundamentals","ES2024 Features","TypeScript Basics","Type System Deep Dive","Generics","Async/Promises","Event Loop","Node.js","Express APIs","React 19","Hooks & Context","tRPC","Prisma ORM","Authentication","Testing with Vitest","Bundling with Vite","Monorepos","Performance","Security","WebSockets","GraphQL","Deployment","Edge Functions","Deno & Bun","Package Publishing","Open Source","Contributing to OSS","Final Full-Stack App"] },
  { id:"rust-dev", track:"coding", category:"Rust", level:"Intermediate", icon:"🦀", title:"Rust Systems Programming", description:"Memory safety, ownership, concurrency, high-performance systems.", lessons:22, duration:"11h 00m", xpReward:1200, skyReward:120, students:14300, rating:4.8, color:"oklch(0.72 0.20 30)", topics:["Ownership & Borrowing","Lifetimes","Traits & Generics","Error Handling","Iterators","Closures","Smart Pointers","Concurrency","Async Rust","Tokio Runtime","CLI Tools","Web APIs with Axum","WebAssembly","FFI","Unsafe Rust","Macros","Testing","Benchmarking","Embedded Rust","Solana Programs","Performance Tuning","Final Systems Project"] },
  { id:"go-dev", track:"coding", category:"Go", level:"Intermediate", icon:"🐹", title:"Go for Backend Engineers", description:"Goroutines, channels, microservices, cloud-native Go.", lessons:18, duration:"8h 00m", xpReward:900, skyReward:90, students:18700, rating:4.7, color:"oklch(0.72 0.20 200)", topics:["Go Fundamentals","Types & Interfaces","Goroutines","Channels","Select Statement","Error Handling","HTTP Servers","REST APIs","gRPC","Database Access","Testing","Benchmarking","Concurrency Patterns","Microservices","Docker & K8s","Observability","Performance","Final Microservice"] },
  { id:"cpp-dev", track:"coding", category:"C++", level:"Advanced", icon:"⚙️", title:"C++ Systems & Performance", description:"Modern C++23, templates, RAII, and high-frequency trading systems.", lessons:20, duration:"10h 30m", xpReward:1300, skyReward:130, students:9800, rating:4.7, color:"oklch(0.72 0.20 160)", topics:["Modern C++ (C++23)","Move Semantics","Smart Pointers","Templates","STL Deep Dive","Memory Management","RAII Pattern","Concurrency","Atomic Operations","Lock-free Data Structures","SIMD Intrinsics","Profiling","HFT Systems","Game Engine Basics","Embedded Systems","WebAssembly","Python Bindings","Testing","CMake & Conan","Final Performance Project"] },
  { id:"solidity-adv", track:"coding", category:"Solidity", level:"Advanced", icon:"💎", title:"Advanced Solidity & EVM", description:"EVM internals, assembly, gas optimization, protocol architecture.", lessons:16, duration:"8h 45m", xpReward:1400, skyReward:140, students:7200, rating:4.9, color:"oklch(0.72 0.20 305)", topics:["EVM Architecture","Opcodes & Gas","Yul Assembly","Storage Layout","Calldata Encoding","Proxy Patterns","Diamond Standard","Account Abstraction","EIP-4337","L2 Development","ZK Circuits Intro","Cross-chain Messaging","MEV Protection","Gas Golf","Formal Verification","Final Protocol Design"] },
  // Ethical Hacking
  { id:"hack-recon", track:"hacking", category:"Reconnaissance", level:"Beginner", icon:"🔍", title:"Recon & OSINT Mastery", description:"Passive/active recon, OSINT frameworks, target profiling.", lessons:14, duration:"5h 30m", xpReward:700, skyReward:70, students:22100, rating:4.8, color:"oklch(0.72 0.20 30)", topics:["Recon Methodology","OSINT Framework","Google Dorking","Shodan & Censys","theHarvester","Maltego","DNS Enumeration","Subdomain Discovery","Email Harvesting","Social Engineering Recon","Dark Web OSINT","Metadata Analysis","Reporting","Legal Boundaries"] },
  { id:"hack-web", track:"hacking", category:"Web Exploitation", level:"Intermediate", icon:"🕷️", title:"Web Application Hacking", description:"OWASP Top 10, SQL injection, XSS, SSRF, modern web exploits.", lessons:20, duration:"9h 00m", xpReward:1100, skyReward:110, students:31400, rating:4.9, color:"oklch(0.72 0.20 20)", topics:["OWASP Top 10","SQL Injection","XSS (Reflected/Stored/DOM)","CSRF","SSRF","XXE Injection","Insecure Deserialization","Broken Auth","IDOR","Path Traversal","Command Injection","File Upload Exploits","JWT Attacks","OAuth Misconfigs","GraphQL Attacks","API Security","Burp Suite Pro","Nuclei Templates","Bug Bounty Methodology","Report Writing"] },
  { id:"hack-network", track:"hacking", category:"Network Security", level:"Intermediate", icon:"🌐", title:"Network Penetration Testing", description:"Network scanning, exploitation, pivoting, post-exploitation.", lessons:18, duration:"8h 30m", xpReward:1000, skyReward:100, students:16800, rating:4.8, color:"oklch(0.72 0.20 200)", topics:["Network Fundamentals","Nmap & Masscan","Service Enumeration","Vulnerability Scanning","Metasploit Framework","Exploitation Techniques","Password Attacks","Pivoting & Tunneling","Active Directory","Kerberoasting","Pass-the-Hash","Lateral Movement","Persistence","Data Exfiltration","Covering Tracks","Wireless Attacks","VPN Bypass","Final Lab Challenge"] },
  { id:"hack-crypto", track:"hacking", category:"Crypto Security", level:"Advanced", icon:"🔐", title:"Cryptography & Crypto Attacks", description:"Break weak crypto, understand PKI, audit cryptographic implementations.", lessons:16, duration:"7h 45m", xpReward:1200, skyReward:120, students:9400, rating:4.9, color:"oklch(0.72 0.20 305)", topics:["Symmetric Encryption","AES Modes & Attacks","RSA & Factoring","Elliptic Curve Crypto","Hash Functions","Length Extension Attacks","Padding Oracle","Timing Attacks","Side-Channel Attacks","TLS/SSL Attacks","Certificate Pinning Bypass","JWT Attacks","Blockchain Crypto","Zero-Knowledge Proofs","Post-Quantum Crypto","Final CTF Challenge"] },
  { id:"hack-malware", track:"hacking", category:"Malware Analysis", level:"Advanced", icon:"🦠", title:"Malware Analysis & Reverse Engineering", description:"Static/dynamic analysis, disassembly, malware development for defense.", lessons:18, duration:"9h 00m", xpReward:1300, skyReward:130, students:7600, rating:4.8, color:"oklch(0.72 0.20 20)", topics:["Malware Types","Static Analysis","Dynamic Analysis","x86/x64 Assembly","Ghidra & IDA Pro","Debugging with x64dbg","Sandbox Evasion","Anti-debugging","Packing & Obfuscation","Rootkits","Ransomware Analysis","RAT Analysis","Dropper Techniques","C2 Frameworks","YARA Rules","Threat Intel","Incident Response","Final Malware Lab"] },
  { id:"hack-ctf", track:"hacking", category:"CTF & Red Team", level:"Advanced", icon:"🚩", title:"CTF & Red Team Operations", description:"Compete in CTFs, run red team engagements, build your hacker portfolio.", lessons:20, duration:"10h 00m", xpReward:1500, skyReward:150, students:12300, rating:4.9, color:"oklch(0.72 0.20 30)", topics:["CTF Methodology","Web Challenges","Crypto Challenges","Reverse Engineering","Binary Exploitation","Forensics","Steganography","OSINT Challenges","Pwn Techniques","Heap Exploitation","ROP Chains","Kernel Exploitation","Red Team Planning","C2 Infrastructure","Phishing Campaigns","Physical Security","Social Engineering","Report Writing","Bug Bounty Platforms","Building Your Portfolio"] },
  // AI / ML
  { id:"ml-fundamentals", track:"ai", category:"Machine Learning", level:"Beginner", icon:"🤖", title:"Machine Learning Fundamentals", description:"Supervised, unsupervised, and reinforcement learning from scratch.", lessons:20, duration:"9h 00m", xpReward:900, skyReward:90, students:38700, rating:4.9, color:"oklch(0.72 0.20 250)", topics:["What is ML?","Linear Regression","Logistic Regression","Decision Trees","Random Forests","SVM","K-Means Clustering","PCA","Neural Networks Intro","Backpropagation","Overfitting & Regularization","Cross-Validation","Feature Engineering","scikit-learn","Model Evaluation","Hyperparameter Tuning","ML Pipelines","Model Deployment","MLOps Basics","Final ML Project"] },
  { id:"llm-engineering", track:"ai", category:"LLMs & AI Agents", level:"Intermediate", icon:"🧠", title:"LLM Engineering & AI Agents", description:"Build production AI agents, RAG systems, multi-modal applications.", lessons:18, duration:"8h 30m", xpReward:1100, skyReward:110, students:0, rating:4.9, color:"oklch(0.72 0.20 305)", topics:["LLM Architecture","Prompt Engineering","Few-shot Learning","Chain-of-Thought","RAG Systems","Vector Databases","LangChain & LlamaIndex","Function Calling","Tool Use","Multi-Agent Systems","Memory & Context","Fine-tuning","RLHF","Evaluation Frameworks","Safety & Alignment","Production Deployment","Cost Optimization","Final AI Agent Project"] },
  { id:"ai-agents-crypto", track:"ai", category:"AI + Crypto", level:"Advanced", icon:"🤖💰", title:"AI Agents for Crypto Trading", description:"Autonomous trading bots, sentiment analyzers, DeFi automation agents.", lessons:16, duration:"8h 00m", xpReward:1400, skyReward:140, students:11200, rating:4.9, color:"oklch(0.80 0.20 70)", topics:["Trading Bot Architecture","Market Data APIs","Technical Analysis","Sentiment Analysis","On-chain Data","DeFi Protocol Integration","Arbitrage Bots","MEV Bots","Risk Management","Backtesting","Paper Trading","Live Deployment","Monitoring & Alerts","Portfolio Rebalancing","Tax Automation","Final Trading Bot"] },
  // DevOps
  { id:"docker-k8s", track:"devops", category:"Containers", level:"Intermediate", icon:"🐳", title:"Docker & Kubernetes Mastery", description:"Containerize apps, orchestrate at scale, deploy to production clusters.", lessons:16, duration:"7h 30m", xpReward:900, skyReward:90, students:29800, rating:4.8, color:"oklch(0.72 0.20 200)", topics:["Docker Fundamentals","Dockerfile Best Practices","Multi-stage Builds","Docker Compose","Container Networking","Volume Management","K8s Architecture","Pods & Deployments","Services & Ingress","ConfigMaps & Secrets","Helm Charts","Auto-scaling","Rolling Updates","Monitoring with Prometheus","Logging with ELK","Final Production Cluster"] },
  { id:"cicd-devops", track:"devops", category:"CI/CD", level:"Intermediate", icon:"🔄", title:"CI/CD & DevSecOps", description:"Automate testing, security scanning, and deployment pipelines.", lessons:14, duration:"6h 00m", xpReward:800, skyReward:80, students:22400, rating:4.7, color:"oklch(0.72 0.20 140)", topics:["CI/CD Concepts","GitHub Actions","GitLab CI","Jenkins","Automated Testing","SAST & DAST","Dependency Scanning","Container Scanning","Secret Management","Blue/Green Deployments","Canary Releases","Feature Flags","Observability","Final Pipeline Project"] },
  // 中国版 China Edition Tracks
  { id:"ai-learning-cn", track:"china", category:"AI学习", level:"Beginner", icon:"🤖", title:"AI学习入门 · AI Learning Fundamentals", description:"人工智能基础、机器学习、深度学习。AI basics, machine learning, deep learning for Chinese learners.", lessons:20, duration:"10h 00m", xpReward:900, skyReward:90, students:52000, rating:4.9, color:"oklch(0.72 0.20 200)", topics:["什么是AI","机器学习基础","神经网络","深度学习","ChatGPT应用","提示词工程","AI工具应用","AI作画","AI音乐","AI视频","AI写作","AI翻译","AI编程","AI安全","AI伦理","AI业务应用","AI创业","未来趋势","AI实验项目","毕业证书"] },
  { id:"startup-cn", track:"china", category:"创业学院", level:"Intermediate", icon:"🚀", title:"创业学院 · Entrepreneurship Academy", description:"商业模式、融资、产品设计、团队管理。Business models, fundraising, product design, team management.", lessons:18, duration:"9h 00m", xpReward:1000, skyReward:100, students:31000, rating:4.8, color:"oklch(0.72 0.20 70)", topics:["商业模式画布","市场调研","产品设计","MVP构建","用户增长","融资路径","VC投资逻辑","团队管理","运营策略","品牌建设","数字营销","财务管理","法律合规","出海策略","成功案例","创业失败教训","创业项目实战","毕业展示"] },
  { id:"english-cn", track:"china", category:"英语学习", level:"Beginner", icon:"🇬🇧", title:"商务英语 · Business English", description:"商务英语、展示技巧、邮件写作、国际会议。Business English for Chinese professionals.", lessons:16, duration:"8h 00m", xpReward:700, skyReward:70, students:88000, rating:4.8, color:"oklch(0.72 0.20 140)", topics:["商务邮件","会议英语","展示技巧","谈判英语","商务写作","电话英语","LinkedIn英语","面试英语","行业术语","文化差异","演讲技巧","英语写作","商务文书","国际贸易英语","英语面试实战","毕业证书"] },
  { id:"chinese-intl", track:"china", category:"中文学习", level:"Beginner", icon:"🇨🇳", title:"中文商务课 · Business Chinese", description:"Mandarin for international business, HSK prep, professional communication.", lessons:16, duration:"8h 00m", xpReward:700, skyReward:70, students:44000, rating:4.9, color:"oklch(0.72 0.20 30)", topics:["Pinyin & Tones","Basic Greetings","Business Vocabulary","Meeting Chinese","Email Writing","Phone Calls","Negotiation","Numbers & Finance","HSK 1-3 Prep","Cultural Context","WeChat Business","Formal Writing","Presentations","Industry Terms","HSK 4-5 Prep","Certificate Exam"] },
  { id:"cert-cloud-cn", track:"china", category:"认证路径", level:"Intermediate", icon:"🏅", title:"云计算认证 · Cloud Certification Path", description:"阿里云ACA/ACP、腾讯云TCE、华为云HCIA认证备考。Alibaba Cloud, Tencent Cloud, Huawei Cloud certifications.", lessons:20, duration:"10h 00m", xpReward:1200, skyReward:120, students:27000, rating:4.8, color:"oklch(0.72 0.20 250)", topics:["云计算基础","阿里云架构","ECS云服务器","OSS对象存储","RDS数据库","CDN加速","负载均衡","安全组","VPC网络","监控报警","自动伸缩","Serverless","容器服务","DevOps工具","ACA考试备考","ACP考试备考","TCE考试备考","HCIA考试备考","模拟考试","证书考试"] },
];

const TRACKS = [
  { id:"all", name:"All Tracks", icon:BookOpen, color:"oklch(0.72 0.20 200)" },
  { id:"web3", name:"Web3 & DeFi", icon:Coins, color:"oklch(0.72 0.20 140)" },
  { id:"coding", name:"Coding Languages", icon:Code, color:"oklch(0.72 0.20 250)" },
  { id:"hacking", name:"Ethical Hacking", icon:Bug, color:"oklch(0.72 0.20 30)" },
  { id:"ai", name:"AI & ML", icon:Brain, color:"oklch(0.72 0.20 305)" },
  { id:"devops", name:"DevOps & Cloud", icon:Cloud, color:"oklch(0.72 0.20 200)" },
  { id:"china", name:"🇨🇳 China Edition", icon:GraduationCap, color:"oklch(0.72 0.20 30)" },
];

const LEVEL_COLORS: Record<string,string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const LEARNING_PATHS = [
  { id:"full-stack-web3", name:"Full-Stack Web3 Dev", icon:"🚀", desc:"Python → JS/TS → Solidity → Smart Contracts → DeFi", courses:["python-dev","js-ts-dev","solidity-adv","smart-contracts","defi-mastery"], xp:5200, sky:520 },
  { id:"ethical-hacker", name:"Certified Ethical Hacker", icon:"🎯", desc:"Recon → Web Hacking → Network → Crypto → CTF", courses:["hack-recon","hack-web","hack-network","hack-crypto","hack-ctf"], xp:5500, sky:550 },
  { id:"ai-engineer", name:"AI Engineer", icon:"🤖", desc:"ML Fundamentals → LLM Engineering → AI Agents", courses:["ml-fundamentals","llm-engineering","ai-agents-crypto"], xp:3400, sky:340 },
  { id:"defi-developer", name:"DeFi Protocol Developer", icon:"💎", desc:"Blockchain → Smart Contracts → Security → DeFi", courses:["blockchain-101","smart-contracts","web3-security","defi-mastery"], xp:4200, sky:420 },
  { id:"rust-systems", name:"Rust Systems Engineer", icon:"🦀", desc:"Rust → C++ → Go → Docker/K8s", courses:["rust-dev","cpp-dev","go-dev","docker-k8s"], xp:4300, sky:430 },
  { id:"crypto-trader-ai", name:"AI Crypto Trader", icon:"📈", desc:"Python → ML → AI Agents → Crypto Trading", courses:["python-dev","ml-fundamentals","ai-agents-crypto"], xp:3200, sky:320 },
];

export default function SkySchool() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTrack, setActiveTrack] = useState("all");
  const [tab, setTab] = useState("courses");
  const [expanded, setExpanded] = useState<string|null>(null);

  const { data: progress } = trpc.school.getProgress.useQuery(undefined, { enabled: isAuthenticated });
  const enrollMutation = trpc.school.enroll.useMutation({
    onSuccess: () => toast.success("Enrolled! Start learning and earn SKY444."),
    onError: () => toast.error("Enrollment failed"),
  });

  const filtered = COURSES.filter(c => {
    const matchTrack = activeTrack === "all" || c.track === activeTrack;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    return matchTrack && matchSearch;
  });

  const totalSky = COURSES.reduce((s,c) => s+c.skyReward, 0);
  const totalHours = Math.round(COURSES.reduce((s,c) => s+parseFloat(c.duration), 0));

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* ═══ CINEMATIC SKYSCHOOL HERO ═══ */}
      <div className="hero-cinematic border-b border-slate-800/60" style={{ minHeight: 340 }}>
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="glow-orb glow-orb-purple w-96 h-96 -top-10 left-1/3 animate-hero-float" />
        <div className="glow-orb glow-orb-cyan w-64 h-64 top-10 right-10 animate-hero-float" style={{ animationDelay: '2.5s' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-300 text-sm font-bold mb-6 animate-scale-in">
            <GraduationCap className="w-4 h-4" />
            SKY Academy — Learn, Earn, Build
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight text-rainbow">
            <span className="text-gradient-psychedelic" style={{ backgroundSize: '300% 100%' }}>Master Web3,</span>
            <br />
            <span className="text-white">Code &amp; Hacking</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8 desc-metallic">
            {COURSES.length} courses &middot; {totalHours}+ hours &middot; Earn up to{' '}
            <span className="text-amber-400 font-bold">{totalSky.toLocaleString()} SKY444</span>
            {' '}&middot; Blockchain-verified certificates
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {[
              { icon: Code,  label: '6 Coding Languages', color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { icon: Bug,   label: 'Ethical Hacking',    color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
              { icon: Brain, label: 'AI & ML',            color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
              { icon: Coins, label: 'Web3 & DeFi',        color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              { icon: Cloud, label: 'DevOps & Cloud',     color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border ${item.bg}`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
          {progress && (
            <div className="inline-flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm">
              <div className="text-left">
                <p className="text-xs text-slate-500 mb-1">Your XP</p>
                <p className="text-xl font-black text-purple-400">{(progress.totalXp || 0).toLocaleString()}</p>
              </div>
              <div className="w-32">
                <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${Math.min(100, ((progress.totalXp || 0) % 1000) / 10)}%` }} /></div>
                <p className="text-[10px] text-slate-600 mt-1">Level {Math.floor((progress.totalXp || 0) / 1000) + 1}</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 mb-1">SKY444 Earned</p>
                <p className="text-xl font-black text-amber-400">{(progress.totalSkyEarned || 0).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{label:"Courses",value:COURSES.length,icon:BookOpen,color:"text-purple-400"},{label:"Hours of Content",value:`${totalHours}+`,icon:Clock,color:"text-cyan-400"},{label:"SKY444 Earnable",value:totalSky.toLocaleString(),icon:Zap,color:"text-yellow-400"},{label:"Active Students",value:"180K+",icon:Users,color:"text-green-400"}].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div><p className="text-xl font-bold text-white">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"><BookOpen className="w-3.5 h-3.5 mr-1.5" />All Courses</TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"><Rocket className="w-3.5 h-3.5 mr-1.5" />Learning Paths</TabsTrigger>
            <TabsTrigger value="hacking" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300"><Bug className="w-3.5 h-3.5 mr-1.5" />Ethical Hacking</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"><Brain className="w-3.5 h-3.5 mr-1.5" />AI & ML</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {TRACKS.map(track => (
                  <button key={track.id} onClick={() => setActiveTrack(track.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTrack===track.id?"bg-purple-500/20 text-purple-300 border border-purple-500/30":"bg-white/5 text-slate-400 hover:text-white border border-transparent"}`}>
                    <track.icon className="w-3.5 h-3.5" />{track.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(course => (
                <Card key={course.id} className="bg-[#0e0a1a]/90 border border-white/5 hover:border-purple-500/30 transition-all duration-200 overflow-hidden group cursor-pointer" onClick={() => setExpanded(expanded===course.id?null:course.id)}>
                  <div className="h-1.5 w-full" style={{ background:course.color }} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{course.icon}</span>
                        <div>
                          <Badge className={`text-[10px] px-1.5 py-0.5 ${LEVEL_COLORS[course.level]}`}>{course.level}</Badge>
                          <p className="text-[10px] text-slate-500 mt-0.5">{course.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs"><Star className="w-3 h-3 fill-yellow-400" />{course.rating}</div>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-xs mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.students/1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center gap-0.5"><Zap className="w-3 h-3" />+{course.skyReward} SKY</span>
                        <span className="text-xs text-purple-400 flex items-center gap-0.5"><Award className="w-3 h-3" />+{course.xpReward} XP</span>
                      </div>
                      <Button size="sm" className="h-7 text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30" onClick={e => { e.stopPropagation(); if(!isAuthenticated){toast.error("Sign in to enroll");return;} enrollMutation.mutate({courseId:0}); }}>
                        Enroll Free
                      </Button>
                    </div>
                    {expanded===course.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-slate-400 font-semibold mb-2">What you'll learn:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {course.topics.slice(0,8).map((topic,i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-slate-500">
                              <CheckCircle className="w-2.5 h-2.5 text-green-500 shrink-0" />{topic}
                            </div>
                          ))}
                          {course.topics.length>8 && <p className="text-xs text-slate-600 col-span-2">+{course.topics.length-8} more topics</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filtered.length===0 && (
              <div className="text-center py-16 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No courses found for "{search}"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paths">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEARNING_PATHS.map(path => {
                const pathCourses = path.courses.map(id => COURSES.find(c => c.id===id)).filter(Boolean) as typeof COURSES;
                return (
                  <Card key={path.id} className="bg-[#0e0a1a]/90 border border-white/5 hover:border-cyan-500/30 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">{path.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-base">{path.name}</h3>
                          <p className="text-slate-500 text-xs mt-0.5">{path.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1"><Zap className="w-3 h-3" />+{path.sky} SKY</span>
                        <span className="text-xs text-purple-400 flex items-center gap-1"><Award className="w-3 h-3" />+{path.xp.toLocaleString()} XP</span>
                        <span className="text-xs text-slate-500">{path.courses.length} courses</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {pathCourses.map((course,i) => (
                          <div key={course.id} className="flex items-center gap-2 text-xs">
                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-slate-500 font-bold shrink-0">{i+1}</div>
                            <span className="text-slate-300">{course.title}</span>
                            <span className="text-slate-600 ml-auto">{course.duration}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-300 border border-cyan-500/20 text-sm" onClick={() => { if(!isAuthenticated){toast.error("Sign in to start");return;} toast.success(`Starting ${path.name}!`); }}>
                        <Rocket className="w-4 h-4 mr-2" />Start Learning Path
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="hacking">
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold text-sm">Ethical Hacking — Legal & Responsible Use Only</p>
                  <p className="text-red-400/70 text-xs mt-1">All techniques are for authorized penetration testing, bug bounty hunting, and defensive security. Unauthorized access is illegal. By enrolling you agree to ethical and legal use only.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COURSES.filter(c => c.track==="hacking").map(course => (
                <Card key={course.id} className="bg-[#0e0a1a]/90 border border-white/5 hover:border-red-500/30 transition-all overflow-hidden group cursor-pointer" onClick={() => setExpanded(expanded===course.id?null:course.id)}>
                  <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-orange-500" />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{course.icon}</span>
                      <Badge className={`text-[10px] px-1.5 py-0.5 ${LEVEL_COLORS[course.level]}`}>{course.level}</Badge>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-red-300 transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-xs mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>{course.lessons} lessons</span><span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 font-semibold">+{course.skyReward} SKY</span>
                      <Button size="sm" className="h-7 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30" onClick={e => { e.stopPropagation(); toast.success("Enrolled!"); }}>Enroll</Button>
                    </div>
                    {expanded===course.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-1">
                          {course.topics.slice(0,8).map((topic,i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-slate-500">
                              <Terminal className="w-2.5 h-2.5 text-red-500 shrink-0" />{topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300 font-semibold text-sm">AI & ML Track — Build the Future</p>
                <p className="text-purple-400/70 text-xs mt-1">From ML fundamentals to deploying production AI agents. Build autonomous trading bots, RAG systems, and multi-modal AI applications that earn real crypto.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COURSES.filter(c => c.track==="ai").map(course => (
                <Card key={course.id} className="bg-[#0e0a1a]/90 border border-white/5 hover:border-purple-500/30 transition-all overflow-hidden group cursor-pointer" onClick={() => setExpanded(expanded===course.id?null:course.id)}>
                  <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-500" />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{course.icon}</span>
                      <Badge className={`text-[10px] px-1.5 py-0.5 ${LEVEL_COLORS[course.level]}`}>{course.level}</Badge>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-xs mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>{course.lessons} lessons</span><span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 font-semibold">+{course.skyReward} SKY</span>
                      <Button size="sm" className="h-7 text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30" onClick={e => { e.stopPropagation(); toast.success("Enrolled in AI course!"); }}>Enroll</Button>
                    </div>
                    {expanded===course.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-1">
                          {course.topics.slice(0,8).map((topic,i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-slate-500">
                              <Cpu className="w-2.5 h-2.5 text-purple-500 shrink-0" />{topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
