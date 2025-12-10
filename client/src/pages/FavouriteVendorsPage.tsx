import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, Star, Loader2, Search, Grid, List } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthDrawer } from '../components/features/AuthDrawer';
import { CartDrawer } from '../components/features/CartDrawer';
import { Button } from '../components/ui/Button';
import { useFavouriteVendorsStore } from '../store/favouriteVendorsStore';
import { useAuthStore } from '../store/authStore';

export default function FavouriteVendorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { vendors, isLoading, error, fetchFavourites, removeFavourite } = useFavouriteVendorsStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavourites();
    }
  }, [isAuthenticated, fetchFavourites]);

  const handleToggleFavourite = async (vendorId: number) => {
    try {
      await removeFavourite(vendorId);
    } catch (error) {
      console.error('Failed to remove from favourites:', error);
    }
  };

  // Filter vendors by search query
  const filteredVendors = vendors.filter(v => 
    v.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <AuthDrawer />
        <CartDrawer />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Heart className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Please sign in to view your favourite vendors
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Create an account or sign in to save your favourite stores.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              <Heart className="w-8 h-8 inline-block mr-3 text-red-400" />
              Favourite Vendors
            </h1>
            <p className="text-slate-400">
              Your favourite stores. Get updates on new products and exclusive deals.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Store className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No vendors found' : 'No favourite vendors yet'}
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try a different search term.'
                : 'Browse vendors and add them to your favourites to see them here.'}
            </p>
            <Link to="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.vendorId}
                className="group bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all"
              >
                {/* Header with gradient */}
                <div className="h-24 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 relative">
                  <button 
                    onClick={() => handleToggleFavourite(vendor.vendorId)}
                    className="absolute top-3 right-3 p-2 rounded-lg transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Vendor Logo */}
                <div className="relative -mt-10 px-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center ring-4 ring-slate-900">
                    <span className="text-3xl font-bold text-white">
                      {vendor.storeName.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {vendor.storeName}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {vendor.storeDescription || 'Quality products from a verified seller'}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-white font-medium">4.8</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-sm">Products available</span>
                  </div>

                  <Link to={`/store/${vendor.storeName}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Store
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.vendorId}
                className="flex items-center gap-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all"
              >
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {vendor.storeName.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {vendor.storeName}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {vendor.storeDescription || 'Quality products from a verified seller'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-white font-medium text-sm">4.8</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggleFavourite(vendor.vendorId)}
                    className="p-2 rounded-lg transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                  <Link to={`/store/${vendor.storeName}`}>
                    <Button variant="primary" size="sm">
                      View Store
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
