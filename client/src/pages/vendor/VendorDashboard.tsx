import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Store,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { useMyProducts } from '../../hooks/useProducts';
import { useAuthStore } from '../../store/authStore';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: products, isLoading, error } = useMyProducts();

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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Vendor Dashboard
              </h1>
            </div>
            <p className="text-slate-400">
              Welcome back, {user?.firstName}! Manage your products here.
            </p>
          </div>
          <Button
            onClick={() => {/* TODO: Navigate to add product page */}}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

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
                              onClick={() => {/* TODO: Navigate to edit product */}}
                              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {/* TODO: Handle delete */}}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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
              <Button onClick={() => {/* TODO: Navigate to add product */}} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
