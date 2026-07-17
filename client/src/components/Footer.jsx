import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Globe, MessageCircle, Share2, ArrowUpRight, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto transition-colors duration-300">
      {/* Pre-footer CTA strip */}
      <div className="border-b border-border bg-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
              <Heart className="w-5 h-5 fill-primary/20" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-sm text-text">Official Geeta University Store</p>
              <p className="font-sans text-xs text-text-secondary">Premium campus merchandise, delivered with pride.</p>
            </div>
          </div>
          <Link to="/products" className="btn-primary !py-2.5 !px-6 text-xs">
            Shop Now <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/80 text-left">

          {/* Brand */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GU Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-display font-black text-sm text-text tracking-wide block">GEETA UNIVERSITY</span>
                <span className="font-sans font-bold text-[9px] text-text-secondary uppercase tracking-[0.2em]">Merchandise Hub</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              The official merchandise platform of Geeta University. Wear your academic pride with style, comfort, and premium quality.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { href: 'https://instagram.com', icon: Globe, label: 'Instagram' },
                { href: 'https://twitter.com', icon: MessageCircle, label: 'Twitter' },
                { href: 'https://facebook.com', icon: Share2, label: 'Facebook' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg hover:bg-primary hover:text-white text-text-secondary rounded-xl border border-border hover:border-primary transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Shop</h4>
            <ul className="space-y-3 text-sm font-medium text-text-secondary">
              {[
                { to: '/products', label: 'All Collections' },
                { to: '/products?category=hoodies', label: 'Premium Hoodies' },
                { to: '/products?category=tshirts', label: 'Heritage Tees' },
                { to: '/products?category=accessories', label: 'Accessories' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Support</h4>
            <ul className="space-y-3 text-sm font-medium text-text-secondary">
              {['FAQ & Contact', 'Return Policy', 'Size Guide', 'Campus Pickup'].map((item) => (
                <li key={item}>
                  <span className="hover:text-primary cursor-pointer transition-colors duration-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Stay Connected</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Subscribe to get notified about product drops and university events.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Email address"
                className="input-field py-2.5 px-3.5 text-sm flex-grow"
              />
              <button type="submit" className="p-2.5 btn-primary !px-3.5 !py-2.5">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <ul className="space-y-2.5 text-sm text-text-secondary pt-1">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Geeta University, NH-709, Panipat, Haryana 132145</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 99960 51000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>merchstore@geetauniversity.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Geeta University. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <span key={item} className="hover:text-primary cursor-pointer transition-colors duration-200">{item}</span>
            ))}
            <Link to="/admin/analytics" className="hover:text-primary transition-colors duration-200 flex items-center gap-1">
              Admin Portal <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
