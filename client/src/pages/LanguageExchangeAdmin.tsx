import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Flag,
  Ban,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface ModerationCase {
  id: string;
  type: "inappropriate_content" | "spam" | "harassment" | "fraud";
  reporter: string;
  reportedUser: string;
  description: string;
  timestamp: Date;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  evidence: string[];
  priority: "low" | "medium" | "high";
}

interface TeacherReport {
  id: string;
  teacherId: string;
  teacherName: string;
  rating: number;
  complaints: number;
  lastComplaint: Date;
  status: "active" | "suspended" | "banned";
  reason?: string;
}

const MOCK_CASES: ModerationCase[] = [
  {
    id: "case_1",
    type: "inappropriate_content",
    reporter: "user_123",
    reportedUser: "teacher_456",
    description: "Posted inappropriate content in community chat",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "investigating",
    evidence: ["message_id_1", "message_id_2"],
    priority: "high",
  },
  {
    id: "case_2",
    type: "spam",
    reporter: "user_789",
    reportedUser: "user_101",
    description: "Spamming promotional links in multiple sessions",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "pending",
    evidence: ["link_1", "link_2", "link_3"],
    priority: "medium",
  },
  {
    id: "case_3",
    type: "fraud",
    reporter: "system",
    reportedUser: "teacher_202",
    description: "Suspicious payment activity detected",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "resolved",
    evidence: ["transaction_1", "transaction_2"],
    priority: "high",
  },
];

const MOCK_TEACHERS: TeacherReport[] = [
  {
    id: "t1",
    teacherId: "teacher_456",
    teacherName: "李明",
    rating: 3.2,
    complaints: 5,
    lastComplaint: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "t2",
    teacherId: "teacher_789",
    teacherName: "Maria García",
    rating: 4.8,
    complaints: 0,
    lastComplaint: new Date(0),
    status: "active",
  },
  {
    id: "t3",
    teacherId: "teacher_202",
    teacherName: "Yuki Tanaka",
    rating: 2.1,
    complaints: 12,
    lastComplaint: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "suspended",
    reason: "Fraud investigation",
  },
];

const ACTIVITY_DATA = [
  { date: "Mon", reports: 12, resolved: 8, pending: 4 },
  { date: "Tue", reports: 15, resolved: 12, pending: 3 },
  { date: "Wed", reports: 10, resolved: 10, pending: 0 },
  { date: "Thu", reports: 18, resolved: 14, pending: 4 },
  { date: "Fri", reports: 22, resolved: 18, pending: 4 },
  { date: "Sat", reports: 8, resolved: 8, pending: 0 },
  { date: "Sun", reports: 5, resolved: 5, pending: 0 },
];

export function LanguageExchangeAdmin() {
  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);
  const [cases, setCases] = useState<ModerationCase[]>(MOCK_CASES);
  const [teachers, setTeachers] = useState<TeacherReport[]>(MOCK_TEACHERS);

  const handleResolveCase = (caseId: string, action: "approve" | "ban") => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, status: "resolved" as const } : c
      )
    );
    toast.success(`Case ${action === "ban" ? "banned user" : "approved"}`);
  };

  const handleSuspendTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.teacherId === teacherId
          ? { ...t, status: "suspended" as const, reason: "Admin action" }
          : t
      )
    );
    toast.success("Teacher suspended");
  };

  const handleBanTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.teacherId === teacherId
          ? { ...t, status: "banned" as const, reason: "Admin action" }
          : t
      )
    );
    toast.success("Teacher banned");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-red-400" />
              Moderation Dashboard
            </h1>
            <p className="text-gray-400">
              Manage reports, review teacher profiles, and maintain platform safety
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Cases</p>
                <p className="text-3xl font-bold text-red-400">
                  {cases.filter((c) => c.status === "pending").length}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Investigating</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {cases.filter((c) => c.status === "investigating").length}
                </p>
              </div>
              <Eye className="w-10 h-10 text-yellow-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-400">
                  {cases.filter((c) => c.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Suspended Teachers</p>
                <p className="text-3xl font-bold text-blue-400">
                  {teachers.filter((t) => t.status === "suspended").length}
                </p>
              </div>
              <Ban className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="cases" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="cases">Moderation Cases</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Moderation Cases Tab */}
          <TabsContent value="cases" className="space-y-4">
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="bg-slate-800/50 border-slate-700 p-6 hover:border-red-500/50 transition cursor-pointer"
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={
                            caseItem.type === "fraud"
                              ? "bg-red-500/20 text-red-300"
                              : caseItem.type === "harassment"
                              ? "bg-orange-500/20 text-orange-300"
                              : caseItem.type === "spam"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-purple-500/20 text-purple-300"
                          }
                        >
                          {caseItem.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          className={
                            caseItem.priority === "high"
                              ? "bg-red-500/20 text-red-300"
                              : caseItem.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                          }
                        >
                          {caseItem.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge
                          className={
                            caseItem.status === "pending"
                              ? "bg-red-500/20 text-red-300"
                              : caseItem.status === "investigating"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                          }
                        >
                          {caseItem.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-white font-bold mb-1">{caseItem.description}</p>
                      <p className="text-gray-400 text-sm">
                        Reported by {caseItem.reporter} • {caseItem.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs mb-2">Evidence</p>
                      <p className="text-white font-bold">{caseItem.evidence.length} items</p>
                    </div>
                  </div>

                  {caseItem.status === "pending" && (
                    <div className="flex gap-2 pt-4 border-t border-slate-700">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleResolveCase(caseItem.id, "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={() => handleResolveCase(caseItem.id, "ban")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Ban User
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Teacher Reports Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="bg-slate-800/50 border-slate-700 p-6 hover:border-red-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white text-lg">
                          {teacher.teacherName}
                        </h3>
                        <Badge
                          className={
                            teacher.status === "banned"
                              ? "bg-red-500/20 text-red-300"
                              : teacher.status === "suspended"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                          }
                        >
                          {teacher.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Rating: {teacher.rating.toFixed(1)}/5</span>
                        <span>Complaints: {teacher.complaints}</span>
                        <span>Last: {teacher.lastComplaint.toLocaleString()}</span>
                      </div>
                      {teacher.reason && (
                        <p className="text-red-300 text-sm mt-2">Reason: {teacher.reason}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {teacher.status === "active" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspendTeacher(teacher.teacherId)}
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleBanTeacher(teacher.teacherId)}
                          >
                            Ban
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {teacher.complaints > 0 && (
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-gray-400 text-sm mb-2">Complaint Breakdown</p>
                      <Progress
                        value={(teacher.complaints / 15) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="font-bold text-white mb-4">Weekly Moderation Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #4b5563",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="reports" fill="#ef4444" name="Reports" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">Report Types</h3>
                <div className="space-y-3">
                  {[
                    { type: "Inappropriate Content", count: 34, percent: 40 },
                    { type: "Spam", count: 28, percent: 33 },
                    { type: "Harassment", count: 18, percent: 21 },
                    { type: "Fraud", count: 5, percent: 6 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">{item.type}</span>
                        <span className="text-gray-400 text-sm">{item.count}</span>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">Resolution Rate</h3>
                <div className="space-y-3">
                  {[
                    { period: "Today", rate: 100 },
                    { period: "This Week", rate: 94 },
                    { period: "This Month", rate: 89 },
                    { period: "All Time", rate: 85 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">{item.period}</span>
                        <span className="text-green-400 font-bold">{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default LanguageExchangeAdmin;
