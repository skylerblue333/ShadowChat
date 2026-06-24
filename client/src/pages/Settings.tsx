import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [notifyTips, setNotifyTips] = useState(true);
  const [notifyFollows, setNotifyFollows] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDMs, setAllowDMs] = useState(true);

  const { upload, uploading } = useFileUpload();

  const { data: profile } = trpc.user.profile.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user }
  );

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => toast.success("Profile updated!"),
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.name || "");
      setBio(profile.bio || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) {
      updateProfile.mutate({ avatar: result.url });
    }
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({
      displayName,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold overflow-hidden">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        displayName.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <span className="text-xs text-white">Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="font-medium">{displayName || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Click avatar to change"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Fields */}
                <div className="grid gap-4">
                  <div>
                    <Label>Display Name</Label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell people about yourself..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email is managed by your OAuth provider</p>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-purple-400">{profile?.level || 1}</p>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-blue-400">{profile?.xp || 0}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-purple-400">{profile?.reputation || 0}</p>
                    <p className="text-xs text-muted-foreground">Reputation</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-amber-400">{profile?.followerCount || 0}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tip Notifications</Label>
                    <p className="text-xs text-muted-foreground">When someone sends you a tip</p>
                  </div>
                  <Switch checked={notifyTips} onCheckedChange={setNotifyTips} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Follow Notifications</Label>
                    <p className="text-xs text-muted-foreground">When someone follows you</p>
                  </div>
                  <Switch checked={notifyFollows} onCheckedChange={setNotifyFollows} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Message Notifications</Label>
                    <p className="text-xs text-muted-foreground">When you receive a direct message</p>
                  </div>
                  <Switch checked={notifyMessages} onCheckedChange={setNotifyMessages} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Notifications</Label>
                    <p className="text-xs text-muted-foreground">Platform updates and announcements</p>
                  </div>
                  <Switch checked={notifySystem} onCheckedChange={setNotifySystem} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Privacy Mode</Label>
                    <p className="text-xs text-muted-foreground">Hide your activity from public feeds</p>
                  </div>
                  <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Online Status</Label>
                    <p className="text-xs text-muted-foreground">Let others see when you're online</p>
                  </div>
                  <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Direct Messages</Label>
                    <p className="text-xs text-muted-foreground">Let anyone send you messages</p>
                  </div>
                  <Switch checked={allowDMs} onCheckedChange={setAllowDMs} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-500/10">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {twoFactorEnabled && <Badge className="bg-purple-600/20 text-purple-400">Active</Badge>}
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Active Sessions</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Chrome on macOS • Last active now</p>
                      </div>
                      <Badge className="bg-purple-600/20 text-purple-400">Active</Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Login History</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last login: {new Date().toLocaleDateString()} from your current device
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
                <CardDescription>Manage your SKY444 wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm mt-1 break-all">
                    {user?.id ? `0x${user.id.toString(16).padStart(40, '0')}` : "Not connected"}
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-stake Rewards</Label>
                    <p className="text-xs text-muted-foreground">Automatically stake earned tokens</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Transaction Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified for all wallet activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
