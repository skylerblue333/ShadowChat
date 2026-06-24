// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();

  const { data: users, isLoading: usersLoading } = trpc.wave4Explore.discoverUsers.useQuery({
    limit: 20,
  });

  const { data: content, isLoading: contentLoading } = trpc.wave4Explore.discoverContent.useQuery({
    limit: 20,
  });

  const { data: trendingProducts } = trpc.wave4Explore.getTrendingProducts.useQuery({ limit: 20 });
  const { data: trendingCourses } = trpc.wave4Explore.getTrendingCourses.useQuery({ limit: 20 });
  const { data: trendingGames } = trpc.wave4Explore.getTrendingGames.useQuery({ limit: 20 });
  const { data: trendingProposals } = trpc.wave4Explore.getTrendingProposals.useQuery({ limit: 20 });
  const { data: recommendations } = trpc.wave4Explore.getRecommendations.useQuery(
    { type: 'users', limit: 20 },
    { enabled: isAuthenticated }
  );

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-gray-600">Discover new content, users, and opportunities</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">Discover Users</h2>
          {usersLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users?.users.map((u: any) => (
                <Card key={u.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-gray-600">{u.email}</p>
                    </div>
                  </div>
                  {u.bio && <p className="text-sm text-gray-600 mb-3">{u.bio}</p>}
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>👥 {u._count.followers} followers</span>
                    <span>📝 {u._count.posts} posts</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Follow
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Content</h2>
          {contentLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-3">
              {content?.posts.map((p: any) => (
                <Card key={p.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{p.author?.name}</p>
                      <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{p.content.substring(0, 200)}...</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❤️ {p._count.likes}</span>
                    <span>💬 {p._count.comments}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingProducts?.map((p: any) => (
              <Card key={p.id} className="p-4">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600 mt-2">${p.price}</p>
                <p className="text-xs text-gray-500 mt-2">Orders: {p._count.orders}</p>
                <Button size="sm" className="w-full mt-3">
                  View
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingCourses?.map((c: any) => (
              <Card key={c.id} className="p-4">
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-gray-600 mt-2">{c.description?.substring(0, 100)}...</p>
                <p className="text-xs text-gray-500 mt-2">Enrolled: {c._count.enrollments}</p>
                <Button size="sm" className="w-full mt-3">
                  Enroll
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingGames?.map((g: any) => (
              <Card key={g.id} className="p-4">
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-gray-600 mt-2">{g.description?.substring(0, 100)}...</p>
                <p className="text-xs text-gray-500 mt-2">Players: {g._count.sessions}</p>
                <Button size="sm" className="w-full mt-3">
                  Play
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Proposals</h2>
          <div className="space-y-3">
            {trendingProposals?.map((prop: any) => (
              <Card key={prop.id} className="p-4">
                <p className="font-semibold">{prop.title}</p>
                <p className="text-sm text-gray-600 mt-2">{prop.description?.substring(0, 150)}...</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">Votes: {prop._count.votes}</p>
                  <Button size="sm" variant="outline">
                    Vote
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {isAuthenticated && recommendations && recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((item: any) => (
              <Card key={item.id} className="p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600 mt-2">{item._count?.followers || 0} followers</p>
                <Button size="sm" className="w-full mt-3">
                  Follow
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
