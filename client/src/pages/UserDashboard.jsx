import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { User, ShoppingBag, MapPin, Eye, Plus, Trash, Shield, LogOut, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchUserOrders, updateOrderStatusInList } from '../features/orders/orderSlice';
import { addAddress, logout } from '../features/auth/authSlice';
import { useUserOrdersSocket } from '../hooks/useUserOrdersSocket';
import Loader from '../components/Loader';
import { downloadReceipt } from '../utils/receiptGenerator';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orders, loading: ordersLoading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('orders');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleOrderStatusUpdate = useCallback((payload) => {
    dispatch(updateOrderStatusInList({
      orderId: payload.orderId,
      status: payload.status,
      paymentStatus: payload.paymentStatus,
    }));
    if (payload.status) {
      toast.success(`Your order #${payload.orderId.slice(-6)} is now ${payload.status}!`, {
        icon: '📦',
        duration: 4000,
      });
    }
    if (payload.paymentStatus) {
      toast.success(`Order #${payload.orderId.slice(-6)} payment status is now ${payload.paymentStatus}!`, {
        icon: '💳',
        duration: 4000,
      });
    }
  }, [dispatch]);

  useUserOrdersSocket(
    orders.map((ord) => ord._id),
    handleOrderStatusUpdate
  );

  if (user?.role === 'admin') {
    return <Navigate to="/admin/analytics" replace />;
  }

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!street || !city || !stateName || !pincode) {
      toast.error('All address fields are required.');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be exactly 6 digits.');
      return;
    }
    dispatch(addAddress({
      street, city, state: stateName, pincode,
      isDefault: user?.addresses?.length === 0
    }))
      .unwrap()
      .then(() => {
        toast.success('Address added successfully');
        setStreet(''); setCity(''); setStateName(''); setPincode('');
        setShowAddressForm(false);
      })
      .catch(() => { toast.error('Failed to save address'); });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':   return 'bg-primary/5 text-primary border-primary/10';
      case 'Packed':   return 'bg-warning/10 text-warning border-warning/20';
      case 'Shipped':  return 'bg-accent/5 text-accent border-accent/10';
      case 'Delivered': return 'bg-success/5 text-success border-success/20';
      default:         return 'bg-border/50 text-text-secondary border-border';
    }
  };

  return (
    <div className="min-h-screen bg-bg text-left transition-colors duration-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER BANNER ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-premium mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-2xl shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1.5">
              <h1 className="font-display font-black text-2xl text-text leading-none">
                Welcome, {user?.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full capitalize">
                  {user?.role || 'Student'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/30" />
                <span className="font-sans text-[10px] text-text-secondary font-bold uppercase tracking-wider">Geeta University Member</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            <Link
              to="/products"
              className="flex-1 md:flex-none text-center px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Shop Merchandise
            </Link>
            <button
              onClick={() => {
                dispatch(logout());
                toast.success('Logged out successfully');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-error/5 hover:bg-error/10 border border-error/15 text-error rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── STATS CARDS GRID ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: ShoppingBag,
              title: 'Total Purchases',
              val: `${orders.length} ${orders.length === 1 ? 'Order' : 'Orders'}`,
              color: 'text-primary',
              bg: 'bg-primary/5 border-primary/10'
            },
            {
              icon: MapPin,
              title: 'Saved Locations',
              val: `${user?.addresses?.length || 0} ${user?.addresses?.length === 1 ? 'Address' : 'Addresses'}`,
              color: 'text-accent',
              bg: 'bg-accent/5 border-accent/10'
            },
            {
              icon: Shield,
              title: 'Member Verification',
              val: 'Verified Profile',
              color: 'text-success',
              bg: 'bg-success/5 border-success/20'
            }
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5 shadow-premium flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="font-sans text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                  {stat.title}
                </span>
                <p className="font-display font-extrabold text-lg text-text mt-0.5 truncate">
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB LAYOUT GRID ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Side Navigation */}
          <aside className="lg:col-span-1 bg-surface border border-border rounded-2xl p-3 shadow-premium">
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: 'orders', label: 'Order History', icon: ShoppingBag },
                { id: 'addresses', label: 'Manage Address', icon: MapPin },
                { id: 'profile', label: 'Member Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap lg:w-full ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:bg-primary/5 hover:text-text'
                  }`}
                >
                  <tab.icon className="w-4.5 h-4.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Tab Panel */}
          <main className="lg:col-span-3">

            {/* ── TAB 1: ORDERS ─────────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-premium space-y-6 animate-fadeIn">
                <div className="border-b border-border pb-3">
                  <h2 className="font-display font-bold text-lg text-text">Order Purchases</h2>
                </div>

                {ordersLoading ? (
                  <Loader />
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 text-text-secondary font-sans text-sm">
                    You haven't placed any orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="bg-bg border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 transition-all duration-200"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-extrabold text-sm text-text">
                              Order #{ord._id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`px-2 py-0.5 border text-[9px] font-sans font-bold uppercase rounded-md ${getStatusBadge(ord.status)}`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-text-secondary truncate max-w-md">
                            {ord.items.map(i => `${i.name} (${i.size})`).join(', ')}
                          </p>
                          <p className="font-sans text-[10px] text-text-secondary/60">
                            Placed on: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                          <span className="font-sans font-black text-base text-text">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}.00
                          </span>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/order-confirm/${ord._id}`}
                              className="p-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl transition-all duration-200 border border-primary/10"
                              title="Track Live Order Status"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {ord.status?.toLowerCase() === 'delivered' && ord.paymentStatus?.toLowerCase() === 'paid' && (
                              <button
                                onClick={() => downloadReceipt(ord)}
                                className="p-2.5 bg-success/5 hover:bg-success text-success hover:text-white rounded-xl transition-all duration-200 border border-success/10"
                                title="Download Receipt"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: ADDRESSES ──────────────────────────────────────── */}
            {activeTab === 'addresses' && (
              <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-premium space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="font-display font-bold text-lg text-text">Delivery Locations</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-sans font-bold text-xs rounded-xl shadow-sm hover:bg-primary/95 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="border border-border p-5 rounded-2xl bg-bg space-y-4 animate-fadeIn">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">Add New Shipping Location</h3>

                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Hostel/Room/Address Details</label>
                      <input
                        type="text"
                        className="input-field text-xs py-2.5"
                        placeholder="Room 102, GU Boys Hostel A"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'City', placeholder: 'Panipat', val: city, set: setCity },
                        { label: 'State', placeholder: 'Haryana', val: stateName, set: setStateName },
                        { label: 'Pincode', placeholder: '132145', val: pincode, set: setPincode },
                      ].map(({ label, placeholder, val, set }) => (
                        <div key={label}>
                          <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
                          <input
                            type="text"
                            className="input-field text-xs py-2.5"
                            placeholder={placeholder}
                            value={val}
                            onChange={(e) => set(e.target.value)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="btn-secondary px-4 py-2 text-xs"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary px-5 py-2 text-xs">
                        Save Location
                      </button>
                    </div>
                  </form>
                )}

                {user?.addresses?.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary font-sans text-sm">
                    No shipping locations saved. Add your first hostel/room location above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div
                        key={addr._id}
                        className="p-4 border border-border rounded-2xl bg-bg text-left space-y-2 relative hover:border-primary/20 transition-all"
                      >
                        <span className="font-sans font-bold text-sm text-text">
                          {addr.street.split(', ').pop() || 'Address'}
                        </span>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          {addr.street.split(',').slice(0, -1).join(',')}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block px-2.5 py-0.5 bg-accent/5 border border-accent/10 text-accent font-sans font-bold text-[8.5px] tracking-wider rounded uppercase mt-2">
                            Default Shipping
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: MEMBER PROFILE ─────────────────────────────────── */}
            {activeTab === 'profile' && (
              <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-premium space-y-6 animate-fadeIn">
                <div className="border-b border-border pb-3">
                  <h2 className="font-display font-bold text-lg text-text">Member Profile Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans text-text-secondary">
                  {[
                    { label: 'Full Name', val: user?.name },
                    { label: 'Email Address', val: user?.email },
                    {
                      label: 'Account Status',
                      val: null,
                      custom: (
                        <p className="text-success font-bold text-sm flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-success rounded-full inline-block animate-pulse"></span>
                          Verified GU Member
                        </p>
                      )
                    },
                    { label: 'Membership Portal Access', val: `${user?.role} Portal`, valClass: 'capitalize' },
                  ].map(({ label, val, custom, valClass }) => (
                    <div key={label} className="space-y-1">
                      <span className="font-bold text-text-secondary uppercase tracking-wider text-[10px] block">{label}</span>
                      {custom || <p className={`text-text font-semibold text-base ${valClass || ''}`}>{val}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
