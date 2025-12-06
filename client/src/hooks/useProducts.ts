import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

// Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  active: boolean;
  vendorId?: number;
  vendorStoreName?: string;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name';
}

// API Functions
async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

async function fetchProduct(id: string | number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

async function fetchCategories(): Promise<{ id: number; name: string }[]> {
  const { data } = await api.get('/categories');
  return data;
}

async function fetchMyProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products/my-products');
  return data;
}

// Hooks
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useMyProducts() {
  return useQuery({
    queryKey: ['my-products'],
    queryFn: fetchMyProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch products for a specific vendor by store name
async function fetchVendorProducts(storeName: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/vendors/${storeName}/products`);
  return data;
}

// Hook to get products for a specific vendor
export function useVendorProducts(storeName: string | undefined) {
  return useQuery({
    queryKey: ['vendor-products', storeName],
    queryFn: () => fetchVendorProducts(storeName!),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!storeName,
  });
}

// Client-side filtering (since backend may not support all filters)
export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let filtered = [...products];

  // Category filter
  if (filters.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
  }

  // Price range filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // In stock filter
  if (filters.inStock) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      // Assume higher ID = newer
      filtered.sort((a, b) => b.id - a.id);
      break;
  }

  return filtered;
}

// Mock data for development (when backend is unavailable)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.',
    price: 299.99,
    stockQuantity: 45,
    categoryId: 1,
    categoryName: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    active: true,
  },
  {
    id: 2,
    name: 'Premium Leather Messenger Bag',
    description: 'Handcrafted genuine leather messenger bag with laptop compartment and multiple pockets.',
    price: 189.99,
    stockQuantity: 23,
    categoryId: 2,
    categoryName: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    active: true,
  },
  {
    id: 3,
    name: 'Smart Fitness Watch Pro',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
    price: 249.99,
    stockQuantity: 67,
    categoryId: 1,
    categoryName: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    active: true,
  },
  {
    id: 4,
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
    price: 79.99,
    stockQuantity: 0,
    categoryId: 3,
    categoryName: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    active: true,
  },
  {
    id: 5,
    name: 'Organic Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer.',
    price: 129.99,
    stockQuantity: 34,
    categoryId: 4,
    categoryName: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    active: true,
  },
  {
    id: 6,
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with hot-swappable switches and programmable macros.',
    price: 159.99,
    stockQuantity: 89,
    categoryId: 1,
    categoryName: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80',
    active: true,
  },
  {
    id: 7,
    name: 'Designer Sunglasses',
    description: 'UV-protected polarized lenses in a sleek titanium frame.',
    price: 219.99,
    stockQuantity: 15,
    categoryId: 2,
    categoryName: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    active: true,
  },
  {
    id: 8,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 20-hour playtime.',
    price: 89.99,
    stockQuantity: 156,
    categoryId: 1,
    categoryName: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    active: true,
  },
  {
    id: 9,
    name: 'Yoga Mat Premium',
    description: 'Extra thick eco-friendly yoga mat with alignment lines.',
    price: 59.99,
    stockQuantity: 78,
    categoryId: 5,
    categoryName: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
    active: true,
  },
  {
    id: 10,
    name: 'Coffee Table Book Collection',
    description: 'Set of 3 beautifully illustrated art and design books.',
    price: 89.99,
    stockQuantity: 42,
    categoryId: 6,
    categoryName: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80',
    active: true,
  },
  {
    id: 11,
    name: 'Wireless Earbuds Elite',
    description: 'True wireless earbuds with ANC and spatial audio support.',
    price: 179.99,
    stockQuantity: 234,
    categoryId: 1,
    categoryName: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    active: true,
  },
  {
    id: 12,
    name: 'Cashmere Sweater',
    description: 'Luxuriously soft 100% cashmere sweater in classic fit.',
    price: 299.99,
    stockQuantity: 0,
    categoryId: 2,
    categoryName: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    active: true,
  },
];

export const mockCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
  { id: 3, name: 'Home & Living' },
  { id: 4, name: 'Beauty' },
  { id: 5, name: 'Sports' },
  { id: 6, name: 'Books' },
];
