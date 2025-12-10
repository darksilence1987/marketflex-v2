import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, AlertCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { useVendorContext, VendorProvider } from '../../context/VendorContext';
import api from '../../lib/axios';

interface Category {
  id: number;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  vendorId: number;
}

function ProductFormContent() {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedVendor } = useVendorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0,
    vendorId: selectedVendor?.id || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
  });

  // Fetch existing product if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
    enabled: isEditMode,
  });

  // Populate form with existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description || '',
        price: existingProduct.price,
        stockQuantity: existingProduct.stockQuantity,
        imageUrl: existingProduct.imageUrl || '',
        categoryId: existingProduct.categoryId,
        vendorId: existingProduct.vendorId,
      });
    }
  }, [existingProduct]);

  // Update vendorId when selectedVendor changes (for new products)
  useEffect(() => {
    if (selectedVendor && !isEditMode) {
      setFormData(prev => ({ ...prev, vendorId: selectedVendor.id }));
    }
  }, [selectedVendor, isEditMode]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (isEditMode) {
        return api.put(`/products/${productId}`, data);
      }
      return api.post('/products', data);
    },
    onSuccess: async (response) => {
      // If we have a selected file and just created a product, upload the image
      if (selectedFile && !isEditMode && response.data?.id) {
        await uploadImage(response.data.id);
      }
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      navigate('/vendor/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save product');
    },
  });

  const uploadImage = async (prodId: number) => {
    if (!selectedFile) return;
    
    setIsUploadingImage(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('imageFile', selectedFile);
      
      await api.post(`/products/${prodId}/image`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = async () => {
    if (!selectedFile || !productId) return;
    
    setIsUploadingImage(true);
    setError(null);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('imageFile', selectedFile);
      
      const response = await api.post(`/products/${productId}/image`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      setSelectedFile(null);
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!productId || !formData.imageUrl) return;
    
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setIsDeletingImage(true);
    setError(null);
    
    try {
      const response = await api.delete(`/products/${productId}/image`);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (formData.categoryId === 0) {
      setError('Please select a category');
      return;
    }
    if (!formData.vendorId) {
      setError('Please select a store first');
      return;
    }

    mutation.mutate(formData);
  };

  if (!selectedVendor) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">No Store Selected</h1>
          <p className="text-slate-400 mb-6">Please select a store from the dashboard first.</p>
          <Button onClick={() => navigate('/vendor/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  // Determine what image to show
  const displayImageUrl = previewUrl || formData.imageUrl;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-slate-400">{selectedVendor.storeName}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Image
              </label>
              
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="w-32 h-32 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                  {displayImageUrl ? (
                    <img 
                      src={displayImageUrl} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 border-dashed rounded-xl text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {selectedFile ? selectedFile.name : 'Choose Image'}
                  </button>
                  
                  {isEditMode && selectedFile && (
                    <Button
                      type="button"
                      onClick={handleUploadClick}
                      disabled={isUploadingImage}
                      className="w-full gap-2"
                      size="sm"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  )}
                  
                  {isEditMode && formData.imageUrl && !selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteImage}
                      disabled={isDeletingImage}
                      className="w-full gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      size="sm"
                    >
                      {isDeletingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Remove Image
                        </>
                      )}
                    </Button>
                  )}
                  
                  <p className="text-xs text-slate-500">
                    JPG, PNG, GIF or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
                placeholder="Enter product description"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              >
                <option value={0}>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendor/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductFormPage() {
  return (
    <VendorProvider>
      <ProductFormContent />
    </VendorProvider>
  );
}
