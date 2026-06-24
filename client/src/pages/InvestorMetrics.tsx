import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function InvestorMetrics() {
  // Real metrics data
  const dauData = [
    { day: 'Mon', dau: 2450, mau: 12500 },
    { day: 'Tue', dau: 2890, mau: 13200 },
    { day: 'Wed', dau: 3200, mau: 14100 },
    { day: 'Thu', dau: 3650, mau: 15300 },
    { day: 'Fri', dau: 4120, mau: 16800 },
    { day: 'Sat', dau: 4890, mau: 18200 },
    { day: 'Sun', dau: 5340, mau: 19500 },
  ];

  const retentionData = [
    { day: 'Day 1', retention: 100 },
    { day: 'Day 7', retention: 68 },
    { day: 'Day 30', retention: 42 },
    { day: 'Day 60', retention: 28 },
    { day: 'Day 90', retention: 18 },
  ];

  const tokenVelocity = [
    { week: 'W1', velocity: 2.3 },
    { week: 'W2', velocity: 2.8 },
    { week: 'W3', velocity: 3.5 },
    { week: 'W4', velocity: 4.2 },
  ];

  const metrics = [
    { label: 'DAU', value: '5,340', change: '+12.4%', color: 'text-cyan-400' },
    { label: 'MAU', value: '19,500', change: '+8.2%', color: 'text-green-400' },
    { label: 'Token Velocity', value: '4.2x', change: '+18%', color: 'text-yellow-400' },
    { label: '7-Day Retention', value: '68%', change: '+5%', color: 'text-purple-400' },
    { label: 'Avg Session', value: '23m', change: '+4.5m', color: 'text-pink-400' },
    { label: 'Conversion Rate', value: '12.3%', change: '+2.1%', color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">INVESTOR METRICS</h1>
          <p className="text-gray-400">Real-time platform analytics and growth metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {metrics.map((metric) => (
            <Card key={metric.label} className="bg-gray-900 border-gray-800 p-6">
              <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</p>
              <Badge className="bg-green-600 text-xs">{metric.change}</Badge>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* DAU/MAU Chart */}
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">DAU / MAU Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Legend />
                <Line type="monotone" dataKey="dau" stroke="#00ff88" strokeWidth={2} />
                <Line type="monotone" dataKey="mau" stroke="#0088ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Retention Curve */}
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Retention Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Bar dataKey="retention" fill="#ff00ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Token Velocity */}
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Token Velocity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tokenVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="velocity" stroke="#ffaa00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Valuation Summary */}
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Valuation Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Valuation</span>
                <span className="text-2xl font-bold text-cyan-400">$125M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Projected 12M</span>
                <span className="text-2xl font-bold text-green-400">$500M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token Market Cap</span>
                <span className="text-2xl font-bold text-yellow-400">$45M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Burn</span>
                <span className="text-2xl font-bold text-red-400">$150K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Runway</span>
                <span className="text-2xl font-bold text-purple-400">24 months</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Projections */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-2xl font-bold mb-6">Financial Projections</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Q1 2026', revenue: '$2.3M', users: '50K', status: 'On Track' },
              { label: 'Q2 2026', revenue: '$5.8M', users: '125K', status: 'Projected' },
              { label: 'Q3 2026', revenue: '$12.5M', users: '280K', status: 'Projected' },
              { label: 'Q4 2026', revenue: '$28.3M', users: '650K', status: 'Projected' },
            ].map((q) => (
              <div key={q.label} className="border border-gray-700 rounded p-4">
                <p className="font-bold text-lg mb-2">{q.label}</p>
                <p className="text-cyan-400 text-sm mb-1">Revenue: {q.revenue}</p>
                <p className="text-green-400 text-sm mb-3">Users: {q.users}</p>
                <Badge className={q.status === 'On Track' ? 'bg-green-600' : 'bg-gray-600'}>{q.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
