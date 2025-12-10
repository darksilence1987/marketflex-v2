import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
  Zap,
  TrendingUp,
  Award,
  Loader2,
  Package,
  Car,
  Gamepad2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthDrawer } from '../components/features/AuthDrawer';
import { CartDrawer } from '../components/features/CartDrawer';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { getImageUrl } from '../lib/utils';
import api from '../lib/axios';
import type { Product } from '../hooks/useProducts';

// Types
interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

interface Vendor {
  id: number;
  storeName: string;
  storeDescription?: string;
  contactEmail?: string;
}

// Hero slides (static content)
const heroSlides = [
  {
    id: 1,
    title: 'The Future of Shopping',
    subtitle: 'Multi-Vendor Marketplace',
    description: 'Discover products from thousands of verified sellers. Premium quality, competitive prices, seamless experience.',
    cta: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    accent: 'from-emerald-500/20 to-cyan-500/20',
  },
  {
    id: 2,
    title: 'Winter Collection',
    subtitle: 'New Season Arrivals',
    description: 'Stay warm in style with our curated winter essentials from top fashion brands.',
    cta: 'Shop Collection',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    accent: 'from-purple-500/20 to-pink-500/20',
  },
];

// Category icon mapping
const categoryIcons: Record<string, typeof Laptop> = {
  'Electronics': Laptop,
  'Fashion': Shirt,
  'Home & Living': Home,
  'Sports & Fitness': Dumbbell,
  'Beauty': Sparkles,
  'Books': BookOpen,
  'Toys & Games': Gamepad2,
  'Automotive': Car,
};

const categoryColors: Record<string, string> = {
  'Electronics': 'from-blue-500 to-blue-600',
  'Fashion': 'from-pink-500 to-rose-600',
  'Home & Living': 'from-amber-500 to-orange-600',
  'Sports & Fitness': 'from-green-500 to-emerald-600',
  'Beauty': 'from-purple-500 to-violet-600',
  'Books': 'from-cyan-500 to-teal-600',
  'Toys & Games': 'from-indigo-500 to-indigo-600',
  'Automotive': 'from-red-500 to-red-600',
};

// API fetchers
async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<Product[]>('/products');
    return data.slice(0, 8);
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  } catch {
    return [];
  }
}

