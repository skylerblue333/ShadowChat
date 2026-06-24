import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Shield, Users, Flag, CheckCircle, XCircle, Ban, Crown, Eye, Search, AlertTriangle, BarChart3, RefreshCw, Activity } from "lucide-react";
import { toast } from "sonner";

type Tab = "users" | "reports" | "stats";

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");

  // Live DB queries — no mock data
  const { data: adminStats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, { refetchInterval: 30000 });
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.users.useQuery(
    { limit: 50, offset: 0, search: search || undefined },
    { enabled: tab === "users" }
  );
  const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports } = trpc.admin.moderationQueue.useQuery(
    { limit: 50 },
    { enabled: tab === "reports" }
  );

  const banUserMutation = trpc.moderation.banUser.useMutation({
    onSuccess: () => { toast.error("User banned"); refetchUsers(); },
    onError: (e) => toast.error(e.message),
  });
  const promoteUserMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast.success("User promoted to admin"); refetchUsers(); },
    onError: (e) => toast.error(e.message),
  });

  if (!user) return (
    <div className="container py-20 text-center">
      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Admin access required. Please log in.</p>
    </div>
  );

  if (user.role !== "admin") return (
    <div className="container py-20 text-center">
      <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">Access Denied</h2>
      <p className="text-muted-foreground">You need admin privileges to access this panel.</p>
    </div>
  );

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full ml-auto">● Live Data</span>
      </div>

      {/* Live KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: statsLoading ? "…" : (adminStats?.totalUsers ?? 0).toLocaleString(), color: "text-primary" },
          { icon: Activity, label: "Online Now", value: statsLoading ? "…" : (adminStats?.onlineUsers ?? 0).toLocaleString(), color: "text-green-400" },
          { icon: Flag, label: "Connections", value: statsLoading ? "…" : (adminStats?.connections ?? 0).toLocaleString(), color: "text-yellow-400" },
          { icon: CheckCircle, label: "Status", value: statsLoading ? "…" : (adminStats?.health ?? "—"), color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["users", "reports", "stats"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Link href="/security" className="btn-secondary text-xs flex items-center gap-1.5"><Shield className="w-3 h-3" />Security</Link>
          <Link href="/audit-log" className="btn-secondary text-xs flex items-center gap-1.5"><Eye className="w-3 h-3" />Audit Log</Link>
        </div>
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email…"
              className="flex-1 bg-transparent text-sm outline-none" />
            <button onClick={() => refetchUsers()} className="text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {usersLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading users…</div>
          ) : !Array.isArray(usersData) || usersData.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Posts</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr></thead>
                <tbody>
                  {(usersData as any[]).map((u: any) => (
                    <tr key={u.id} className="border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.username || u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isBanned ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-400"}`}>
                          {u.isBanned ? "banned" : "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.postCount ?? 0}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {u.role !== "admin" && (
                            <button onClick={() => promoteUserMutation.mutate({ userId: u.id, role: "admin" })}
                              disabled={promoteUserMutation.isPending}
                              className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Crown className="w-3 h-3" />Promote
                            </button>
                          )}
                          {!u.isBanned && (
                            <button onClick={() => banUserMutation.mutate({ userId: u.id, reason: "Admin action", duration: 0 })}
                              disabled={banUserMutation.isPending}
                              className="text-xs text-destructive hover:underline flex items-center gap-1">
                              <Ban className="w-3 h-3" />Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reports/Moderation Tab */}
      {tab === "reports" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => refetchReports()} className="btn-secondary text-xs flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {reportsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading moderation queue…</div>
          ) : !Array.isArray(reportsData) || reportsData.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-muted-foreground">No pending moderation items. Platform is clean.</p>
            </div>
          ) : (
            (reportsData as any[]).map((r: any) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${r.action === "ban" ? "text-destructive" : "text-yellow-400"}`} />
                    <span className="text-sm font-medium capitalize">{r.action ?? r.type ?? "report"}</span>
                    <span className="text-xs text-muted-foreground">
                      by {r.moderatorName ?? r.moderatorId} on user {r.targetUserId ?? r.targetId}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                {r.reason && (
                  <p className="text-sm text-muted-foreground bg-secondary/50 rounded px-3 py-2 italic">"{r.reason}"</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats Tab */}
      {tab === "stats" && (
        <div className="grid md:grid-cols-2 gap-4">
          {statsLoading ? (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">Loading stats…</div>
          ) : (
            <>
              {[
                { label: "Total Users", value: (adminStats?.totalUsers ?? 0).toLocaleString() },
                { label: "Total Posts", value: (adminStats?.totalPosts ?? 0).toLocaleString() },
                { label: "Total Streams", value: (adminStats?.totalStreams ?? 0).toLocaleString() },
                { label: "Total Communities", value: (adminStats?.totalCommunities ?? 0).toLocaleString() },
                { label: "Staking Positions", value: (adminStats?.totalStakingPositions ?? 0).toLocaleString() },
                { label: "Online Now", value: (adminStats?.onlineUsers ?? 0).toLocaleString() },
                { label: "Active Connections", value: (adminStats?.connections ?? 0).toLocaleString() },
                { label: "System Health", value: adminStats?.health ?? "—" },
              ].map((s, i) => (
                <div key={i} className="card p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div className="text-2xl font-bold">{s.value}</div>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 card p-4 text-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Full analytics in{" "}
                  <Link href="/analytics" className="text-primary hover:underline">Analytics Dashboard →</Link>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
