import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, ShoppingCart, Heart, Share2, MessageSquare, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  image: string;
  date: string;
  helpful: number;
}

export default function SkyStore() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 149.99,
      image: 'https://via.placeholder.com/300x300?text=Headphones',
      rating: 4.8,
      reviews: 324,
      category: 'Electronics',
      inStock: true,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      price: 299.99,
      image: 'https://via.placeholder.com/300x300?text=SmartWatch',
      rating: 4.6,
      reviews: 156,
      category: 'Electronics',
      inStock: true,
    },
    {
      id: '3',
      name: 'Portable Charger 20K',
      price: 39.99,
      image: 'https://via.placeholder.com/300x300?text=Charger',
      rating: 4.9,
      reviews: 892,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: '4',
      name: 'USB-C Cable 2M',
      price: 12.99,
      image: 'https://via.placeholder.com/300x300?text=Cable',
      rating: 4.7,
      reviews: 1203,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: '5',
      name: 'Phone Stand Adjustable',
      price: 24.99,
      image: 'https://via.placeholder.com/300x300?text=Stand',
      rating: 4.5,
      reviews: 567,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300?text=Speaker',
      rating: 4.7,
      reviews: 445,
      category: 'Electronics',
      inStock: true,
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0]);
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: 'John Doe',
      rating: 5,
      text: 'Amazing quality! Exceeded my expectations. Highly recommend!',
      image: 'https://via.placeholder.com/100x100?text=Review1',
      date: '2 days ago',
      helpful: 234,
    },
    {
      id: '2',
      author: 'Sarah Smith',
      rating: 4,
      text: 'Great product, fast shipping. Minor issue with packaging but overall satisfied.',
      image: 'https://via.placeholder.com/100x100?text=Review2',
      date: '1 week ago',
      helpful: 156,
    },
    {
      id: '3',
      author: 'Mike Johnson',
      rating: 5,
      text: 'Best purchase ever! Perfect for my needs. Will buy again!',
      image: 'https://via.placeholder.com/100x100?text=Review3',
      date: '2 weeks ago',
      helpful: 89,
    },
  ]);

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { productId: product.id, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">SKY STORE</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">Checkout</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          <Button variant="outline" className="border-purple-500 text-purple-400 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            All Categories
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400">
            Electronics
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400">
            Accessories
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400">
            On Sale
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Detail */}
          {selectedProduct && (
            <div className="lg:col-span-2">
              <Card className="bg-black border-purple-500/30 p-6 space-y-6">
                {/* Product Image */}
                <div className="bg-gradient-to-br from-purple-900 to-black rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400">
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-4xl font-bold text-green-400">${selectedProduct.price.toFixed(2)}</div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${selectedProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span>{selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-purple-500/30 pt-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                        <div className="flex items-start gap-4 mb-3">
                          <img
                            src={review.image}
                            alt={review.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-purple-400">{review.author}</p>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{review.text}</p>
                        <button className="text-xs text-gray-500 hover:text-purple-400 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Products Grid & Cart */}
          <div className="space-y-6">
            {/* Products Grid */}
            <div>
              <h3 className="text-lg font-bold mb-4">Browse Products</h3>
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedProduct?.id === product.id
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="p-3 space-y-2">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-black rounded overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                        <p className="text-green-400 font-bold text-sm">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span className="text-gray-500">({product.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <Card className="bg-black border-purple-500/30 p-4">
              <h3 className="font-bold mb-4">Cart Summary</h3>
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-gray-400">{product?.name}</span>
                          <span className="font-semibold">
                            ${((product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex justify-between font-bold mb-3">
                        <span>Total:</span>
                        <span className="text-green-400">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Proceed to Checkout</Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
