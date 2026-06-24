// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Zap, TrendingUp, AlertCircle, CheckCircle, Star } from "lucide-react";

export default function CodeQualityDashboard() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const evaluateMutation = trpc.codeQuality.evaluateCode.useMutation();

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await evaluateMutation.mutateAsync({ code, language });
      setResult(res);
    } finally {
      setEvaluating(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-purple-400 bg-purple-600/20";
      case "B": return "text-blue-400 bg-blue-500/20";
      case "C": return "text-yellow-400 bg-yellow-500/20";
      default: return "text-red-400 bg-red-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Code Quality Dashboard</h1>
              <p className="text-slate-400">AI-powered code evaluation & improvement</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="col-span-2 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <label className="block text-sm font-semibold text-white mb-3">Paste Your Code</label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="bg-slate-900 border-slate-700 text-white font-mono text-sm h-64 resize-none"
              />
              
              <div className="flex gap-4 mt-4">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40 bg-slate-900 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleEvaluate}
                  disabled={!code || evaluating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {evaluating ? "Evaluating..." : "Evaluate Code"}
                </Button>
              </div>
            </Card>

            {/* Suggestions */}
            {result?.suggestions && (
              <Card className="bg-slate-800/50 border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Suggestions for Improvement
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((s: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Quality Score */}
                <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6">
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{result.qualityScore}/100</div>
                    <p className="text-slate-400 text-sm">Quality Score</p>
                  </div>
                </Card>

                {/* Ratings */}
                <Card className="bg-slate-800/50 border-slate-700/50 p-6">
                  <h3 className="font-semibold text-white mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {Object.entries(result.ratings).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-400 capitalize">{key}</span>
                          <span className="text-sm font-semibold text-cyan-400">{value}/5</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Issues */}
                <Card className="bg-slate-800/50 border-slate-700/50 p-6">
                  <h3 className="font-semibold text-white mb-4">Issues Found</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-500/10 rounded border border-red-500/20">
                      <span className="text-sm text-red-300">Critical</span>
                      <Badge className="bg-red-500/20 text-red-300">{result.issues.critical}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <span className="text-sm text-yellow-300">Warnings</span>
                      <Badge className="bg-yellow-500/20 text-yellow-300">{result.issues.warning}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <span className="text-sm text-blue-300">Info</span>
                      <Badge className="bg-blue-500/20 text-blue-300">{result.issues.info}</Badge>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Star className="w-4 h-4 mr-2" />
                    Auto-Improve Code
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">
                    Compare Versions
                  </Button>
                </div>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 p-6 text-center">
                <Code2 className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400 text-sm">Paste code and click Evaluate to get started</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
