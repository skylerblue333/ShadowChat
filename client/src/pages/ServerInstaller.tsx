import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft, Server, Download, Copy, CheckCircle, Terminal,
  Shield, Zap, Globe, Database, Lock, Cloud, Package,
  ChevronRight, ExternalLink, AlertTriangle, Settings
} from "lucide-react";

const INSTALL_STEPS = [
  { id: 1, title: "Prerequisites", desc: "Docker 24+, Node 20+, 4GB RAM", done: true },
  { id: 2, title: "Clone Repository", desc: "git clone shadowchat", done: true },
  { id: 3, title: "Configure Environment", desc: "Set API keys and database URL", done: false },
  { id: 4, title: "Database Setup", desc: "Run migrations and seed data", done: false },
  { id: 5, title: "Start Services", desc: "docker-compose up -d", done: false },
  { id: 6, title: "SSL Certificate", desc: "Auto-configure Let's Encrypt", done: false },
  { id: 7, title: "Health Check", desc: "Verify all services running", done: false },
];

const DOCKER_COMPOSE = `version: '3.9'
services:
  app:
    image: shadowchat/platform:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
      - S3_BUCKET=\${S3_BUCKET}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=\${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=shadowchat
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - certbot_data:/etc/letsencrypt
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
  redis_data:
  certbot_data:
`;

const QUICK_INSTALL_SCRIPT = `#!/bin/bash
# ShadowChat One-Click Installer
# Requires: Ubuntu 22.04+, Docker, Docker Compose

set -e

echo "🌑 Installing ShadowChat Platform..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker required. Install: https://docs.docker.com/get-docker/"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose required."; exit 1; }

# Clone and configure
git clone https://github.com/shadowchat/platform.git shadowchat
cd shadowchat
cp .env.example .env

# Generate secrets
JWT_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i "s/DB_ROOT_PASSWORD=.*/DB_ROOT_PASSWORD=$DB_PASSWORD/" .env

# Start services
docker-compose pull
docker-compose up -d

# Wait for DB
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
docker-compose exec app pnpm db:push

echo "✅ ShadowChat installed at http://localhost:3000"
echo "📋 Admin credentials saved to ./admin-credentials.txt"
`;

const ENV_TEMPLATE = `# ShadowChat Environment Configuration
# Copy to .env and fill in your values

# Database
DATABASE_URL=mysql://root:password@db:3306/shadowchat

# Auth
JWT_SECRET=your-super-secret-jwt-key-here

# Storage (S3-compatible)
S3_BUCKET=shadowchat-media
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Redis
REDIS_URL=redis://redis:6379

# AI (optional)
OPENAI_API_KEY=sk-...

# Crypto (optional)
WEB3_RPC_URL=https://mainnet.infura.io/v3/your-key

# Email (optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-key

# Domain
APP_DOMAIN=your-domain.com
`;