async function fetchVendors(): Promise<Vendor[]> {
  try {
    const { data } = await api.get<Vendor[]>('/vendors/all');
    // Shuffle vendors for random display
    const shuffled = data.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  } catch {
    return [];
  }
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categorySlide, setCategorySlide] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  // Fetch products from backend
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch categories from backend
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch vendors from backend
  const { data: vendors = [], isLoading: isLoadingVendors } = useQuery({
    queryKey: ['featured-vendors'],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 30,
  });

  // Category carousel auto-slide
  useEffect(() => {
    if (categories.length <= 3) return;
    const timer = setInterval(() => {
      setCategorySlide(prev => (prev + 1) % Math.ceil(categories.length / 3));
    }, 5000);
    return () => clearInterval(timer);
  }, [categories.length]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: getImageUrl(product.imageUrl),
      vendor: product.vendorStoreName || 'MarketFlex',
    });
    openCartDrawer();
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Category carousel controls
  const maxCategorySlides = Math.max(1, Math.ceil(categories.length / 3));
  const nextCategorySlide = () => setCategorySlide(prev => (prev + 1) % maxCategorySlides);
  const prevCategorySlide = () => setCategorySlide(prev => (prev - 1 + maxCategorySlides) % maxCategorySlides);

  // Get visible categories (3 at a time)
  const visibleCategories = categories.slice(categorySlide * 3, categorySlide * 3 + 3);

  // Get category icon and color
  const getCategoryIcon = (name: string) => categoryIcons[name] || Package;
  const getCategoryColor = (name: string) => categoryColors[name] || 'from-slate-500 to-slate-600';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i}>
                    {i === heroSlides[currentSlide].title.split(' ').length - 1 ? (
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {word}
                      </span>
                    ) : (
                      word + ' '
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lg text-slate-400 max-w-md">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/products">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    {heroSlides[currentSlide].cta}
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '2K+', label: 'Vendors' },
                  { value: '98%', label: 'Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].accent} rounded-3xl blur-3xl opacity-50`} />
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                
                {/* Floating Cards */}
                <div className="absolute top-6 right-6 p-4 bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Sales Today</p>
                      <p className="text-xl font-bold text-white">$24,780</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 p-4 bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Top Rated</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">4.9</span>
                        <span className="text-slate-400">(12k)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Controls */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentSlide ? 'w-6 bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1.5s;
          }
        `}</style>
      </section>

      {/* Categories Carousel */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-slate-400 max-w-md">
                Browse our curated categories featuring products from verified sellers worldwide.
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="relative">
              {/* Category Cards - 3 visible at a time with equal sizes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[280px]">
                {visibleCategories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  const color = getCategoryColor(category.name);
                  return (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="group relative h-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all hover:border-slate-700 hover:scale-[1.02]"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={getImageUrl(category.imageUrl)}
                          alt={category.name}
                          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-30`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative h-full p-6 flex flex-col justify-end">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                        <p className="text-sm text-slate-400">{category.productCount || '100+'} products</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Carousel Controls */}
              {categories.length > 3 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevCategorySlide}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: maxCategorySlides }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCategorySlide(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === categorySlide ? 'w-8 bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextCategorySlide}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Vendor Spotlight - Dynamic with custom scrollbar */}
      <section className="py-16 lg:py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Vendors
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Top-rated sellers delivering quality products and exceptional service.
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory vendor-scroll">
              {isLoadingVendors ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-64 p-6 bg-slate-900 rounded-2xl border border-slate-800 snap-start"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-800 animate-pulse mb-4" />
                    <div className="h-5 bg-slate-800 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
                  </div>
                ))
              ) : vendors.length > 0 ? vendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  to={`/store/${vendor.storeName}`}
                  className="flex-shrink-0 w-64 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group snap-start"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 ring-2 ring-slate-700 group-hover:ring-emerald-500/50 transition-all">
                    <span className="text-2xl font-bold text-white">
                      {vendor.storeName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{vendor.storeName}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {vendor.storeDescription || 'Quality products from a verified seller'}
                  </p>
                  <span className="text-sm text-emerald-400 group-hover:underline">View Store →</span>
                </Link>
              )) : (
                // Fallback placeholder vendors
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-64 p-6 bg-slate-900 rounded-2xl border border-slate-800 snap-start"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-800 animate-pulse mb-4" />
                    <div className="h-5 bg-slate-800 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Custom scrollbar styles */}
          <style>{`
            .vendor-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(16, 185, 129, 0.5) rgba(30, 41, 59, 0.5);
            }
            .vendor-scroll::-webkit-scrollbar {
              height: 6px;
            }
            .vendor-scroll::-webkit-scrollbar-track {
              background: rgba(30, 41, 59, 0.5);
              border-radius: 10px;
            }
            .vendor-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(to right, rgba(16, 185, 129, 0.6), rgba(6, 182, 212, 0.6));
              border-radius: 10px;
            }
            .vendor-scroll::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to right, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.8));
            }
          `}</style>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Featured Products
              </h2>
              <p className="text-slate-400 max-w-md">
                Handpicked products with the best reviews and competitive prices.
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400">No products available. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
                >
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Stock Badge */}
                    {product.stockQuantity <= 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                        Out of Stock
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        className={`w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-400'} hover:bg-slate-800`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={product.stockQuantity <= 0}
                      className="absolute bottom-0 left-0 right-0 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-slate-500 mb-1">{product.categoryName}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-white">4.8</span>
                      <span className="text-sm text-slate-500">(128)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border-y border-slate-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-slate-400 mb-8">
            Subscribe to get exclusive deals, new arrivals, and insider updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <Button size="lg">Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
