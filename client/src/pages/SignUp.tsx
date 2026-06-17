import { useState } from "react";
import { useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    referralCode: "",
  });
  const [aiCodeFeed, setAiCodeFeed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // const signupMutation = trpc.system.notifyOwner.useMutation();
  const aiCodeQuery = trpc.hopeaiAdvanced.analyzeCodeLive.useQuery({ code: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAICode = async () => {
    setLoading(true);
    try {
      const codeSnippet = `// Signup validation for ${formData.email}\nif (!email.includes('@')) return false;`;
      setAiCodeFeed(prev => [...prev, codeSnippet]);
    } catch (error) {
      console.error("AI code generation failed:", error);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Signup failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Sign-up Form */}
        <Card className="p-8 bg-slate-800/50 border-purple-500/30">
          <h1 className="text-3xl font-bold text-white mb-2">Join SKYCOIN4444</h1>
          <p className="text-gray-400 mb-6">Create your account and unlock unlimited possibilities</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="bg-slate-700/50 border-purple-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="bg-slate-700/50 border-purple-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-slate-700/50 border-purple-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Referral Code (Optional)</label>
              <Input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                placeholder="Enter referral code"
                className="bg-slate-700/50 border-purple-500/30"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              {loading ? <Spinner /> : "Create Account"}
            </Button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            Already have an account?             <button onClick={() => window.location.href = "/login"} className="text-cyan-400 hover:underline">Sign in</button>
          </p>
        </Card>

        {/* AI Code Feed */}
        <Card className="p-8 bg-slate-800/50 border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">AI Code Generation Feed</h2>
          <p className="text-gray-400 mb-4">AI generates code snippets for your signup flow</p>

          <Button
            onClick={generateAICode}
            disabled={loading}
            className="w-full mb-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {loading ? <Spinner /> : "Generate AI Code"}
          </Button>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {aiCodeFeed.map((code, idx) => (
              <div key={idx} className="bg-slate-700/50 p-3 rounded border border-green-500/30">
                <p className="text-xs text-gray-300 font-mono break-all">{code}</p>
                <Button
                  size="sm"
                  className="mt-2 text-xs bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Auto-implement if smart enough
                    console.log("Implementing AI code:", code);
                  }}
                >
                  Implement
                </Button>
              </div>
            ))}
          </div>

          {aiCodeFeed.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>AI code snippets will appear here</p>
              <p className="text-xs mt-2">Click "Generate AI Code" to start</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
