import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Download, Filter, Search, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: "send" | "receive" | "stake" | "unstake" | "swap" | "purchase";
  amount: number;
  currency: string;
  counterparty: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  hash: string;
  fee?: number;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "stake",
    amount: 1000,
    currency: "SKY4",
    counterparty: "Staking Pool",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    status: "completed",
    hash: "0x123abc...",
    fee: 0.5,
  },
  {
    id: "2",
    type: "receive",
    amount: 50,
    currency: "DOGE",
    counterparty: "Referral Bonus",
    timestamp: new Date(Date.now() - 2000 * 60 * 60),
    status: "completed",
    hash: "0x456def...",
  },
  {
    id: "3",
    type: "swap",
    amount: 100,
    currency: "ETH",
    counterparty: "SKY4",
    timestamp: new Date(Date.now() - 3000 * 60 * 60),
    status: "completed",
    hash: "0x789ghi...",
    fee: 2,
  },
  {
    id: "4",
    type: "send",
    amount: 25,
    currency: "SKY4",
    counterparty: "0x7a2b...c9d8",
    timestamp: new Date(Date.now() - 4000 * 60 * 60),
    status: "pending",
    hash: "0xabc123...",
    fee: 0.1,
  },
  {
    id: "5",
    type: "purchase",
    amount: 99.99,
    currency: "USD",
    counterparty: "Marketplace",
    timestamp: new Date(Date.now() - 5000 * 60 * 60),
    status: "completed",
    hash: "0xdef456...",
  },
];

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === filterStatus);
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else if (sortBy === "highest") {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "lowest") {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    return filtered;
  }, [searchTerm, filterType, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const totalSent = mockTransactions
      .filter((tx) => tx.type === "send")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalReceived = mockTransactions
      .filter((tx) => tx.type === "receive")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalFees = mockTransactions.reduce((sum, tx) => sum + (tx.fee || 0), 0);

    return { totalSent, totalReceived, totalFees };
  }, []);

  const getTypeIcon = (type: string) => {
    return type === "send" || type === "unstake" ? (
      <ArrowUpRight className="w-4 h-4 text-red-400" />
    ) : (
      <ArrowDownLeft className="w-4 h-4 text-green-400" />
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
    if (status === "pending") return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
    return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-slate-400">View and manage all your transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Sent</p>
                  <p className="text-2xl font-bold text-red-400">${stats.totalSent.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Received</p>
                  <p className="text-2xl font-bold text-green-400">${stats.totalReceived.toFixed(2)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Fees</p>
                  <p className="text-2xl font-bold text-purple-400">${stats.totalFees.toFixed(2)}</p>
                </div>
                <Filter className="w-8 h-8 text-purple-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by address or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="stake">Stake</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No transactions found</p>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-slate-600 rounded-lg">{getTypeIcon(tx.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-white capitalize">{tx.type}</p>
                        <p className="text-sm text-slate-400">{tx.counterparty}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white">
                        {tx.type === "send" || tx.type === "unstake" ? "-" : "+"}
                        {tx.amount} {tx.currency}
                      </p>
                      <p className="text-sm text-slate-400">
                        {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="ml-4">{getStatusBadge(tx.status)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TransactionHistory;
