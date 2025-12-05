import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Grid3X3,
  LayoutList,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AuthDrawer } from '../../components/features/AuthDrawer';
import { CartDrawer } from '../../components/features/CartDrawer';
import { ProductCard, ProductCardSkeleton } from '../../components/features/ProductCard';
import { Button } from '../../components/ui/Button';
import {
  useProducts,
  filterProducts,
  mockProducts,
  mockCategories,
  type ProductFilters,
} from '../../hooks/useProducts';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
] as const;

const priceRanges = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: Infinity, label: '$500+' },
];

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products, isLoading, error } = useProducts();

  // Use mock data if API fails or is loading
  const productList = products ?? mockProducts;
  const categories = mockCategories;

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
  const filters: ProductFilters = {
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    search: searchParams.get('q') ?? undefined,
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) ?? 'newest',
  };

  // Update URL params
  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return filterProducts(productList, filters);
  }, [productList, filters]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.search;

  // Sidebar content
  const SidebarContent = () => (
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
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    filters.categoryId === category.id
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-600 group-hover:border-emerald-500'
                  }`}
                  onClick={() =>
                    updateFilter(
                      'category',
                      filters.categoryId === category.id ? null : String(category.id)
                    )
                  }
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

      {/* Price Range */}
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
          <div className="space-y-2">
            {priceRanges.map((range, i) => {
              const isSelected =
                filters.minPrice === range.min &&
                (range.max === Infinity
                  ? filters.maxPrice === undefined
                  : filters.maxPrice === range.max);
              return (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-600 group-hover:border-emerald-500'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        updateFilter('minPrice', null);
                        updateFilter('maxPrice', null);
                      } else {
                        updateFilter('minPrice', String(range.min));
                        updateFilter(
                          'maxPrice',
                          range.max === Infinity ? null : String(range.max)
                        );
                      }
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors">
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
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
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <AuthDrawer />
      <CartDrawer />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {filters.search ? `Search: "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-slate-400">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
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
              {filters.categoryId && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                  {categories.find((c) => c.id === filters.categoryId)?.name}
                  <button onClick={() => updateFilter('category', null)}>
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
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-400 mb-4">Failed to load products</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" />
                ))}
              </div>
            )}
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
