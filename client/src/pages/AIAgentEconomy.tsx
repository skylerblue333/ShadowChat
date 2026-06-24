import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function AIAgentEconomy() {
  const { data: goals, isLoading } = trpc.enterprise.freeWill.goals.useQuery();
  const { data: actionLog = [] } = trpc.enterprise.freeWill.actionLog.useQuery({});
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);


  const agentTypes = [
    { id: 'research', name: 'Research Agent', icon: '🔬', color: 'bg-blue-500' },
    { id: 'trading', name: 'Trading Agent', icon: '📈', color: 'bg-green-500' },
    { id: 'creator', name: 'Creator Agent', icon: '🎨', color: 'bg-purple-500' },
    { id: 'governance', name: 'Governance Agent', icon: '⚖️', color: 'bg-amber-500' },
    { id: 'developer', name: 'Developer Agent', icon: '💻', color: 'bg-indigo-500' },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">AGENT CITY</h1>
          <p className="text-gray-400">Your autonomous AI workforce — earning on your behalf</p>
        </div>

        {/* Agent Marketplace */}
        <div className="grid grid-cols-5 gap-4 mb-12">
          {agentTypes.map((type) => (
            <Card key={type.id} className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-cyan-500 transition" onClick={() => setSelectedAgent(type.id)}>
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="font-bold text-lg">{type.name}</h3>
              <p className="text-sm text-gray-400 mt-2">Deploy & earn</p>
            </Card>
          ))}
        </div>

        {/* Active Agents Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">ACTIVE AGENTS ({goals?.length || 0})</h2>
          <div className="grid grid-cols-3 gap-6">
            {goals?.map((agent: any) => (
              <Card key={agent.id} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{agent.name}</h3>
                  <Badge className={agent.status === 'working' ? 'bg-green-500' : 'bg-gray-600'}>{agent.status}</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Level</span>
                    <span className="font-bold">{agent.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tasks Today</span>
                    <span className="font-bold text-cyan-400">{agent.tasksToday}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Earned Today</span>
                    <span className="font-bold text-yellow-400">+{agent.earnedToday} SKY</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Efficiency</span>
                    <span className="font-bold">{agent.efficiency}%</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">View Activity</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Task Queue */}
        <div>
          <h2 className="text-2xl font-bold mb-6">TASK QUEUE ({actionLog?.length || 0})</h2>
          <div className="space-y-3">
            {actionLog?.slice(0, 5).map((task: any) => (
              <Card key={task.id} className="bg-gray-900 border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{task.title}</h4>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-600 mb-2">{task.reward} SKY</Badge>
                  <p className="text-xs text-gray-400">{task.assignedAgents} agents</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
