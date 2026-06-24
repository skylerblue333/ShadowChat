// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function CreatorStudioPage() {
  const { isAuthenticated } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [listingDesc, setListingDesc] = useState('');
  const [listingPrice, setListingPrice] = useState('');

  const { data: posts, isLoading: postsLoading } = trpc.wave4Creator.getCreatorPosts.useQuery({
    limit: 20,
  });

  const { data: analytics } = trpc.wave4Creator.getAnalytics.useQuery();
  const { data: listings } = trpc.wave4Creator.getListings.useQuery({ limit: 20 });
  const { data: monetization } = trpc.wave4Creator.getMonetization.useQuery();

  const createPostMutation = trpc.wave4Creator.createPost.useMutation({
    onSuccess: () => {
      toast.success('Post created!');
      setPostContent('');
    },
  });

  const createListingMutation = trpc.wave4Creator.createListing.useMutation({
    onSuccess: () => {
      toast.success('Listing created!');
      setListingTitle('');
      setListingDesc('');
      setListingPrice('');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <p className="text-gray-600">Please log in to access Creator Studio</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creator Studio</h1>
        <p className="text-gray-600">Manage your content and monetization</p>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Posts</p>
            <p className="text-2xl font-bold">{analytics.posts}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Likes</p>
            <p className="text-2xl font-bold">{analytics.likes}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Comments</p>
            <p className="text-2xl font-bold">{analytics.comments}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Engagement</p>
            <p className="text-2xl font-bold">{analytics.engagement.toFixed(1)}%</p>
          </Card>
        </div>
      )}

      {/* Monetization */}
      {monetization && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-xl font-bold mb-4">Monetization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">{monetization.totalSales}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">${monetization.totalRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Payout</p>
              <p className="text-sm font-semibold">{new Date(monetization.nextPayout).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Create Post</h3>
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <Button
              onClick={() => {
                if (postContent.trim()) {
                  createPostMutation.mutate({
                    content: postContent,
                  });
                }
              }}
              disabled={createPostMutation.isPending || !postContent.trim()}
            >
              Publish Post
            </Button>
          </Card>

          <h3 className="text-lg font-semibold">Your Posts</h3>
          {postsLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-2">
              {posts?.posts.map((p: any) => (
                <Card key={p.id} className="p-4">
                  <p className="font-semibold">{p.content.substring(0, 100)}...</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Create Listing</h3>
            <div className="space-y-4">
              <Input
                placeholder="Product title"
                value={listingTitle}
                onChange={(e) => setListingTitle(e.target.value)}
              />
              <Textarea
                placeholder="Product description"
                value={listingDesc}
                onChange={(e) => setListingDesc(e.target.value)}
                rows={4}
              />
              <Input
                placeholder="Price"
                type="number"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (listingTitle && listingDesc && listingPrice) {
                    createListingMutation.mutate({
                      title: listingTitle,
                      description: listingDesc,
                      price: parseFloat(listingPrice),
                      category: 'general',
                      inventory: 1,
                    });
                  }
                }}
                disabled={createListingMutation.isPending}
              >
                Create Listing
              </Button>
            </div>
          </Card>

          <h3 className="text-lg font-semibold">Your Listings</h3>
          <div className="space-y-2">
            {listings?.listings.map((l: any) => (
              <Card key={l.id} className="p-4">
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-gray-600">${l.price}</p>
                <p className="text-xs text-gray-500 mt-2">Orders: {l._count.orders}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
