import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function ConnectorIntelligence() {
  const [selectedConnector, setSelectedConnector] = useState('slack');

  // Connected platforms
  const connectors = [
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communication',
      status: 'connected',
      health: 0.98,
      lastSync: '2 minutes ago',
      dataPoints: 45230,
      metrics: {
        messages: 12450,
        channels: 142,
        users: 850,
        integrations: 23,
      },
      insights: [
        'Team engagement up 35%',
        'Most active channel: #general',
        'Peak activity: 2-4 PM',
      ],
    },
    {
      id: 'jira',
      name: 'Jira',
      category: 'Project Management',
      status: 'connected',
      health: 0.95,
      lastSync: '5 minutes ago',
      dataPoints: 8920,
      metrics: {
        issues: 342,
        sprints: 12,
        velocity: 45,
        burndown: 0.87,
      },
      insights: [
        'Sprint velocity stable',
        'Bug resolution time: 2.3 days',
        'Feature completion: 92%',
      ],
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design',
      status: 'connected',
      health: 0.92,
      lastSync: '8 minutes ago',
      dataPoints: 5640,
      metrics: {
        files: 234,
        components: 1250,
        updates: 342,
        collaborators: 45,
      },
      insights: [
        'Design system coverage: 95%',
        'Component reuse: 78%',
        'Collaboration score: 8.5/10',
      ],
    },
    {
      id: 'asana',
      name: 'Asana',
      category: 'Task Management',
      status: 'connected',
      health: 0.89,
      lastSync: '12 minutes ago',
      dataPoints: 6780,
      metrics: {
        tasks: 1240,
        projects: 45,
        teams: 12,
        completion: 0.84,
      },
      insights: [
        'Task completion rate: 84%',
        'Average task duration: 3.2 days',
        'Team utilization: 92%',
      ],
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'Development',
      status: 'connected',
      health: 0.96,
      lastSync: '1 minute ago',
      dataPoints: 12340,
      metrics: {
        repos: 28,
        commits: 2340,
        prs: 156,
        issues: 89,
      },
      insights: [
        'Code quality: A+',
        'Test coverage: 87%',
        'Deployment frequency: 12/day',
      ],
    },
  ];

  // Sync activity data
  const syncData = [
    { time: '12:00', slack: 450, jira: 120, figma: 80, asana: 95, github: 340 },
    { time: '13:00', slack: 520, jira: 145, figma: 92, asana: 110, github: 380 },
    { time: '14:00', slack: 680, jira: 180, figma: 110, asana: 140, github: 420 },
    { time: '15:00', slack: 750, jira: 210, figma: 125, asana: 160, github: 480 },
    { time: '16:00', slack: 620, jira: 165, figma: 95, asana: 130, github: 390 },
  ];

  // Connector health
  const healthData = [
    { connector: 'Slack', uptime: 99.8, latency: 45, errors: 2 },
    { connector: 'Jira', uptime: 99.5, latency: 120, errors: 5 },
    { connector: 'Figma', uptime: 99.2, latency: 180, errors: 8 },
    { connector: 'Asana', uptime: 98.9, latency: 200, errors: 11 },
    { connector: 'GitHub', uptime: 99.6, latency: 65, errors: 3 },
  ];

  const selectedConnectorData = connectors.find(c => c.id === selectedConnector);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Connector Intelligence</h1>
          </div>
          <p className="text-gray-400">Bi-directional platform connectors and organizational health monitoring</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Connected Platforms</p>
                <p className="text-3xl font-bold text-white">5</p>
                <p className="text-xs text-green-400">All active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg System Health</p>
                <p className="text-3xl font-bold text-white">94%</p>
                <p className="text-xs text-green-400">Excellent</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Data Points Synced</p>
                <p className="text-3xl font-bold text-white">79K</p>
                <p className="text-xs text-blue-400">Last 24 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Sync Latency</p>
                <p className="text-3xl font-bold text-white">122ms</p>
                <p className="text-xs text-green-400">Real-time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Real-Time Sync Activity</CardTitle>
            <CardDescription>Data sync events across connected platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={syncData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="slack" stroke="#3b82f6" strokeWidth={2} name="Slack" />
                <Line type="monotone" dataKey="jira" stroke="#10b981" strokeWidth={2} name="Jira" />
                <Line type="monotone" dataKey="figma" stroke="#f59e0b" strokeWidth={2} name="Figma" />
                <Line type="monotone" dataKey="asana" stroke="#8b5cf6" strokeWidth={2} name="Asana" />
                <Line type="monotone" dataKey="github" stroke="#ef4444" strokeWidth={2} name="GitHub" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Connector Health */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connector Health</CardTitle>
            <CardDescription>Uptime, latency, and error metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="connector" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="uptime" fill="#10b981" name="Uptime %" />
                <Bar dataKey="latency" fill="#f59e0b" name="Latency (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Connector List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connected Platforms</CardTitle>
            <CardDescription>Select a connector to view detailed intelligence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectors.map(connector => (
              <button
                key={connector.id}
                onClick={() => setSelectedConnector(connector.id)}
                className={`w-full p-4 rounded-lg border transition text-left ${
                  selectedConnector === connector.id
                    ? 'bg-blue-900/50 border-blue-500'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{connector.name}</p>
                    <p className="text-xs text-gray-400">{connector.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={connector.health > 0.95 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}
                    >
                      {Math.round(connector.health * 100)}%
                    </Badge>
                    <Badge variant="outline">{connector.status}</Badge>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Last sync: {connector.lastSync}</span>
                  <span>{connector.dataPoints.toLocaleString()} data points</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Connector Analysis */}
        {selectedConnectorData && (
          <>
            <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedConnectorData.name} Intelligence</CardTitle>
                <CardDescription>{selectedConnectorData.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(selectedConnectorData.metrics).map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                      <p className="text-xs text-gray-400 capitalize">{key}</p>
                      <p className="text-2xl font-bold text-white">{typeof value === 'number' && value < 1 ? (value * 100).toFixed(0) + '%' : value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium mb-3">Key Insights</p>
                  <ul className="space-y-2">
                    {selectedConnectorData.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">View Full Logs</Button>
                  <Button variant="outline" className="flex-1">Configure Connector</Button>
                </div>
              </CardContent>
            </Card>

            {/* Connector Insights */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Organizational Intelligence
                </CardTitle>
                <CardDescription>Cross-platform insights from connected systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ All platforms synchronized in real-time</p>
                  <p className="text-xs text-gray-400 mt-1">Average sync latency: 122ms</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Team collaboration metrics up 28%</p>
                  <p className="text-xs text-gray-400 mt-1">Cross-platform engagement increasing</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ System health excellent across all platforms</p>
                  <p className="text-xs text-gray-400 mt-1">99.2% average uptime this month</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
