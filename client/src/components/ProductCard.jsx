import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../features/cart/cartSlice';
import { useAuth } from '../hooks/useAuth';
import { redirectToLogin } from '../utils/authRedirect';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const { _id, name, price, images, category, averageRating, sizes } = product;

  const totalStock = sizes.reduce((acc, curr) => acc + curr.stock, 0);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 10;

  const [inWishlist, setInWishlist] = useState(false);

  // Check if product is in wishlist on mount and when localStorage updates
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('gu_wishlist') || '[]');
    setInWishlist(savedWishlist.some(item => item._id === _id));

    const handleWishlistUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('gu_wishlist') || '[]');
      setInWishlist(updated.some(item => item._id === _id));
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [_id]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const savedWishlist = JSON.parse(localStorage.getItem('gu_wishlist') || '[]');
    let updated;
    if (inWishlist) {
      updated = savedWishlist.filter(item => item._id !== _id);
      toast.success('Removed from wishlist');
    } else {
      updated = [...savedWishlist, { _id, name, price, images }];
      toast.success('Added to wishlist', { icon: '❤️' });
    }

    localStorage.setItem('gu_wishlist', JSON.stringify(updated));
    setInWishlist(!inWishlist);
    // Dispatch custom event to notify Navbar
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const availableSize = sizes.find((s) => s.stock > 0);
    if (!availableSize) {
      toast.error('This product is currently out of stock.');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Please login to add items to your cart.');
      redirectToLogin(navigate, location, {
        productId: _id,
        qty: 1,
        size: availableSize.size,
        productName: name,
      });
      return;
    }

    dispatch(addToCart({ productId: _id, qty: 1, size: availableSize.size }))
      .unwrap()
      .then(() => {
        toast.success(`Added ${name} (${availableSize.size}) to cart!`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to add item');
      });
  };

  return (
    <Link
      to={`/products/${_id}`}
      className="group flex flex-col h-full product-card-glow overflow-hidden"
    >
      {/* Category Badge */}
      <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-xl bg-surface/90 backdrop-blur-md border border-border/80 font-sans font-bold text-[9px] text-primary tracking-wider uppercase shadow-xs">
        {category}
      </span>

      {/* Stock status badge */}
      {isOutOfStock && (
        <span className="absolute top-3.5 right-12 z-10 px-2.5 py-1 rounded-xl bg-text/90 backdrop-blur-md text-bg font-sans font-bold text-[9px] uppercase tracking-wider shadow-sm transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
          Sold Out
        </span>
      )}
      {!isOutOfStock && isLowStock && (
        <span className="absolute top-3.5 right-12 z-10 px-2.5 py-1 rounded-xl bg-accent text-white font-sans font-bold text-[9px] uppercase tracking-wider shadow-sm transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
          {totalStock} Left
        </span>
      )}

      {/* Wishlist Toggle Button (Top Right) */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-surface/85 backdrop-blur-md border border-border shadow-sm text-text-secondary hover:text-error hover:bg-error/5 hover:scale-105 active:scale-95 transition-all duration-200"
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-error text-error' : ''}`} />
      </button>

      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-bg/40 overflow-hidden border-b border-border">
        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Geeta University Logo hover watermark */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none select-none opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <img
            src="/logo.png"
            alt="Geeta University Logo"
            className="w-9 h-9 object-contain bg-surface/95 backdrop-blur-md p-1.5 rounded-xl border border-border/80 shadow-premium"
          />
        </div>

        {/* Quick Add To Cart Button */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 right-4 p-3 btn-primary !p-3 !rounded-2xl translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-105 active:scale-95"
            title="Quick Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Card Details */}
      <div className="p-4 flex flex-col flex-grow gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-3 h-3 ${
                  idx < Math.round(averageRating) ? 'fill-amber-500 text-amber-500' : 'text-border'
                }`}
              />
            ))}
          </div>
          <span className="font-sans text-[10px] text-text-secondary font-bold">
            {(averageRating || 0).toFixed(1)}
          </span>
        </div>

        <h3 className="font-display font-bold text-sm text-text leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        <div className="mt-auto pt-1.5 flex items-baseline justify-between">
          <span className="font-display font-black text-base text-text">
            ₹{price.toLocaleString('en-IN')}.00
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
