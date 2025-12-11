import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Package,
  ChevronRight,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ProductCard, ProductCardSkeleton } from '../../components/features/ProductCard';
import { useFavouriteVendorsStore } from '../../store/favouriteVendorsStore';
import { useAuthStore } from '../../store/authStore';
import { AuthDrawer } from '../../components/features/AuthDrawer';
import api from '../../lib/axios';
import type { Product } from '../../hooks/useProducts';

interface Vendor {
  id: number;
  storeName: string;
  storeDescription: string | null;
  address: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  userId: number;
  userFullName: string;
}

export default function VendorStorePage() {
  const { storeName } = useParams<{ storeName: string }>();
  const { isAuthenticated } = useAuthStore();
  const { addFavourite, removeFavourite, isFavourite } = useFavouriteVendorsStore();

  // Fetch vendor details
  const { data: vendor, isLoading: isLoadingVendor, error: vendorError } = useQuery({
    queryKey: ['vendor', storeName],
    queryFn: async () => {
      const { data } = await api.get<Vendor>(`/vendors/${storeName}`);
      return data;
    },
    enabled: !!storeName,
  });

  // Fetch vendor products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['vendor-products', storeName],
    queryFn: async () => {
      const { data } = await api.get<Product[]>(`/vendors/${storeName}/products`);
      return data;
    },
    enabled: !!storeName,
  });

  if (isLoadingVendor) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-slate-800 rounded-2xl mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (vendorError || !vendor) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Store Not Found</h1>
          <p className="text-slate-400 mb-6">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Browse all products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{vendor.storeName}</span>
        </nav>

        {/* Store Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Store Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Store className="w-10 h-10 text-white" />
              </div>

              {/* Store Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{vendor.storeName}</h1>
                {vendor.storeDescription && (
                  <p className="text-slate-400 mb-4">{vendor.storeDescription}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {vendor.address && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {vendor.address}
                    </div>
                  )}
                  {vendor.contactEmail && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      {vendor.contactEmail}
                    </div>
                  )}
                  {vendor.contactPhone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      {vendor.contactPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats and Favourite Button */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{products?.length || 0}</div>
                  <div className="text-sm text-slate-400">Products</div>
                </div>
                
                {/* Favourite Button */}
                {isAuthenticated && vendor && (
                  <button
                    onClick={async () => {
                      if (isFavourite(vendor.id)) {
                        await removeFavourite(vendor.id);
                      } else {
                        await addFavourite(vendor.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      isFavourite(vendor.id)
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavourite(vendor.id) ? 'fill-current' : ''}`} />
                    {isFavourite(vendor.id) ? 'Favourited' : 'Add to Favourites'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Products from this store</h2>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
              <p className="text-slate-400">
                This store hasn't added any products yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </main>

      <AuthDrawer />
      <Footer />
    </div>
  );
}
