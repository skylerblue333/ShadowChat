// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

const AnalyticsPage: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState<'user' | 'platform' | 'trading' | 'social' | 'marketplace' | 'learning'>('user');

  // Queries
  const userAnalyticsQuery = trpc.analytics.dashboard.useQuery(undefined, { enabled: isAuthenticated });
  const platformAnalyticsQuery = trpc.analytics.platformStats.useQuery(undefined, { enabled: true });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {(['user', 'platform', 'trading', 'social', 'marketplace', 'learning'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* User Analytics */}
      {activeTab === 'user' && isAuthenticated && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userAnalyticsQuery.isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : userAnalyticsQuery.data ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userAnalyticsQuery.data.summary?.posts || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userAnalyticsQuery.data.summary?.followers || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userAnalyticsQuery.data.summary?.engagement || 0}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${userAnalyticsQuery.data.summary?.walletBalance || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userAnalyticsQuery.data.summary?.gamesPlayed || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userAnalyticsQuery.data.summary?.coursesEnrolled || 0}</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* Platform Analytics */}
      {activeTab === 'platform' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platformAnalyticsQuery.isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : platformAnalyticsQuery.data ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{platformAnalyticsQuery.data.users || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{platformAnalyticsQuery.data.features || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Marketplace Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${platformAnalyticsQuery.data.marketplaceVolume || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${platformAnalyticsQuery.data.totalDonated || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Software Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${platformAnalyticsQuery.data.softwareValue || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rarity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{platformAnalyticsQuery.data.rarity}</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* Trading Analytics */}
      {activeTab === 'trading' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit/Loss</p>
                <p className="text-2xl font-bold text-green-600">$0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg P/L</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Analytics */}
      {activeTab === 'social' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Social Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Posts</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Likes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Comments</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marketplace Analytics */}
      {activeTab === 'marketplace' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Listings</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sales</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Analytics */}
      {activeTab === 'learning' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Enrolled</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;
