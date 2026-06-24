import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, Database, Zap, Shield } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('24h');

  // API Performance Data
  const apiPerformanceData = [
    { time: '00:00', latency: 145, errorRate: 0.02, throughput: 850 },
    { time: '04:00', latency: 162, errorRate: 0.03, throughput: 720 },
    { time: '08:00', latency: 178, errorRate: 0.05, throughput: 1200 },
    { time: '12:00', latency: 156, errorRate: 0.02, throughput: 1450 },
    { time: '16:00', latency: 189, errorRate: 0.04, throughput: 1320 },
    { time: '20:00', latency: 142, errorRate: 0.01, throughput: 980 },
    { time: '24:00', latency: 138, errorRate: 0.02, throughput: 850 },
  ];

  // Database Performance
  const dbPerformanceData = [
    { metric: 'Query Time (ms)', value: 78, target: 100, status: 'good' },
    { metric: 'Connection Pool', value: 18, target: 20, status: 'good' },
    { metric: 'Slow Queries/min', value: 2, target: 10, status: 'good' },
    { metric: 'Replication Lag (ms)', value: 12, target: 50, status: 'good' },
  ];

  // Cache Performance
  const cacheData = [
    { name: 'Hit', value: 87, fill: '#10b981' },
    { name: 'Miss', value: 13, fill: '#ef4444' },
  ];

  // System Resources
  const systemResourcesData = [
    { time: '00:00', cpu: 45, memory: 62, disk: 58 },
    { time: '04:00', cpu: 38, memory: 58, disk: 58 },
    { time: '08:00', cpu: 72, memory: 78, disk: 59 },
    { time: '12:00', cpu: 65, memory: 72, disk: 59 },
    { time: '16:00', cpu: 58, memory: 68, disk: 60 },
    { time: '20:00', cpu: 42, memory: 61, disk: 60 },
    { time: '24:00', cpu: 35, memory: 55, disk: 60 },
  ];

  // Engine Health Status
  const engineHealth = [
    { name: 'Feedback', uptime: 99.98, requests: 12450, errors: 2, avgLatency: 145 },
    { name: 'Roadmap', uptime: 99.95, requests: 8320, errors: 4, avgLatency: 152 },
    { name: 'Agents', uptime: 99.92, requests: 5680, errors: 5, avgLatency: 178 },
    { name: 'Competitors', uptime: 99.87, requests: 3240, errors: 4, avgLatency: 198 },
    { name: 'Behavioral', uptime: 99.93, requests: 7890, errors: 5, avgLatency: 165 },
    { name: 'Experiments', uptime: 99.91, requests: 6120, errors: 6, avgLatency: 172 },
    { name: 'Narratives', uptime: 99.89, requests: 4560, errors: 5, avgLatency: 185 },
    { name: 'Connectors', uptime: 99.94, requests: 9870, errors: 6, avgLatency: 142 },
    { name: 'ProductBrain', uptime: 99.96, requests: 5430, errors: 2, avgLatency: 138 },
    { name: 'Simulator', uptime: 99.88, requests: 2340, errors: 3, avgLatency: 215 },
  ];

  // Error Distribution
  const errorDistribution = [
    { name: '4xx Client', value: 28, fill: '#f59e0b' },
    { name: '5xx Server', value: 8, fill: '#ef4444' },
    { name: 'Timeout', value: 4, fill: '#8b5cf6' },
  ];

  // Key Metrics
  const keyMetrics = [
    {
      title: 'API Response Time (p95)',
      value: '145ms',
      target: '<200ms',
      status: 'good',
      icon: Zap,
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      target: '<0.1%',
      status: 'good',
      icon: AlertTriangle,
    },
    {
      title: 'Cache Hit Rate',
      value: '87%',
      target: '>80%',
      status: 'good',
      icon: Activity,
    },
    {
      title: 'System Uptime',
      value: '99.2%',
      target: '99.9%',
      status: 'warning',
      icon: Shield,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Ecosystem Analytics</h1>
          <p className="text-gray-400">Real-time monitoring of all 10 strategic engines</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                      Target: {metric.target}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* API Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">API Performance</CardTitle>
            <CardDescription>Response time, error rate, and throughput</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={apiPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="latency" stroke="#8b5cf6" name="Latency (ms)" />
                <Line type="monotone" dataKey="throughput" stroke="#10b981" name="Throughput (req/s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Database Performance</CardTitle>
              <CardDescription>Key database metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dbPerformanceData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.metric}</span>
                      <span className="text-white font-medium">{item.value} / {item.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.value / item.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cache Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Cache Performance</CardTitle>
              <CardDescription>Hit/miss ratio</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={cacheData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {cacheData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Resources */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Resources</CardTitle>
            <CardDescription>CPU, memory, and disk usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={systemResourcesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="CPU %" />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Memory %" />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="#ef4444" fill="#ef4444" name="Disk %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engine Health */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Engine Health Status</CardTitle>
            <CardDescription>All 10 strategic engines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300">Engine</th>
                    <th className="text-left py-3 px-4 text-gray-300">Uptime</th>
                    <th className="text-left py-3 px-4 text-gray-300">Requests</th>
                    <th className="text-left py-3 px-4 text-gray-300">Errors</th>
                    <th className="text-left py-3 px-4 text-gray-300">Avg Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {engineHealth.map((engine, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white font-medium">{engine.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant={engine.uptime > 99.9 ? 'default' : 'secondary'}>
                          {engine.uptime}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{engine.requests.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={engine.errors > 5 ? 'text-red-400' : 'text-green-400'}>
                          {engine.errors}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{engine.avgLatency}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Error Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Error Distribution</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={errorDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
