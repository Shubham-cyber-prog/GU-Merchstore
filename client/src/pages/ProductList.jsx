import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, Grid3X3, RefreshCw,
  Search, X, TrendingUp, Package,
  ChevronDown, Sparkles
} from 'lucide-react';
import { fetchProducts, setFilter, resetFilters } from '../features/products/productSlice';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals', icon: '✨' },
  { value: 'price-asc', label: 'Price: Low → High', icon: '↑' },
  { value: 'price-desc', label: 'Price: High → Low', icon: '↓' },
  { value: 'rating', label: 'Top Rated', icon: '⭐' },
];

const CATEGORY_QUICK = [
  { value: 'all', label: 'All Items', emoji: '🎓' },
  { value: 'hoodie', label: 'Hoodies', emoji: '🧥' },
  { value: 'tshirt', label: 'T-Shirts', emoji: '👕' },
  { value: 'cap', label: 'Caps', emoji: '🧢' },
  { value: 'bag', label: 'Bags', emoji: '🎒' },
  { value: 'stationery', label: 'Stationery', emoji: '📝' },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, filters } = useSelector((state) => state.products);
  const safeProducts = Array.isArray(products) ? products.filter((p) => p.isActive !== false) : [];
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const size = searchParams.get('size') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    setSearchValue(search);
    dispatch(setFilter({ search, category, size, minPrice, maxPrice, sort }));
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilter(newFilters));
    const updatedParams = { ...filters, ...newFilters };
    const params = {};
    Object.keys(updatedParams).forEach((key) => {
      if (updatedParams[key] && updatedParams[key] !== 'all') params[key] = updatedParams[key];
      else if (updatedParams[key] === 'all') params[key] = 'all';
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchParams({});
    setSearchValue('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange({ search: searchValue });
  };

  const currentSort = SORT_OPTIONS.find(s => s.value === (filters.sort || 'newest'));
  const hasActiveFilters = filters.search || filters.size || filters.minPrice || filters.maxPrice || (filters.category && filters.category !== 'all');

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">

      {/* ── HERO HEADER BANNER ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden section-hero mesh-bg border-b border-border">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

            <div className="space-y-4 animate-slideUp">
              <span className="badge-brand">
                <Sparkles className="w-3 h-3" />
                Official GU Collection
              </span>

              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text leading-tight">
                University{' '}
                <span className="gradient-text">Catalog</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-text-secondary max-w-md leading-relaxed">
                Discover premium university apparel — hoodies, tees, caps, bags & stationery.
                All official Geeta University certified merchandise.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full lg:w-96">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/45 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-11 pr-10 py-3 bg-surface border border-border rounded-xl font-sans text-sm text-text placeholder:text-text-secondary/35 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/60 transition-all shadow-sm"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => { setSearchValue(''); handleFilterChange({ search: '' }); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-border hover:bg-border/80 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3 text-text-secondary" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_QUICK.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilterChange({ category: cat.value })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-xs whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                  (filters.category || 'all') === cat.value
                    ? 'btn-primary !py-2 !px-4 !text-xs shadow-brand'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* SIDEBAR ─────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-1 h-fit sticky top-24">
            <div className="bg-surface border border-border rounded-2xl shadow-premium overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-sm text-text">Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </aside>

          {/* PRODUCTS COLUMN ─────────────────────────── */}
          <main className="lg:col-span-3 flex flex-col gap-5">

            {/* TOP BAR ─────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 bg-surface border border-border rounded-2xl px-4 py-3 shadow-premium">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-bg border border-border text-text hover:text-primary hover:border-primary lg:hidden font-sans font-semibold text-xs rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>

                {/* Product count */}
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-text-secondary/40" />
                  <span className="font-sans text-xs text-text-secondary font-bold">
                    {loading ? 'Loading...' : `${safeProducts.length} ${safeProducts.length === 1 ? 'Product' : 'Products'}`}
                  </span>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    {filters.search && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-full border border-primary/10">
                        "{filters.search}"
                        <button onClick={() => handleFilterChange({ search: '' })}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                    {filters.size && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent/5 text-accent text-[10px] font-bold rounded-full border border-accent/10">
                        Size: {filters.size}
                        <button onClick={() => handleFilterChange({ size: '' })}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-bg border border-border rounded-xl font-sans text-xs font-semibold text-text transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-text-secondary/40" />
                  <span className="hidden sm:inline">{currentSort?.label}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className={`w-3 h-3 text-text-secondary/40 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-xl z-20 py-1.5 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { handleFilterChange({ sort: opt.value }); setSortOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors ${
                            (filters.sort || 'newest') === opt.value
                              ? 'bg-primary/5 text-primary'
                              : 'text-text-secondary hover:bg-bg'
                          }`}
                        >
                          <span className="text-base">{opt.icon}</span>
                          {opt.label}
                          {(filters.sort || 'newest') === opt.value && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PRODUCTS GRID ───────────────────────── */}
            <AnimatePresence mode="wait">
              {loading ? (
                /* Premium Skeleton */
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-premium">
                      <div className="aspect-[4/5] bg-bg animate-pulse" />
                      <div className="p-4 space-y-2.5">
                        <div className="h-2.5 bg-border rounded-full w-1/3 animate-pulse" />
                        <div className="h-4 bg-border rounded-full w-3/4 animate-pulse" />
                        <div className="h-3.5 bg-border rounded-full w-1/4 mt-3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : safeProducts.length === 0 ? (
                /* Premium Empty State */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 px-8 bg-surface border border-border rounded-3xl shadow-premium text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Grid3X3 className="w-9 h-9 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-text mb-2">No Products Found</h3>
                  <p className="font-sans text-sm text-text-secondary max-w-xs leading-relaxed">
                    We couldn't find products matching your filters. Try different keywords or reset.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-8 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                /* Products Grid */
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                >
                  {safeProducts.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ─────────────────────── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-text/40 dark:bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-surface shadow-2xl flex flex-col z-50 text-left"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-base text-text">Filters</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl bg-bg hover:bg-border transition-colors animate-fadeIn"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
