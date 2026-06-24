import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield, FileCheck, Trash2, Download, AlertTriangle, CheckCircle2,
  Clock, Lock, Eye, BarChart3, XCircle, Info
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const KYC_STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  not_started: { label: "Not Started", color: "text-gray-400", icon: AlertTriangle },
  pending: { label: "Pending Review", color: "text-yellow-400", icon: Clock },
  in_review: { label: "In Review", color: "text-blue-400", icon: Eye },
  approved: { label: "Approved", color: "text-green-400", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-400", icon: XCircle },
  expired: { label: "Expired", color: "text-orange-400", icon: AlertTriangle },
};

export default function ComplianceCenter() {
  const utils = trpc.useUtils();
  const [kycForm, setKycForm] = useState({
    firstName: "", lastName: "", dateOfBirth: "", country: "",
    documentType: "passport" as "passport" | "national_id" | "drivers_license" | "residence_permit",
    documentNumber: "",
    level: "basic" as "basic" | "standard" | "enhanced",
  });

  const { data: summary } = trpc.complianceIntelligence.getComplianceSummary.useQuery();
  const { data: kycData } = trpc.complianceIntelligence.getKYCStatus.useQuery();
  const { data: consentsData } = trpc.complianceIntelligence.getConsents.useQuery();
  const { data: requestsData } = trpc.complianceIntelligence.getDataRequests.useQuery();
  const { data: auditData } = trpc.complianceIntelligence.getAuditLog.useQuery({ limit: 30 });

  const submitKYC = trpc.complianceIntelligence.submitKYC.useMutation({
    onSuccess: (data) => {
      toast.success(`KYC submitted — status: ${data.status}`);
      utils.complianceIntelligence.getKYCStatus.invalidate();
      utils.complianceIntelligence.getComplianceSummary.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateConsent = trpc.complianceIntelligence.updateConsent.useMutation({
    onSuccess: () => {
      utils.complianceIntelligence.getConsents.invalidate();
      utils.complianceIntelligence.getComplianceSummary.invalidate();
    },
  });

  const requestExport = trpc.complianceIntelligence.requestDataExport.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.complianceIntelligence.getDataRequests.invalidate();
    },
  });

  const requestDeletion = trpc.complianceIntelligence.requestDeletion.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.complianceIntelligence.getDataRequests.invalidate();
    },
  });

  const cancelRequest = trpc.complianceIntelligence.cancelDeletionRequest.useMutation({
    onSuccess: () => {
      toast.success("Request cancelled");
      utils.complianceIntelligence.getDataRequests.invalidate();
    },
  });

  const kycStatus = kycData?.status ?? "not_started";
  const kycConfig = KYC_STATUS_CONFIG[kycStatus] ?? KYC_STATUS_CONFIG.not_started;
  const KYCIcon = kycConfig.icon;

  const scoreColor = (summary?.score ?? 0) >= 80 ? "text-green-400" : (summary?.score ?? 0) >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-900/30 rounded-xl">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Compliance Center</h1>
          <p className="text-gray-400 text-sm">KYC, GDPR, consent management & data rights</p>
        </div>
      </div>

      {/* Compliance Score */}
      {summary && (
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Compliance Health Score</p>
                <p className={`text-4xl font-bold ${scoreColor}`}>{summary.score}<span className="text-lg text-gray-500">/100</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Consents</p>
                <p className="text-xl font-bold text-white">{summary.consentsGranted}/{summary.consentsTotal}</p>
              </div>
            </div>
            {summary.issues.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {summary.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-yellow-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {issue}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="kyc">
        <TabsList className="bg-gray-900 border border-gray-800 mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-600">
            <FileCheck className="w-4 h-4 mr-1" /> KYC
          </TabsTrigger>
          <TabsTrigger value="consents" className="data-[state=active]:bg-blue-600">
            <Lock className="w-4 h-4 mr-1" /> Consents
          </TabsTrigger>
          <TabsTrigger value="data-rights" className="data-[state=active]:bg-blue-600">
            <Download className="w-4 h-4 mr-1" /> Data Rights
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-1" /> Audit Log
          </TabsTrigger>
        </TabsList>

        {/* KYC Tab */}
        <TabsContent value="kyc">
          <Card className="bg-gray-900 border-gray-800 mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <KYCIcon className={`w-5 h-5 ${kycConfig.color}`} />
                Identity Verification
                <Badge className={`ml-auto ${kycStatus === "approved" ? "bg-green-800 text-green-200" : kycStatus === "rejected" ? "bg-red-800 text-red-200" : "bg-gray-700 text-gray-300"}`}>
                  {kycConfig.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kycStatus === "approved" ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-semibold">Identity Verified</p>
                  <p className="text-gray-400 text-sm mt-1">Level: {kycData?.level} · Risk Score: {kycData?.riskScore}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(kycStatus === "pending" || kycStatus === "in_review") && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      Your KYC submission is being reviewed. This typically takes 1-3 business days.
                    </div>
                  )}
                  {kycStatus === "rejected" && kycData?.rejectionReason && (
                    <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg text-red-300 text-sm">
                      <strong>Rejection reason:</strong> {kycData.rejectionReason}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">First Name</Label>
                      <Input
                        value={kycForm.firstName}
                        onChange={(e) => setKycForm({ ...kycForm, firstName: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">Last Name</Label>
                      <Input
                        value={kycForm.lastName}
                        onChange={(e) => setKycForm({ ...kycForm, lastName: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">Date of Birth</Label>
                      <Input
                        type="date"
                        value={kycForm.dateOfBirth}
                        onChange={(e) => setKycForm({ ...kycForm, dateOfBirth: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">Country</Label>
                      <Input
                        value={kycForm.country}
                        onChange={(e) => setKycForm({ ...kycForm, country: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="US"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">Document Type</Label>
                      <Select value={kycForm.documentType} onValueChange={(v: any) => setKycForm({ ...kycForm, documentType: v })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="residence_permit">Residence Permit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-1 block">Verification Level</Label>
                      <Select value={kycForm.level} onValueChange={(v: any) => setKycForm({ ...kycForm, level: v })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="basic">Basic (up to $1K/day)</SelectItem>
                          <SelectItem value="standard">Standard (up to $10K/day)</SelectItem>
                          <SelectItem value="enhanced">Enhanced (unlimited)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={() => submitKYC.mutate(kycForm)}
                    disabled={submitKYC.isPending || !kycForm.firstName || !kycForm.lastName || !kycForm.dateOfBirth || !kycForm.country}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submitKYC.isPending ? "Submitting..." : "Submit KYC Application"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consents Tab */}
        <TabsContent value="consents">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Privacy & Consent Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consentsData?.consents.map((consent) => (
                <div key={consent.type} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white capitalize">{consent.type.replace(/_/g, " ")}</p>
                      {consent.required && (
                        <Badge className="bg-red-900/50 text-red-300 text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {consent.granted
                        ? `Granted ${consent.grantedAt ? formatDistanceToNow(new Date(consent.grantedAt), { addSuffix: true }) : ""}`
                        : "Not granted"}
                    </p>
                  </div>
                  <Switch
                    checked={consent.granted}
                    disabled={consent.required && consent.granted}
                    onCheckedChange={(checked) => {
                      updateConsent.mutate({ consentType: consent.type as any, granted: checked });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Rights Tab */}
        <TabsContent value="data-rights">
          <div className="space-y-4">
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200">
                Under GDPR and CCPA, you have the right to access, export, correct, and delete your personal data.
                All requests are processed within 30 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Export My Data</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Download a complete copy of all your personal data stored on this platform.</p>
                  <Button
                    onClick={() => requestExport.mutate()}
                    disabled={requestExport.isPending}
                    className="w-full bg-green-700 hover:bg-green-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {requestExport.isPending ? "Requesting..." : "Request Data Export"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-white">Delete My Account</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all associated data. 30-day grace period applies.</p>
                  <Button
                    onClick={() => requestDeletion.mutate({ type: "full_deletion", reason: "User requested account deletion" })}
                    disabled={requestDeletion.isPending}
                    variant="outline"
                    className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {requestDeletion.isPending ? "Requesting..." : "Request Account Deletion"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pending Requests */}
            {requestsData && requestsData.requests.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {requestsData.requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{req.type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500">
                          {req.scheduledAt ? `Scheduled: ${formatDistanceToNow(new Date(req.scheduledAt), { addSuffix: true })}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={req.status === "pending" ? "bg-yellow-800 text-yellow-200" : req.status === "completed" ? "bg-green-800 text-green-200" : "bg-gray-700 text-gray-300"}>
                          {req.status}
                        </Badge>
                        {req.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelRequest.mutate({ requestId: req.id })}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Compliance Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              {auditData && auditData.events.length > 0 ? (
                <div className="space-y-2">
                  {auditData.events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white capitalize">{event.action.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No compliance events recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
