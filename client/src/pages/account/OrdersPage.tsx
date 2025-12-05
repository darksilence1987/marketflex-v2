import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl } from '../../lib/utils';

interface Product {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  totalPrice: number;
  items: OrderItem[];
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  CONFIRMED: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  PROCESSING: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  SHIPPED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  DELIVERED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <p className="text-slate-400 mt-1">View and track your order history</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-1/4 mb-4" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <p className="text-slate-400 mt-1">View and track your order history</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center">
          <p className="text-red-400">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <p className="text-slate-400 mt-1">View and track your order history</p>
        </div>
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-slate-400 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">My Orders</h2>
        <p className="text-slate-400 mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusStyle = statusColors[order.status] || statusColors.PENDING;
          
          return (
            <div
              key={order.id}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 transition-all duration-200 hover:border-slate-700"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">
                    ${Number(order.totalPrice).toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Product Images */}
              <div className="flex items-center gap-2 mb-4">
                {order.items.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.id}
                    className="w-14 h-14 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border-2 border-slate-700"
                    style={{ marginLeft: idx > 0 ? '-8px' : '0', zIndex: 5 - idx }}
                  >
                    {item.product?.imageUrl ? (
                      <img
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xl">
                        📦
                      </div>
                    )}
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-700 text-slate-400 text-sm font-medium" style={{ marginLeft: '-8px' }}>
                    +{order.items.length - 5}
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-400 border-t border-slate-700 pt-4">
                <div>
                  <span className="text-slate-500">Payment:</span>{' '}
                  <span className="text-slate-300">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500">Ship to:</span>{' '}
                  <span className="text-slate-300 truncate">{order.shippingAddress}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
