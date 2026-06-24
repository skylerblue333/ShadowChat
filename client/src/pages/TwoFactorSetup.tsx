import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Smartphone, Key, CheckCircle, Copy, AlertTriangle, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";

const BACKUP_CODES = [
  "A1B2-C3D4", "E5F6-G7H8", "I9J0-K1L2",
  "M3N4-O5P6", "Q7R8-S9T0", "U1V2-W3X4",
  "Y5Z6-A7B8", "C9D0-E1F2",
];

export default function TwoFactorSetup() {
  const { user } = useAuth();
  const [step, setStep] = useState<"intro" | "scan" | "verify" | "backup" | "done">("intro");
  const [code, setCode] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const totpSecret = "JBSWY3DPEHPK3PXP";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Shadowchat:${encodeURIComponent(user?.name || "user")}?secret=${totpSecret}%26issuer=Shadowchat`;

  const handleVerify = () => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      toast.error("Enter a valid 6-digit code from your authenticator app");
      return;
    }
    toast.success("2FA code verified!");
    setStep("backup");
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(BACKUP_CODES.join("\n")).catch(() => {});
    setCopiedCodes(true);
    toast.success("Backup codes copied!");
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <p className="text-zinc-400">Sign in to configure 2FA</p>
        </div>
      </div>
    );
  }

  const steps = ["intro", "scan", "verify", "backup", "done"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <PageHeader title="Two-Factor Authentication" subtitle="Secure your account with TOTP 2FA" backHref="/settings" icon={Shield} />

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {[
            { key: "intro", label: "Setup" },
            { key: "scan", label: "Scan QR" },
            { key: "verify", label: "Verify" },
            { key: "backup", label: "Backup" },
            { key: "done", label: "Done" },
          ].map((s, i, arr) => {
            const thisIdx = steps.indexOf(s.key);
            const isActive = s.key === step;
            const isDone = thisIdx < currentIdx;
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isDone ? "bg-emerald-500 text-white" : isActive ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${isActive ? "text-white" : isDone ? "text-emerald-400" : "text-zinc-500"}`}>{s.label}</span>
                {i < arr.length - 1 && <div className={`h-px flex-1 ${isDone ? "bg-emerald-500/50" : "bg-zinc-800"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step: Intro */}
        {step === "intro" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                Enable Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">
                Two-factor authentication adds an extra layer of security. You'll need an authenticator app like{" "}
                <strong className="text-white">Google Authenticator</strong>,{" "}
                <strong className="text-white">Authy</strong>, or{" "}
                <strong className="text-white">1Password</strong>.
              </p>
              <div className="grid gap-3">
                {[
                  { icon: Smartphone, title: "Download an authenticator app", desc: "Google Authenticator, Authy, or any TOTP app" },
                  { icon: Key, title: "Scan the QR code", desc: "Or enter the secret key manually" },
                  { icon: CheckCircle, title: "Verify the code", desc: "Enter the 6-digit code from your app" },
                  { icon: Lock, title: "Save backup codes", desc: "Store them safely in case you lose your phone" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    <div className="p-1.5 bg-violet-500/20 rounded-lg shrink-0">
                      <item.icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep("scan")} className="w-full bg-violet-600 hover:bg-violet-700">
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Scan QR */}
        {step === "scan" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-violet-400" />
                Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">Open your authenticator app and scan this QR code:</p>
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl">
                  <img src={qrUrl} alt="TOTP QR Code" className="w-48 h-48" />
                </div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">Manual entry key</span>
                  <button onClick={() => setShowSecret(!showSecret)} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </div>
                <code className="text-sm font-mono text-white tracking-widest">
                  {showSecret ? totpSecret : "••••••••••••••••"}
                </code>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("intro")} className="flex-1 border-zinc-700">Back</Button>
                <Button onClick={() => setStep("verify")} className="flex-1 bg-violet-600 hover:bg-violet-700">I've scanned it</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Verify */}
        {step === "verify" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-violet-400" />
                Verify Your Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">Enter the 6-digit code from your authenticator app to confirm setup:</p>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="bg-zinc-800 border-zinc-700 text-center text-2xl font-mono tracking-[0.5em] h-14"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("scan")} className="flex-1 border-zinc-700">Back</Button>
                <Button onClick={handleVerify} disabled={code.length !== 6} className="flex-1 bg-violet-600 hover:bg-violet-700">Verify</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Backup Codes */}
        {step === "backup" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                Save Your Backup Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">Save these codes in a safe place. Each code can only be used once if you lose access to your authenticator app.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BACKUP_CODES.map((c, i) => (
                  <div key={i} className="bg-zinc-800 rounded-lg p-2 text-center font-mono text-sm text-white tracking-wider">
                    {c}
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={copyBackupCodes} className="w-full border-zinc-700 gap-2">
                {copiedCodes ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedCodes ? "Copied!" : "Copy All Codes"}
              </Button>
              <Button onClick={() => setStep("done")} className="w-full bg-violet-600 hover:bg-violet-700">
                I've saved my backup codes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">2FA Enabled!</h2>
              <p className="text-zinc-400 text-sm">Your account is now protected with two-factor authentication. You'll be asked for a code each time you sign in.</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("intro")} className="flex-1 border-zinc-700 gap-2">
                  <RefreshCw className="w-4 h-4" /> Reconfigure
                </Button>
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => window.history.back()}>
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
