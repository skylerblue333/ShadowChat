import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Sparkles, Copy, RefreshCw, Zap, Globe, TrendingUp,
  FileText, Mail, Twitter, Megaphone, Tag, BookOpen,
  MousePointer, Newspaper, Hash, CheckCircle, Loader2,
  ChevronRight, Star, BarChart3, Languages, Wand2
} from "lucide-react";

const COPY_TYPES = [
  { id: "social_post", label: "Social Post", icon: Hash, color: "text-blue-400", desc: "Engaging posts for any platform" },
  { id: "ad_headline", label: "Ad Headlines", icon: Megaphone, color: "text-orange-400", desc: "5 high-converting A/B variants" },
  { id: "product_description", label: "Product Description", icon: Tag, color: "text-purple-400", desc: "Feature-rich product copy" },
  { id: "email_subject", label: "Email Subject", icon: Mail, color: "text-purple-400", desc: "5 high-open-rate subject lines" },
  { id: "email_body", label: "Email Body", icon: Mail, color: "text-emerald-400", desc: "Full email with CTA" },
  { id: "seo_title", label: "SEO Title", icon: Globe, color: "text-cyan-400", desc: "3 keyword-optimized titles" },
  { id: "seo_description", label: "SEO Description", icon: Globe, color: "text-teal-400", desc: "3 meta descriptions" },
  { id: "tweet", label: "Tweets", icon: Twitter, color: "text-sky-400", desc: "5 shareable tweet variants" },
  { id: "blog_intro", label: "Blog Intro", icon: BookOpen, color: "text-indigo-400", desc: "Hook + value preview" },
  { id: "cta", label: "CTA Buttons", icon: MousePointer, color: "text-pink-400", desc: "10 action-driving CTAs" },
  { id: "press_release", label: "Press Release", icon: Newspaper, color: "text-yellow-400", desc: "Professional announcement" },
  { id: "tagline", label: "Taglines", icon: Star, color: "text-rose-400", desc: "10 memorable brand taglines" },
] as const;

const TONES = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "😊" },
  { id: "hype", label: "Hype", emoji: "🚀" },
  { id: "urgent", label: "Urgent", emoji: "⚡" },
  { id: "friendly", label: "Friendly", emoji: "🤝" },
  { id: "bold", label: "Bold", emoji: "💪" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "technical", label: "Technical", emoji: "🔧" },
] as const;

const IMPROVE_GOALS = [
  { id: "more_engaging", label: "More Engaging" },
  { id: "more_concise", label: "More Concise" },
  { id: "more_persuasive", label: "More Persuasive" },
  { id: "more_professional", label: "More Professional" },
  { id: "add_cta", label: "Add CTA" },
  { id: "add_urgency", label: "Add Urgency" },
  { id: "seo_optimize", label: "SEO Optimize" },
] as const;

interface CopyHistoryItem {
  id: number;
  type: string;
  topic: string;
  copy: string;
  tone: string;
  wordCount: number;
  timestamp: Date;
}

