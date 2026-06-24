// @ts-nocheck
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, TrendingUp, Heart, ShoppingCart, Target, Vote, Zap, X } from "lucide-react";

export default function NotificationsHub() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { data: notifications } = trpc.notifications.getNotifications.useQuery({ limit: 50 });
  const { data: trading } = trpc.notifications.getTradingAlerts.useQuery({ symbol: undefined });
  const { data: marketplace } = trpc.notifications.getMarketplaceAlerts.useQuery();
  const { data: social } = trpc.notifications.getSocialAlerts.useQuery();

  const getIconForType = (type: string) => {
    switch (type) {
      case "trading_signal": return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case "new_follower": return <Heart className="w-5 h-5 text-pink-400" />;
      case "marketplace": return <ShoppingCart className="w-5 h-5 text-cyan-400" />;
      case "charity": return <Target className="w-5 h-5 text-purple-400" />;
      case "governance": return <Vote className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getGradientForType = (type: string) => {
    switch (type) {
      case "trading_signal": return "from-yellow-900/20 to-yellow-900/5 border-yellow-500/20";
      case "new_follower": return "from-pink-900/20 to-pink-900/5 border-pink-500/20";
      case "marketplace": return "from-cyan-900/20 to-cyan-900/5 border-cyan-500/20";
      case "charity": return "from-green-900/20 to-green-900/5 border-purple-500/20";
      case "governance": return "from-purple-900/20 to-purple-900/5 border-purple-500/20";
      default: return "from-blue-900/20 to-blue-900/5 border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications Hub</h1>
              <p className="text-slate-400">Stay updated with real-time alerts</p>
            </div>
          </div>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            {notifications?.unreadCount || 0} Unread
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="marketplace">Market</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-4">
            {notifications?.notifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`group relative overflow-hidden rounded-lg border bg-gradient-to-r ${getGradientForType(notif.type)} p-4 transition-all hover:border-opacity-100 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="mt-1">{getIconForType(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{notif.title}</h3>
                      {!notif.read && <div className="w-2 h-2 bg-cyan-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-slate-300">{notif.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Trading Alerts */}
          <TabsContent value="trading" className="space-y-4">
            {trading?.alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="group relative overflow-hidden rounded-lg border from-yellow-900/20 to-yellow-900/5 border-yellow-500/20 bg-gradient-to-r p-4 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
              >
                <div className="relative flex items-start gap-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{alert.symbol}</h3>
                      <Badge className={alert.signal === "BUY" ? "bg-purple-600/20 text-purple-400" : "bg-blue-500/20 text-blue-300"}>
                        {alert.signal}
                      </Badge>
                      <Badge className="bg-slate-700 text-slate-300">
                        {Math.round(alert.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">
                      Price: ${alert.price} → Target: ${alert.target || "N/A"}
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    Trade
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Marketplace Alerts */}
          <TabsContent value="marketplace" className="space-y-4">
            {marketplace?.alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="group relative overflow-hidden rounded-lg border from-cyan-900/20 to-cyan-900/5 border-cyan-500/20 bg-gradient-to-r p-4 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="relative flex items-start gap-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{alert.message}</h3>
                    <p className="text-sm text-slate-300">{alert.seller || alert.item}</p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Social Alerts */}
          <TabsContent value="social" className="space-y-4">
            {social?.alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="group relative overflow-hidden rounded-lg border from-pink-900/20 to-pink-900/5 border-pink-500/20 bg-gradient-to-r p-4 transition-all hover:shadow-lg hover:shadow-pink-500/20"
              >
                <div className="relative flex items-start gap-4">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{alert.user}</h3>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Activity Feed */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="text-center text-slate-400">
                <Zap className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                <p>Real-time activity feed coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border-cyan-500/20 p-4">
            <div className="text-sm text-slate-400 mb-2">Trading Alerts</div>
            <div className="text-2xl font-bold text-cyan-400">{trading?.alerts.length || 0}</div>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border-yellow-500/20 p-4">
            <div className="text-sm text-slate-400 mb-2">Marketplace</div>
            <div className="text-2xl font-bold text-yellow-400">{marketplace?.alerts.length || 0}</div>
          </Card>
          <Card className="bg-gradient-to-br from-pink-900/20 to-pink-900/5 border-pink-500/20 p-4">
            <div className="text-sm text-slate-400 mb-2">Social</div>
            <div className="text-2xl font-bold text-pink-400">{social?.alerts.length || 0}</div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-500/20 p-4">
            <div className="text-sm text-slate-400 mb-2">Total</div>
            <div className="text-2xl font-bold text-purple-400">
              {(trading?.alerts.length || 0) + (marketplace?.alerts.length || 0) + (social?.alerts.length || 0)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
