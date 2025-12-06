import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { getImageUrl } from '../../lib/utils';
import type { Product } from '../../hooks/useProducts';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: getImageUrl(product.imageUrl),
      vendor: product.vendorStoreName || 'MarketFlex',
    });
    openCartDrawer();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (variant === 'compact') {
    return (
      <div className="group flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800">
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-500">{product.categoryName}</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">
            {formatPrice(product.price)}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!isInStock}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
        >
          Add
        </Button>
      </div>
    );
  }

  return (
    <div className="group bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {!isInStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
              <X className="w-3 h-3" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
              Only {product.stockQuantity} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
              <Check className="w-3 h-3" />
              In Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
          {product.categoryName}
        </p>

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-white line-clamp-2 group-hover:text-emerald-400 transition-colors min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating (mock) */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">(128)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-emerald-400">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-slate-800 rounded" />
        <div className="h-5 w-full bg-slate-800 rounded" />
        <div className="h-5 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-6 w-20 bg-slate-800 rounded" />
      </div>
    </div>
  );
}
