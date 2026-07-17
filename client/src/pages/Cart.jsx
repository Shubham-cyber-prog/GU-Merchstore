import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCart, updateCartItem, removeCartItem } from '../features/cart/cartSlice';
import { useAuth } from '../hooks/useAuth';
import { redirectToLogin } from '../utils/authRedirect';
import Loader from '../components/Loader';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  // Calculations - backend returns flat items: { productId, name, price, image, size, qty, stock }
  const subtotal = safeCartItems.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
  const totalItemsCount = safeCartItems.reduce((acc, item) => acc + item.qty, 0);
  const estimatedDelivery = subtotal > 1000 ? 0 : 60;

  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) return;
    // Check stock limit for that product size
    if (item.stock !== undefined && newQty > item.stock) {
      toast.error(`Sorry, only ${item.stock} units available in size ${item.size}.`);
      return;
    }

    dispatch(updateCartItem({ productId: item.productId, qty: newQty, size: item.size }))
      .unwrap()
      .then(() => {
        toast.success('Cart updated');
      })
      .catch((err) => {
        toast.error(err || 'Failed to update quantity');
      });
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId))
      .unwrap()
      .then(() => {
        toast.success('Product removed from cart');
      })
      .catch((err) => {
        toast.error(err || 'Failed to remove product');
      });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen text-center flex flex-col items-center justify-center">
        <ShoppingBag className="w-14 h-14 text-primary mx-auto mb-4" />
        <h1 className="font-display font-extrabold text-3xl text-text tracking-tight mb-3">
          Login to View Your Cart
        </h1>
        <p className="font-sans text-text-secondary max-w-md mx-auto mb-8">
          Sign in with your Geeta University email to add items, review your cart, and checkout.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => redirectToLogin(navigate, location)}
            className="btn-primary px-8 py-3 text-sm font-semibold"
          >
            Login to Continue
          </button>
          <Link to="/products" className="btn-secondary px-8 py-3 text-sm font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-left">
      {loading && safeCartItems.length === 0 && <Loader fullScreen />}

      <h1 className="font-display font-extrabold text-3xl text-text tracking-tight mb-8">
        Your Shopping Cart
      </h1>

      {safeCartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-surface border border-border rounded-3xl p-12 text-center shadow-premium max-w-xl mx-auto my-10 space-y-6">
          <div className="p-4 bg-primary/5 text-primary rounded-2xl inline-block">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="font-display font-bold text-xl text-text">Your Cart is Empty</h3>
          <p className="font-sans text-text-secondary text-sm max-w-xs mx-auto leading-relaxed">
            Look like you haven't added any official university merchandise to your basket yet.
          </p>
          <div className="pt-2">
            <Link to="/products" className="btn-primary inline-flex py-3 px-8 text-sm font-semibold">
              Go To Shop Catalog
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: CART ITEMS LIST (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {safeCartItems.map((item) => (
              <div 
                key={`${item.productId}-${item.size}`}
                className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-premium hover:shadow-premium-hover transition-all flex flex-col sm:flex-row items-center gap-5"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-25 rounded-xl bg-bg border border-border overflow-hidden shrink-0 relative">
                  <img 
                    src={item.image || item.product?.images?.[0]} 
                    alt={item.name || item.product?.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* University logo watermark */}
                  <div className="absolute bottom-1 left-1 z-10 p-0.5 bg-surface rounded shadow-sm border border-border w-8 h-8 flex items-center justify-center pointer-events-none select-none">
                    <img 
                      src="/logo.png" 
                      alt="GU Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Info details */}
                <div className="flex-grow text-center sm:text-left space-y-1.5 min-w-0">
                  <h3 className="font-display font-bold text-sm text-text hover:text-primary transition-colors truncate">
                    <Link to={`/products/${item.productId}`}>{item.name || item.product?.name}</Link>
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 text-xs text-text-secondary font-semibold font-sans">
                    <span className="bg-bg border border-border px-2 py-0.5 rounded-lg">
                      Size: {item.size}
                    </span>
                    <span>₹{(item.price || item.product?.price || 0).toLocaleString('en-IN')}.00 each</span>
                  </div>
                </div>

                {/* Controls (Qty Stepper & Remove Trash Button) */}
                <div className="flex items-center gap-6 shrink-0 justify-between w-full sm:w-auto">
                  {/* Stepper */}
                  <div className="flex items-center border border-border bg-bg rounded-xl h-10">
                    <button
                      onClick={() => handleQtyChange(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-3 py-1.5 text-text-secondary hover:text-primary disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-sans font-bold text-xs text-text">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item, item.qty + 1)}
                      className="px-3 py-1.5 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Item Price */}
                  <span className="font-sans font-bold text-sm text-text min-w-20 text-right">
                    ₹{((item.price || item.product?.price || 0) * item.qty).toLocaleString('en-IN')}.00
                  </span>

                  {/* Trash Bin button */}
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-2.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-xl transition-all duration-200"
                    title="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: CART SUMMARY SIDEBAR (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-premium space-y-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-text border-b border-border pb-4">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm font-sans font-semibold text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="text-text">₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-text">
                    {estimatedDelivery === 0 ? (
                      <span className="text-success font-bold uppercase text-xs bg-success/5 border border-success/10 px-1.5 py-0.5 rounded-lg">Free</span>
                    ) : (
                      `₹${estimatedDelivery}.00`
                    )}
                  </span>
                </div>
                {estimatedDelivery > 0 && (
                  <p className="text-[10px] text-text-secondary/40 text-right font-medium">
                    Add ₹{1000 - subtotal} more for free delivery
                  </p>
                )}
              </div>

              <hr className="border-border" />

              {/* Total amount */}
              <div className="flex justify-between items-baseline">
                <span className="font-display font-bold text-base text-text">Total Amount</span>
                <span className="font-sans font-black text-2xl text-primary">
                  ₹{(subtotal + estimatedDelivery).toLocaleString('en-IN')}.00
                </span>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary py-3.5 text-sm font-semibold"
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  Proceed to Checkout
                </button>
                
                <Link
                  to="/products"
                  className="block text-center text-xs font-bold text-primary hover:underline transition-colors uppercase tracking-wider py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
