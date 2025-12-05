import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const categories = [
  { name: 'Electronics', icon: Laptop, color: 'text-blue-400' },
  { name: 'Fashion', icon: Shirt, color: 'text-pink-400' },
  { name: 'Home & Living', icon: Home, color: 'text-amber-400' },
  { name: 'Sports', icon: Dumbbell, color: 'text-green-400' },
  { name: 'Beauty', icon: Sparkles, color: 'text-purple-400' },
  { name: 'Books', icon: BookOpen, color: 'text-cyan-400' },
];

export function Navbar() {
  const { openAuthDrawer, openCartDrawer, isMegaMenuOpen, toggleMegaMenu, closeMegaMenu } =
    useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Market<span className="text-emerald-400">Flex</span>
              </span>
            </a>

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
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist (Desktop) */}
              <button className="hidden lg:flex p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <Heart className="w-5 h-5" />
              </button>

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
                      <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-800">
                          <p className="font-medium text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <a
                            href="/account"
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </a>
                          <a
                            href="/orders"
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            Orders
                          </a>
                          <a
                            href="/wishlist"
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </a>
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

        {/* Mega Menu */}
        {isMegaMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-30"
              onClick={closeMegaMenu}
            />
            <div className="absolute left-0 right-0 bg-slate-900 border-t border-b border-slate-800 shadow-2xl z-40">
              <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-6 gap-6">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={`/category/${category.name.toLowerCase()}`}
                      className="group text-center"
                      onClick={closeMegaMenu}
                    >
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-all group-hover:scale-110 mb-3">
                        <category.icon className={`w-7 h-7 ${category.color}`} />
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {category.name}
                      </span>
                    </a>
                  ))}
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
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={`/category/${category.name.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
