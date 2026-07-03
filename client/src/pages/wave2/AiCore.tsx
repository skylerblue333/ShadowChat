// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const AiCorePage: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState<'chat' | 'content' | 'analysis' | 'learn' | 'logs'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [contentType, setContentType] = useState<'blog' | 'social' | 'email' | 'code' | 'documentation'>('blog');
  const [contentTopic, setContentTopic] = useState('');
  const [symbols, setSymbols] = useState('');
  const [learningTopic, setLearningTopic] = useState('');
  const [learningLevel, setLearningLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Queries
  const logsQuery = trpc.wave2AiCore.getLogs.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const analyticsQuery = trpc.wave2AiCore.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const chatMutation = trpc.wave2AiCore.chat.useMutation({
    onSuccess: () => {
      setChatMessage('');
      logsQuery.refetch();
      toast.success('Chat response received');
    },
    onError: (error) => {
      toast.error(error.message || 'Chat failed');
    },
  });

  const generateContentMutation = trpc.wave2AiCore.generateContent.useMutation({
    onSuccess: () => {
      setContentTopic('');
      logsQuery.refetch();
      toast.success('Content generated');
    },
    onError: (error) => {
      toast.error(error.message || 'Content generation failed');
    },
  });

  const scanMarketsMutation = trpc.wave2AiCore.scanMarkets.useMutation({
    onSuccess: () => {
      setSymbols('');
      logsQuery.refetch();
      toast.success('Market scan complete');
    },
    onError: (error) => {
      toast.error(error.message || 'Market scan failed');
    },
  });

  const learnMutation = trpc.wave2AiCore.learnTopic.useMutation({
    onSuccess: () => {
      setLearningTopic('');
      logsQuery.refetch();
      toast.success('Learning guide generated');
    },
    onError: (error) => {
      toast.error(error.message || 'Learning failed');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in to access AI Core.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Core</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {(['chat', 'content', 'analysis', 'learn', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <Card>
          <CardHeader>
            <CardTitle>AI Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Ask me anything..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <Button
              onClick={() =>
                chatMutation.mutateAsync({
                  messages: [{ role: 'user', content: chatMessage }],
                })
              }
              disabled={chatMutation.isPending || !chatMessage}
              className="w-full"
            >
              {chatMutation.isPending ? 'Thinking...' : 'Send Message'}
            </Button>
            {chatMutation.data && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm whitespace-pre-wrap">{chatMutation.data.response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Generation Tab */}
      {activeTab === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="blog">Blog Post</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="code">Code</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="What should I write about?"
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={() =>
                generateContentMutation.mutateAsync({
                  type: contentType,
                  topic: contentTopic,
                })
              }
              disabled={generateContentMutation.isPending || !contentTopic}
              className="w-full"
            >
              {generateContentMutation.isPending ? 'Generating...' : 'Generate'}
            </Button>
            {generateContentMutation.data && (
              <div className="p-3 rounded-lg bg-muted max-h-96 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{generateContentMutation.data.content}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Tab */}
      {activeTab === 'analysis' && (
        <Card>
          <CardHeader>
            <CardTitle>Market Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Symbols (comma-separated)</label>
              <Input
                placeholder="e.g., BTC, ETH, SKY"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={() =>
                scanMarketsMutation.mutateAsync({
                  symbols: symbols.split(',').map((s) => s.trim()),
                })
              }
              disabled={scanMarketsMutation.isPending || !symbols}
              className="w-full"
            >
              {scanMarketsMutation.isPending ? 'Analyzing...' : 'Scan Markets'}
            </Button>
            {scanMarketsMutation.data && (
              <div className="p-3 rounded-lg bg-muted max-h-96 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{scanMarketsMutation.data.analysis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Learning Tab */}
      {activeTab === 'learn' && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="What do you want to learn?"
                value={learningTopic}
                onChange={(e) => setLearningTopic(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Level</label>
              <select
                value={learningLevel}
                onChange={(e) => setLearningLevel(e.target.value as any)}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <Button
              onClick={() =>
                learnMutation.mutateAsync({
                  topic: learningTopic,
                  level: learningLevel,
                })
              }
              disabled={learnMutation.isPending || !learningTopic}
              className="w-full"
            >
              {learnMutation.isPending ? 'Generating...' : 'Generate Guide'}
            </Button>
            {learnMutation.data && (
              <div className="p-3 rounded-lg bg-muted max-h-96 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{learnMutation.data.guide}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {analyticsQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">{analyticsQuery.data.totalLogs}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Tokens Used</p>
                    <p className="text-2xl font-bold">{analyticsQuery.data.totalTokens}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Types</p>
                    <p className="text-2xl font-bold">{Object.keys(analyticsQuery.data.byType).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Interaction Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {logsQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (logsQuery.data?.logs || []).length > 0 ? (
                <div className="space-y-2">
                  {(logsQuery.data?.logs || []).map((log: any) => (
                    <div key={log.id} className="p-3 rounded-lg border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium capitalize">{log.type}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{log.input}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{log.tokensUsed} tokens</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No logs yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AiCorePage;
