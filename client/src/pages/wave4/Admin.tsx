// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: users, isLoading: usersLoading } = trpc.wave4Admin.getUsers.useQuery({
    limit: 20,
  });

  const { data: reports, isLoading: reportsLoading } = trpc.wave4Admin.getReports.useQuery({
    limit: 20,
  });

  const { data: health } = trpc.wave4Admin.getHealth.useQuery();
  const { data: analytics } = trpc.wave4Admin.getAnalytics.useQuery();

  const banUserMutation = trpc.wave4Admin.banUser.useMutation({
    onSuccess: () => {
      toast.success('User banned successfully');
    },
  });

  const resolveReportMutation = trpc.wave4Admin.resolveReport.useMutation({
    onSuccess: () => {
      toast.success('Report resolved');
    },
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <p className="text-red-600">Admin access required</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, reports, and platform health</p>
      </div>

      {/* Health Stats */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{health.users}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold">{health.posts}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Banned Users</p>
            <p className="text-2xl font-bold text-red-600">{health.bannedUsers}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Open Reports</p>
            <p className="text-2xl font-bold text-yellow-600">{health.openReports}</p>
          </Card>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">24h Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold">{analytics.users24h}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Posts</p>
              <p className="text-2xl font-bold">{analytics.posts24h}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold">{analytics.transactions24h}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">${analytics.revenue24h.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {usersLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-2">
              {users?.users.map((u: any) => (
                <Card key={u.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-500">Posts: {u._count.posts}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      banUserMutation.mutate({
                        userId: u.id,
                        reason: 'Admin action',
                      });
                    }}
                  >
                    Ban
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {reportsLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-2">
              {reports?.reports.map((r: any) => (
                <Card key={r.id} className="p-4">
                  <p className="font-semibold">Report from {r.reporter?.name}</p>
                  <p className="text-sm text-gray-600 mt-2">{r.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">Against: {r.reportedUser?.name}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        resolveReportMutation.mutate({
                          reportId: r.id,
                          action: 'resolved',
                        });
                      }}
                    >
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resolveReportMutation.mutate({
                          reportId: r.id,
                          action: 'dismissed',
                        });
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card className="p-6">
            <p className="text-gray-600">Audit logs coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
