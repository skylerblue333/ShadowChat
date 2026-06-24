import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DeveloperArea() {
  const [logs, setLogs] = useState<string[]>([]);
  
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">🛠️ Developer Area</h1>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">45+</div>
                      <div className="text-sm text-gray-500">API Routers</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-sm text-gray-500">Modules</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">61</div>
                      <div className="text-sm text-gray-500">Passing Tests</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">tRPC</div>
                      <div className="text-sm text-gray-500">Type-safe API</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>AI Agents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Code Engineer', 'Data Analyst', 'Business Advisor', 'Security Expert'].map(agent => (
                <div key={agent} className="flex justify-between items-center p-4 border rounded">
                  <span>{agent}</span>
                  <Button size="sm">Execute</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-purple-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <div>System ready. Waiting for events...</div>
                ) : (
                  logs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>API Response Time</span>
                  <span className="font-bold">85ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cache Hit Rate</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Database Query Time</span>
                  <span className="font-bold">42ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: '42%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
