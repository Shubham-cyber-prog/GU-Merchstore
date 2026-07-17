import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight, Award, Shield, CheckCircle, Sparkles,
  Truck, RotateCcw, ShieldCheck, Mail, ArrowUpRight
} from 'lucide-react';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  // Featured Products, New Arrivals, Best Sellers sections
  const featuredProducts = useMemo(() => {
    const featured = safeProducts.filter((p) => p.isFeatured && p.isActive !== false);
    return featured.length > 0 ? featured.slice(0, 4) : safeProducts.slice(0, 4);
  }, [safeProducts]);

  const newArrivals = useMemo(() => {
    const active = safeProducts.filter((p) => p.isActive !== false);
    return [...active]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [safeProducts]);

  const bestSellers = useMemo(() => {
    const active = safeProducts.filter((p) => p.isActive !== false);
    return [...active]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 4);
  }, [safeProducts]);

  const categoryData = useMemo(() => {
    const defaultCategories = [
      {
        name: 'Premium Hoodies',
        slug: 'hoodies',
        description: 'Heavyweight fleece with gold embroidery.',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Heritage Tees',
        slug: 'tshirts',
        description: '100% combed cotton comfort wear.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Campus Sweatshirts',
        slug: 'sweatshirts',
        description: 'Minimalist classic crewnecks.',
        image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Caps, journals & thermal flasks.',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
      },
    ];

    return defaultCategories.map((cat) => {
      const targetSlug = cat.slug === 'sweatshirts' ? 'hoodies' : cat.slug;
      const catProducts = safeProducts.filter(
        (p) => p.category === targetSlug && p.images && p.images.length > 0 && p.isActive
      );
      if (catProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * catProducts.length);
        const randomProduct = catProducts[randomIndex];
        return {
          ...cat,
          image: randomProduct.images[0],
        };
      }
      return cat;
    });
  }, [safeProducts]);

  const assurances = [
    { icon: Truck, title: 'Free Shipping', desc: 'Complimentary shipping across campus & hostel locations.' },
    { icon: RotateCcw, title: 'Easy Returns', desc: 'No questions asked size replacement within 7 days.' },
    { icon: Award, title: 'Premium Quality', desc: 'Shrinkage-free premium combed cotton & heavyweight fleece.' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: 'Encrypted checkout pathways powered by Stripe APIs.' },
  ];

  const testimonials = [
    {
      name: 'Aditya Sharma',
      role: 'B.Tech CS Student',
      comment: 'The quality of the gold varsity hoodie is top notch. The fabric is heavy and super soft inside. Worth every rupee.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Neha Kapoor',
      role: 'MBA Student',
      comment: 'Received the heritage tee yesterday. The fit is perfect and the university crest gold embroidery looks beautiful!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Rohan Verma',
      role: 'GU Alumni',
      comment: 'Super easy to order online and collect from campus office. Great way to stay connected to my legacy.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    }
  ];

  return (
    <div className="bg-bg min-h-screen transition-colors duration-300">
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface border-b border-border py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px] -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
          {/* Clean grid background pattern */}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[radial-gradient(rgb(var(--text))_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 animate-slideUp text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-sans font-bold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Official GU Merchandise Hub
              </span>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-text tracking-tight leading-[1.1] max-w-lg">
                Wear Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Pride
                </span>
                .<br />
                Own Your Legacy.
              </h1>
              <p className="font-sans text-sm sm:text-base text-text-secondary max-w-md leading-relaxed">
                Premium campus apparel crafted for Geeta University students and faculty. Experience comfort, premium quality, and pride in every thread.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/products" className="btn-primary px-8 py-3.5 text-xs.5 shadow-sm">
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary px-8 py-3.5 text-xs.5"
                >
                  View Catalog
                </Link>
              </div>
            </div>

            {/* Right Hero Image Showcase */}
            <div className="lg:col-span-6 hidden lg:block animate-fadeIn">
              <div className="relative max-w-lg mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[32px] blur-2xl opacity-60" />
                <div className="relative overflow-hidden rounded-[24px] bg-surface border border-border aspect-[4/4] shadow-premium hover:shadow-premium-hover transition-all duration-300">
                  <img
                    src="/gu-hoodie-hero.png"
                    alt="GU Varsity Hoodie"
                    className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/10 via-transparent to-transparent" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BANNER SECTION ──────────────────────────────────────── */}
      <section className="py-10 bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {assurances.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface border border-transparent hover:border-border transition-all duration-200">
                <div className="p-2.5 bg-primary/5 text-primary rounded-xl flex-shrink-0 shadow-xs border border-primary/5">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-text text-xs tracking-wide">{title}</h3>
                  <p className="font-sans text-[11px] text-text-secondary mt-1 leading-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORIES ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Shop by Category</h2>
            <div className="w-12 h-0.5 bg-primary/40 mx-auto mt-4 rounded-full" />
            <p className="section-subheading mx-auto">
              Browse student collections, daily campus wear, and official accessories.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">
            {categoryData.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-premium hover:-translate-y-1 transition-all duration-350"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-display font-bold text-sm sm:text-base text-text group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-[11px] text-text-secondary mt-1.5 hidden sm:block leading-relaxed">{cat.description}</p>
                  <div className="flex items-center gap-1.5 text-primary font-sans font-bold text-xs mt-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Browse <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 text-left">
            <div>
              <h2 className="section-heading text-2xl sm:text-3xl">Featured Products</h2>
              <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1">
                Official premium picks, crafted to meet highest university guidelines.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 font-sans font-bold text-sm text-primary hover:underline transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 text-left">
            <div>
              <h2 className="section-heading text-2xl sm:text-3xl">New Arrivals</h2>
              <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1">
                The latest catalog additions freshly minted for this semester.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 font-sans font-bold text-sm text-primary hover:underline transition-all"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 text-left">
            <div>
              <h2 className="section-heading text-2xl sm:text-3xl">Best Sellers</h2>
              <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1">
                Top rated merchandise beloved by Geeta University community.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 font-sans font-bold text-sm text-primary hover:underline transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Student & Faculty Voices</h2>
            <div className="w-12 h-0.5 bg-primary/40 mx-auto mt-4 rounded-full" />
            <p className="section-subheading mx-auto">
              Read authentic feedback from members of the Geeta University community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map(({ name, role, comment, rating, avatar }) => (
              <div
                key={name}
                className="bg-surface border border-border rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-500 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-sans text-xs.5 text-text-secondary leading-relaxed mb-6">
                    "{comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 border-t border-border/60 pt-4 mt-auto">
                  <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover border border-border" />
                  <div>
                    <h4 className="font-display font-bold text-text text-xs">{name}</h4>
                    <p className="font-sans text-[10px] text-text-secondary">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER SECTION ───────────────────────────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3.5 bg-primary/5 text-primary rounded-2xl border border-primary/10">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-text tracking-tight">
            Keep Up with the Campus Club
          </h2>
          <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Subscribe to receive alerts on new arrivals, back-in-stock items, and member-only promotions.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your university email"
              className="input-field py-2.5 text-xs flex-grow"
            />
            <button type="submit" className="btn-primary py-2.5 px-6 text-xs.5 flex-shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