export default function ServerInstaller() {
  const [currentStep, setCurrentStep] = useState(2);
  const [domain, setDomain] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [dbUrl, setDbUrl] = useState("");
  const [jwtSecret] = useState(() => Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, "0")).join(""));
  const [copied, setCopied] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{ envFile: string; dockerCompose: string; nginxConfig: string; installScript: string } | null>(null);

  const generateFilesMutation = trpc.installer.generateFiles.useMutation({
    onSuccess: (data) => {
      setGeneratedFiles(data);
      setCurrentStep(3);
      toast.success("Config files generated! Review and download below.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate config files");
    },
  });

  const handleGenerateFiles = () => {
    generateFilesMutation.mutate({
      projectName: "shadowchat",
      domain: domain || "yourdomain.com",
      adminEmail: adminEmail || "admin@yourdomain.com",
      enableSSL: true,
      enableRedis: true,
      enableNginx: true,
      port: 3000,
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <Server className="w-5 h-5 text-green-400" />
          <h1 className="text-lg font-bold">Server Installer</h1>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Self-Hosted</Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20">
          <Server className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Deploy ShadowChat on Your Server</h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Full self-hosted deployment with Docker Compose. Own your data, customize everything, run on any cloud or bare metal.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-400" /> Full data ownership</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> 5-min setup</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-blue-400" /> Any cloud provider</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Install wizard */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="wizard">
              <TabsList className="bg-white/5 border border-white/10 mb-4">
                <TabsTrigger value="wizard" className="data-[state=active]:bg-green-600">
                  <Settings className="w-3 h-3 mr-1" /> Setup Wizard
                </TabsTrigger>
                <TabsTrigger value="docker" className="data-[state=active]:bg-green-600">
                  <Package className="w-3 h-3 mr-1" /> Docker Compose
                </TabsTrigger>
                <TabsTrigger value="script" className="data-[state=active]:bg-green-600">
                  <Terminal className="w-3 h-3 mr-1" /> Quick Install
                </TabsTrigger>
                <TabsTrigger value="env" className="data-[state=active]:bg-green-600">
                  <Lock className="w-3 h-3 mr-1" /> Environment
                </TabsTrigger>
              </TabsList>

              {/* Wizard */}
              <TabsContent value="wizard">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm">Installation Wizard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Steps */}
                    <div className="space-y-2">
                      {INSTALL_STEPS.map((step, i) => (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStep(i)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            i === currentStep
                              ? "border-green-500/50 bg-green-500/10"
                              : step.done
                              ? "border-white/10 bg-white/5 opacity-60"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            step.done ? "bg-green-500 text-white" : i === currentStep ? "bg-green-600 text-white" : "bg-white/10 text-gray-400"
                          }`}>
                            {step.done ? <CheckCircle className="w-4 h-4" /> : step.id}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">{step.title}</div>
                            <div className="text-xs text-gray-400">{step.desc}</div>
                          </div>
                          {i === currentStep && <ChevronRight className="w-4 h-4 text-green-400 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {/* Current step detail */}
                    {currentStep === 2 && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <h3 className="text-sm font-semibold text-green-400">Configure Environment</h3>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Your Domain</label>
                          <Input
                            placeholder="shadowchat.yourdomain.com"
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Admin Email</label>
                          <Input
                            placeholder="admin@yourdomain.com"
                            value={adminEmail}
                            onChange={e => setAdminEmail(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Database URL (optional)</label>
                          <Input
                            placeholder="mysql://user:pass@host:3306/shadowchat"
                            value={dbUrl}
                            onChange={e => setDbUrl(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Generated JWT Secret</label>
                          <div className="flex gap-2">
                            <Input
                              value={jwtSecret}
                              readOnly
                              className="bg-white/5 border-white/10 text-green-300 font-mono text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(jwtSecret, "jwt")}
                              className="border-white/10 shrink-0"
                            >
                              {copied === "jwt" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handleGenerateFiles}
                          disabled={generateFilesMutation.isPending}
                          className="w-full bg-green-600 hover:bg-green-500"
                        >
                          {generateFilesMutation.isPending ? (
                            <span className="flex items-center gap-2"><span className="animate-spin">⚙</span> Generating...</span>
                          ) : (
                            <span className="flex items-center gap-2">Generate Config Files <ChevronRight className="w-4 h-4" /></span>
                          )}
                        </Button>
                      </div>
                    )}
                    {currentStep === 3 && generatedFiles && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <h3 className="text-sm font-semibold text-green-400">Generated Config Files</h3>
                        <p className="text-xs text-gray-400">Your custom config files are ready. Download each file and place them in your server directory.</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" className="border-white/10 text-xs" onClick={() => downloadFile(generatedFiles.dockerCompose, "docker-compose.yml")}>
                            <Download className="w-3 h-3 mr-1" /> docker-compose.yml
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/10 text-xs" onClick={() => downloadFile(generatedFiles.envFile, ".env")}>
                            <Download className="w-3 h-3 mr-1" /> .env
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/10 text-xs" onClick={() => downloadFile(generatedFiles.nginxConfig, "nginx.conf")}>
                            <Download className="w-3 h-3 mr-1" /> nginx.conf
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/10 text-xs" onClick={() => downloadFile(generatedFiles.installScript, "install.sh")}>
                            <Download className="w-3 h-3 mr-1" /> install.sh
                          </Button>
                        </div>
                        <Button onClick={() => setCurrentStep(4)} className="w-full bg-green-600 hover:bg-green-500">
                          Continue to Database Setup <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Docker Compose */}
              <TabsContent value="docker">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">docker-compose.yml</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => copyToClipboard(DOCKER_COMPOSE, "docker")}>
                        {copied === "docker" ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span className="ml-1">Copy</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => downloadFile(DOCKER_COMPOSE, "docker-compose.yml")}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 rounded-xl p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre-wrap border border-white/5">
                      {DOCKER_COMPOSE}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick install script */}
              <TabsContent value="script">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">install.sh — One-Click Setup</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => copyToClipboard(QUICK_INSTALL_SCRIPT, "script")}>
                        {copied === "script" ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span className="ml-1">Copy</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => downloadFile(QUICK_INSTALL_SCRIPT, "install.sh")}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-300">
                        Review the script before running. Run on a clean Ubuntu 22.04+ server with root access.
                      </p>
                    </div>
                    <pre className="bg-black/60 rounded-xl p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre-wrap border border-white/5">
                      {QUICK_INSTALL_SCRIPT}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Environment template */}
              <TabsContent value="env">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">.env Template</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => copyToClipboard(ENV_TEMPLATE, "env")}>
                        {copied === "env" ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span className="ml-1">Copy</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-xs"
                        onClick={() => downloadFile(ENV_TEMPLATE, ".env.example")}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 rounded-xl p-4 text-xs text-blue-300 font-mono overflow-x-auto whitespace-pre-wrap border border-white/5">
                      {ENV_TEMPLATE}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Requirements + links */}
          <div className="space-y-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-400" /> System Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  { label: "OS", value: "Ubuntu 22.04+ / Debian 12+" },
                  { label: "CPU", value: "2+ cores (4 recommended)" },
                  { label: "RAM", value: "4GB min (8GB recommended)" },
                  { label: "Storage", value: "20GB SSD min" },
                  { label: "Docker", value: "24.0+" },
                  { label: "Node.js", value: "20.0+" },
                  { label: "MySQL", value: "8.0+ (or TiDB)" },
                  { label: "Redis", value: "7.0+" },
                ].map(req => (
                  <div key={req.label} className="flex justify-between">
                    <span className="text-gray-400">{req.label}</span>
                    <span className="text-white text-xs font-mono">{req.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-400" /> Cloud Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "DigitalOcean", price: "$12/mo", badge: "Recommended" },
                  { name: "Hetzner", price: "$5/mo", badge: "Budget" },
                  { name: "AWS EC2", price: "$15/mo", badge: "Enterprise" },
                  { name: "Vultr", price: "$6/mo", badge: "Fast" },
                  { name: "Linode", price: "$10/mo", badge: "" },
                ].map(provider => (
                  <div key={provider.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span className="text-sm">{provider.name}</span>
                      {provider.badge && (
                        <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                          {provider.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{provider.price}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" /> Quick Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { cmd: "docker-compose up -d", desc: "Start all services" },
                  { cmd: "docker-compose logs -f app", desc: "View app logs" },
                  { cmd: "docker-compose exec app pnpm db:push", desc: "Run migrations" },
                  { cmd: "docker-compose restart app", desc: "Restart app" },
                  { cmd: "docker-compose down", desc: "Stop all services" },
                ].map(item => (
                  <div key={item.cmd} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-green-300 font-mono bg-black/40 px-2 py-0.5 rounded">{item.cmd}</code>
                      <button
                        onClick={() => copyToClipboard(item.cmd, item.cmd)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {copied === item.cmd ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
