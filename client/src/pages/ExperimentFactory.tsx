import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Beaker, TrendingUp, CheckCircle, AlertCircle, Zap, Clock } from 'lucide-react';

export default function ExperimentFactory() {
  const [selectedExperiment, setSelectedExperiment] = useState('exp-001');

  // Active experiments
  const experiments = [
    {
      id: 'exp-001',
      name: 'Mobile Sign-Up Flow v2',
      status: 'running',
      startDate: '2026-06-15',
      endDate: '2026-06-29',
      progress: 65,
      hypothesis: 'Simplified sign-up flow increases conversion by 15%',
      controlGroup: 5000,
      treatmentGroup: 5000,
      metrics: {
        conversionRate: { control: 0.12, treatment: 0.18, improvement: '+50%' },
        signupTime: { control: 3.2, treatment: 1.8, improvement: '-44%' },
        dropoffRate: { control: 0.35, treatment: 0.22, improvement: '-37%' },
      },
      confidence: 0.94,
      recommendation: 'DEPLOY',
    },
    {
      id: 'exp-002',
      name: 'AI Recommendation Algorithm v3',
      status: 'running',
      startDate: '2026-06-18',
      endDate: '2026-07-02',
      progress: 45,
      hypothesis: 'New ML model improves click-through rate by 20%',
      controlGroup: 10000,
      treatmentGroup: 10000,
      metrics: {
        ctr: { control: 0.08, treatment: 0.11, improvement: '+37.5%' },
        engagement: { control: 0.25, treatment: 0.32, improvement: '+28%' },
        retention: { control: 0.72, treatment: 0.78, improvement: '+8%' },
      },
      confidence: 0.89,
      recommendation: 'CONTINUE',
    },
    {
      id: 'exp-003',
      name: 'Pricing Tier Experiment',
      status: 'completed',
      startDate: '2026-06-01',
      endDate: '2026-06-15',
      progress: 100,
      hypothesis: 'Mid-tier pricing increases ARPU by 25%',
      controlGroup: 8000,
      treatmentGroup: 8000,
      metrics: {
        arpu: { control: 45, treatment: 58, improvement: '+28.9%' },
        conversionRate: { control: 0.08, treatment: 0.11, improvement: '+37.5%' },
        churn: { control: 0.05, treatment: 0.04, improvement: '-20%' },
      },
      confidence: 0.96,
      recommendation: 'DEPLOY',
    },
    {
      id: 'exp-004',
      name: 'Dark Mode Implementation',
      status: 'completed',
      startDate: '2026-05-20',
      endDate: '2026-06-03',
      progress: 100,
      hypothesis: 'Dark mode increases session duration by 15%',
      controlGroup: 6000,
      treatmentGroup: 6000,
      metrics: {
        sessionDuration: { control: 12.5, treatment: 14.2, improvement: '+13.6%' },
        engagement: { control: 0.22, treatment: 0.25, improvement: '+13.6%' },
        satisfaction: { control: 0.75, treatment: 0.82, improvement: '+9.3%' },
      },
      confidence: 0.91,
      recommendation: 'DEPLOYED',
    },
  ];

  // Experiment timeline
  const timelineData = [
    { week: 'Week 1', running: 2, completed: 1, planned: 3 },
    { week: 'Week 2', running: 3, completed: 1, planned: 2 },
    { week: 'Week 3', running: 2, completed: 2, planned: 3 },
    { week: 'Week 4', running: 2, completed: 1, planned: 4 },
  ];

  // Experiment success rate
  const successData = [
    { category: 'Deployed', value: 12, fill: '#10b981' },
    { category: 'Running', value: 4, fill: '#3b82f6' },
    { category: 'Inconclusive', value: 2, fill: '#6b7280' },
    { category: 'Failed', value: 1, fill: '#ef4444' },
  ];

  const selectedExperimentData = experiments.find(e => e.id === selectedExperiment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Beaker className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Experiment Factory</h1>
          </div>
          <p className="text-gray-400">Automated A/B testing and experimentation platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Total Experiments</p>
                <p className="text-3xl font-bold text-white">19</p>
                <p className="text-xs text-green-400">+4 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-3xl font-bold text-white">86%</p>
                <p className="text-xs text-green-400">12 deployed, 1 failed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Improvement</p>
                <p className="text-3xl font-bold text-white">+24%</p>
                <p className="text-xs text-green-400">Across all metrics</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Running Now</p>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-xs text-blue-400">2 more planned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Experiment Timeline */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Experiment Timeline</CardTitle>
            <CardDescription>Weekly experiment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="running" fill="#3b82f6" name="Running" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="planned" fill="#f59e0b" name="Planned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Experiment List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active & Recent Experiments</CardTitle>
            <CardDescription>Click to view detailed results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {experiments.map(exp => (
              <button
                key={exp.id}
                onClick={() => setSelectedExperiment(exp.id)}
                className={`w-full p-4 rounded-lg border transition text-left ${
                  selectedExperiment === exp.id
                    ? 'bg-green-900/50 border-green-500'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{exp.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{exp.hypothesis}</p>
                  </div>
                  <Badge 
                    className={
                      exp.status === 'running' ? 'bg-blue-900 text-blue-300' :
                      exp.status === 'completed' ? 'bg-green-900 text-green-300' :
                      'bg-gray-900 text-gray-300'
                    }
                  >
                    {exp.status === 'running' && <Clock className="w-3 h-3 mr-1" />}
                    {exp.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {exp.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{exp.progress}% complete</span>
                  <span className={exp.recommendation === 'DEPLOY' ? 'text-green-400' : 'text-blue-400'}>
                    {exp.recommendation}
                  </span>
                </div>
                <Progress value={exp.progress} className="h-1 mt-2" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Experiment Results */}
        {selectedExperimentData && (
          <>
            <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedExperimentData.name}</CardTitle>
                <CardDescription>{selectedExperimentData.hypothesis}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="text-lg font-bold text-white capitalize">{selectedExperimentData.status}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className="text-lg font-bold text-white">{Math.round(selectedExperimentData.confidence * 100)}%</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Sample Size</p>
                    <p className="text-lg font-bold text-white">{(selectedExperimentData.controlGroup + selectedExperimentData.treatmentGroup).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Recommendation</p>
                    <p className="text-lg font-bold text-green-400">{selectedExperimentData.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Comparison */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Results Comparison</CardTitle>
                <CardDescription>Control vs Treatment group performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedExperimentData.metrics).map(([metricName, values]: any) => (
                  <div key={metricName} className="p-4 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-medium capitalize">{metricName.replace(/([A-Z])/g, ' $1')}</p>
                      <Badge className="bg-green-900 text-green-300">{values.improvement}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Control</p>
                        <p className="text-lg font-bold text-white">{typeof values.control === 'number' && values.control < 1 ? (values.control * 100).toFixed(1) + '%' : values.control}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Treatment</p>
                        <p className="text-lg font-bold text-green-400">{typeof values.treatment === 'number' && values.treatment < 1 ? (values.treatment * 100).toFixed(1) + '%' : values.treatment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Experiment Insights */}
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Experiment Insights
            </CardTitle>
            <CardDescription>Key findings from automated experimentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ 86% success rate across all experiments</p>
              <p className="text-xs text-gray-400 mt-1">12 experiments deployed, generating $2.5M+ in value</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Mobile sign-up flow shows 50% improvement</p>
              <p className="text-xs text-gray-400 mt-1">Ready for full production deployment</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ AI recommendation algorithm outperforming baseline</p>
              <p className="text-xs text-gray-400 mt-1">37.5% CTR improvement, 28% engagement lift</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
