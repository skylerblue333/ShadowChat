import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Trophy,
  BarChart3,
  Gift,
  Zap,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

function formatSKY(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function EconomicLayer() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: balance } = trpc.economy.getBalance.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 15000,
  });

  const { data: ledger } = trpc.economy.getLedger.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  const { data: feeSchedule } = trpc.economy.getFeeSchedule.useQuery();
  const { data: treasury } = trpc.economy.getTreasuryStats.useQuery();
  const { data: econStats } = trpc.economy.getEconomicStats.useQuery();
  const { data: richList } = trpc.economy.getRichList.useQuery({ limit: 20 });

  const claimBonus = trpc.economy.claimWelcomeBonus.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message ?? "Welcome bonus claimed!");
        utils.economy.getBalance.invalidate();
        utils.economy.getLedger.invalidate();
      } else {
        toast.info(data.message ?? "Already claimed");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const chargeTest = trpc.economy.chargeActionFee.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Fee charged: ${formatSKY(data.fee)} SKY444`);
        utils.economy.getBalance.invalidate();
        utils.economy.getLedger.invalidate();
      } else {
        toast.error("Insufficient balance");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-900/30 rounded-xl">
            <Coins className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Economic Layer</h1>
            <p className="text-gray-400 text-sm">SKY444 token economy — fees, ledger, treasury</p>
          </div>
        </div>
        {user && (
          <Button
            size="sm"
            onClick={() => claimBonus.mutate()}
            disabled={claimBonus.isPending}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Gift className="w-4 h-4 mr-1" />
            Claim Bonus
          </Button>
        )}
      </div>

      {/* Balance Card */}
      {user && balance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/20 border-yellow-800/50 col-span-2">
            <CardContent className="p-4">
              <p className="text-yellow-400 text-sm mb-1">Your Balance</p>
              <p className="text-3xl font-bold text-white">{formatSKY(balance.balance)}</p>
              <p className="text-yellow-300/70 text-xs mt-1">SKY444 tokens</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-green-400 text-xs mb-1">Total Earned</p>
              <p className="text-xl font-bold text-white">{formatSKY(balance.totalEarned)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-red-400 text-xs mb-1">Fees Paid</p>
              <p className="text-xl font-bold text-white">{formatSKY(balance.totalFeesPaid)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="ledger">
        <TabsList className="bg-gray-900 border border-gray-800 mb-6">
          <TabsTrigger value="ledger" className="data-[state=active]:bg-yellow-600">
            <BarChart3 className="w-4 h-4 mr-1" /> Ledger
          </TabsTrigger>
          <TabsTrigger value="fees" className="data-[state=active]:bg-yellow-600">
            <Zap className="w-4 h-4 mr-1" /> Fee Schedule
          </TabsTrigger>
          <TabsTrigger value="treasury" className="data-[state=active]:bg-yellow-600">
            <TrendingUp className="w-4 h-4 mr-1" /> Treasury
          </TabsTrigger>
          <TabsTrigger value="richlist" className="data-[state=active]:bg-yellow-600">
            <Trophy className="w-4 h-4 mr-1" /> Rich List
          </TabsTrigger>
        </TabsList>

        {/* Ledger Tab */}
        <TabsContent value="ledger">
          {!user ? (
            <div className="text-center py-16 text-gray-500">
              <Coins className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Sign in to view your transaction ledger</p>
            </div>
          ) : (ledger?.transactions ?? []).length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="mb-4">No transactions yet</p>
              <Button onClick={() => claimBonus.mutate()} className="bg-yellow-600 hover:bg-yellow-700">
                <Gift className="w-4 h-4 mr-2" />
                Claim Welcome Bonus
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {(ledger?.transactions ?? []).map((tx: { id: number; actionType: string; amount: number; fee: number; netAmount: number; direction: string; referenceId: string | null; referenceType: string | null; description: string | null; balanceAfter: number; createdAt: number }) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      tx.direction === "credit" ? "bg-green-900/30" : "bg-red-900/30"
                    }`}
                  >
                    {tx.direction === "credit" ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white capitalize">
                      {tx.actionType.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {tx.description ?? "—"} ·{" "}
                      {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        tx.direction === "credit" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {tx.direction === "credit" ? "+" : "-"}
                      {formatSKY(tx.amount)} SKY
                    </p>
                    {tx.fee > 0 && (
                      <p className="text-xs text-gray-600">fee: {formatSKY(tx.fee)}</p>
                    )}
                    <p className="text-xs text-gray-500">bal: {formatSKY(tx.balanceAfter)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Fee Schedule Tab */}
        <TabsContent value="fees">
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Flat Fees (SKY444)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(feeSchedule?.flatFees ?? {})
                    .filter(([, v]) => v > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([action, fee]) => (
                      <div
                        key={action}
                        className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
                      >
                        <span className="text-sm text-gray-300 capitalize">
                          {action.replace(/_/g, " ")}
                        </span>
                        <Badge className="bg-yellow-900/50 text-yellow-300">
                          {formatSKY(fee)} SKY
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Percentage Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(feeSchedule?.percentageFees ?? {}).map(([action, pct]) => (
                    <div
                      key={action}
                      className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-300 capitalize">
                        {action.replace(/_/g, " ")}
                      </span>
                      <Badge className="bg-orange-900/50 text-orange-300">
                        {(pct * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {user && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Test Action Fee</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {["post", "comment", "governance_vote", "nft_mint", "stream_start"].map((action) => (
                    <Button
                      key={action}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        chargeTest.mutate({ actionType: action, description: `Test: ${action}` })
                      }
                      disabled={chargeTest.isPending}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 capitalize"
                    >
                      {action.replace(/_/g, " ")} ({formatSKY(feeSchedule?.flatFees[action] ?? 0)} SKY)
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Treasury Tab */}
        <TabsContent value="treasury">
          <div className="space-y-4">
            {econStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{econStats.activeWallets}</p>
                    <p className="text-xs text-gray-400 mt-1">Active Wallets</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {formatSKY(econStats.totalCirculating)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Circulating SKY</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">{econStats.dailyTxCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Daily Transactions</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {formatSKY(econStats.dailyTxVolume)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Daily Volume</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {treasury && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    Treasury — {formatSKY(treasury.grandTotal)} SKY444 collected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {treasury.byAction.map((item: { action: string; total: number }) => (
                    <div
                      key={item.action}
                      className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-300 capitalize flex-1">
                        {item.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-yellow-400">
                        {formatSKY(item.total)} SKY
                      </span>
                    </div>
                  ))}
                  {treasury.byAction.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No fees collected yet. Perform actions to generate treasury revenue.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Rich List Tab */}
        <TabsContent value="richlist">
          <div className="space-y-2">
            {(richList?.richList ?? []).map((entry: { rank: number; userId: number; name: string; username: string; balance: number; totalEarned: number }) => (
              <div
                key={entry.userId}
                className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800"
              >
                <span
                  className={`text-lg font-bold w-8 text-center ${
                    entry.rank === 1
                      ? "text-yellow-400"
                      : entry.rank === 2
                      ? "text-gray-300"
                      : entry.rank === 3
                      ? "text-orange-400"
                      : "text-gray-600"
                  }`}
                >
                  #{entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-gray-500">@{entry.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-400">{formatSKY(entry.balance)} SKY</p>
                  <p className="text-xs text-gray-500">earned: {formatSKY(entry.totalEarned)}</p>
                </div>
              </div>
            ))}
            {(richList?.richList ?? []).length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No wallets yet. Claim your welcome bonus to appear on the rich list!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
