import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  Heart,
  Package,
  LogOut,
  X,
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
  Store,
  Gamepad2,
  Car,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

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
  'Electronics': 'text-blue-400',
  'Fashion': 'text-pink-400',
  'Home & Living': 'text-amber-400',
  'Sports & Fitness': 'text-green-400',
  'Beauty': 'text-purple-400',
  'Books': 'text-cyan-400',
  'Toys & Games': 'text-indigo-400',
  'Automotive': 'text-red-400',
};

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
}

interface UserVendor {
  id: number;
  storeName: string;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  } catch {
    return [];
  }
}

async function fetchMyVendors(): Promise<UserVendor[]> {
  try {
    const { data } = await api.get<UserVendor[]>('/vendors/my-stores');
    return data;
  } catch {
    return [];
  }
}

interface SearchProduct {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  vendorStoreName?: string;
}

async function searchProducts(query: string): Promise<SearchProduct[]> {
  if (!query || query.length < 2) return [];
  try {
    const { data } = await api.get<{ content: SearchProduct[] }>(
      `/products/filter?search=${encodeURIComponent(query)}&size=8`
    );
    return data.content || [];
  } catch {
    return [];
  }
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

export function Navbar() {
  const navigate = useNavigate();
  const { openAuthDrawer, openCartDrawer, isMegaMenuOpen, toggleMegaMenu, closeMegaMenu } =
    useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Debounced search query
  const debouncedSearch = useDebounce(searchQuery, 400);
  
  // Search products query
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['search-products', debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: number) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  // Fetch categories dynamically
  const { data: categories = [] } = useQuery({
    queryKey: ['navbar-categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
  });


  // Fetch user's vendors if authenticated and is vendor
  // Backend may return role as 'VENDOR' or 'ROLE_VENDOR' depending on context
  const userRole = user?.role?.replace('ROLE_', '');
  const isVendor = userRole === 'VENDOR' || userRole === 'MANAGER' || userRole === 'ADMIN';
  const { data: myVendors = [] } = useQuery({
    queryKey: ['my-vendors-nav'],
    queryFn: fetchMyVendors,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated && isVendor,
  });

  const getCategoryIcon = (name: string) => categoryIcons[name] || Package;
  const getCategoryColor = (name: string) => categoryColors[name] || 'text-slate-400';

  return (
    <>
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-6">
                <span>🚚 Free shipping on orders over $50</span>
                <span>📦 30-day returns</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
                <a href="#" className="hover:text-white transition-colors">Track Order</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Market<span className="text-emerald-400">Flex</span>
              </span>
            </Link>

            {/* Categories Dropdown (Desktop) */}
            <div className="relative hidden lg:block">
              <button
                onClick={toggleMegaMenu}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Menu className="w-4 h-4" />
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for products, brands, and more..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
                )}
                
                {/* Search Dropdown */}
                {isSearchFocused && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 transition-colors text-left"
                          >
                            {/* Product Image */}
                            <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-slate-600" />
                                </div>
                              )}
                            </div>
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{product.name}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="text-emerald-400 font-semibold">${product.price.toFixed(2)}</span>
                                <span>•</span>
                                <span className={product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                                </span>
                              </div>
                              {product.vendorStoreName && (
                                <p className="text-xs text-slate-500 truncate">by {product.vendorStoreName}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : !isSearching ? (
                      <div className="p-4 text-center text-slate-400 text-sm">
                        No products found for "{searchQuery}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist (Desktop) - Heart Icon without badge */}
              <Link
                to="/wishlist"
                className="hidden lg:flex relative p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-800">
                          <p className="font-medium text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/account"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          
                          <Link
                            to="/account/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                          
                          <Link
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </Link>
                          
                          <Link
                            to="/favourite-vendors"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            Favourite Vendors
                          </Link>
                        </div>

                        {/* Vendor Section */}
                        {isVendor && (
                          <div className="border-t border-slate-800 p-2">
                            <p className="px-3 py-1 text-xs font-medium text-slate-500 uppercase">My Stores</p>
                            
                            {myVendors.length > 0 ? (
                              myVendors.slice(0, 3).map((vendor) => (
                                <Link
                                  key={vendor.id}
                                  to={`/store/${vendor.storeName}`}
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                                    <span className="text-xs font-bold">{vendor.storeName.charAt(0)}</span>
                                  </div>
                                  <span className="truncate text-sm">{vendor.storeName}</span>
                                </Link>
                              ))
                            ) : (
                              <p className="px-3 py-2 text-sm text-slate-500">No stores yet</p>
                            )}
                            
                            <Link
                              to="/vendor/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors font-medium"
                            >
                              <Store className="w-4 h-4" />
                              Vendor Dashboard
                            </Link>
                          </div>
                        )}

                        <div className="border-t border-slate-800 p-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAuthDrawer('login')}
                    className="hidden lg:flex"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openAuthDrawer('register')}
                  >
                    <span className="hidden lg:inline">Get Started</span>
                    <User className="w-4 h-4 lg:hidden" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-11 pl-12 pr-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Mega Menu - Dynamic Categories */}
        {isMegaMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-30"
              onClick={closeMegaMenu}
            />
            <div className="absolute left-0 right-0 bg-slate-900 border-t border-b border-slate-800 shadow-2xl z-40">
              <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                  {categories.length > 0 ? categories.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    const color = getCategoryColor(category.name);
                    return (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="group text-center"
                        onClick={closeMegaMenu}
                      >
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-all group-hover:scale-110 mb-3">
                          {category.imageUrl ? (
                            <img 
                              src={category.imageUrl} 
                              alt={category.name} 
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <Icon className={`w-7 h-7 ${color}`} />
                          )}
                        </div>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                          {category.name}
                        </span>
                      </Link>
                    );
                  }) : (
                    // Loading placeholders
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 animate-pulse mb-3" />
                        <div className="h-4 bg-slate-800 rounded animate-pulse w-16 mx-auto" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-slate-900 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mobile Categories */}
            <div className="p-4 space-y-2">
              <p className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">Categories</p>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const color = getCategoryColor(category.name);
                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    {category.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Quick Links */}
            <div className="p-4 border-t border-slate-800 space-y-2">
              <Link
                to="/favourite-vendors"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 text-red-400" />
                Favourite Vendors
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
