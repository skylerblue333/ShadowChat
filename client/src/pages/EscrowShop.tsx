import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function EscrowShop() {
  const { user } = useAuth();
  const [category, setCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'SKY444' | 'DODGE' | 'TRUMP'>('SKY444');

  const { data: listings, isLoading } = trpc.escrow.listListings.useQuery({ category, limit: 20 });
  const initiateTx = trpc.escrow.initiateTransaction.useMutation();

  const categories = ['Electronics', 'Art', 'Services', 'Digital', 'Collectibles', 'Gaming'];

  const handlePurchase = (listingId: number) => {
    initiateTx.mutate({ listingId, currency: selectedCurrency });
  };

  const filteredListings = listings?.filter(
    (item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-cyan-400" />
            Escrow Marketplace
          </h1>
          <p className="text-gray-400">Buy, sell, and trade with secure escrow protection</p>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as any)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="SKY444">SKY444</option>
            <option value="DODGE">DODGE</option>
            <option value="TRUMP">TRUMP</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            onClick={() => setCategory('')}
            variant={category === '' ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              variant={category === cat ? 'default' : 'outline'}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700 p-12 text-center">
            <p className="text-gray-400">No listings found. Be the first to sell!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing: any) => (
              <Card
                key={listing.id}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                {/* Image Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center">
                  {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="w-12 h-12 text-gray-600" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{listing.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{listing.description}</p>

                  {/* Prices */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-cyan-400 font-bold">{listing.priceSky}</div>
                      <div className="text-gray-500 text-xs">SKY444</div>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-green-400 font-bold">{listing.priceDodge}</div>
                      <div className="text-gray-500 text-xs">DODGE</div>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-yellow-400 font-bold">{listing.priceTrump}</div>
                      <div className="text-gray-500 text-xs">TRUMP</div>
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="flex justify-between items-center mb-4 text-xs">
                    <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                      {listing.category}
                    </span>
                    <span className="text-gray-400">Stock: {listing.quantity}</span>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={() => handlePurchase(listing.id)}
                    disabled={!user || initiateTx.isPending}
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  >
                    {initiateTx.isPending ? 'Processing...' : `Buy with ${selectedCurrency}`}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Seller Info */}
        <Card className="bg-gray-900 border-gray-700 p-6 mt-8">
          <h3 className="text-xl font-bold text-white mb-3">Want to Sell?</h3>
          <p className="text-gray-400 mb-4">
            List your items on the escrow marketplace. Buyers and sellers are protected with secure escrow transactions.
          </p>
          <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">Create Listing</Button>
        </Card>
      </div>
    </div>
  );
}
