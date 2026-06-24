import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, ExternalLink, BookOpen, Zap } from 'lucide-react';

export default function APIDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      id: 'feedback-list',
      method: 'GET',
      path: '/api/trpc/feedback.list',
      description: 'Get all feedback items',
      code: `fetch('https://api.skycoin4444.com/api/trpc/feedback.list', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))`,
    },
    {
      id: 'roadmap-query',
      method: 'GET',
      path: '/api/trpc/roadmap.query',
      description: 'Query roadmap initiatives',
      code: `const response = await fetch('https://api.skycoin4444.com/api/trpc/roadmap.query', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
const data = await response.json();`,
    },
    {
      id: 'agents-debate',
      method: 'POST',
      path: '/api/trpc/agents.debate',
      description: 'Start multi-agent debate',
      code: `fetch('https://api.skycoin4444.com/api/trpc/agents.debate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    topic: 'Product strategy',
    agents: ['strategist', 'engineer', 'designer']
  })
})`,
    },
    {
      id: 'order-create',
      method: 'POST',
      path: '/api/trpc/orders.create',
      description: 'Create new SKY STORE order',
      code: `const order = await fetch('https://api.skycoin4444.com/api/trpc/orders.create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{ productId: 'prod_123', quantity: 1 }],
    total: 99.99
  })
});`,
    },
  ];

  const authMethods = [
    { name: 'Bearer Token', description: 'JWT token in Authorization header', code: 'Authorization: Bearer eyJhbGc...' },
    { name: 'API Key', description: 'API key in X-API-Key header', code: 'X-API-Key: sk_live_...' },
    { name: 'OAuth 2.0', description: 'OAuth 2.0 with Manus OAuth provider', code: 'Authorization: Bearer <access_token>' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">API Documentation</h1>
          <p className="text-muted-foreground">Complete reference for SKYCOIN4444 REST & GraphQL APIs</p>
        </div>

        {/* Quick Start */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Get Your API Key</h3>
              <p className="text-sm text-muted-foreground mb-3">Generate an API key from your account settings</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Generate API Key</Button>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">2. Make Your First Request</h3>
              <div className="bg-muted p-3 rounded-lg font-mono text-xs text-muted-foreground">
                curl -H "Authorization: Bearer YOUR_TOKEN" https://api.skycoin4444.com/api/trpc/feedback.list
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Choose your preferred authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {authMethods.map((method, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <code className="text-xs bg-muted p-2 rounded block text-muted-foreground">{method.code}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Available REST endpoints for SKYCOIN4444</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback-list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {endpoints.map(endpoint => (
                  <TabsTrigger key={endpoint.id} value={endpoint.id} className="text-xs">
                    {endpoint.method}
                  </TabsTrigger>
                ))}
              </TabsList>

              {endpoints.map(endpoint => (
                <TabsContent key={endpoint.id} value={endpoint.id} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={
                      endpoint.method === 'GET' ? 'bg-blue-600' :
                      endpoint.method === 'POST' ? 'bg-green-600' :
                      endpoint.method === 'PUT' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Example Request</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.code, endpoint.id)}
                      >
                        <Copy className="w-4 h-4" />
                        {copiedCode === endpoint.id ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-auto">
                      {endpoint.code}
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">Free Tier</p>
                <p className="text-2xl font-bold text-purple-500 mt-1">100</p>
                <p className="text-xs text-muted-foreground">requests/hour</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">Pro Tier</p>
                <p className="text-2xl font-bold text-pink-500 mt-1">10,000</p>
                <p className="text-xs text-muted-foreground">requests/hour</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">Enterprise</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">Unlimited</p>
                <p className="text-xs text-muted-foreground">custom limits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between">
                Full API Reference
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                GraphQL Schema
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Webhook Guide
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                SDKs & Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between">
                JavaScript SDK
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Python SDK
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Postman Collection
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
