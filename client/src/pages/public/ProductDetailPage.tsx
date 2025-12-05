import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Star,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Store,
  Package,
  Loader2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AuthDrawer } from '../../components/features/AuthDrawer';
import { CartDrawer } from '../../components/features/CartDrawer';
import { ProductCard } from '../../components/features/ProductCard';
import { Button } from '../../components/ui/Button';
import { useProduct, mockProducts, type Product } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { getImageUrl } from '../../lib/utils';
import api from '../../lib/axios';

// Mock additional images for gallery
const getGalleryImages = (mainImage: string) => {
  const url = getImageUrl(mainImage);
  return [
    url,
    url.includes('unsplash') ? url.replace('w=600', 'w=800') : url,
    url.includes('unsplash') ? url.replace('w=600', 'w=500') : url,
    url.includes('unsplash') ? url.replace('w=600', 'w=700') : url,
  ];
};

// Mock specifications
const specifications = [
  { name: 'Brand', value: 'MarketFlex Premium' },
  { name: 'Material', value: 'Premium Quality' },
  { name: 'Weight', value: '0.5 kg' },
  { name: 'Dimensions', value: '20 x 15 x 10 cm' },
  { name: 'Warranty', value: '2 Years' },
  { name: 'Country of Origin', value: 'USA' },
];

// Mock reviews
const reviews = [
  {
    id: 1,
    author: 'Sarah M.',
    rating: 5,
    date: '2024-11-15',
    content: 'Absolutely love this product! The quality is exceptional and it arrived faster than expected.',
    helpful: 24,
  },
  {
    id: 2,
    author: 'James K.',
    rating: 4,
    date: '2024-11-10',
    content: 'Great product overall. Minor issue with packaging but the product itself is perfect.',
    helpful: 18,
  },
  {
    id: 3,
    author: 'Emily R.',
    rating: 5,
    date: '2024-11-05',
    content: 'This exceeded my expectations! Would definitely recommend to anyone looking for quality.',
    helpful: 32,
  },
];

type Tab = 'description' | 'specifications' | 'reviews';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id || '');

  // Scroll to top when page loads or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Fallback to mock data
  const productData = product ?? mockProducts.find((p) => p.id === Number(id));

  const addToCart = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const openAuthDrawer = useUIStore((state) => state.openAuthDrawer);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('description');

  const galleryImages = productData ? getGalleryImages(productData.imageUrl) : [];

  const isInStock = productData ? productData.stockQuantity > 0 : false;
  const isLowStock = productData ? productData.stockQuantity > 0 && productData.stockQuantity <= 10 : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!productData) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: String(productData.id),
        name: productData.name,
        price: productData.price,
        image: getImageUrl(productData.imageUrl),
        vendor: 'MarketFlex',
      });
    }
    openCartDrawer();
  };

  const handleBuyNow = () => {
    if (!productData) return;
    handleAddToCart();
    if (!isAuthenticated) {
      openAuthDrawer('login');
    } else {
      navigate('/checkout');
    }
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  // Fetch related products from API
  const { data: relatedProductsData, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['related-products', productData?.categoryId, id],
    queryFn: async () => {
      if (!productData?.categoryId) return [];
      try {
        const { data } = await api.get<Product[]>(`/products?categoryId=${productData.categoryId}`);
        // Filter out current product and limit to 4
        return data.filter((p) => p.id !== Number(id)).slice(0, 4);
      } catch {
        // Fallback to mock data
        return mockProducts
          .filter((p) => p.id !== Number(id) && p.categoryId === productData?.categoryId)
          .slice(0, 4);
      }
    },
    enabled: !!productData?.categoryId,
    staleTime: 1000 * 60 * 5,
  });

  const relatedProducts = relatedProductsData ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <AuthDrawer />
        <CartDrawer />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-800 rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-slate-800 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-slate-800 rounded w-1/4 animate-pulse" />
              <div className="h-24 bg-slate-800 rounded animate-pulse" />
              <div className="h-12 bg-slate-800 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <AuthDrawer />
        <CartDrawer />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-24 text-center">
          <Package className="w-24 h-24 text-slate-700 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-slate-400 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={`/products?category=${productData.categoryId}`}
            className="hover:text-white transition-colors"
          >
            {productData.categoryName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white truncate max-w-[200px]">{productData.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={productData.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === selectedImageIndex
                      ? 'border-emerald-500'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-emerald-400 text-sm font-medium mb-2">
                {productData.categoryName}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                {productData.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400">4.8 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-emerald-400">
                {formatPrice(productData.price)}
              </span>
              <span className="text-xl text-slate-500 line-through">
                {formatPrice(productData.price * 1.25)}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-lg">
                -20%
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {isInStock ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg">
                    <Check className="w-4 h-4" />
                    In Stock
                  </span>
                  {isLowStock && (
                    <span className="text-amber-400 text-sm">
                      Only {productData.stockQuantity} left!
                    </span>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 text-sm font-medium rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 leading-relaxed">
              {productData.description}
            </p>

            {/* Vendor Info */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Sold by</p>
                <p className="font-semibold text-white">MarketFlex Official</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Visit Store
              </Button>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(productData.stockQuantity, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                  disabled={quantity >= productData.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!isInStock}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleBuyNow}
                disabled={!isInStock}
                leftIcon={<Zap className="w-5 h-5" />}
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: RefreshCw, label: '30-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          {/* Tab Headers */}
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800 mb-6 w-fit">
            {(['description', 'specifications', 'reviews'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
                {tab === 'reviews' && (
                  <span className="ml-2 text-xs opacity-70">({reviews.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-white mb-4">Product Description</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  {productData.description}
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Experience premium quality with our carefully crafted product. Designed with
                  attention to detail and built to last, this item represents the perfect
                  combination of style, functionality, and durability.
                </p>
                <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Premium materials for long-lasting durability</li>
                  <li>Ergonomic design for maximum comfort</li>
                  <li>Modern aesthetics that complement any style</li>
                  <li>Easy maintenance and care</li>
                  <li>Backed by our 2-year warranty</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {specifications.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between p-4 bg-slate-900/50 rounded-xl"
                    >
                      <span className="text-slate-400">{spec.name}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 bg-slate-900/50 rounded-xl mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">4.8</div>
                    <div className="flex items-center gap-0.5 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 5 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">128 reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-400 w-8">
                          {stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 7 : 2}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-slate-900/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {review.author[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">{review.author}</p>
                            <p className="text-sm text-slate-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300">{review.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="text-sm text-slate-400 hover:text-white transition-colors">
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="text-sm text-slate-400 hover:text-white transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {(relatedProducts.length > 0 || isLoadingRelated) && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            {isLoadingRelated ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={`related-${product.id}`} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
