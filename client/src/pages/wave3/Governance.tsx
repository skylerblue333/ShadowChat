// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const GovernancePage: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState<'proposals' | 'treasury' | 'votes' | 'create'>('proposals');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'governance' | 'treasury' | 'feature' | 'other'>('governance');

  // Queries
  const proposalsQuery = trpc.governance.proposals.useQuery(undefined, { enabled: true });
  const treasuryQuery = trpc.governance.getTreasury.useQuery(undefined, { enabled: true });
  const votesQuery = trpc.governance.myStaking.useQuery(undefined, { enabled: isAuthenticated });

  // Mutations
  const voteQuery = trpc.governance.vote.useMutation({
    onSuccess: () => {
      proposalsQuery.refetch();
      toast.success('Vote recorded!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to vote');
    },
  });

  const handleVote = async (proposalId: number, choice: 'for' | 'against') => {
    await voteQuery.mutateAsync({
      proposalId,
      choice,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Governance</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['proposals', 'treasury', 'votes', 'create'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals Tab */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {proposalsQuery.isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (proposalsQuery.data || []).length > 0 ? (
            (proposalsQuery.data || []).map((proposal: any) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">For</p>
                      <p className="font-bold">{proposal.votesFor || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Against</p>
                      <p className="font-bold">{proposal.votesAgainst || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-bold capitalize">{proposal.status}</p>
                    </div>
                  </div>
                  {isAuthenticated && proposal.status === 'active' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVote(proposal.id, 'for')}
                        disabled={voteQuery.isPending}
                        className="flex-1"
                        variant="default"
                      >
                        Vote For
                      </Button>
                      <Button
                        onClick={() => handleVote(proposal.id, 'against')}
                        disabled={voteQuery.isPending}
                        className="flex-1"
                        variant="outline"
                      >
                        Vote Against
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No proposals</p>
          )}
        </div>
      )}

      {/* Treasury Tab */}
      {activeTab === 'treasury' && (
        <Card>
          <CardHeader>
            <CardTitle>Treasury</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {treasuryQuery.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">${treasuryQuery.data?.balance || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold">${treasuryQuery.data?.totalIncome || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Expense</p>
                    <p className="text-2xl font-bold">${treasuryQuery.data?.totalExpense || 0}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Transactions</h4>
                  {(treasuryQuery.data?.transactions || []).slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="p-2 rounded border border-border text-sm">
                      <div className="flex justify-between">
                        <span>{tx.description}</span>
                        <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Votes Tab */}
      {activeTab === 'votes' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>My Voting Power</CardTitle>
          </CardHeader>
          <CardContent>
            {votesQuery.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : votesQuery.data ? (
              <div className="space-y-2">
                {Object.entries(votesQuery.data).map(([eco, power]: [string, any]) => (
                  <div key={eco} className="p-3 rounded-lg border border-border flex justify-between">
                    <span className="font-medium">{eco}</span>
                    <span className="font-bold">{power} power</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No staking data</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Create Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Proposal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Proposal description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="governance">Governance</option>
                <option value="treasury">Treasury</option>
                <option value="feature">Feature</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button className="w-full">Create Proposal</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GovernancePage;
