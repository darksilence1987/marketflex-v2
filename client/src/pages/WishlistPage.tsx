import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthDrawer } from '../components/features/AuthDrawer';
import { CartDrawer } from '../components/features/CartDrawer';
import { Button } from '../components/ui/Button';

// For now, this is a placeholder page - you can integrate with a wishlist store later
export default function WishlistPage() {
  // Placeholder wishlist items - integrate with backend/store later
  const wishlistItems: { id: number; name: string; price: number; image: string; inStock: boolean }[] = [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            My Wishlist
          </h1>
          <p className="text-slate-400">
            Products you've saved for later. Add them to cart when you're ready!
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Heart className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Start adding products you love by clicking the heart icon on any product.
            </p>
            <Link to="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Remove from Wishlist */}
                  <button className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {!item.inStock && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-white mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-400">
                      ${item.price.toFixed(2)}
                    </span>
                    <button 
                      disabled={!item.inStock}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-lg text-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
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