export default function AICopyStudio() {
  const [selectedType, setSelectedType] = useState<typeof COPY_TYPES[number]["id"]>("social_post");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<typeof TONES[number]["id"]>("professional");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [copyHistory, setCopyHistory] = useState<CopyHistoryItem[]>([]);
  const [improveCopy, setImproveCopy] = useState("");
  const [improveGoal, setImproveGoal] = useState<typeof IMPROVE_GOALS[number]["id"]>("more_engaging");
  const [improvedCopy, setImprovedCopy] = useState("");
  const [analyzeCopyText, setAnalyzeCopyText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [translateText, setTranslateText] = useState("");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedCopy, setTranslatedCopy] = useState("");

  const { data: templates } = trpc.ai.getCopyTemplates.useQuery();

  const generateMutation = trpc.ai.generateCopy.useMutation({
    onSuccess: (data) => {
      setGeneratedCopy(data.copy);
      setCopyHistory(prev => [{
        id: Date.now(),
        type: selectedType,
        topic,
        copy: data.copy,
        tone: data.tone,
        wordCount: data.wordCount,
        timestamp: new Date(),
      }, ...prev.slice(0, 19)]);
      toast.success(`Copy generated! ${data.wordCount} words`);
    },
    onError: (err) => toast.error(err.message),
  });

  const improveMutation = trpc.ai.improveCopy.useMutation({
    onSuccess: (data) => {
      setImprovedCopy(data.improved);
      toast.success("Copy improved!");
    },
    onError: (err) => toast.error(err.message),
  });

  const analyzeMutation = trpc.ai.analyzeCopy.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success(`Analysis complete! Score: ${data.score}/100`);
    },
    onError: (err) => toast.error(err.message),
  });

  const translateMutation = trpc.ai.translateCopy.useMutation({
    onSuccess: (data) => {
      setTranslatedCopy(data.translated);
      toast.success(`Translated to ${data.language}!`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Enter a topic or product to generate copy for");
      return;
    }
    generateMutation.mutate({
      type: selectedType,
      topic: topic.trim(),
      tone,
      keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : undefined,
      length,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const selectedTypeInfo = COPY_TYPES.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageHeader
        title="AI Copy Studio"
        subtitle="Generate high-converting copy powered by real AI"
        backHref="/ai-brain"
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="bg-gray-900/60 border border-gray-700/50 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="generate" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />Generate
            </TabsTrigger>
            <TabsTrigger value="improve" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />Improve
            </TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />Analyze
            </TabsTrigger>
            <TabsTrigger value="translate" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Languages className="w-3.5 h-3.5 mr-1.5" />Translate
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <FileText className="w-3.5 h-3.5 mr-1.5" />Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />History
            </TabsTrigger>
          </TabsList>

          {/* GENERATE TAB */}
          <TabsContent value="generate">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Config */}
              <div className="lg:col-span-1 space-y-4">
                {/* Copy Type Selector */}
                <Card className="bg-gray-900/60 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-300">Copy Type</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {COPY_TYPES.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            selectedType === type.id
                              ? "border-cyan-500/50 bg-cyan-500/10"
                              : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 mb-1 ${type.color}`} />
                          <div className="text-xs font-medium text-white leading-tight">{type.label}</div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Tone Selector */}
                <Card className="bg-gray-900/60 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-300">Tone</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {TONES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`p-2 rounded-lg border text-sm transition-all ${
                          tone === t.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Length */}
                <Card className="bg-gray-900/60 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-300">Length</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    {(["short","medium","long"] as const).map(l => (
                      <button
                        key={l}
                        onClick={() => setLength(l)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all capitalize ${
                          length === l
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-gray-700/50 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Input + Output */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-gray-900/60 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                      {selectedTypeInfo && <selectedTypeInfo.icon className={`w-4 h-4 ${selectedTypeInfo.color}`} />}
                      {selectedTypeInfo?.label} — {selectedTypeInfo?.desc}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-400 mb-1.5 block">Topic / Product / Brand *</Label>
                      <Input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. SKYCOIN4444 token launch, 8-20% APY staking..."
                        className="bg-gray-800/60 border-gray-600 text-white placeholder:text-gray-500"
                        onKeyDown={e => e.key === "Enter" && handleGenerate()}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400 mb-1.5 block">Keywords (comma-separated, optional)</Label>
                      <Input
                        value={keywords}
                        onChange={e => setKeywords(e.target.value)}
                        placeholder="e.g. Web3, DeFi, staking, SKY444..."
                        className="bg-gray-800/60 border-gray-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !topic.trim()}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
                    >
                      {generateMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-2" />Generate Copy</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Output */}
                {(generatedCopy || generateMutation.isPending) && (
                  <Card className="bg-gray-900/60 border-cyan-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Generated Copy
                        </CardTitle>
                        {generatedCopy && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(generatedCopy)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 h-7 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />Copy All
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {generateMutation.isPending ? (
                        <div className="flex items-center gap-3 py-8 justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                          <span className="text-gray-400">AI is writing your copy...</span>
                        </div>
                      ) : (
                        <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                          {generatedCopy}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* IMPROVE TAB */}
          <TabsContent value="improve">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Paste Your Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={improveCopy}
                    onChange={e => setImproveCopy(e.target.value)}
                    placeholder="Paste your existing copy here to improve it..."
                    className="bg-gray-800/60 border-gray-600 text-white placeholder:text-gray-500 min-h-[200px]"
                  />
                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">Improvement Goal</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {IMPROVE_GOALS.map(g => (
                        <button
                          key={g.id}
                          onClick={() => setImproveGoal(g.id)}
                          className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                            improveGoal === g.id
                              ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                              : "border-gray-700/50 text-gray-400 hover:border-gray-600"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => improveMutation.mutate({ copy: improveCopy, goal: improveGoal })}
                    disabled={improveMutation.isPending || !improveCopy.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    {improveMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Improving...</> : <><Wand2 className="w-4 h-4 mr-2" />Improve Copy</>}
                  </Button>
                </CardContent>
              </Card>

              {(improvedCopy || improveMutation.isPending) && (
                <Card className="bg-gray-900/60 border-purple-500/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-purple-400">Improved Copy</CardTitle>
                      {improvedCopy && (
                        <Button size="sm" variant="outline" onClick={() => handleCopy(improvedCopy)} className="border-gray-600 text-gray-300 h-7 text-xs">
                          <Copy className="w-3 h-3 mr-1" />Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {improveMutation.isPending ? (
                      <div className="flex items-center gap-3 py-8 justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        <span className="text-gray-400">Improving your copy...</span>
                      </div>
                    ) : (
                      <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {improvedCopy}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ANALYZE TAB */}
          <TabsContent value="analyze">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Analyze Copy Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={analyzeCopyText}
                    onChange={e => setAnalyzeCopyText(e.target.value)}
                    placeholder="Paste your copy here to get an AI quality analysis..."
                    className="bg-gray-800/60 border-gray-600 text-white placeholder:text-gray-500 min-h-[200px]"
                  />
                  <Button
                    onClick={() => analyzeMutation.mutate({ copy: analyzeCopyText })}
                    disabled={analyzeMutation.isPending || !analyzeCopyText.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  >
                    {analyzeMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><BarChart3 className="w-4 h-4 mr-2" />Analyze Copy</>}
                  </Button>
                </CardContent>
              </Card>

              {analysisResult && (
                <Card className="bg-gray-900/60 border-purple-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-purple-400">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-purple-400">{analysisResult.score}</div>
                      <div className="text-xs text-gray-400 mt-1">Overall Score / 100</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Readability", value: analysisResult.readability, color: "text-blue-400" },
                        { label: "Persuasion", value: analysisResult.persuasion, color: "text-purple-400" },
                        { label: "Clarity", value: analysisResult.clarity, color: "text-cyan-400" },
                        { label: "Emotional Impact", value: analysisResult.emotionalImpact, color: "text-pink-400" },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-800/50 rounded-lg p-3">
                          <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                          <div className="text-xs text-gray-400">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {analysisResult.strengths?.length > 0 && (
                      <div>
                        <div className="text-xs text-purple-400 font-medium mb-2">Strengths</div>
                        {analysisResult.strengths.map((s: string, i: number) => (
                          <div key={i} className="text-xs text-gray-300 flex items-start gap-1.5 mb-1">
                            <CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />{s}
                          </div>
                        ))}
                      </div>
                    )}
                    {analysisResult.improvements?.length > 0 && (
                      <div>
                        <div className="text-xs text-yellow-400 font-medium mb-2">Improvements</div>
                        {analysisResult.improvements.map((s: string, i: number) => (
                          <div key={i} className="text-xs text-gray-300 flex items-start gap-1.5 mb-1">
                            <ChevronRight className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />{s}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* TRANSLATE TAB */}
          <TabsContent value="translate">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Translate Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={translateText}
                    onChange={e => setTranslateText(e.target.value)}
                    placeholder="Paste your copy to translate..."
                    className="bg-gray-800/60 border-gray-600 text-white placeholder:text-gray-500 min-h-[150px]"
                  />
                  <div>
                    <Label className="text-xs text-gray-400 mb-1.5 block">Target Language</Label>
                    <Select value={targetLang} onValueChange={setTargetLang}>
                      <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {["Spanish","French","German","Portuguese","Japanese","Korean","Chinese","Arabic","Hindi","Russian","Italian","Dutch","Turkish","Polish","Swedish"].map(lang => (
                          <SelectItem key={lang} value={lang} className="text-white hover:bg-gray-700">{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => translateMutation.mutate({ copy: translateText, targetLanguage: targetLang, preserveTone: true })}
                    disabled={translateMutation.isPending || !translateText.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    {translateMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Translating...</> : <><Languages className="w-4 h-4 mr-2" />Translate</>}
                  </Button>
                </CardContent>
              </Card>

              {(translatedCopy || translateMutation.isPending) && (
                <Card className="bg-gray-900/60 border-blue-500/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-blue-400">Translated to {targetLang}</CardTitle>
                      {translatedCopy && (
                        <Button size="sm" variant="outline" onClick={() => handleCopy(translatedCopy)} className="border-gray-600 text-gray-300 h-7 text-xs">
                          <Copy className="w-3 h-3 mr-1" />Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {translateMutation.isPending ? (
                      <div className="flex items-center gap-3 py-8 justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                        <span className="text-gray-400">Translating...</span>
                      </div>
                    ) : (
                      <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {translatedCopy}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(templates || []).map((t: any) => (
                <Card key={t.id} className="bg-gray-900/60 border-gray-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  onClick={() => {
                    setTopic(t.name);
                    setSelectedType(t.type as any);
                    setTone(t.tone as any);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">{t.type.replace(/_/g, " ")}</Badge>
                      <Badge className="bg-gray-700/50 text-gray-400 border-gray-600/30 text-xs">{t.tone}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{t.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{t.description}</p>
                    <div className="bg-gray-800/50 rounded-lg p-2 text-xs text-gray-300 font-mono">{t.template}</div>
                    <Button size="sm" className="w-full mt-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 text-xs">
                      Use Template <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            {copyHistory.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No copy generated yet</p>
                <p className="text-xs mt-1">Generate copy to see your history here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {copyHistory.map(item => (
                  <Card key={item.id} className="bg-gray-900/60 border-gray-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">{item.type.replace(/_/g, " ")}</Badge>
                          <Badge className="bg-gray-700/50 text-gray-400 border-gray-600/30 text-xs">{item.tone}</Badge>
                          <span className="text-xs text-gray-500">{item.wordCount} words</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.timestamp.toLocaleTimeString()}</span>
                          <Button size="sm" variant="outline" onClick={() => handleCopy(item.copy)} className="border-gray-600 text-gray-300 h-6 text-xs px-2">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Topic: {item.topic}</div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-300 whitespace-pre-wrap line-clamp-4">
                        {item.copy}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
