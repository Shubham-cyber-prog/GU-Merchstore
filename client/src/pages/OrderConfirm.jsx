import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Package, Truck, Compass, Check, ArrowRight, ShoppingBag, Star, X, Download } from 'lucide-react';
import { fetchOrderById } from '../features/orders/orderSlice';
import { useSocket } from '../hooks/useSocket';
import Loader from '../components/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { downloadReceipt } from '../utils/receiptGenerator';

const OrderConfirm = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const [localStatus, setLocalStatus] = useState('');
  const [localPaymentStatus, setLocalPaymentStatus] = useState('');

  // Review states
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductForReview) return;

    if (!reviewComment.trim()) {
      toast.error('Please write a comment for your review.');
      return;
    }

    if (reviewComment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await api.post(`/reviews/${selectedProductForReview.productId}`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Thank you! Review posted successfully.');
      setSelectedProductForReview(null);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 1. Fetch Order on mount
  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [orderId, dispatch]);

  // Set initial status when order loads
  useEffect(() => {
    if (order) {
      setLocalStatus(order.status);
      setLocalPaymentStatus(order.paymentStatus || 'pending');
    }
  }, [order]);

  // 2. Connect mock websocket tracker
  useSocket(orderId, (update) => {
    if (update.status) {
      setLocalStatus(update.status);
    }
    if (update.paymentStatus) {
      setLocalPaymentStatus(update.paymentStatus);
      toast.success(`Payment status updated to: ${update.paymentStatus}!`, {
        icon: '💳',
        duration: 4000
      });
    }
  });

  if (loading) return <Loader fullScreen />;

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="font-display font-bold text-xl text-text-secondary">Order Not Found</h3>
        <p className="font-sans text-text-secondary mt-2">The order ID does not exist in our records.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Explore Shop</Link>
      </div>
    );
  }

  const currentStatus = (localStatus || order.status || '').toLowerCase();
  const currentPaymentStatus = (localPaymentStatus || order.paymentStatus || '').toLowerCase();
  const showReceiptButton = currentStatus === 'delivered' && currentPaymentStatus === 'paid';

  const steps = [
    { title: 'Placed', icon: ShoppingBag, desc: 'We have received your order details.' },
    { title: 'Packed', icon: Package, desc: 'Items are sorted and quality checked.' },
    { title: 'Shipped', icon: Truck, desc: 'Merch desk has prepared packages.' },
    { title: 'Delivered', icon: CheckCircle, desc: 'Package collected at Block A Desk.' }
  ];

  const getStepStatus = (stepTitle) => {
    const statuses = ['placed', 'packed', 'shipped', 'delivered'];
    const currentStatus = (localStatus || order.status || '').toLowerCase();
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(stepTitle.toLowerCase());

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen text-left">
      {/* Success Hero Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 text-green-600 mb-2 animate-bounce">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="font-sans text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Order <strong className="text-text-secondary font-bold">{order._id}</strong> has been confirmed. You will receive a notification when it is ready for collection.
        </p>
      </div>

      {/* TRACKER PROGRESS BLOCK */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-premium mb-10 space-y-8">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="font-display font-bold text-lg text-text">
            Realtime Order Tracker
          </h2>
          <span className="px-3 py-1 bg-brand-maroon-50 text-brand-maroon-800 font-sans font-bold text-xxs tracking-wider rounded-full border border-brand-maroon-150 uppercase animate-pulse">
            Live Updates Enabled
          </span>
        </div>

        {/* Visual Line Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((stepItem, idx) => {
            const status = getStepStatus(stepItem.title);
            const Icon = stepItem.icon;

            return (
              <div 
                key={idx}
                className={`p-4 border rounded-2xl flex flex-col gap-3 relative transition-all duration-300 ${
                  status === 'active' 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/10' 
                    : status === 'completed'
                      ? 'border-border bg-brand-dark-50/50 opacity-80'
                      : 'border-border opacity-40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className={`p-2 rounded-xl ${
                    status === 'active' 
                      ? 'bg-primary text-white' 
                      : status === 'completed'
                        ? 'bg-green-700 text-white'
                        : 'bg-brand-dark-100 text-text-secondary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {status === 'completed' && (
                    <span className="w-5 h-5 rounded-full bg-green-150 text-green-800 flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="text-left space-y-1">
                  <h4 className="font-display font-bold text-sm text-text">{stepItem.title}</h4>
                  <p className="font-sans text-[11px] text-text-secondary leading-snug">{stepItem.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT: ORDER SPECIFICATIONS (md:col-span-8) */}
        <div className="md:col-span-8 bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-base text-text border-b border-border pb-3">
            Items Purchased
          </h3>

          <div className="divide-y divide-brand-dark-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex gap-4 items-center">
                <div className="w-12 h-15 rounded-lg overflow-hidden border border-border shrink-0 bg-brand-dark-50 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {/* University logo watermark */}
                  <div className="absolute bottom-0.5 left-0.5 z-10 p-0.5 bg-surface rounded-sm shadow-xs border border-border/50 w-7 h-7 flex items-center justify-center pointer-events-none select-none">
                    <img 
                      src="/logo.png" 
                      alt="GU Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-display font-bold text-sm text-text-secondary">{item.name}</h4>
                  <span className="font-sans text-xs text-text-secondary font-semibold mt-0.5 block">
                    Size: {item.size} | Qty: {item.qty}
                  </span>
                  {(localStatus || order.status || '').toLowerCase() === 'delivered' && (
                    <button
                      onClick={() => setSelectedProductForReview(item)}
                      className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline mt-1 block text-left"
                    >
                      Review Product
                    </button>
                  )}
                </div>
                <span className="font-sans font-bold text-sm text-text-secondary">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}.00
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-start pt-6 border-t border-border text-xs font-sans text-text-secondary gap-6">
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-text-secondary">Collection Point</span>
              <p className="text-text-secondary font-semibold leading-relaxed">
                Geeta University Store Counter<br />
                Block A Administrative Office, Panipat
              </p>
            </div>
            <div className="space-y-1 text-right">
              <span className="font-bold uppercase tracking-wider text-text-secondary">Payment Status</span>
              <div className="text-text-secondary font-bold capitalize space-y-1 flex flex-col items-end">
                {(() => {
                  const payStatus = localPaymentStatus || order.paymentStatus || 'pending';
                  if (payStatus === 'paid') {
                    return (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        Paid ({order.paymentMethod === 'stripe' ? 'Stripe' : order.paymentMethod.toUpperCase()})
                      </span>
                    );
                  }
                  if (payStatus === 'failed') {
                    return (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Failed ({order.paymentMethod.toUpperCase()})
                      </span>
                    );
                  }
                  if (payStatus === 'refunded') {
                    return (
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Refunded
                      </span>
                    );
                  }
                  // Fallback pending states
                  if (order.paymentMethod === 'stripe') {
                    return <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Paid (Stripe)</span>;
                  }
                  if (order.paymentMethod === 'upi') {
                    return (
                      <>
                        <span className="text-brand-gold-800 bg-brand-gold-50 px-2 py-0.5 rounded border border-brand-gold-200">
                          UPI (Pending Verification)
                        </span>
                        {order.upiTxnId && (
                          <span className="text-[10px] text-text-secondary lowercase font-mono">
                            Ref: {order.upiTxnId}
                          </span>
                        )}
                      </>
                    );
                  }
                  return (
                    <span className="text-brand-gold-800 bg-brand-gold-50 px-2 py-0.5 rounded border border-brand-gold-200">
                      COD (Pending)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: COST BREAKDOWN SUMMARY (md:col-span-4) */}
        <div className="md:col-span-4 bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <h3 className="font-display font-bold text-base text-text border-b border-border pb-3">
            Payment Breakdown
          </h3>

          <div className="space-y-4 text-xs font-sans font-semibold text-text-secondary flex-grow">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-text-secondary">₹{order.subtotal?.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-text-secondary">
                {order.totalAmount - order.subtotal + (order.discount || 0) === 0 ? 'Free' : `₹${order.totalAmount - order.subtotal + (order.discount || 0)}.00`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Coupon Saved</span>
                <span>- ₹{order.discount?.toLocaleString('en-IN')}.00</span>
              </div>
            )}

            <hr className="border-border my-4" />

            <div className="flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-text-secondary">Paid Amount</span>
              <span className="font-sans font-black text-xl text-primary">
                ₹{order.totalAmount?.toLocaleString('en-IN')}.00
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {showReceiptButton && (
              <button 
                onClick={() => downloadReceipt(order)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#7A1C1C] text-white hover:bg-[#611414] rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
            )}
            <Link to="/dashboard" className="w-full btn-secondary py-3 text-sm font-semibold text-center block">
              View Order History
            </Link>
            <Link to="/products" className="w-full btn-secondary py-3 text-sm font-semibold flex items-center justify-center gap-1.5">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Review Dialog Modal */}
      {selectedProductForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark-950/40 backdrop-blur-md animate-fadeIn text-left">
          <div 
            onClick={() => setSelectedProductForReview(null)} 
            className="absolute inset-0"
          />
          <div className="relative bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-premium w-full max-w-lg z-10 animate-slideUp">
            <button 
              onClick={() => setSelectedProductForReview(null)}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-text mb-2">
              Review Product
            </h3>
            <p className="font-sans text-xs text-text-secondary mb-6">
              Share your thoughts on <strong className="text-text-secondary font-bold">{selectedProductForReview.name}</strong> (Size: {selectedProductForReview.size}).
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Star Selection */}
              <div className="space-y-2">
                <label className="block font-sans font-bold text-xxs uppercase tracking-wider text-text-secondary">
                  Overall Rating
                </label>
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starVal = idx + 1;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setReviewRating(starVal)}
                        className="p-1 hover:scale-115 transition-transform text-brand-gold-500 focus:outline-none"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            starVal <= reviewRating ? 'fill-brand-gold-500' : 'text-text-secondary'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text area */}
              <div className="space-y-2">
                <label className="block font-sans font-bold text-xxs uppercase tracking-wider text-text-secondary">
                  Review Comments
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-border rounded-2xl p-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-maroon-600/20 focus:border-brand-maroon-700 transition-all leading-relaxed"
                  placeholder="What did you like or dislike about the fit, quality, or style?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForReview(null)}
                  className="px-5 py-2.5 bg-bg hover:bg-surface text-text-secondary font-sans font-bold text-xs rounded-xl border border-border transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-brand-maroon-700 hover:bg-primary/90 disabled:bg-primary/60 text-white font-sans font-bold text-xs rounded-xl shadow-premium transition-all"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirm;
