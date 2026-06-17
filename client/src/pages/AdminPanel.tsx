import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Lock, Shield, Eye, EyeOff } from "lucide-react";

export default function AdminPanel() {
  const [lockedFeatures, setLockedFeatures] = useState<string[]>(["ai-code-feed", "admin-panel", "grey-area-tools"]);
  const [contentFilter, setContentFilter] = useState("moderate");
  const [ageVerification, setAgeVerification] = useState(true);

  const demoFeatures = [
    { id: "ai-code-feed", name: "AI Code Generation Feed", risk: "high", locked: true },
    { id: "admin-panel", name: "Admin Panel", risk: "critical", locked: true },
    { id: "grey-area-tools", name: "Grey Area Tools", risk: "high", locked: true },
    { id: "escrow-shop", name: "Escrow Shop", risk: "medium", locked: false },
    { id: "trading", name: "Day Trade Room", risk: "medium", locked: false },
    { id: "marketplace", name: "Marketplace", risk: "low", locked: false },
  ];

  const toggleLock = (featureId: string) => {
    setLockedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Control Panel</h1>
        <p className="text-gray-400 mb-8">Manage demo access, content moderation, and feature locks</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Security Status */}
          <Card className="p-6 bg-slate-800/50 border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Security Status</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Locked Features: <span className="text-green-400 font-bold">{lockedFeatures.length}</span></p>
              <p className="text-sm text-gray-300">Content Filter: <span className="text-cyan-400 font-bold capitalize">{contentFilter}</span></p>
              <p className="text-sm text-gray-300">Age Verification: <span className={ageVerification ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{ageVerification ? "Enabled" : "Disabled"}</span></p>
            </div>
          </Card>

          {/* Content Moderation */}
          <Card className="p-6 bg-slate-800/50 border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Content Moderation</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter Level</label>
                <select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="strict">Strict (No NSFW)</option>
                  <option value="moderate">Moderate (Warnings)</option>
                  <option value="permissive">Permissive (All Content)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageVerification}
                  onChange={(e) => setAgeVerification(e.target.checked)}
                  className="rounded"
                />
                Age Verification Required
              </label>
            </div>
          </Card>

          {/* Demo Protection */}
          <Card className="p-6 bg-slate-800/50 border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">Demo Protection</h2>
            </div>
            <p className="text-sm text-gray-300 mb-4">Prevent users from tampering with critical features</p>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm">
              Enable Full Lockdown
            </Button>
          </Card>
        </div>

        {/* Feature Lock Management */}
        <Card className="p-6 bg-slate-800/50 border-cyan-500/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Feature Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoFeatures.map(feature => (
              <div
                key={feature.id}
                className="bg-slate-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">{feature.name}</p>
                  <Badge
                    className={`mt-2 ${
                      feature.risk === "critical"
                        ? "bg-red-600"
                        : feature.risk === "high"
                        ? "bg-orange-600"
                        : feature.risk === "medium"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {feature.risk.toUpperCase()} RISK
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => toggleLock(feature.id)}
                  className={`ml-4 ${
                    lockedFeatures.includes(feature.id)
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {lockedFeatures.includes(feature.id) ? (
                    <>
                      <Lock className="w-4 h-4 mr-1" /> Locked
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" /> Unlocked
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Flagged Content */}
        <Card className="p-6 bg-slate-800/50 border-yellow-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Flagged Content</h2>
          <div className="space-y-3">
            {[
              { id: 1, type: "Post", content: "Suspicious marketplace listing", action: "Review" },
              { id: 2, type: "Video", content: "NSFW content detected", action: "Remove" },
              { id: 3, type: "User", content: "Multiple fraud reports", action: "Ban" },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded border border-yellow-500/30">
                <div>
                  <p className="font-semibold text-white">{item.type}: {item.content}</p>
                </div>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
