// @ts-nocheck
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  BarChart3,
  AlertCircle,
  TrendingUp,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch admin stats
  const { data: stats } = trpc.admin.getStats.useQuery();

  // Fetch users list
  const { data: users } = trpc.admin.listUsers.useQuery({
    search: searchQuery || undefined,
    limit: 50,
    page: 1,
  });

  // Fetch audit logs
  const { data: auditLogs } = trpc.admin.getAuditLogs.useQuery({
    limit: 20,
  });

  // Fetch reports
  const { data: reports } = trpc.admin.getReports.useQuery({
    limit: 20,
  });

  // Ban user mutation
  const banUserMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      alert('User banned');
      trpc.useUtils().admin.listUsers.invalidate();
    },
  });

  // Approve report mutation
  const approveReportMutation = trpc.admin.approveReport.useMutation({
    onSuccess: () => {
      alert('Report approved');
      trpc.useUtils().admin.getReports.invalidate();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform management and monitoring</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-purple-400 mt-3">
              +{stats?.newUsersToday} today
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Sessions</p>
                <p className="text-3xl font-bold">{stats?.activeSessions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {((stats?.activeSessions || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% online
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Reports</p>
                <p className="text-3xl font-bold">{stats?.pendingReports}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-red-600 mt-3">
              Requires attention
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">System Health</p>
                <p className="text-3xl font-bold">{stats?.systemHealth}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-400 mt-3">
              All systems operational
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Management</h2>
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.users && users.users.length > 0 ? (
                      users.users.map((user: any) => (
                        <tr key={user.id} className="border-b hover:bg-accent/5">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.id}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                user.status === 'active'
                                  ? 'bg-purple-600/10 text-purple-400'
                                  : 'bg-red-500/10 text-red-700'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => banUserMutation.mutate({ userId: user.id })}
                                disabled={banUserMutation.isPending}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Moderation Reports</h2>

              <div className="space-y-4">
                {reports && reports.length > 0 ? (
                  reports.map((report: any) => (
                    <div
                      key={report.id}
                      className="p-4 border rounded-lg flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{report.type}</p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              report.priority === 'high'
                                ? 'bg-red-500/10 text-red-700'
                                : 'bg-yellow-500/10 text-yellow-700'
                            }`}
                          >
                            {report.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reported by {report.reporterName} • {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveReportMutation.mutate({ reportId: report.id })}
                          disabled={approveReportMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No pending reports
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Audit Logs</h2>

              <div className="space-y-3">
                {auditLogs && auditLogs.length > 0 ? (
                  auditLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="p-3 border rounded-lg text-sm"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold">{log.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        {log.actor} • {log.resource}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.details}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No audit logs
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">User Growth (7 days)</h3>
                <div className="h-48 bg-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Transaction Volume</h3>
                <div className="h-48 bg-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Error Rate (24h)</h3>
                <div className="h-48 bg-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">API Performance</h3>
                <div className="h-48 bg-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal (Simplified) */}
        {selectedUser && (
          <Card className="p-6 mt-6 border-2 border-blue-600">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">User Details</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">{selectedUser.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
