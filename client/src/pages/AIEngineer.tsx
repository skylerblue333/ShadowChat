import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Zap, BookOpen, Bug, TestTube2, Wrench, FileText } from "lucide-react";

export default function AIEngineer() {
  const [activeTab, setActiveTab] = useState("generate");
  const [code, setCode] = useState("");
  const [requirement, setRequirement] = useState("");
  const [concept, setConcept] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Queries
  const generateCodeQuery = trpc.aiCodeEngineer.generateCode.useQuery(
    { requirement, language: "typescript" },
    { enabled: false }
  );

  const analyzeQuery = trpc.aiCodeEngineer.analyzeAndImprove.useQuery(
    { code, language: "typescript" },
    { enabled: false }
  );

  const teachQuery = trpc.aiCodeEngineer.teachCoding.useQuery(
    { concept, level: "intermediate" },
    { enabled: false }
  );

  const debugQuery = trpc.aiCodeEngineer.debugCode.useQuery(
    { code, language: "typescript" },
    { enabled: false }
  );

  const testQuery = trpc.aiCodeEngineer.generateTests.useQuery(
    { code, framework: "vitest", language: "typescript" },
    { enabled: false }
  );

  const refactorQuery = trpc.aiCodeEngineer.refactorCode.useQuery(
    { code, language: "typescript" },
    { enabled: false }
  );

  const docsQuery = trpc.aiCodeEngineer.generateDocs.useQuery(
    { code, style: "markdown", language: "typescript" },
    { enabled: false }
  );

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateCodeQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await analyzeQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleTeach = async () => {
    setLoading(true);
    const res = await teachQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleDebug = async () => {
    setLoading(true);
    const res = await debugQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleTest = async () => {
    setLoading(true);
    const res = await testQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleRefactor = async () => {
    setLoading(true);
    const res = await refactorQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  const handleDocs = async () => {
    setLoading(true);
    const res = await docsQuery.refetch();
    setResult(res.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-400" size={32} />
            <h1 className="text-4xl font-bold text-white">24/7 Free AI Engineer</h1>
          </div>
          <p className="text-slate-400">Autonomous code generation, analysis, teaching, debugging, testing, refactoring, and documentation</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Zap size={16} /> Generate
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <BookOpen size={16} /> Analyze
            </TabsTrigger>
            <TabsTrigger value="teach" className="flex items-center gap-2">
              <BookOpen size={16} /> Teach
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Bug size={16} /> Debug
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube2 size={16} /> Test
            </TabsTrigger>
            <TabsTrigger value="refactor" className="flex items-center gap-2">
              <Wrench size={16} /> Refactor
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText size={16} /> Docs
            </TabsTrigger>
          </TabsList>

          {/* Generate Code */}
          <TabsContent value="generate" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generate Code</h2>
              <Textarea
                placeholder="Describe what code you want to generate..."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={4}
              />
              <Button
                onClick={handleGenerate}
                disabled={!requirement.trim() || loading}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Zap size={16} className="mr-2" />}
                Generate Code
              </Button>
            </Card>
            {result?.code && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <pre className="bg-slate-900 p-4 rounded overflow-auto text-cyan-300 text-sm">
                  {result.code}
                </pre>
              </Card>
            )}
          </TabsContent>

          {/* Analyze & Improve */}
          <TabsContent value="analyze" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Analyze & Improve</h2>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={6}
              />
              <Button
                onClick={handleAnalyze}
                disabled={!code.trim() || loading}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <BookOpen size={16} className="mr-2" />}
                Analyze Code
              </Button>
            </Card>
            {result?.improvements && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Improvements (Score: {result.score}/100)</h3>
                <ul className="space-y-2">
                  {result.improvements.map((imp: string, idx: number) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </TabsContent>

          {/* Teach Coding */}
          <TabsContent value="teach" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Learn Coding Concepts</h2>
              <Textarea
                placeholder="What concept do you want to learn?"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={3}
              />
              <Button
                onClick={handleTeach}
                disabled={!concept.trim() || loading}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <BookOpen size={16} className="mr-2" />}
                Teach Me
              </Button>
            </Card>
            {result?.explanation && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Explanation</h3>
                <p className="text-slate-300 mb-4">{result.explanation}</p>
                {result.examples?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {result.examples.map((ex: string, idx: number) => (
                        <li key={idx} className="text-slate-300">• {ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          {/* Debug Code */}
          <TabsContent value="debug" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Debug Code</h2>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={6}
              />
              <Button
                onClick={handleDebug}
                disabled={!code.trim() || loading}
                className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Bug size={16} className="mr-2" />}
                Debug Code
              </Button>
            </Card>
            {result?.bugs && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4">Bugs Found: {result.bugs.length}</h3>
                <div className="space-y-3">
                  {result.bugs.map((bug: any, idx: number) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded border border-red-500/30">
                      <p className="text-red-400 font-semibold">Line {bug.line}: {bug.issue}</p>
                      <p className="text-green-400 mt-1">Fix: {bug.fix}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Generate Tests */}
          <TabsContent value="test" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generate Tests</h2>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={6}
              />
              <Button
                onClick={handleTest}
                disabled={!code.trim() || loading}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <TestTube2 size={16} className="mr-2" />}
                Generate Tests
              </Button>
            </Card>
            {result?.tests && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <pre className="bg-slate-900 p-4 rounded overflow-auto text-green-300 text-sm">
                  {result.tests}
                </pre>
              </Card>
            )}
          </TabsContent>

          {/* Refactor Code */}
          <TabsContent value="refactor" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Refactor Code</h2>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={6}
              />
              <Button
                onClick={handleRefactor}
                disabled={!code.trim() || loading}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Wrench size={16} className="mr-2" />}
                Refactor Code
              </Button>
            </Card>
            {result?.refactoredCode && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <pre className="bg-slate-900 p-4 rounded overflow-auto text-purple-300 text-sm">
                  {result.refactoredCode}
                </pre>
              </Card>
            )}
          </TabsContent>

          {/* Generate Docs */}
          <TabsContent value="docs" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generate Documentation</h2>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 mb-4"
                rows={6}
              />
              <Button
                onClick={handleDocs}
                disabled={!code.trim() || loading}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <FileText size={16} className="mr-2" />}
                Generate Docs
              </Button>
            </Card>
            {result?.documentation && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="bg-slate-900 p-4 rounded overflow-auto text-blue-300 text-sm">
                    {result.documentation}
                  </pre>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-4 text-center">
            <Zap className="text-yellow-400 mx-auto mb-2" size={24} />
            <h3 className="font-bold text-white">Generate</h3>
            <p className="text-sm text-slate-400">Create code from requirements</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4 text-center">
            <BookOpen className="text-blue-400 mx-auto mb-2" size={24} />
            <h3 className="font-bold text-white">Learn</h3>
            <p className="text-sm text-slate-400">Understand coding concepts</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4 text-center">
            <Wrench className="text-purple-400 mx-auto mb-2" size={24} />
            <h3 className="font-bold text-white">Improve</h3>
            <p className="text-sm text-slate-400">Optimize and refactor code</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
