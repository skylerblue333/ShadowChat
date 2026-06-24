import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Zap, AlertCircle, BarChart3, Settings, Ban, CheckCircle } from 'lucide-react';

export default function AdvancedAdminPanel() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', joinDate: '2024-01-15', lastActive: '2 hours ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'moderator', status: 'active', joinDate: '2024-02-20', lastActive: '30 mins ago' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'user', status: 'suspended', joinDate: '2024-03-10', lastActive: '5 days ago' },
    { id: '4', name: 'David Brown', email: 'david@example.com', role: 'user', status: 'active', joinDate: '2024-04-05', lastActive: '1 hour ago' },
    { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'moderator', status: 'active', joinDate: '2024-05-12', lastActive: '15 mins ago' },
  ];

  const flaggedContent = [
    { id: '1', type: 'Post', author: 'User123', reason: 'Hate speech', severity: 'high', reported: '2 hours ago', status: 'pending' },
    { id: '2', type: 'Comment', author: 'User456', reason: 'Spam', severity: 'medium', reported: '4 hours ago', status: 'reviewed' },
    { id: '3', type: 'Post', author: 'User789', reason: 'Misinformation', severity: 'high', reported: '1 day ago', status: 'removed' },
    { id: '4', type: 'Message', author: 'User012', reason: 'Harassment', severity: 'high', reported: '2 days ago', status: 'pending' },
  ];

  const systemMetrics = [
    { label: 'Total Users', value: '12,547', change: '+2.3%', icon: Users },
    { label: 'Active Sessions', value: '3,421', change: '+5.1%', icon: Zap },
    { label: 'Flagged Content', value: '47', change: '+12%', icon: AlertCircle },
    { label: 'Suspended Accounts', value: '23', change: '-1.2%', icon: Ban },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage users, content moderation, and platform settings</p>
        </div>

        {/* System Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          {systemMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                      <p className="text-xs text-green-500 mt-1">{metric.change}</p>
                    </div>
                    <Icon className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Controls */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 mb-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-muted border-border"
                  />
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40 bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Active</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={
                              user.role === 'admin' ? 'bg-red-600' :
                              user.role === 'moderator' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={
                              user.status === 'active' ? 'bg-green-600' :
                              'bg-yellow-600'
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{user.joinDate}</td>
                          <td className="py-3 px-4 text-muted-foreground">{user.lastActive}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="destructive">Suspend</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Moderation */}
          <TabsContent value="moderation" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Content Moderation Queue</CardTitle>
                <CardDescription>Review and take action on flagged content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {flaggedContent.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={
                              item.severity === 'high' ? 'bg-red-600' :
                              item.severity === 'medium' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            }>
                              {item.severity}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">{item.type}</span>
                            <span className="text-xs text-muted-foreground">by {item.author}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Reason: {item.reason}</p>
                          <p className="text-xs text-muted-foreground">Reported {item.reported}</p>
                        </div>
                        <Badge className={
                          item.status === 'pending' ? 'bg-orange-600' :
                          item.status === 'reviewed' ? 'bg-blue-600' :
                          'bg-red-600'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                        <Button size="sm" variant="destructive">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global platform settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground mb-3">Enable maintenance mode to temporarily disable user access</p>
                    <Button variant="outline">Enable Maintenance Mode</Button>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground mb-3">Configure API rate limits and request throttling</p>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Requests per minute</label>
                        <Input type="number" defaultValue="100" className="bg-muted border-border mt-1" />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Security Policies</h3>
                    <p className="text-sm text-muted-foreground mb-3">Manage security policies and access controls</p>
                    <Button variant="outline">Configure Security Policies</Button>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Backup & Recovery</h3>
                    <p className="text-sm text-muted-foreground mb-3">Manage database backups and disaster recovery</p>
                    <div className="flex gap-2">
                      <Button variant="outline">Create Backup</Button>
                      <Button variant="outline">Restore Backup</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
