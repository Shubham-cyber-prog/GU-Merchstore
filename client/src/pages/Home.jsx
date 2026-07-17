import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight, Award, CheckCircle, Sparkles,
  Truck, RotateCcw, ShieldCheck, Mail, ArrowUpRight, Star, Users, Package
} from 'lucide-react';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const MARQUEE_ITEMS = [
  'Official GU Merchandise', 'Premium Cotton', 'Campus Delivery',
  'Gold Embroidery', 'Student Exclusive', 'Alumni Collection',
  'Secure Checkout', 'Easy Returns',
];

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

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
        return { ...cat, image: catProducts[randomIndex].images[0] };
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

  const stats = [
    { icon: Users, value: '2,500+', label: 'Happy Students' },
    { icon: Package, value: '50+', label: 'Products' },
    { icon: Star, value: '4.9', label: 'Avg Rating' },
    { icon: CheckCircle, value: '100%', label: 'Official GU' },
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

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="section-hero mesh-bg border-b border-border pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div className="lg:col-span-6 space-y-7 animate-slideUp text-left">
              <span className="badge-brand">
                <Sparkles className="w-3.5 h-3.5" />
                Official GU Merchandise Hub
              </span>

              <h1 className="font-display font-black text-[2.5rem] sm:text-5xl lg:text-[3.5rem] text-text tracking-tight leading-[1.08]">
                Wear Your{' '}
                <span className="gradient-text">Pride</span>.
                <br />
                Own Your Legacy.
              </h1>

              <p className="font-sans text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed">
                Premium campus apparel crafted for Geeta University students and faculty.
                Experience comfort, quality, and pride in every thread.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/products" className="btn-primary px-8 py-3.5">
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="btn-secondary px-8 py-3.5">
                  View Catalog
                </Link>
              </div>

              {/* Inline stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-border/60">
                {stats.slice(0, 3).map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-display font-black text-xl text-text">{value}</p>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero visual */}
            <div className="lg:col-span-6 animate-fadeIn stagger-2">
              <div className="relative max-w-md lg:max-w-lg mx-auto">
                {/* Decorative rings */}
                <div className="absolute -inset-6 rounded-[2rem] border border-primary/10 animate-pulse-glow" />
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-brand-gold-500/10 border border-brand-gold-500/20 animate-float-slow hidden sm:flex items-center justify-center">
                  <Star className="w-8 h-8 text-brand-gold-500 fill-brand-gold-500/30" />
                </div>
                <div className="absolute -bottom-4 -left-4 glass-strong px-4 py-3 animate-float hidden sm:block">
                  <p className="font-display font-black text-lg text-text">4.9★</p>
                  <p className="font-sans text-[10px] text-text-secondary">Student Rated</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-surface border border-border shadow-brand-lg aspect-square">
                  <img
                    src="/gu-hoodie-hero.png"
                    alt="GU Varsity Hoodie"
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────────────────── */}
      <div className="trust-strip py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center mx-8 font-sans font-semibold text-xs text-text-secondary uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST ASSURANCES ──────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {assurances.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-primary/20 hover:shadow-premium transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="p-3 bg-primary/5 text-primary rounded-xl flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-text">{title}</h3>
                  <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-brand mb-4">Collections</span>
            <h2 className="section-heading">Shop by Category</h2>
            <div className="divider-gradient w-24 mx-auto mt-5 mb-4" />
            <p className="section-subheading mx-auto">
              Browse student collections, daily campus wear, and official accessories.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryData.map((cat, idx) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-border hover:border-primary/25 hover:shadow-brand transition-all duration-400 hover:-translate-y-1.5 animate-slideUp"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-display font-bold text-base text-text group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs text-text-secondary mt-1.5 hidden sm:block">{cat.description}</p>
                  <div className="flex items-center gap-1.5 text-primary font-sans font-bold text-xs mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Browse <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="badge-brand mb-3">Curated</span>
              <h2 className="section-heading text-2xl sm:text-3xl">Featured Products</h2>
              <p className="font-sans text-sm text-text-secondary mt-2">
                Official premium picks, crafted to meet highest university guidelines.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 font-sans font-bold text-sm text-primary hover:gap-3 transition-all duration-200"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BRAND STORY BAND ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 text-left">
              <span className="badge-brand">Our Promise</span>
              <h2 className="section-heading text-2xl sm:text-3xl">
                Built for Campus Life,<br />
                <span className="gradient-text">Designed to Last</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed max-w-md">
                Every piece in our collection is sourced from premium materials and crafted with
                Geeta University's official branding standards. From lecture halls to alumni reunions —
                wear your story with confidence.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="stat-pill">
                    <Icon className="w-5 h-5 text-primary mb-2" />
                    <p className="font-display font-black text-xl text-text">{value}</p>
                    <p className="font-sans text-xs text-text-secondary">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-premium aspect-[3/4]">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300" alt="Campus wear" className="w-full h-full object-cover" />
                  </div>
                  <div className="glass p-4 text-left">
                    <p className="font-display font-bold text-sm text-text">Premium Materials</p>
                    <p className="font-sans text-xs text-text-secondary mt-1">100% combed cotton & heavyweight fleece</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass p-4 text-left">
                    <p className="font-display font-bold text-sm text-text">Official Branding</p>
                    <p className="font-sans text-xs text-text-secondary mt-1">Gold embroidery & university crest</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border shadow-premium aspect-[3/4]">
                    <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300" alt="Hoodies" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="badge-brand mb-3">Fresh Drops</span>
              <h2 className="section-heading text-2xl sm:text-3xl">New Arrivals</h2>
              <p className="font-sans text-sm text-text-secondary mt-2">
                The latest catalog additions freshly minted for this semester.
              </p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 font-sans font-bold text-sm text-primary hover:gap-3 transition-all duration-200">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? <Loader /> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="badge-brand mb-3">Top Rated</span>
              <h2 className="section-heading text-2xl sm:text-3xl">Best Sellers</h2>
              <p className="font-sans text-sm text-text-secondary mt-2">
                Top rated merchandise beloved by the Geeta University community.
              </p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 font-sans font-bold text-sm text-primary hover:gap-3 transition-all duration-200">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? <Loader /> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-brand mb-4">Reviews</span>
            <h2 className="section-heading">Student & Faculty Voices</h2>
            <div className="divider-gradient w-24 mx-auto mt-5 mb-4" />
            <p className="section-subheading mx-auto">
              Authentic feedback from members of the Geeta University community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, comment, rating, avatar }, idx) => (
              <div
                key={name}
                className="card-premium p-7 flex flex-col justify-between animate-slideUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div>
                  <div className="flex text-brand-gold-500 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold-500" />
                    ))}
                  </div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3.5 border-t border-border/60 pt-5">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-text">{name}</h4>
                    <p className="font-sans text-xs text-text-secondary">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────────────────────────── */}
      <section className="cta-band py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex p-4 bg-white/10 text-white rounded-2xl backdrop-blur-sm">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Keep Up with the Campus Club
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/75 max-w-md mx-auto leading-relaxed">
            Subscribe for new arrivals, back-in-stock alerts, and member-only promotions.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your university email"
              className="input-field py-3 text-sm flex-grow bg-white/95 border-white/20 focus:border-white/40 focus:ring-white/10"
            />
            <button type="submit" className="btn-gold py-3 px-8 text-sm flex-shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
