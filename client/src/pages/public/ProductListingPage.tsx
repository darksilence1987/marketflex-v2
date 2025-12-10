import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Grid3X3,
  LayoutList,
  Loader2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AuthDrawer } from '../../components/features/AuthDrawer';
import { CartDrawer } from '../../components/features/CartDrawer';
import { ProductCard, ProductCardSkeleton } from '../../components/features/ProductCard';
import { Button } from '../../components/ui/Button';
import { DualRangeSlider } from '../../components/ui/Slider';
import { mockCategories } from '../../hooks/useProducts';
import api from '../../lib/axios';

// Fetch categories from API
async function fetchCategories() {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch {
    return mockCategories;
  }
}

// Fetch paginated products
interface ProductPage {
  content: any[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

async function fetchProductsPage(page: number, size: number, filters: Record<string, any>): Promise<ProductPage> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.search) params.set('search', filters.search);
  
  // Send sortBy directly - backend expects: price-asc, price-desc, newest, name
  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }
  
  const { data } = await api.get<ProductPage>(`/products/filter?${params.toString()}`);
  return data;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
] as const;

// Price range constants
const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PAGE_SIZE = 12;

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch categories from API
  const { data: apiCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
  });

  // Use API categories or fallback to mock
  const categories = apiCategories ?? mockCategories;

  // Filter state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    availability: true,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get filters from URL
  const filters = useMemo(() => ({
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    search: searchParams.get('q') ?? undefined,
    sortBy: (searchParams.get('sort') as 'newest' | 'price-asc' | 'price-desc' | 'name') ?? 'newest',
  }), [searchParams]);

  // Infinite query for products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['products-infinite', filters],
    queryFn: ({ pageParam = 0 }) => fetchProductsPage(pageParam, PAGE_SIZE, filters),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  // Flatten all pages into single products array
  const products = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.content);
  }, [data]);

  const totalProducts = data?.pages[0]?.totalElements ?? 0;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Get selected category name
  const selectedCategoryName = useMemo(() => {
    if (!filters.categoryId) return null;
    const category = categories.find((c: { id: number; name: string }) => c.id === filters.categoryId);
    return category?.name ?? null;
  }, [filters.categoryId, categories]);

  // Page title
  const pageTitle = useMemo(() => {
    if (filters.search) return `Search: "${filters.search}"`;
    if (selectedCategoryName) return selectedCategoryName;
    return 'All Products';
  }, [filters.search, selectedCategoryName]);

  // Update URL params
  const updateFilter = useCallback((key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Handle price range change
  const handlePriceRangeChange = useCallback((values: { min: number; max: number }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (values.min === PRICE_MIN) {
      newParams.delete('minPrice');
    } else {
      newParams.set('minPrice', String(values.min));
    }
    
    if (values.max === PRICE_MAX) {
      newParams.delete('maxPrice');
    } else {
      newParams.set('maxPrice', String(values.max));
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.search;

  // Sidebar content component
  const SidebarContent = useCallback(() => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b border-slate-800 pb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <span className="font-semibold text-white">Categories</span>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            {categories.map((category: { id: number; name: string }) => (
              <label
                key={`category-${category.id}`}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() =>
                  updateFilter(
                    'category',
                    filters.categoryId === category.id ? null : String(category.id)
                  )
                }
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    filters.categoryId === category.id
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-600 group-hover:border-emerald-500'
                  }`}
                >
                  {filters.categoryId === category.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range - Now using Slider */}
      <div className="border-b border-slate-800 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <span className="font-semibold text-white">Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {expandedSections.price && (
          <DualRangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            minValue={filters.minPrice ?? PRICE_MIN}
            maxValue={filters.maxPrice ?? PRICE_MAX}
            onChange={handlePriceRangeChange}
            formatLabel={(v) => `$${v}`}
          />
        )}
      </div>

      {/* Availability */}
      <div>
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <span className="font-semibold text-white">Availability</span>
          {expandedSections.availability ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {expandedSections.availability && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                filters.inStock
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-600 group-hover:border-emerald-500'
              }`}
              onClick={() => updateFilter('inStock', filters.inStock ? null : 'true')}
            >
              {filters.inStock && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-slate-300 group-hover:text-white transition-colors">
              In Stock Only
            </span>
          </label>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  ), [categories, expandedSections, filters, hasActiveFilters, toggleSection, updateFilter, handlePriceRangeChange, clearAllFilters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {pageTitle}
          </h1>
          <p className="text-slate-400">
            {isLoading ? 'Loading...' : `${totalProducts} product${totalProducts !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Left - Filter Toggle & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Active Filters Pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {filters.categoryId && selectedCategoryName && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                  {selectedCategoryName}
                  <button onClick={() => updateFilter('category', null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                  ${filters.minPrice ?? PRICE_MIN} - ${filters.maxPrice ?? PRICE_MAX}
                  <button onClick={() => {
                    updateFilter('minPrice', null);
                    updateFilter('maxPrice', null);
                  }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.inStock && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                  In Stock
                  <button onClick={() => updateFilter('inStock', null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Right - Sort & View */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          {isSidebarOpen && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <SidebarContent />
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-400 mb-4">Failed to load products</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div
                className={`grid gap-6 ${
                  isSidebarOpen
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={`product-${product.id}`} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCard key={`product-${product.id}`} product={product} variant="compact" />
                ))}
              </div>
            )}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading more products...
                </div>
              )}
              {!hasNextPage && products.length > 0 && (
                <p className="text-slate-500 text-sm">No more products to load</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-slate-900 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
