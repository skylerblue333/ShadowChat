import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle, XCircle, Cpu, Thermometer, Wifi } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  hashrate: number;
  temperature: number;
  power: number;
  uptime: number;
  acceptedShares: number;
  rejectedShares: number;
  lastUpdate: number;
  coin: string;
  pool: string;
}

interface PoolStats {
  name: string;
  coin: string;
  connected: boolean;
  hashrate: number;
  difficulty: number;
  acceptedShares: number;
  rejectedShares: number;
  staleShares: number;
  earnings: number;
  earningsUSD: number;
}

const MinerDashboard: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 'worker-1',
      name: 'Antminer S21 #1',
      status: 'online',
      hashrate: 200,
      temperature: 65,
      power: 3500,
      uptime: 86400,
      acceptedShares: 1250,
      rejectedShares: 12,
      lastUpdate: Date.now(),
      coin: 'BTC',
      pool: 'Foundry USA',
    },
    {
      id: 'worker-2',
      name: 'RTX 4090 #1',
      status: 'online',
      hashrate: 100,
      temperature: 72,
      power: 450,
      uptime: 172800,
      acceptedShares: 890,
      rejectedShares: 8,
      lastUpdate: Date.now(),
      coin: 'ETC',
      pool: 'Ethermine',
    },
    {
      id: 'worker-3',
      name: 'Antminer L7',
      status: 'online',
      hashrate: 500,
      temperature: 58,
      power: 3425,
      uptime: 259200,
      acceptedShares: 2100,
      rejectedShares: 15,
      lastUpdate: Date.now(),
      coin: 'DOGE',
      pool: 'Poolin',
    },
  ]);

  const [poolStats, setPoolStats] = useState<PoolStats[]>([
    {
      name: 'Foundry USA',
      coin: 'BTC',
      connected: true,
      hashrate: 200,
      difficulty: 124.93,
      acceptedShares: 1250,
      rejectedShares: 12,
      staleShares: 5,
      earnings: 0.0032,
      earningsUSD: 203.84,
    },
    {
      name: 'Ethermine',
      coin: 'ETC',
      connected: true,
      hashrate: 100,
      difficulty: 45000,
      acceptedShares: 890,
      rejectedShares: 8,
      staleShares: 3,
      earnings: 0.156,
      earningsUSD: 4.43,
    },
    {
      name: 'Poolin',
      coin: 'DOGE',
      connected: true,
      hashrate: 500,
      difficulty: 0.00000654,
      acceptedShares: 2100,
      rejectedShares: 15,
      staleShares: 8,
      earnings: 45000,
      earningsUSD: 3240,
    },
  ]);

  const [performanceHistory, setPerformanceHistory] = useState<any[]>([
    { time: '00:00', BTC: 200, ETC: 100, DOGE: 500 },
    { time: '04:00', BTC: 198, ETC: 102, DOGE: 495 },
    { time: '08:00', BTC: 202, ETC: 99, DOGE: 505 },
    { time: '12:00', BTC: 200, ETC: 101, DOGE: 502 },
    { time: '16:00', BTC: 201, ETC: 100, DOGE: 498 },
    { time: '20:00', BTC: 199, ETC: 103, DOGE: 504 },
  ]);

  const [earningsHistory, setEarningsHistory] = useState<any[]>([
    { day: 'Mon', BTC: 203.84, ETC: 4.43, DOGE: 3240 },
    { day: 'Tue', BTC: 215.32, ETC: 5.12, DOGE: 3450 },
    { day: 'Wed', BTC: 198.76, ETC: 4.89, DOGE: 3180 },
    { day: 'Thu', BTC: 221.45, ETC: 5.67, DOGE: 3620 },
    { day: 'Fri', BTC: 209.12, ETC: 4.95, DOGE: 3320 },
    { day: 'Sat', BTC: 225.89, ETC: 6.12, DOGE: 3780 },
    { day: 'Sun', BTC: 218.34, ETC: 5.43, DOGE: 3550 },
  ]);

  const totalHashrate = workers.reduce((sum, w) => sum + w.hashrate, 0);
  const totalPower = workers.reduce((sum, w) => sum + w.power, 0);
  const totalEarningsUSD = poolStats.reduce((sum, p) => sum + p.earningsUSD, 0);
  const onlineWorkers = workers.filter(w => w.status === 'online').length;
  const avgTemperature = workers.reduce((sum, w) => sum + w.temperature, 0) / workers.length;

  const coinDistribution = poolStats.map(p => ({
    name: p.coin,
    value: p.earningsUSD,
  }));

  const COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8" />
            Mining Operations Dashboard
          </h1>
          <p className="text-slate-400">Real-time monitoring of all mining workers and pools</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Total Hashrate</p>
                <p className="text-3xl font-bold text-blue-400">{totalHashrate}</p>
                <p className="text-xs text-slate-500 mt-1">TH/s</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Daily Earnings</p>
                <p className="text-3xl font-bold text-green-400">${totalEarningsUSD.toFixed(0)}</p>
                <p className="text-xs text-slate-500 mt-1">USD</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Power Usage</p>
                <p className="text-3xl font-bold text-yellow-400">{(totalPower / 1000).toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">kW</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Workers Online</p>
                <p className="text-3xl font-bold text-emerald-400">{onlineWorkers}/{workers.length}</p>
                <p className="text-xs text-slate-500 mt-1">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="workers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="pools">Pools</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <div className="space-y-4">
              {workers.map((worker) => (
                <Card key={worker.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${worker.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-white font-semibold">{worker.name}</p>
                          <p className="text-slate-400 text-sm">{worker.coin} • {worker.pool}</p>
                        </div>
                      </div>
                      <Badge variant={worker.status === 'online' ? 'default' : 'destructive'}>
                        {worker.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-slate-400 text-xs">Hashrate</p>
                        <p className="text-lg font-bold text-white">{worker.hashrate}</p>
                        <p className="text-xs text-slate-500">TH/s</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Temperature</p>
                        <p className={`text-lg font-bold ${worker.temperature > 75 ? 'text-red-400' : 'text-green-400'}`}>
                          {worker.temperature}°C
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Power</p>
                        <p className="text-lg font-bold text-white">{worker.power}W</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Uptime</p>
                        <p className="text-lg font-bold text-white">{(worker.uptime / 86400).toFixed(1)}</p>
                        <p className="text-xs text-slate-500">days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Accepted</p>
                        <p className="text-lg font-bold text-green-400">{worker.acceptedShares}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Rejected</p>
                        <p className="text-lg font-bold text-red-400">{worker.rejectedShares}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pools Tab */}
          <TabsContent value="pools" className="space-y-6">
            <div className="space-y-4">
              {poolStats.map((pool) => (
                <Card key={pool.name} className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-white font-semibold">{pool.name}</p>
                        <p className="text-slate-400 text-sm">{pool.coin} Mining Pool</p>
                      </div>
                      <Badge variant={pool.connected ? 'default' : 'destructive'}>
                        {pool.connected ? 'CONNECTED' : 'DISCONNECTED'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-slate-400 text-xs">Hashrate</p>
                        <p className="text-lg font-bold text-white">{pool.hashrate}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Difficulty</p>
                        <p className="text-lg font-bold text-white">{pool.difficulty.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Accepted Shares</p>
                        <p className="text-lg font-bold text-green-400">{pool.acceptedShares}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Earnings</p>
                        <p className="text-lg font-bold text-blue-400">${pool.earningsUSD.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Share Ratio</p>
                        <p className="text-lg font-bold text-white">
                          {((pool.acceptedShares / (pool.acceptedShares + pool.rejectedShares)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">24-Hour Hashrate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line type="monotone" dataKey="BTC" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="ETC" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="DOGE" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">7-Day Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={earningsHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Legend />
                      <Bar dataKey="BTC" fill="#f59e0b" />
                      <Bar dataKey="ETC" fill="#8b5cf6" />
                      <Bar dataKey="DOGE" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Earnings Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={coinDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {coinDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alerts Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alerts & Notifications
          </h2>
          
          <Alert className="bg-slate-800 border-yellow-600">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-slate-300">
              RTX 4090 #1 temperature rising: 72°C (threshold: 75°C). Monitor closely.
            </AlertDescription>
          </Alert>

          <Alert className="bg-slate-800 border-green-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-slate-300">
              All mining pools connected and operating normally. Daily earnings on track.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default MinerDashboard;
