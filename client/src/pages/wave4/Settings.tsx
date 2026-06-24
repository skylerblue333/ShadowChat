// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profilePublic, setProfilePublic] = useState(false);

  const { data: settings } = trpc.wave4Settings.getSettings.useQuery();

  const updateProfileMutation = trpc.wave4Settings.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated!');
    },
  });

  const updatePrivacyMutation = trpc.wave4Settings.updatePrivacy.useMutation({
    onSuccess: () => {
      toast.success('Privacy settings updated!');
    },
  });

  const updateNotificationsMutation = trpc.wave4Settings.updateNotifications.useMutation({
    onSuccess: () => {
      toast.success('Notification settings updated!');
    },
  });

  const updatePreferencesMutation = trpc.wave4Settings.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success('Preferences updated!');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <p className="text-gray-600">Please log in to access Settings</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
              </div>
              <Button
                onClick={() => {
                  updateProfileMutation.mutate({
                    name,
                    bio,
                  });
                }}
                disabled={updateProfileMutation.isPending}
              >
                Save Profile
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(e) => setProfilePublic(e.target.checked)}
                />
                <span>Make profile public</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Allow messages from followers</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Show email address</span>
              </label>
              <Button
                onClick={() => {
                  updatePrivacyMutation.mutate({
                    profilePublic,
                  });
                }}
                disabled={updatePrivacyMutation.isPending}
              >
                Save Privacy Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Push notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Marketing emails</span>
              </label>
              <Button
                onClick={() => {
                  updateNotificationsMutation.mutate({
                    emailNotifications,
                  });
                }}
                disabled={updateNotificationsMutation.isPending}
              >
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  updatePreferencesMutation.mutate({
                    theme: theme as 'light' | 'dark',
                  });
                }}
                disabled={updatePreferencesMutation.isPending}
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
