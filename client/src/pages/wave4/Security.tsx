// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SecurityPage() {
  const { isAuthenticated } = useAuth();
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'sms' | 'email'>('totp');

  const { data: sessions, isLoading: sessionsLoading } = trpc.wave4Security.getSessions.useQuery({
    limit: 20,
  });

  const { data: loginHistory } = trpc.wave4Security.getLoginHistory.useQuery({ limit: 20 });
  const { data: alerts } = trpc.wave4Security.getSecurityAlerts.useQuery({ limit: 20 });
  const { data: securityScore } = trpc.wave4Security.getSecurityScore.useQuery();

  const setupMFAMutation = trpc.wave4Security.setupMFA.useMutation({
    onSuccess: () => {
      toast.success('MFA setup initiated');
    },
  });

  const revokeSessionMutation = trpc.wave4Security.revokeSession.useMutation({
    onSuccess: () => {
      toast.success('Session revoked');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <p className="text-gray-600">Please log in to access Security settings</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and sessions</p>
      </div>

      {/* Security Score */}
      {securityScore && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-bold mb-4">Security Score</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-blue-600">{securityScore.score}</div>
            <div>
              <p className="text-lg font-semibold capitalize">{securityScore.level} Security</p>
              {securityScore.recommendations.length > 0 && (
                <div className="mt-2 space-y-1">
                  {securityScore.recommendations.map((rec: string, i: number) => (
                    <p key={i} className="text-sm text-gray-600">• {rec}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Login History</TabsTrigger>
          <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          {sessionsLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-2">
              {sessions?.map((s: any) => (
                <Card key={s.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{s.device}</p>
                    <p className="text-sm text-gray-600">{s.location}</p>
                    <p className="text-xs text-gray-500">Last active: {new Date(s.lastActive).toLocaleString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      revokeSessionMutation.mutate({ sessionId: s.id });
                    }}
                  >
                    Revoke
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Login History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="space-y-2">
            {loginHistory?.logs.map((log: any) => (
              <Card key={log.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{log.action}</p>
                    <p className="text-sm text-gray-600">{log.details}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* MFA Tab */}
        <TabsContent value="mfa" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Set Up Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose method:</label>
                <div className="space-y-2">
                  {(['totp', 'sms', 'email'] as const).map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={method}
                        checked={mfaMethod === method}
                        onChange={(e) => setMfaMethod(e.target.value as any)}
                      />
                      <span className="capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => {
                  setupMFAMutation.mutate({ method: mfaMethod });
                }}
                disabled={setupMFAMutation.isPending}
              >
                Set Up {mfaMethod.toUpperCase()}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {alerts && alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert: any) => (
                <Card key={alert.id} className="p-4 border-l-4 border-yellow-500">
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-gray-600">{alert.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(alert.createdAt).toLocaleString()}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-gray-600">No security alerts</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
