import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EnterpriseAPI() {
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);

  const apis = [
    {
      name: 'Behavior API',
      desc: 'User archetype, personality, engagement patterns',
      endpoints: 3,
      rateLimit: '10,000 req/min',
      pricing: '$500/month',
    },
    {
      name: 'Retention API',
      desc: 'Churn prediction, retention scoring, engagement signals',
      endpoints: 4,
      rateLimit: '10,000 req/min',
      pricing: '$500/month',
    },
    {
      name: 'Decision API',
      desc: 'AI decision engine, reasoning, confidence scoring',
      endpoints: 2,
      rateLimit: '5,000 req/min',
      pricing: '$1,000/month',
    },
    {
      name: 'Agent API',
      desc: 'Autonomous agent deployment, task assignment, earnings',
      endpoints: 5,
      rateLimit: '20,000 req/min',
      pricing: '$2,000/month',
    },
    {
      name: 'Prediction API',
      desc: 'Future path prediction, opportunity scoring, market forecasting',
      endpoints: 3,
      rateLimit: '10,000 req/min',
      pricing: '$1,500/month',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">ENTERPRISE API</h1>
          <p className="text-gray-400">Access SKYCOIN4444's AI engines via REST API</p>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {apis.map((api) => (
            <Card
              key={api.name}
              className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-cyan-500 transition"
              onClick={() => setSelectedAPI(api.name)}
            >
              <h3 className="font-bold text-lg mb-2">{api.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{api.desc}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Endpoints</span>
                  <span>{api.endpoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate Limit</span>
                  <span>{api.rateLimit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pricing</span>
                  <span className="text-cyan-400 font-bold">{api.pricing}</span>
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">View Docs</Button>
            </Card>
          ))}
        </div>

        {/* Documentation */}
        <div>
          <h2 className="text-2xl font-bold mb-6">QUICK START</h2>
          <Card className="bg-gray-900 border-gray-800 p-8">
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="mt-6">
                <pre className="bg-black p-4 rounded overflow-x-auto text-sm">
                  {`curl -X POST https://api.skycoin4444.com/v1/behavior/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "user123"}'`}
                </pre>
              </TabsContent>

              <TabsContent value="python" className="mt-6">
                <pre className="bg-black p-4 rounded overflow-x-auto text-sm">
                  {`import requests

response = requests.post(
  'https://api.skycoin4444.com/v1/behavior/analyze',
  headers={'Authorization': 'Bearer YOUR_API_KEY'},
  json={'userId': 'user123'}
)

print(response.json())`}
                </pre>
              </TabsContent>

              <TabsContent value="javascript" className="mt-6">
                <pre className="bg-black p-4 rounded overflow-x-auto text-sm">
                  {`const response = await fetch(
  'https://api.skycoin4444.com/v1/behavior/analyze',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: 'user123' })
  }
);

const data = await response.json();`}
                </pre>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
