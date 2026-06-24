// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const NotificationsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Queries
  const notificationsQuery = trpc.wave2Notifications.getNotifications.useQuery(
    { limit: 50, unreadOnly },
    { enabled: isAuthenticated }
  );

  const unreadCountQuery = trpc.wave2Notifications.getUnreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const statsQuery = trpc.wave2Notifications.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const markReadMutation = trpc.wave2Notifications.markRead.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      unreadCountQuery.refetch();
      toast.success('Marked as read');
    },
  });

  const markAllReadMutation = trpc.wave2Notifications.markAllRead.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      unreadCountQuery.refetch();
      toast.success('All marked as read');
    },
  });

  const deleteNotificationMutation = trpc.wave2Notifications.deleteNotification.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      toast.success('Notification deleted');
    },
  });

  const deleteAllMutation = trpc.wave2Notifications.deleteAll.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      toast.success('All notifications cleared');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in to view notifications.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          {unreadCountQuery.data && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCountQuery.data.unreadCount} unread
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutateAsync()}
            disabled={markAllReadMutation.isPending}
          >
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={() => deleteAllMutation.mutateAsync()}
            disabled={deleteAllMutation.isPending}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      {statsQuery.data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{statsQuery.data.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold">{statsQuery.data.unread}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Types</p>
              <p className="text-2xl font-bold">{Object.keys(statsQuery.data.byType).length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="unreadOnly"
          checked={unreadOnly}
          onChange={(e) => setUnreadOnly(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="unreadOnly" className="text-sm font-medium cursor-pointer">
          Unread only
        </label>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {notificationsQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (notificationsQuery.data?.notifications || []).length > 0 ? (
            <div className="space-y-2">
              {(notificationsQuery.data?.notifications || []).map((notif: any) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notif.read
                      ? 'border-border bg-background'
                      : 'border-primary/50 bg-primary/5'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutateAsync({ id: notif.id })}
                          disabled={markReadMutation.isPending}
                        >
                          Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotificationMutation.mutateAsync({ id: notif.id })}
                        disabled={deleteNotificationMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
