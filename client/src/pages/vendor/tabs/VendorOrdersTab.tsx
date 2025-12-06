import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertCircle,
  ChevronRight,
  Eye 
} from 'lucide-react';
import api from '../../../lib/axios';

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}

interface VendorOrdersTabProps {
  vendorId: number;
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock }> = {
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
  PROCESSING: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Package },
  SHIPPED: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Truck },
  DELIVERED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  CANCELLED: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

export default function VendorOrdersTab({ vendorId }: VendorOrdersTabProps) {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['vendorOrders', vendorId],
    queryFn: async () => {
      const response = await api.get(`/vendors/store/${vendorId}/orders`);
      // Map backend response to frontend Order interface
      return response.data.map((order: any) => ({
        id: order.orderId,
        status: order.status,
        totalPrice: order.vendorTotal,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map((item: any) => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      }));
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!vendorId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await api.put(`/vendors/${vendorId}/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders', vendorId] });
      setSelectedOrder(null);
    },
  });

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">Failed to load orders. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              statusFilter === status
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {status === 'ALL' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
            <p className="text-slate-400">
              Orders for your products will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={order.id}
                  className="p-6 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">Order #{order.id}</p>
                        <p className="text-sm text-slate-400">{order.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium text-white">{formatPrice(order.totalPrice)}</p>
                        <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                      </div>
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {order.status}
                      </span>
                      
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <Package className="w-4 h-4" />
                    {order.items?.length || 0} items
                    <ChevronRight className="w-4 h-4" />
                    {order.items?.map(i => i.productName).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Order #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Customer</h4>
                <p className="text-white">{selectedOrder.customerName}</p>
                <p className="text-slate-400 text-sm">{selectedOrder.customerEmail}</p>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Shipping Address</h4>
                <p className="text-white">{selectedOrder.shippingAddress}</p>
              </div>
              
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <span className="text-white">{item.productName}</span>
                      <div className="text-right">
                        <span className="text-slate-400">x{item.quantity}</span>
                        <span className="ml-4 text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Update Status */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => {
                    const config = statusConfig[status];
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatusMutation.mutate({ 
                          orderId: selectedOrder.id, 
                          status 
                        })}
                        disabled={updateStatusMutation.isPending || selectedOrder.status === status}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === status
                            ? `${config.bg} ${config.color} cursor-default`
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
