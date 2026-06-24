// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const MarketplacePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'orders' | 'sell'>('browse');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const listingsQuery = trpc.wave2Marketplace.listListings.useQuery(
    { limit: 20 },
    { enabled: true }
  );

  const ordersQuery = trpc.wave2Marketplace.getOrders.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const sellerListingsQuery = trpc.wave2Marketplace.getSellerListings.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const searchQueryHook = trpc.wave2Marketplace.searchListings.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: searchQuery.length > 0 }
  );

  // Mutations
  const createListingMutation = trpc.wave2Marketplace.createListing.useMutation({
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      sellerListingsQuery.refetch();
      toast.success('Listing created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create listing');
    },
  });

  const createOrderMutation = trpc.wave2Marketplace.createOrder.useMutation({
    onSuccess: () => {
      ordersQuery.refetch();
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create order');
    },
  });

  const handleCreateListing = async () => {
    if (!title || !description || !price || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    await createListingMutation.mutateAsync({
      title,
      description,
      price,
      category,
    });
  };

  const handleBuyItem = async (itemId: string) => {
    await createOrderMutation.mutateAsync({
      itemId,
      quantity: 1,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['browse', 'create', 'orders', 'sell'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listingsQuery.isLoading ? (
              <>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </>
            ) : (listingsQuery.data?.listings || []).length > 0 ? (
              (listingsQuery.data?.listings || []).map((listing: any) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {listing.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">${listing.price}</p>
                        <p className="text-xs text-muted-foreground">{listing.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{listing.views} views</p>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <Button
                        onClick={() => handleBuyItem(listing.id)}
                        disabled={createOrderMutation.isPending}
                        className="w-full"
                      >
                        {createOrderMutation.isPending ? 'Buying...' : 'Buy Now'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No listings found</p>
            )}
          </div>
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g., Electronics"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleCreateListing}
              disabled={createListingMutation.isPending}
              className="w-full"
              size="lg"
            >
              {createListingMutation.isPending ? 'Creating...' : 'Create Listing'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (ordersQuery.data?.orders || []).length > 0 ? (
              <div className="space-y-2">
                {(ordersQuery.data?.orders || []).map((order: any) => (
                  <div key={order.id} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                          order.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sell Tab */}
      {activeTab === 'sell' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {sellerListingsQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (sellerListingsQuery.data?.listings || []).length > 0 ? (
              <div className="space-y-2">
                {(sellerListingsQuery.data?.listings || []).map((listing: any) => (
                  <div key={listing.id} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">{listing.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${listing.price}</p>
                        <p className="text-xs text-muted-foreground">{listing.views} views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No listings yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketplacePage;
