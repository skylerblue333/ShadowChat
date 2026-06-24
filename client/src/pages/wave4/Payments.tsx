// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const { isAuthenticated } = useAuth();
  const [payoutAmount, setPayoutAmount] = useState('');

  const { data: methods } = trpc.wave4Payments.getPaymentMethods.useQuery();
  const { data: history, isLoading: historyLoading } = trpc.wave4Payments.getBillingHistory.useQuery({
    limit: 20,
  });
  const { data: subscriptions } = trpc.wave4Payments.getSubscriptions.useQuery();
  const { data: payouts } = trpc.wave4Payments.getPayouts.useQuery({ limit: 20 });
  const { data: stats } = trpc.wave4Payments.getPaymentStats.useQuery();

  const requestPayoutMutation = trpc.wave4Payments.requestPayout.useMutation({
    onSuccess: () => {
      toast.success('Payout requested!');
      setPayoutAmount('');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <p className="text-gray-600">Please log in to access Payments</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Billing</h1>
        <p className="text-gray-600">Manage your payment methods and billing</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Earned</p>
            <p className="text-2xl font-bold text-green-600">${stats.totalEarned.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pending Payouts</p>
            <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Last Transaction</p>
            <p className="text-sm font-semibold">
              {stats.lastTransaction ? new Date(stats.lastTransaction).toLocaleDateString() : 'None'}
            </p>
          </Card>
        </div>
      )}

      <Tabs defaultValue="methods" className="w-full">
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Payment Methods</h3>
            {methods && methods.length > 0 ? (
              <div className="space-y-2">
                {methods.map((m: any) => (
                  <Card key={m.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold capitalize">{m.type}</p>
                      <p className="text-sm text-gray-600">•••• {m.lastFour}</p>
                      {m.isDefault && <p className="text-xs text-blue-600 mt-1">Default</p>}
                    </div>
                    <p className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No payment methods added</p>
            )}
          </Card>
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="history" className="space-y-4">
          {historyLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-2">
              {history?.transactions.map((t: any) => (
                <Card key={t.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold capitalize">{t.type}</p>
                    <p className="text-sm text-gray-600">${t.amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{t.status}</p>
                    <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-4">
          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-2">
              {subscriptions.map((s: any) => (
                <Card key={s.id} className="p-4">
                  <p className="font-semibold">{s.plan?.name}</p>
                  <p className="text-sm text-gray-600">${s.plan?.price}/month</p>
                  <p className="text-xs text-gray-500 mt-2">Status: {s.status}</p>
                  <p className="text-xs text-gray-500">
                    Renews: {new Date(s.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-gray-600">No active subscriptions</p>
            </Card>
          )}
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Request Payout</h3>
            <div className="space-y-4">
              <Input
                placeholder="Amount"
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (payoutAmount) {
                    requestPayoutMutation.mutate({
                      amount: parseFloat(payoutAmount),
                      paymentMethodId: 'default',
                    });
                  }
                }}
                disabled={requestPayoutMutation.isPending || !payoutAmount}
              >
                Request Payout
              </Button>
            </div>
          </Card>

          <h3 className="text-lg font-semibold">Payout History</h3>
          <div className="space-y-2">
            {payouts?.map((p: any) => (
              <Card key={p.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">${p.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 capitalize">{p.status}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(p.requestedAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
