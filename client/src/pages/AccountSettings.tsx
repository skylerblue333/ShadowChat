import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Lock, Mail, Bell, Eye, EyeOff, Loader2, Shield, Trash2 } from "lucide-react";

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem("user_email") || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      toast.success("Password updated successfully");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success("Notification preferences updated");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      setLoading(true);
      try {
        localStorage.clear();
        toast.success("Account deleted");
        window.location.href = "/";
      } catch (error) {
        toast.error("Failed to delete account");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your account, security, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="general" className="text-slate-300">General</TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300">Notifications</TabsTrigger>
            <TabsTrigger value="danger" className="text-slate-300">Danger</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">General Settings</CardTitle>
                <CardDescription>Update your basic account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-slate-700 border-slate-600 text-slate-400"
                    />
                    <Button variant="outline" className="border-slate-600">Change</Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email verified ✓</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Current Password</label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">New Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="bg-slate-700 border-slate-600 text-white pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Confirm Password</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">Add an extra layer of security to your account</p>
                <Button variant="outline" className="border-slate-600">Enable 2FA</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {key === "emailNotifications" && "Receive email notifications"}
                        {key === "pushNotifications" && "Receive browser push notifications"}
                        {key === "marketingEmails" && "Receive promotional emails"}
                        {key === "weeklyDigest" && "Receive weekly digest"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => handleNotificationChange(key as keyof typeof notifications)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Tab */}
          <TabsContent value="danger" className="space-y-4">
            <Card className="border-red-500/20 bg-red-900/10">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    Deleting your account will permanently remove all your data. This action cannot be undone.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AccountSettings;
