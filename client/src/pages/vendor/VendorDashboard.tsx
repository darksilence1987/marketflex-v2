import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Store,
  Settings,
  ShoppingCart,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { useVendorProducts } from '../../hooks/useProducts';
import { useAuthStore } from '../../store/authStore';
import { VendorProvider, useVendorContext } from '../../context/VendorContext';
import StoreSettingsTab from './tabs/StoreSettingsTab';
import VendorOrdersTab from './tabs/VendorOrdersTab';
import api from '../../lib/axios';

function VendorDashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vendors, selectedVendor, selectVendor } = useVendorContext();
  
  // Fetch products for the SELECTED vendor
  const { data: products, isLoading, error } = useVendorProducts(selectedVendor?.storeName);
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      setDeletingProductId(null);
    },
    onError: () => {
      alert('Failed to delete product. Please try again.');
      setDeletingProductId(null);
    },
  });

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingProductId(productId);
      deleteMutation.mutate(productId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (quantity < 10) return { label: 'Low Stock', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'In Stock', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Vendor Dashboard
                </h1>
                
                {/* Store Selector */}
                {vendors.length > 0 && (
                  <div className="relative mt-1">
                    <button
                      onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                      className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {selectedVendor?.storeName || 'Select Store'}
                      </span>
                      {vendors.length > 1 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {isStoreDropdownOpen && vendors.length > 1 && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsStoreDropdownOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                          <div className="p-2">
                            {vendors.map((vendor) => (
                              <button
                                key={vendor.id}
                                onClick={() => {
                                  selectVendor(vendor);
                                  setIsStoreDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                  selectedVendor?.id === vendor.id
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <Store className="w-4 h-4" />
                                <span className="text-sm">{vendor.storeName}</span>
                              </button>
                            ))}
                          </div>
                          <div className="border-t border-slate-800 p-2">
                            <button
                              onClick={() => navigate('/vendor/create-store')}
                              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm">Create New Store</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-slate-400">
              Welcome back, {user?.firstName}! Manage your store here.
            </p>
          </div>
          
          {activeTab === 'products' && (
            <Button
              onClick={() => navigate('/vendor/product/new')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Products</p>
                    <p className="text-2xl font-bold text-white">{products?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Active Products</p>
                    <p className="text-2xl font-bold text-white">
                      {products?.filter(p => p.active).length || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Low Stock</p>
                    <p className="text-2xl font-bold text-white">
                      {products?.filter(p => p.stockQuantity < 10 && p.stockQuantity > 0).length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">Your Products</h2>
              </div>

              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading products...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400">Failed to load products. Please try again.</p>
                </div>
              ) : products && products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Product</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Category</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Price</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Stock</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {products.map((product) => {
                        const stockStatus = getStockStatus(product.stockQuantity);
                        return (
                          <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                                  {product.imageUrl ? (
                                    <img
                                      src={product.imageUrl}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-6 h-6 text-slate-600" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{product.name}</p>
                                  <p className="text-sm text-slate-400 line-clamp-1 max-w-xs">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-300">{product.categoryName}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-white">{formatPrice(product.price)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-300">{product.stockQuantity}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                  title="View Product"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/vendor/product/${product.id}/edit`)}
                                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={deletingProductId === product.id}
                                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete Product"
                                >
                                  {deletingProductId === product.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
                  <p className="text-slate-400 mb-6">
                    Start by adding your first product to the marketplace.
                  </p>
                  <Button onClick={() => navigate('/vendor/product/new')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Product
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'orders' && selectedVendor && (
          <VendorOrdersTab vendorId={selectedVendor.id} />
        )}

        {activeTab === 'settings' && selectedVendor && (
          <StoreSettingsTab vendor={selectedVendor} />
        )}
      </main>
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <VendorProvider>
      <VendorDashboardContent />
    </VendorProvider>
  );
}
