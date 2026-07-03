// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'posts' | 'followers' | 'activity'>('view');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  // Queries
  const profileQuery = trpc.wave2Profile.getCurrentProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const statsQuery = trpc.wave2Profile.getStats.useQuery(
    { userId: user?.id || '' },
    { enabled: isAuthenticated && !!user?.id }
  );

  const postsQuery = trpc.wave2Profile.getUserPosts.useQuery(
    { userId: user?.id || '', limit: 20 },
    { enabled: isAuthenticated && !!user?.id }
  );

  const followersQuery = trpc.wave2Profile.getFollowers.useQuery(
    { userId: user?.id || '', limit: 20 },
    { enabled: isAuthenticated && !!user?.id }
  );

  const followingQuery = trpc.wave2Profile.getFollowing.useQuery(
    { userId: user?.id || '', limit: 20 },
    { enabled: isAuthenticated && !!user?.id }
  );

  const activityQuery = trpc.wave2Profile.getActivityHistory.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const walletQuery = trpc.wave2Profile.getWalletSummary.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const updateProfileMutation = trpc.wave2Profile.updateProfile.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      toast.success('Profile updated');
      setActiveTab('view');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleUpdateProfile = async () => {
    await updateProfileMutation.mutateAsync({
      name,
      bio,
      location,
      website,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {(['view', 'edit', 'posts', 'followers', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* View Tab */}
      {activeTab === 'view' && (
        <div className="space-y-4">
          {profileQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : profileQuery.data ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{profileQuery.data.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profileQuery.data.email}</p>
                  </div>
                  {profileQuery.data.profile?.bio && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bio</p>
                      <p className="font-medium">{profileQuery.data.profile.bio}</p>
                    </div>
                  )}
                  {profileQuery.data.profile?.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{profileQuery.data.profile.location}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {statsQuery.data && (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Posts</p>
                      <p className="text-2xl font-bold">{statsQuery.data.posts}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="text-2xl font-bold">{statsQuery.data.followers}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Following</p>
                      <p className="text-2xl font-bold">{statsQuery.data.following}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Likes</p>
                      <p className="text-2xl font-bold">{statsQuery.data.likes}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold">{statsQuery.data.comments}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Reputation</p>
                      <p className="text-2xl font-bold">{statsQuery.data.reputation}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {walletQuery.data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="text-2xl font-bold">${walletQuery.data.balance}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Edit Tab */}
      {activeTab === 'edit' && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
              className="w-full"
            >
              {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <Card>
          <CardHeader>
            <CardTitle>My Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (postsQuery.data?.posts || []).length > 0 ? (
              <div className="space-y-2">
                {(postsQuery.data?.posts || []).map((post: any) => (
                  <div key={post.id} className="p-3 rounded-lg border border-border">
                    <p className="text-sm">{post.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Followers Tab */}
      {activeTab === 'followers' && (
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            {followersQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (followersQuery.data?.followers || []).length > 0 ? (
              <div className="space-y-2">
                {(followersQuery.data?.followers || []).map((follower: any) => (
                  <div key={follower.id} className="p-3 rounded-lg border border-border">
                    <p className="font-medium">{follower.name}</p>
                    <p className="text-xs text-muted-foreground">{follower.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No followers yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            {activityQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (activityQuery.data || []).length > 0 ? (
              <div className="space-y-2">
                {(activityQuery.data || []).map((activity: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border border-border">
                    <p className="text-sm capitalize font-medium">{activity.type}</p>
                    {activity.content && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {activity.content}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
