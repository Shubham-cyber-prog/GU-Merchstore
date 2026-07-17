import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Globe, MessageCircle, Share2, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface/50 border-t border-border mt-auto pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/80 text-left">
          
          {/* Brand and Description */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GU Logo" className="w-9 h-9 object-contain" />
              <span className="font-display font-black text-xs.5 text-text tracking-widest uppercase">GEETA UNIVERSITY</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              The official merchandise platform of Geeta University. Wear your academic pride with style, comfort, and premium quality.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg hover:bg-primary/5 text-text-secondary hover:text-primary rounded-xl transition-all duration-200" aria-label="Instagram">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg hover:bg-primary/5 text-text-secondary hover:text-primary rounded-xl transition-all duration-200" aria-label="Twitter">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg hover:bg-primary/5 text-text-secondary hover:text-primary rounded-xl transition-all duration-200" aria-label="Facebook">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-text-secondary">
              <li>
                <Link to="/products" className="hover:text-primary hover:underline underline-offset-4 transition-all">All Collections</Link>
              </li>
              <li>
                <Link to="/products?category=hoodies" className="hover:text-primary hover:underline underline-offset-4 transition-all">Premium Hoodies</Link>
              </li>
              <li>
                <Link to="/products?category=tshirts" className="hover:text-primary hover:underline underline-offset-4 transition-all">Heritage Tees</Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="hover:text-primary hover:underline underline-offset-4 transition-all">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Support</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-text-secondary">
              <li>
                <span className="hover:text-primary cursor-pointer hover:underline underline-offset-4 transition-all">FAQ & Contact</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer hover:underline underline-offset-4 transition-all">Return Policy</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer hover:underline underline-offset-4 transition-all">Size Guide</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer hover:underline underline-offset-4 transition-all">Campus pickup</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-text text-xs tracking-wider uppercase">Stay Connected</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Subscribe to get notified about product drops and university events.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Email address"
                className="input-field py-2 px-3 text-xs flex-grow"
              />
              <button type="submit" className="p-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200">
                <Send className="w-4 h-4" />
              </button>
            </form>

            <ul className="space-y-2.5 text-xs text-text-secondary pt-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Geeta University, NH-709, Panipat, Haryana 132145</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>+91 99960 51000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-secondary font-medium">
          <p>© {new Date().getFullYear()} Geeta University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors duration-200">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors duration-200">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer transition-colors duration-200 flex items-center gap-1">
              Admin Portal <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
