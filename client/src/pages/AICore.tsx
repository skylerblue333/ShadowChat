// @ts-nocheck
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Send, Copy, Trash2, BarChart3, Zap } from 'lucide-react';

export default function AICore() {
  const [activeTab, setActiveTab] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [tokenUsage, setTokenUsage] = useState(0);

  // Fetch AI usage
  const { data: aiUsage } = trpc.ai.getUsage.useQuery();

  // Chat mutation
  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages([
        ...messages,
        { role: 'user', content: prompt },
        { role: 'assistant', content: data.response },
      ]);
      setPrompt('');
      setTokenUsage(tokenUsage + data.tokensUsed);
    },
  });

  // Content generation mutation
  const generateMutation = trpc.ai.generateContent.useMutation({
    onSuccess: (data) => {
      alert('Content generated! Check your dashboard.');
      setPrompt('');
    },
  });

  // Market analysis mutation
  const analysisMutation = trpc.ai.analyzeMarket.useMutation({
    onSuccess: (data) => {
      setMessages([
        ...messages,
        { role: 'user', content: `Analyze: ${prompt}` },
        { role: 'assistant', content: data.analysis },
      ]);
      setPrompt('');
    },
  });

  const handleChat = () => {
    if (!prompt) return;
    chatMutation.mutate({ message: prompt });
  };

  const handleGenerate = () => {
    if (!prompt) return;
    generateMutation.mutate({ prompt });
  };

  const handleAnalyze = () => {
    if (!prompt) return;
    analysisMutation.mutate({ symbol: prompt });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold">AI Core</h1>
          </div>
          <p className="text-muted-foreground">
            Powered by OpenAI • {aiUsage?.tokensRemaining.toLocaleString()} tokens remaining
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="analyze">Analyze</TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat">
                <Card className="p-6 flex flex-col h-[600px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Start a conversation with AI
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-accent text-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask AI anything..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                      disabled={chatMutation.isPending}
                    />
                    <Button
                      onClick={handleChat}
                      disabled={!prompt || chatMutation.isPending}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Generate Tab */}
              <TabsContent value="generate">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Generate Content</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Content Description
                      </label>
                      <Textarea
                        placeholder="Describe the content you want to generate..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-32"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-semibold mb-1">Content Type</p>
                        <p className="text-xs text-muted-foreground">Blog Post</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-semibold mb-1">Tone</p>
                        <p className="text-xs text-muted-foreground">Professional</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt || generateMutation.isPending}
                      className="w-full"
                    >
                      {generateMutation.isPending ? 'Generating...' : 'Generate Content'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Analyze Tab */}
              <TabsContent value="analyze">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Trading Symbol
                      </label>
                      <Input
                        placeholder="e.g., BTC, ETH, SKY"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Analysis Type</p>
                        <p className="font-semibold">Technical</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
                        <p className="font-semibold">24h</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={!prompt || analysisMutation.isPending}
                      className="w-full"
                    >
                      {analysisMutation.isPending ? 'Analyzing...' : 'Analyze Market'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Token Usage
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold">
                      {aiUsage?.tokensUsedMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (aiUsage?.tokensUsedMonth || 0) /
                          (aiUsage?.monthlyLimit || 1) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aiUsage?.tokensRemaining.toLocaleString()} remaining
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Generations */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Recent Generations
              </h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-semibold line-clamp-2">
                    Market Analysis Report
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-semibold line-clamp-2">
                    Trading Strategy Guide
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-semibold line-clamp-2">
                    Portfolio Optimization Tips
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </Card>

            {/* Subscription */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              <h3 className="font-semibold mb-2">AI Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlimited AI features with priority processing
              </p>
              <Button className="w-full" size="sm">
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
