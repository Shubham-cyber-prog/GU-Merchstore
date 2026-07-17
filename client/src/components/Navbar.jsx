import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag, User, LogOut, LayoutDashboard,
  Menu, X, ChevronDown, Settings, Sparkles,
  Heart, Search, ArrowRight, Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchCart } from '../features/cart/cartSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, user, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);
  const wishlistRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('gu_wishlist') || '[]');
    setWishlist(savedWishlist);

    // Event listener to listen to custom wishlist updates from other components
    const handleWishlistUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('gu_wishlist') || '[]');
      setWishlist(updated);
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  useEffect(() => {
    if (isLoggedIn) dispatch(fetchCart());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    setCategoriesOpen(false);
    setWishlistOpen(false);
    setMobileSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
        setWishlistOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const removeFromWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = wishlist.filter(item => item._id !== productId);
    localStorage.setItem('gu_wishlist', JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const isActive = (path) => location.pathname === path;

  const categoriesList = [
    { label: 'Hoodies & Sweatshirts', slug: 'hoodies' },
    { label: 'T-Shirts & Tops', slug: 'tshirts' },
    { label: 'Bags & Backpacks', slug: 'bag' },
    { label: 'Caps & Accessories', slug: 'accessories' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-surface/95 backdrop-blur-2xl border-b border-border shadow-brand'
        : 'bg-surface/70 backdrop-blur-xl border-b border-border/40'
    }`}>
      {/* Top brand gradient bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-maroon-700 via-brand-gold-500 to-brand-maroon-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px] gap-4">

          {/* ── LOGO (Slightly larger as requested) ───────────────────── */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="GU Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-[15px] text-text tracking-tight group-hover:text-primary transition-colors">
                GEETA UNIVERSITY
              </span>
              <span className="font-sans font-bold text-[9px] text-text-secondary uppercase tracking-[0.22em] mt-0.5">
                Merchandise Hub
              </span>
            </div>
          </Link>

          {/* ── SEARCH BAR (Desktop) ─────────────────────────────────── */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-[280px] lg:max-w-sm relative group mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg/50 border border-border/80 rounded-xl font-sans text-xs text-text placeholder:text-text-secondary/40 focus:outline-none focus:bg-surface focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-200"
              />
            </div>
          </form>

          {/* ── DESKTOP NAV LINKS ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            <Link
              to="/"
              className={`relative px-3.5 py-2 rounded-xl font-sans font-semibold text-xs.5 transition-all duration-200 group ${
                isActive('/') ? 'text-primary' : 'text-text-secondary hover:text-text'
              }`}
            >
              {isActive('/') && <span className="absolute inset-0 bg-primary/5 rounded-xl" />}
              <span className="relative z-10">Home</span>
            </Link>

            <Link
              to="/products"
              className={`relative px-3.5 py-2 rounded-xl font-sans font-semibold text-xs.5 transition-all duration-200 group ${
                isActive('/products') && !location.search.includes('category')
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {isActive('/products') && !location.search.includes('category') && (
                <span className="absolute inset-0 bg-primary/5 rounded-xl" />
              )}
              <span className="relative z-10">Catalog</span>
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl font-sans font-semibold text-xs.5 transition-all duration-200 ${
                  categoriesOpen
                    ? 'text-primary bg-primary/5'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-premium py-1.5 z-50 animate-fadeIn">
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      className="block px-4 py-2 text-xs font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── DESKTOP RIGHT ACTIONS ─────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            {/* Wishlist Heart Icon */}
            <div className="relative" ref={wishlistRef}>
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className={`relative p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-xl transition-all duration-200 group ${
                  wishlistOpen ? 'text-error bg-error/5' : ''
                }`}
                title="Wishlist"
              >
                <Heart className={`w-[19px] h-[19px] ${wishlist.length > 0 ? 'fill-error text-error' : ''} group-hover:scale-105 transition-transform`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-error text-white font-sans font-bold text-[8px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {wishlistOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-2xl shadow-premium p-4 z-50 animate-fadeIn max-h-96 overflow-y-auto scrollbar-thin">
                  <h4 className="font-display font-bold text-xs text-text border-b border-border pb-2 mb-2 flex items-center justify-between">
                    <span>Wishlist ({wishlist.length})</span>
                    <Heart className="w-3.5 h-3.5 text-error fill-error" />
                  </h4>
                  {wishlist.length === 0 ? (
                    <p className="text-center py-4 text-xs text-text-secondary/60">Your wishlist is empty</p>
                  ) : (
                    <div className="space-y-2.5">
                      {wishlist.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 p-1.5 hover:bg-bg/40 rounded-xl transition-all relative group/item">
                          <Link to={`/products/${item._id}`} className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-bg overflow-hidden flex-shrink-0 border border-border">
                              <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-sans font-semibold text-xs text-text truncate group-hover/item:text-primary transition-colors">{item.name}</p>
                              <p className="font-sans text-[10px] text-text-secondary font-bold">₹{item.price?.toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                          <button
                            onClick={(e) => removeFromWishlist(item._id, e)}
                            className="p-1.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-[19px] h-[19px] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white font-sans font-bold text-[8px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-4 bg-border/80 mx-1" />

            {/* User Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border transition-all duration-200 ${
                    dropdownOpen
                      ? 'bg-primary/5 border-primary/20 shadow-sm'
                      : 'bg-surface border-border hover:border-primary/20 hover:bg-primary/[0.02]'
                  }`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-6.5 h-6.5 rounded-lg object-cover border border-border" alt="Avatar" />
                  ) : (
                    <div className="w-6.5 h-6.5 rounded-lg bg-primary text-white flex items-center justify-center font-display font-bold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="font-sans font-semibold text-[11px] text-text">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl shadow-premium py-1 z-50 animate-fadeIn overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-3.5 py-3 border-b border-border mb-0.5">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover border border-border flex-shrink-0" alt="Avatar" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-bold text-sm text-text truncate leading-snug">{user?.name}</p>
                          <p className="font-sans text-[11px] text-text-secondary truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span className="font-sans text-[10px] font-bold text-success uppercase tracking-wider capitalize">{user?.role || 'Student'} Account</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {[
                      { to: user?.role === 'admin' ? '/admin/analytics' : '/dashboard', icon: LayoutDashboard, label: user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard' },
                      { to: '/products', icon: Sparkles, label: 'Browse Catalog' },
                      { to: '/settings', icon: Settings, label: 'Settings' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-3.5 py-2 hover:bg-primary/5 transition-all duration-150 group"
                      >
                        <div className="p-1 bg-bg rounded-md group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-sans font-semibold text-xs.5 text-text-secondary group-hover:text-text transition-colors">{label}</span>
                      </Link>
                    ))}

                    <div className="border-t border-border mt-0.5 pt-0.5">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-3.5 py-2 text-error hover:bg-error/5 transition-all duration-150 text-left group"
                      >
                        <div className="p-1 bg-error/5 rounded-md group-hover:bg-error/10 transition-colors">
                          <LogOut className="w-3.5 h-3.5 text-error" />
                        </div>
                        <span className="font-sans font-semibold text-xs.5">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="px-3.5 py-2 text-xs.5 font-semibold text-text-secondary hover:text-text transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  state={{ from: location }}
                  className="px-4 py-2 btn-primary text-xs.5 !py-2 !px-5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ── MOBILE CONTROLS ───────────────────────────────────────── */}
          <div className="flex items-center md:hidden gap-1">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2.5 text-text-secondary rounded-xl hover:bg-primary/5 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative p-2.5 text-text-secondary rounded-xl hover:bg-primary/5 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white font-black text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-text-secondary hover:bg-primary/5 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE SEARCH OVERLAY ─────────────────────────────────────── */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-xl font-sans text-xs text-text focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50"
            />
          </form>
        </div>
      )}

      {/* ── MOBILE MENU ───────────────────────────────────────────────── */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-surface/98 backdrop-blur-2xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-sans font-semibold text-sm transition-all ${
                isActive('/') ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-primary/5 hover:text-text'
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-sans font-semibold text-sm transition-all ${
                isActive('/products') ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-primary/5 hover:text-text'
              }`}
            >
              Catalog
            </Link>

            <div className="border-t border-border my-2" />

            <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary/60">Categories</p>
            {categoriesList.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans font-semibold text-sm text-text-secondary hover:bg-primary/5 hover:text-primary transition-all"
              >
                {cat.label}
              </Link>
            ))}

            <div className="border-t border-border my-2" />

            {isLoggedIn ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-3 px-3.5 py-3 mb-1">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-border flex-shrink-0" alt="Avatar" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-display font-bold text-base flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-text truncate">{user?.name}</p>
                    <p className="font-sans text-[11px] text-text-secondary truncate">{user?.email}</p>
                  </div>
                </div>

                {[
                  { to: user?.role === 'admin' ? '/admin/analytics' : '/dashboard', icon: LayoutDashboard, label: user?.role === 'admin' ? 'Admin Panel' : 'Dashboard' },
                  { to: '/settings', icon: Settings, label: 'Settings' },
                  { to: '/cart', icon: ShoppingBag, label: 'My Cart' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans font-semibold text-sm text-text-secondary hover:bg-primary/5 hover:text-text transition-all"
                  >
                    <Icon className="w-4.5 h-4.5 text-text-secondary/60" />
                    {label}
                  </Link>
                ))}

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans font-semibold text-sm text-error hover:bg-error/5 text-left transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="w-full text-center py-3 border border-border text-text rounded-xl font-bold text-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  state={{ from: location }}
                  className="w-full text-center py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/95 transition-all duration-200 shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
