import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock analytics data
const revenueData = [
  { month: 'Jan', revenue: 4000, users: 2400, transactions: 240 },
  { month: 'Feb', revenue: 3000, users: 1398, transactions: 221 },
  { month: 'Mar', revenue: 2000, users: 9800, transactions: 229 },
  { month: 'Apr', revenue: 2780, users: 3908, transactions: 200 },
  { month: 'May', revenue: 1890, users: 4800, transactions: 221 },
  { month: 'Jun', revenue: 2390, users: 3800, transactions: 250 },
];

const userEngagementData = [
  { day: 'Mon', active: 4000, inactive: 2400 },
  { day: 'Tue', active: 3000, inactive: 1398 },
  { day: 'Wed', active: 2000, inactive: 9800 },
  { day: 'Thu', active: 2780, inactive: 3908 },
  { day: 'Fri', active: 1890, inactive: 4800 },
  { day: 'Sat', active: 2390, inactive: 3800 },
  { day: 'Sun', active: 2490, inactive: 4300 },
];

const platformMetrics = [
  { name: 'Social', value: 35, color: '#FF6B6B' },
  { name: 'Gaming', value: 25, color: '#4ECDC4' },
  { name: 'Commerce', value: 20, color: '#FFE66D' },
  { name: 'Charity', value: 15, color: '#95E1D3' },
  { name: 'Other', value: 5, color: '#A8E6CF' },
];

const conversionFunnelData = [
  { stage: 'Visitors', count: 10000, percentage: 100 },
  { stage: 'Signups', count: 7500, percentage: 75 },
  { stage: 'Active Users', count: 5000, percentage: 50 },
  { stage: 'Paid Users', count: 2500, percentage: 25 },
  { stage: 'Premium', count: 1000, percentage: 10 },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const stats = [
    { label: 'Total Revenue', value: '$18,060', change: '+12.5%', positive: true },
    { label: 'Active Users', value: '24,398', change: '+8.2%', positive: true },
    { label: 'Conversion Rate', value: '3.24%', change: '-0.5%', positive: false },
    { label: 'Avg. Session', value: '4m 32s', change: '+2.1%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">Real-time insights and performance metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-2 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue and transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#FF6B6B" strokeWidth={2} />
                  <Line type="monotone" dataKey="transactions" stroke="#4ECDC4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Engagement */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Daily active vs inactive users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Legend />
                  <Bar dataKey="active" fill="#4ECDC4" />
                  <Bar dataKey="inactive" fill="#666" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Distribution & Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Platform Metrics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Usage by platform section</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformMetrics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from signup to premium</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.stage}</span>
                      <span className="text-sm text-muted-foreground">{item.count.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export & Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Export & Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700">Export CSV</Button>
            <Button className="bg-pink-600 hover:bg-pink-700">Export PDF</Button>
            <Button variant="outline">Schedule Report</Button>
            <Button variant="outline">Share Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
