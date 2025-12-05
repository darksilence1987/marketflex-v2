import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthDrawer } from '../components/features/AuthDrawer';
import { CartDrawer } from '../components/features/CartDrawer';
import { useCartStore } from '../store/cartStore';
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
  'Sports': Dumbbell,
  'Beauty': Sparkles,
  'Books': BookOpen,
};

const categoryColors: Record<string, string> = {
  'Electronics': 'from-blue-500 to-blue-600',
  'Fashion': 'from-pink-500 to-rose-600',
  'Home & Living': 'from-amber-500 to-orange-600',
  'Sports': 'from-green-500 to-emerald-600',
  'Beauty': 'from-purple-500 to-violet-600',
  'Books': 'from-cyan-500 to-teal-600',
};

// Fallback vendors (static)
const vendors = [
  { name: 'TechPro', logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&q=80', rating: 4.9, products: 234 },
  { name: 'StyleHub', logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80', rating: 4.8, products: 567 },
  { name: 'HomeNest', logo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=80', rating: 4.7, products: 189 },
  { name: 'FitGear', logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&q=80', rating: 4.9, products: 432 },
  { name: 'GlowUp', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80', rating: 4.6, products: 321 },
  { name: 'BookWorm', logo: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&q=80', rating: 4.8, products: 890 },
];

// API fetchers
async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<Product[]>('/products');
    // Return first 8 products (or filter by featured if backend supports)
    return data.slice(0, 8);
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get<Category[]>('/categories');
    return data.slice(0, 6);
  } catch {
    return [];
  }
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

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

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: getImageUrl(product.imageUrl),
      vendor: 'MarketFlex',
    });
    openCartDrawer();
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Get category icon and color
  const getCategoryIcon = (name: string) => categoryIcons[name] || Laptop;
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

      {/* Categories Bento Grid */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(categories.length > 0 ? categories : [
                { id: 1, name: 'Electronics' },
                { id: 2, name: 'Fashion' },
                { id: 3, name: 'Home & Living' },
                { id: 4, name: 'Sports' },
                { id: 5, name: 'Beauty' },
                { id: 6, name: 'Books' },
              ]).map((category, i) => {
                const Icon = getCategoryIcon(category.name);
                const color = getCategoryColor(category.name);
                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all hover:border-slate-700 hover:scale-[1.02] ${
                      i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  >
                    {/* Background Image */}
                    <div className={`absolute inset-0 ${i === 0 ? 'h-full' : 'h-32'}`}>
                      <img
                        src={getImageUrl(category.imageUrl)}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-20`} />
                    </div>

                    {/* Content */}
                    <div className={`relative p-6 ${i === 0 ? 'h-full flex flex-col justify-end' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                      <p className="text-sm text-slate-400">{category.productCount || '100+'} products</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Vendor Spotlight */}
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

          <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {vendors.map((vendor) => (
              <a
                key={vendor.name}
                href={`/vendor/${vendor.name.toLowerCase()}`}
                className="flex-shrink-0 w-64 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group snap-start"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 ring-2 ring-slate-700 group-hover:ring-emerald-500/50 transition-all">
                  <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{vendor.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white font-medium">{vendor.rating}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{vendor.products} products</span>
                </div>
                <span className="text-sm text-emerald-400 group-hover:underline">View Store →</span>
              </a>
            ))}
          </div>
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
                      <button className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors">
                        <Heart className="w-4 h-4" />
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
