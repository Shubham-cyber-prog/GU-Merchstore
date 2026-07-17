import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, Sun, Moon, Monitor, Bell, EyeOff, Share2, Info, LifeBuoy, 
  Shield, AlertTriangle, LogOut, Copy, Check, ChevronDown, 
  Globe, Mail, ShieldAlert, Key, Smartphone, Trash2, 
  HelpCircle, Bug, HeartHandshake, Star, ArrowRight, ShieldCheck, 
  Calendar, Lock, MessageSquare, Sparkles, Database, Send
} from 'lucide-react';
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { logout, updateUserProfile } from '../features/auth/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // --- Theme State & Logic ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('merchstore-theme') || 'system';
  });

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    // Add theme transition class
    root.classList.add('theme-transition');
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = selectedTheme === 'dark' || (selectedTheme === 'system' && systemPrefersDark);

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove theme transition class after animation finishes
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('merchstore-theme', theme);
  }, [theme]);

  // Listen for system theme changes if set to system
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);


  // --- Notifications State & Logic ---
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('merchstore-notifications');
    return saved ? JSON.parse(saved) : {
      orderUpdates: true,
      promotionalOffers: false,
      wishlistAlerts: true,
      backInStock: true,
      newArrivals: false,
      securityAlerts: true
    };
  });

  const toggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('merchstore-notifications', JSON.stringify(updated));
      toast.success('Notification preferences updated!');
      return updated;
    });
  };


  // --- Privacy State & Logic ---
  const [privacy, setPrivacy] = useState(() => {
    const saved = localStorage.getItem('merchstore-privacy');
    return saved ? JSON.parse(saved) : {
      recommendations: true,
      analytics: true,
      marketingEmails: false,
      smsAlerts: false
    };
  });

  const togglePrivacy = (key) => {
    setPrivacy(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('merchstore-privacy', JSON.stringify(updated));
      toast.success('Privacy settings updated!');
      return updated;
    });
  };


  // --- Share Website State & Logic ---
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://gu-merchstore.vercel.app";
  const shareText = "Check out the official Geeta University Merchandise Store for premium varsity hoodies, tees, and academic accessories! 🎓✨";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Copied Successfully!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };


  // --- Modals / Interactive Content State ---
  const [activeModal, setActiveModal] = useState(null); // 'password' | 'sessions' | 'bug' | 'feedback' | 'faq' | 'privacy-policy' | 'terms' | 'licenses' | 'delete-confirm' | 'avatar'
  const [loading, setLoading] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (user?.avatar) {
      setTempAvatar(user.avatar);
    }
  }, [user]);

  const handleAvatarSave = () => {
    setLoading(true);
    dispatch(updateUserProfile({ avatar: tempAvatar }))
      .unwrap()
      .then(() => {
        toast.success('Profile photo updated successfully!');
        setActiveModal(null);
      })
      .catch((err) => {
        toast.error(err || 'Failed to update photo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  // Report Bug Form State
  const [bugForm, setBugForm] = useState({ title: '', desc: '', severity: 'Medium' });
  // Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  // Delete Account Confirmation Input
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Mock Active Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', ip: '192.168.1.45', location: 'Panipat, India (Current)', active: true },
    { id: 2, device: 'Safari on iPhone 15 Pro', ip: '103.241.12.90', location: 'Delhi, India', active: false },
    { id: 3, device: 'Firefox on macOS', ip: '45.112.89.5', location: 'Mumbai, India', active: false }
  ]);

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Session revoked successfully.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error('All password fields are required.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setActiveModal(null);
      toast.success('Password changed successfully!');
    }, 1500);
  };

  const handleBugSubmit = (e) => {
    e.preventDefault();
    if (!bugForm.title || !bugForm.desc) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBugForm({ title: '', desc: '', severity: 'Medium' });
      setActiveModal(null);
      toast.success('Bug report submitted. Thank you for your feedback!', { icon: '🐛' });
    }, 1200);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFeedbackForm({ rating: 5, comment: '' });
      setActiveModal(null);
      toast.success('Feedback submitted. We appreciate your support!', { icon: '✨' });
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveModal(null);
      dispatch(logout());
      toast.success('Account deleted successfully. We are sorry to see you go.');
      navigate('/');
    }, 2000);
  };

  const handleSignOut = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };


  // --- Navigation & Scroll Spy Logic ---
  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: EyeOff },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'share', label: 'Share Website', icon: Share2 },
    { id: 'help', label: 'Help & Support', icon: LifeBuoy },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];

  const [activeSection, setActiveSection] = useState('account');
  const sectionRefs = {
    account: useRef(null),
    appearance: useRef(null),
    notifications: useRef(null),
    privacy: useRef(null),
    security: useRef(null),
    share: useRef(null),
    help: useRef(null),
    about: useRef(null),
    danger: useRef(null)
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const ref = sectionRefs[section.id].current;
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = sectionRefs[id].current;
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };


  // --- FAQ Accordion State ---
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const faqs = [
    { q: "How do I track my order status?", a: "Go to your Dashboard and look at the Order History tab. Click on the Eye icon next to your order to track its real-time shipping status." },
    { q: "What is the return/exchange policy?", a: "We support returns or size exchanges within 7 days of delivery for unused products with university tags intact. Contact support for details." },
    { q: "Are custom department logos available?", a: "Yes, bulk custom order requests with specific department logos can be submitted via the Support Form or directly to campus store admin." },
    { q: "Can I pay using UPI or Cash on Delivery?", a: "Absolutely! We support UPI payments, Credit/Debit Cards via Stripe, and Cash on Delivery at the campus store collection counter." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen text-left relative">
      
      {/* Background Ambient Glow Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-[-5%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-maroon-700/10 dark:bg-brand-maroon-600/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-brand-gold-500/5 blur-[150px]" />
        <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-maroon-700/5 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-brand-dark-900 dark:bg-gradient-to-r dark:from-white dark:via-brand-gold-200 dark:to-brand-gold-450 dark:bg-clip-text dark:text-transparent my-0 flex items-center gap-3">
          Settings
        </h1>
        <p className="font-sans text-sm text-brand-dark-500 dark:text-brand-dark-400 mt-2">
          Manage your account preferences, device theme settings, and security credentials.
        </p>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

        {/* Navigation Sidebar (Desktop sticky, Mobile horizontal scroll) */}
        <aside className="sticky top-[76px] lg:top-28 lg:sticky h-fit z-20 bg-brand-dark-50/95 dark:bg-[#0B0510]/95 backdrop-blur-md pt-2.5 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:pt-0 lg:pb-0 transition-colors duration-300">
          {/* Mobile Categories Selector Bar */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2.5 scrollbar-none scroll-smooth select-none">
            {sections.map((sect) => {
              const Icon = sect.icon;
              const isActive = activeSection === sect.id;
              return (
                <button
                  key={sect.id}
                  onClick={() => scrollToSection(sect.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase whitespace-nowrap border transition-all ${
                    isActive
                      ? 'bg-brand-maroon-700 border-brand-maroon-700 dark:bg-gradient-to-r dark:from-brand-maroon-700 dark:to-brand-maroon-800 text-white shadow-md dark:shadow-[0_4px_12px_rgba(138,23,58,0.3)]'
                      : 'bg-surface border-border text-text-secondary hover:border-brand-maroon-50/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {sect.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Sidebar menu list */}
          <div className="hidden lg:flex flex-col gap-1 p-3 bg-surface/80 backdrop-blur-xl border border-border rounded-3xl shadow-premium">
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 border-b border-brand-dark-50 dark:border-white/5 mb-2">
              Preferences
            </p>
            {sections.map((sect) => {
              const Icon = sect.icon;
              const isActive = activeSection === sect.id;
              return (
                <button
                  key={sect.id}
                  onClick={() => scrollToSection(sect.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-brand-maroon-700 text-white shadow-[0_4px_12px_rgba(138,23,58,0.2)] dark:shadow-[0_4px_20px_rgba(138,23,58,0.4)] dark:bg-gradient-to-r dark:from-brand-maroon-700 dark:to-brand-maroon-800'
                      : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-gold-400' : 'text-text-secondary/60'}`} />
                  <span>{sect.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Settings Panels Stack */}
        <main className="lg:col-span-3 space-y-8 pb-20">

          {/* CARD 1: ACCOUNT */}
          <section ref={sectionRefs.account} id="account" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Account Details
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Your university membership and personal details.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-bg border border-brand-dark-200/50 dark:border-white/5 rounded-2xl">
              <div onClick={() => setActiveModal('avatar')} className="relative group cursor-pointer">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-brand-maroon-600 dark:border-brand-maroon-500" alt="Avatar" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-maroon-600 via-brand-maroon-700 to-brand-maroon-900 text-white flex items-center justify-center font-display font-black text-3xl shadow-lg border-2 border-brand-gold-400">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white font-bold text-center px-2 leading-none uppercase">Edit Pic</span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="font-display font-extrabold text-lg text-text my-0">
                    {user?.name || 'Guest User'}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-brand-gold-100 dark:bg-brand-gold-950/30 border border-brand-gold-250 dark:border-brand-gold-900/40 text-brand-gold-800 dark:text-brand-gold-400 font-sans font-extrabold text-[9px] tracking-wider uppercase rounded-md">
                    Verified Member
                  </span>
                </div>
                <p className="font-sans text-xs text-brand-dark-550 dark:text-brand-dark-400 leading-none truncate">
                  {user?.email || 'not-authenticated@geetauniversity.edu.in'}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xxs text-text-secondary/60 font-semibold font-sans mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-dark-400" />
                    Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'July 2026'}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Role: {user?.role || 'Student'} Portal
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CARD 2: APPEARANCE */}
          <section ref={sectionRefs.appearance} id="appearance" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Appearance
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Customize the visual theme of the Merchandise Store.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Sleek white background with high contrast tags.' },
                { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Premium deep violet hues, ideal for low light.' },
                { id: 'system', label: 'System Default', icon: Monitor, desc: 'Automatically syncs with device OS theme.' }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-brand-maroon-50/40 dark:bg-brand-maroon-950/30 border-brand-gold-500/80 dark:border-brand-gold-500/80 shadow-md ring-2 ring-brand-gold-500/20 dark:shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                        : 'bg-surface border-border hover:border-brand-maroon-500/30 dark:hover:border-brand-maroon-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-primary text-white dark:text-brand-dark-950' 
                          : 'bg-bg text-brand-dark-600 dark:text-brand-dark-350'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-brand-maroon-700 bg-brand-maroon-700 dark:border-brand-gold-500 dark:bg-brand-gold-500' : 'border-brand-dark-350 dark:border-white/10'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 dark:bg-brand-dark-900 animate-scaleIn" />}
                      </div>
                    </div>
                    <span className="font-display font-bold text-sm text-text leading-none">
                      {opt.label}
                    </span>
                    <p className="font-sans text-xxs text-brand-dark-500 dark:text-brand-dark-400 mt-2 leading-relaxed">
                      {opt.desc}
                    </p>

                    {/* Live Preview Miniature Card Inside Button */}
                    <div className="w-full mt-4 h-12 rounded-lg bg-brand-dark-100/50 dark:bg-black/30 border border-brand-dark-200/40 dark:border-white/5 flex items-center justify-between px-3 overflow-hidden select-none opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-brand-maroon-700" />
                        <div className="space-y-1">
                          <div className="w-8 h-1 bg-text-secondary/40 rounded" />
                          <div className="w-12 h-1 bg-border rounded" />
                        </div>
                      </div>
                      <div className="w-4 h-2 bg-brand-gold-400 rounded-full" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CARD 3: NOTIFICATIONS */}
          <section ref={sectionRefs.notifications} id="notifications" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Notification Preferences
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Choose how and when we contact you regarding store updates.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Real-time notifications for placement, packing, and dispatch tracking status.' },
                { key: 'promotionalOffers', label: 'Promotional Offers', desc: 'Discounts, seasonal coupon codes, and festival sale announcements.' },
                { key: 'wishlistAlerts', label: 'Wishlist Alerts', desc: 'Notifications if your favorited item has price cuts or discounts.' },
                { key: 'backInStock', label: 'Product Back in Stock', desc: 'Alerts when out-of-stock sizes or products return to the catalog.' },
                { key: 'newArrivals', label: 'New Arrivals', desc: 'Weekly updates on newly designed hoodies, stationery, and varsity gear.' },
                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Critical notifications about changes in password, sessions, or address details.' }
              ].map((sw) => {
                const isActive = notifications[sw.key];
                return (
                  <div key={sw.key} className="flex items-center justify-between gap-4 p-4 border border-border rounded-2xl hover:bg-surface transition-all">
                    <div className="text-left space-y-1">
                      <span className="font-sans font-bold text-sm text-text">{sw.label}</span>
                      <p className="font-sans text-xxs text-brand-dark-450 dark:text-brand-dark-400 leading-relaxed">{sw.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(sw.key)}
                      className={`relative w-12 h-6.5 rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                        isActive ? 'bg-primary' : 'bg-border/60'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`w-4.5 h-4.5 rounded-full shadow-sm bg-surface border border-border ${
                          isActive ? 'ml-5.5 bg-surface' : 'ml-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CARD 4: PRIVACY */}
          <section ref={sectionRefs.privacy} id="privacy" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Privacy Settings
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Manage personal data tracking and communication methods.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'recommendations', label: 'Personalized Recommendations', desc: 'Allows catalog recommendations matching search history.' },
                { key: 'analytics', label: 'Analytics Collection', desc: 'Allows anonymous usage statistics tracking to improve UX.' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Allows us to send marketing announcements.' },
                { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Allows SMS alert dispatch for orders and reminders.' }
              ].map((opt) => {
                const isActive = privacy[opt.key];
                return (
                  <button
                    key={opt.key}
                    onClick={() => togglePrivacy(opt.key)}
                    className={`flex items-start gap-3.5 p-4 border rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-brand-maroon-50/20 dark:bg-brand-maroon-950/20 border-brand-maroon-300 dark:border-brand-gold-500/50 dark:shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                        : 'bg-surface border-border hover:border-brand-maroon-500/20 dark:hover:border-brand-maroon-500/20'
                    }`}
                  >
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                      isActive 
                        ? 'border-brand-maroon-700 bg-brand-maroon-700 dark:border-brand-gold-500 dark:bg-brand-gold-500 dark:text-brand-dark-950' 
                        : 'border-brand-dark-350 dark:border-white/15'
                    }`}>
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <div className="space-y-1">
                      <span className="font-sans font-bold text-xs.5 text-text">{opt.label}</span>
                      <p className="font-sans text-xxs text-brand-dark-500 dark:text-brand-dark-400 leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CARD 5: SECURITY */}
          <section ref={sectionRefs.security} id="security" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Security Options
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Manage passwords, revoke remote login sessions, or delete account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveModal('password')}
                className="flex flex-col items-center justify-center p-5 bg-[#FAF6DC]/20 dark:bg-brand-gold-950/10 border border-brand-gold-200/50 dark:border-brand-gold-900/20 hover:border-brand-gold-400/80 dark:hover:border-brand-gold-500/50 dark:hover:shadow-[0_0_20px_rgba(212,175,55,0.12)] rounded-2xl text-center gap-3 transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3 bg-brand-gold-100 dark:bg-brand-gold-950/30 text-brand-gold-800 dark:text-brand-gold-450 rounded-xl group-hover:scale-105 transition-transform dark:group-hover:bg-brand-gold-500 dark:group-hover:text-brand-dark-950">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Change Password</span>
                  <span className="font-sans text-xxs text-brand-dark-500 dark:text-brand-dark-400 mt-1 block">Update credentials</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('sessions')}
                className="flex flex-col items-center justify-center p-5 bg-bg border border-border hover:border-brand-dark-350 dark:hover:border-white/20 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-2xl text-center gap-3 transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3 bg-bg text-text-secondary rounded-xl group-hover:scale-105 transition-transform group-hover:bg-primary/5 group-hover:text-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Active Sessions</span>
                  <span className="font-sans text-xxs text-brand-dark-500 dark:text-brand-dark-400 mt-1 block">View active logins</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('delete-confirm')}
                className="flex flex-col items-center justify-center p-5 bg-red-50/20 dark:bg-red-950/5 border border-red-200/40 dark:border-red-900/10 hover:border-red-400/50 dark:hover:border-red-500/30 dark:hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] rounded-2xl text-center gap-3 transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-450 rounded-xl group-hover:scale-105 transition-transform dark:group-hover:bg-red-500 dark:group-hover:text-white">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Delete Account</span>
                  <span className="font-sans text-xxs text-brand-dark-500 dark:text-brand-dark-400 mt-1 block">Close account permanently</span>
                </div>
              </button>
            </div>
          </section>

          {/* CARD 6: SHARE THIS WEBSITE */}
          <section ref={sectionRefs.share} id="share" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Share this Website
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Spread the word about the official Geeta University store!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { 
                  name: 'WhatsApp', 
                  icon: FaWhatsapp, 
                  color: 'bg-emerald-500 hover:bg-emerald-600 dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                  url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` 
                },
                { 
                  name: 'Facebook', 
                  icon: FaFacebook, 
                  color: 'bg-blue-600 hover:bg-blue-700 dark:hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]',
                  url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
                },
                { 
                  name: 'X (Twitter)', 
                  icon: FaTwitter, 
                  color: 'bg-black hover:bg-zinc-900 dark:border dark:border-white/10 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]',
                  url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
                },
                { 
                  name: 'LinkedIn', 
                  icon: FaLinkedin, 
                  color: 'bg-indigo-600 hover:bg-indigo-700 dark:hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]',
                  url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
                },
                { 
                  name: 'Telegram', 
                  icon: FaTelegram, 
                  color: 'bg-cyan-500 hover:bg-cyan-600 dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
                  url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
                }
              ].map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center p-3 text-white rounded-xl text-center gap-1.5 transition-all text-xxs font-bold select-none cursor-pointer ${platform.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{platform.name}</span>
                  </a>
                );
              })}

              <button
                onClick={handleCopyLink}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center gap-1.5 transition-all text-xxs font-bold cursor-pointer ${
                  copied
                    ? 'bg-emerald-50 border-emerald-350 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400'
                    : 'bg-surface border-border text-brand-dark-700 dark:text-brand-dark-350 hover:bg-brand-maroon-50/50 dark:hover:bg-white/10 hover:text-primary'
                }`}
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-scaleIn" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            
            {copied && (
              <p className="text-emerald-700 dark:text-emerald-400 font-sans font-bold text-xxs text-center mt-3 animate-fadeIn">
                ✓ Copied Successfully! Link is now in your clipboard.
              </p>
            )}
          </section>

          {/* CARD 7: HELP & SUPPORT */}
          <section ref={sectionRefs.help} id="help" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  Help & Support
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Need assistance? Our campus store support team is here to help.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <a 
                href="mailto:support@geetauniversity.edu.in"
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-bg border border-border hover:border-brand-maroon-500/30 rounded-2xl text-center gap-2 sm:gap-3 transition-colors duration-300 group cursor-pointer dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              >
                <div className="p-3 bg-bg text-text-secondary rounded-xl group-hover:scale-105 transition-transform group-hover:text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Contact Support</span>
                  <span className="font-sans text-xxs text-brand-dark-550 dark:text-brand-dark-400 mt-1 block">Email store desk</span>
                </div>
              </a>

              <button 
                onClick={() => setActiveModal('faq')}
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-bg border border-border hover:border-brand-maroon-500/30 rounded-2xl text-center gap-2 sm:gap-3 transition-colors duration-300 group cursor-pointer dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              >
                <div className="p-3 bg-bg text-text-secondary rounded-xl group-hover:scale-105 transition-transform group-hover:text-primary">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">FAQs</span>
                  <span className="font-sans text-xxs text-brand-dark-550 dark:text-brand-dark-400 mt-1 block truncate max-w-full">Frequently Asked Questions</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('bug')}
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-bg border border-border hover:border-brand-maroon-500/30 rounded-2xl text-center gap-2 sm:gap-3 transition-colors duration-300 group cursor-pointer dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              >
                <div className="p-3 bg-bg text-text-secondary rounded-xl group-hover:scale-105 transition-transform group-hover:text-primary">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Report Bug</span>
                  <span className="font-sans text-xxs text-brand-dark-550 dark:text-brand-dark-400 mt-1 block truncate max-w-full">Submit UI/checkout bugs</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('feedback')}
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-bg border border-border hover:border-brand-maroon-500/30 rounded-2xl text-center gap-2 sm:gap-3 transition-colors duration-300 group cursor-pointer dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              >
                <div className="p-3 bg-bg text-text-secondary rounded-xl group-hover:scale-105 transition-transform group-hover:text-primary">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xs.5 text-text block">Feedback</span>
                  <span className="font-sans text-xxs text-brand-dark-550 dark:text-brand-dark-400 mt-1 block truncate max-w-full">Suggest improvements</span>
                </div>
              </button>
            </div>
          </section>

          {/* CARD 8: ABOUT US */}
          <section ref={sectionRefs.about} id="about" className="card-premium p-4 sm:p-8 bg-surface border border-border shadow-premium hover:shadow-premium-hover hover:border-primary/10 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-brand-maroon-50 dark:bg-brand-maroon-900/30 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-2xl border border-brand-maroon-100/50 dark:border-brand-maroon-900/20">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-text my-0">
                  About Us
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  MerchStore specifications and legal licensing details.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-5 bg-bg border border-brand-dark-200/50 dark:border-white/5 rounded-2xl mb-6">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border p-2 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/logo.png" alt="Geeta University Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="font-display font-extrabold text-base text-text my-0">
                    Geeta University Merchandise Store
                  </h3>
                  <span className="px-2 py-0.5 bg-brand-maroon-50 dark:bg-brand-maroon-950/30 border border-brand-maroon-150 dark:border-brand-maroon-900/40 text-brand-maroon-700 dark:text-brand-maroon-400 font-sans font-extrabold text-[8px] uppercase tracking-wider rounded">
                    v1.0.0 Stable
                  </span>
                </div>
                <p className="font-sans text-xxs text-brand-dark-550 dark:text-brand-dark-400 leading-relaxed">
                  The official ecommerce destination for Geeta University students, alumni, and faculty to purchase high-quality university apparel, varsity hoodies, stationery, and academic accessories. Designed for high performance and smooth payment syncing.
                </p>
                <div className="text-xxs text-text-secondary/60 font-semibold font-sans pt-1">
                  Developer: <span className="text-brand-dark-800 dark:text-brand-dark-300">GU Creative Tech & Engineering Team</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-white font-sans text-xxs font-bold rounded-xl shadow-sm transition-colors cursor-pointer dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
              >
                <FaGithub className="w-3.5 h-3.5" /> Github Repository
              </a>
              <a 
                href="https://geetauniversity.edu.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-maroon-700 hover:bg-brand-maroon-600 text-white font-sans text-xxs font-bold rounded-xl shadow-sm transition-colors cursor-pointer dark:hover:shadow-[0_0_15px_rgba(138,23,58,0.25)]"
              >
                <Globe className="w-3.5 h-3.5" /> University Portal
              </a>
              <button 
                onClick={() => setActiveModal('privacy-policy')}
                className="btn-secondary py-2 px-3.5 text-xxs font-bold rounded-xl cursor-pointer dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActiveModal('terms')}
                className="btn-secondary py-2 px-3.5 text-xxs font-bold rounded-xl cursor-pointer dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => setActiveModal('licenses')}
                className="btn-secondary py-2 px-3.5 text-xxs font-bold rounded-xl cursor-pointer dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]"
              >
                Open Source Licenses
              </button>
            </div>
          </section>

          {/* CARD 9: DANGER ZONE */}
          <section ref={sectionRefs.danger} id="danger" className="card-premium p-4 sm:p-8 bg-red-50/5 dark:bg-[#1e0a0a]/30 backdrop-blur-xl border border-red-250 dark:border-red-900/20 dark:shadow-[inset_0_1px_1px_rgba(255,0,0,0.02)] shadow-premium hover:shadow-xl dark:hover:shadow-[0_20px_50px_-12px_rgba(220,38,38,0.12)] hover:border-red-400/50 dark:hover:border-red-500/20 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-2xl border border-red-200/40 dark:border-red-900/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-red-700 dark:text-red-400 my-0">
                  Danger Zone
                </h2>
                <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400 mt-1">
                  Actions here are irreversible. Please exercise caution.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-surface border border-border rounded-2xl gap-3">
                <div className="text-left space-y-1">
                  <span className="font-sans font-bold text-sm text-text">Sign Out from Session</span>
                  <p className="font-sans text-xxs text-brand-dark-450 dark:text-brand-dark-400">Safely log out of your current device session.</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 bg-brand-maroon-50 border border-brand-maroon-100 hover:bg-brand-maroon-700 hover:text-white text-brand-maroon-700 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer dark:bg-brand-maroon-950/20 dark:border-brand-maroon-800/50 dark:text-brand-maroon-400 dark:hover:bg-brand-maroon-700 dark:hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-surface border border-border rounded-2xl gap-3">
                <div className="text-left space-y-1">
                  <span className="font-sans font-bold text-sm text-red-755 dark:text-red-400">Permanently Delete Account</span>
                  <p className="font-sans text-xxs text-brand-dark-450 dark:text-brand-dark-400">Completely purge your user credentials, orders, and addresses.</p>
                </div>
                <button
                  onClick={() => setActiveModal('delete-confirm')}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-red-650/10 dark:hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* --- POPUP MODALS (ANIMATED VIA ANIMATEPRESENCE) --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setActiveModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-surface dark:bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-7 w-full max-w-lg z-10 text-left relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
            >
              
              {/* Modal close button */}
              <button 
                onClick={() => !loading && setActiveModal(null)}
                className="absolute right-5 top-5 p-1 text-text-secondary/60 hover:bg-bg rounded-lg transition-colors cursor-pointer"
                disabled={loading}
              >
                ✕
              </button>

              {/* Avatar Update Modal */}
              {activeModal === 'avatar' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-brand-maroon-100 dark:bg-brand-maroon-950/20 text-brand-maroon-800 dark:text-brand-maroon-400 rounded-xl">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Update Profile Photo</h3>
                  </div>

                  <p className="font-sans text-xs text-brand-dark-450 dark:text-brand-dark-400">
                    Choose one of our premium university presets or paste your own custom profile image URL below.
                  </p>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase tracking-wider">Presets</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Classic Crest', url: '/logo.png' },
                        { name: 'Scholar Male', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' },
                        { name: 'Scholar Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
                        { name: 'Creative Designer', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTempAvatar(preset.url)}
                          className={`relative p-1 rounded-2xl border border-border overflow-hidden transition-all duration-300 ${
                            tempAvatar === preset.url
                              ? 'border-brand-maroon-600 dark:border-brand-maroon-500 scale-95 shadow-md bg-brand-maroon-50/10'
                              : 'border-transparent hover:border-brand-dark-300 dark:hover:border-white/10'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full aspect-square object-cover rounded-xl" />
                          {tempAvatar === preset.url && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-maroon-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase tracking-wider">Custom Image URL</label>
                    <input
                      type="text"
                      className="input-field w-full py-2.5 text-xs bg-surface border border-border text-text"
                      placeholder="https://example.com/my-photo.jpg"
                      value={tempAvatar}
                      onChange={(e) => setTempAvatar(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-3 border border-border text-text-secondary rounded-xl font-bold text-xs hover:bg-bg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAvatarSave}
                      className="flex-1 py-3 bg-brand-maroon-700 hover:bg-brand-maroon-600 text-white rounded-xl font-bold text-xs transition-colors shadow-md hover:shadow-lg"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Change Modal */}
              {activeModal === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-brand-gold-100 dark:bg-brand-gold-950/20 text-brand-gold-800 dark:text-brand-gold-400 rounded-xl">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Change Password</h3>
                  </div>

                  <p className="font-sans text-xs text-brand-dark-500 dark:text-brand-dark-400">
                    Your new credentials will apply immediately. You may need to log back in on other devices.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Current Password</label>
                      <input 
                        type="password"
                        required
                        className="input-field text-xs py-2.5"
                        placeholder="••••••••"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">New Password</label>
                      <input 
                        type="password"
                        required
                        className="input-field text-xs py-2.5"
                        placeholder="Minimum 6 characters"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Confirm New Password</label>
                      <input 
                        type="password"
                        required
                        className="input-field text-xs py-2.5"
                        placeholder="••••••••"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-4 text-xs rounded-xl"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary py-2 px-5 text-xs rounded-xl"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Active Sessions Modal */}
              {activeModal === 'sessions' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-bg text-text-secondary rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Active Login Sessions</h3>
                  </div>

                  <p className="font-sans text-xs text-brand-dark-500 dark:text-brand-dark-400">
                    These devices have authenticated access to your student shop credentials. Revoke any unrecognized sessions.
                  </p>

                  <div className="space-y-3 pt-2">
                    {sessions.map((sess) => (
                      <div key={sess.id} className="flex justify-between items-center p-3 border border-border rounded-xl bg-bg/60">
                        <div className="text-left space-y-0.5">
                          <span className="font-sans font-bold text-xs.5 text-text flex items-center gap-1.5">
                            {sess.device}
                            {sess.active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            )}
                          </span>
                          <span className="text-[10px] font-sans text-brand-dark-450 dark:text-brand-dark-550 block">
                            IP: {sess.ip} • Location: {sess.location}
                          </span>
                        </div>
                        {!sess.active && (
                          <button
                            onClick={() => handleRevokeSession(sess.id)}
                            className="px-2.5 py-1 text-xxs font-bold text-red-700 bg-red-50 hover:bg-red-700 hover:text-white rounded-lg border border-red-100 transition-colors cursor-pointer dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-5 text-xs rounded-xl"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

              {/* Bug Reporting Modal */}
              {activeModal === 'bug' && (
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-brand-maroon-50 dark:bg-brand-maroon-900/20 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-xl">
                      <Bug className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Report a System Bug</h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Issue Title</label>
                      <input 
                        type="text"
                        required
                        className="input-field text-xs py-2.5"
                        placeholder="e.g. Cannot complete Stripe checkout callback on Android"
                        value={bugForm.title}
                        onChange={(e) => setBugForm(prev => ({ ...prev, title: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Severity Rating</label>
                      <select
                        className="input-field text-xs py-2.5"
                        value={bugForm.severity}
                        onChange={(e) => setBugForm(prev => ({ ...prev, severity: e.target.value }))}
                        disabled={loading}
                      >
                        <option value="Low">Low - Minor layout alignment issue</option>
                        <option value="Medium">Medium - Feature doesn't work as expected</option>
                        <option value="High">High - Checkout fails or app crashes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Detailed Description</label>
                      <textarea
                        required
                        rows={4}
                        className="input-field text-xs py-2.5"
                        placeholder="Provide steps to reproduce the issue..."
                        value={bugForm.desc}
                        onChange={(e) => setBugForm(prev => ({ ...prev, desc: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-4 text-xs rounded-xl"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary py-2 px-5 text-xs rounded-xl"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Bug Report'}
                    </button>
                  </div>
                </form>
              )}

              {/* Feedback Modal */}
              {activeModal === 'feedback' && (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-brand-maroon-50 dark:bg-brand-maroon-900/20 text-brand-maroon-700 dark:text-brand-maroon-400 rounded-xl">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Share App Feedback</h3>
                  </div>

                  <p className="font-sans text-xs text-brand-dark-500 dark:text-brand-dark-400">
                    We are constantly iterating the store experience. Tell us what we can do better!
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                          className="text-brand-gold-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-8 h-8 ${feedbackForm.rating >= star ? 'fill-brand-gold-500' : 'stroke-[1.5px]'}`} />
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xxs font-bold text-brand-dark-600 dark:text-brand-dark-450 uppercase mb-1">Your Comment</label>
                      <textarea
                        required
                        rows={4}
                        className="input-field text-xs py-2.5"
                        placeholder="Tell us what you liked or how we can improve catalog searches, filters, checkout speed..."
                        value={feedbackForm.comment}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-4 text-xs rounded-xl"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary py-2 px-5 text-xs rounded-xl"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              )}

              {/* FAQs Modal */}
              {activeModal === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-bg text-text-secondary rounded-xl">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Help Center FAQs</h3>
                  </div>

                  <div className="space-y-2.5 pt-2 max-h-[50vh] overflow-y-auto pr-1">
                    {faqs.map((faq, idx) => {
                      const isOpen = faqOpenIndex === idx;
                      return (
                        <div key={idx} className="border border-border rounded-2xl overflow-hidden">
                          <button
                            onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                            className="w-full flex justify-between items-center p-4 bg-bg/60 font-sans font-bold text-xs.5 text-text text-left transition-colors cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-brand-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="p-4 bg-surface border-t border-border font-sans text-xxs.5 text-brand-dark-600 dark:text-brand-dark-450 leading-relaxed text-left animate-fadeIn">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-5 text-xs rounded-xl"
                    >
                      Close Center
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Policy Modal */}
              {activeModal === 'privacy-policy' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-bg text-text-secondary rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Privacy Policy</h3>
                  </div>

                  <div className="space-y-3 pt-2 max-h-[45vh] overflow-y-auto text-xxs.5 text-text-secondary font-sans leading-relaxed pr-1">
                    <p className="font-bold text-brand-dark-800 dark:text-white">Last Updated: July 16, 2026</p>
                    <p>
                      This Privacy Policy describes how Geeta University Merchandise Store ("we", "us", or "our") collects, uses, and shares your personal information when you visit, use, or make purchases from our store catalog.
                    </p>
                    <h4 className="font-bold text-brand-dark-800 dark:text-white mt-3">1. Information We Collect</h4>
                    <p>
                      When you register or check out, we collect personal information you provide, such as your full name, student email, shipping address, and payment preferences. Payment details (credit card) are processed directly via Stripe API and are never stored locally.
                    </p>
                    <h4 className="font-bold text-brand-dark-800 dark:text-white mt-3">2. How We Use Your Data</h4>
                    <p>
                      We utilize collected information to fulfill catalog orders, process secure Stripe payment intents, verify university student status, and send real-time order update notifications.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-5 text-xs rounded-xl"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )}

              {/* Terms of Conditions Modal */}
              {activeModal === 'terms' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-bg text-text-secondary rounded-xl">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Terms & Conditions</h3>
                  </div>

                  <div className="space-y-3 pt-2 max-h-[45vh] overflow-y-auto text-xxs.5 text-text-secondary font-sans leading-relaxed pr-1">
                    <p className="font-bold text-brand-dark-800 dark:text-white">Last Updated: July 16, 2026</p>
                    <p>
                      Welcome to Geeta University Merchandise Store. By accessing or using our application, checkout portals, and student dashboard services, you agree to comply with these terms.
                    </p>
                    <h4 className="font-bold text-brand-dark-800 dark:text-white mt-3">1. Account Security</h4>
                    <p>
                      Users are responsible for keeping dashboard passwords safe. You are fully responsible for all orders, addresses saved, and sessions conducted under your student login credential.
                    </p>
                    <h4 className="font-bold text-brand-dark-800 dark:text-white mt-3">2. Purchases & Campus Pickup</h4>
                    <p>
                      All varsity hoodies, t-shirts, crewneck sweatshirts, and stationery are university property until purchase validation is confirmed. Store order receipts must be presented during campus pickup counters.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-5 text-xs rounded-xl"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )}

              {/* Open Source Licenses Modal */}
              {activeModal === 'licenses' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-dark-50 dark:border-white/5 pb-3">
                    <div className="p-2 bg-bg text-text-secondary rounded-xl">
                      <Info className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-text my-0">Third-Party Open Source Licenses</h3>
                  </div>

                  <div className="space-y-3.5 pt-2 max-h-[45vh] overflow-y-auto text-xxs text-text-secondary font-mono leading-relaxed pr-1">
                    <div className="border-b border-border pb-2">
                      <p className="font-bold font-sans text-brand-dark-800 dark:text-white">React & React DOM</p>
                      <p className="mt-1">MIT License • Copyright (c) Meta Platforms, Inc. and affiliates.</p>
                    </div>
                    <div className="border-b border-border pb-2">
                      <p className="font-bold font-sans text-brand-dark-800 dark:text-white">Tailwind CSS</p>
                      <p className="mt-1">MIT License • Copyright (c) Tailwind Labs, Inc.</p>
                    </div>
                    <div className="border-b border-border pb-2">
                      <p className="font-bold font-sans text-brand-dark-800 dark:text-white">Framer Motion</p>
                      <p className="mt-1">MIT License • Copyright (c) Matt Perry.</p>
                    </div>
                    <div className="border-b border-border pb-2">
                      <p className="font-bold font-sans text-brand-dark-800 dark:text-white">Lucide React Icons</p>
                      <p className="mt-1">ISC License • Copyright (c) Lucide Contributors.</p>
                    </div>
                    <div>
                      <p className="font-bold font-sans text-brand-dark-800 dark:text-white">Redux Toolkit</p>
                      <p className="mt-1">MIT License • Copyright (c) Mark Erikson.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary py-2 px-5 text-xs rounded-xl"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

              {/* Account Deletion Confirmation Modal */}
              {activeModal === 'delete-confirm' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#9c2637]/20 pb-3">
                    <div className="p-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-red-700 dark:text-red-400 my-0">Delete Account Permanently?</h3>
                  </div>

                  <div className="p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-200/40 dark:border-red-900/20 rounded-2xl space-y-2">
                    <p className="font-sans font-bold text-xs text-red-850 dark:text-red-400 leading-snug">
                      Warning: This action is permanent and cannot be undone.
                    </p>
                    <p className="font-sans text-xxs text-text-secondary leading-relaxed">
                      You will immediately lose access to all order receipt histories, billing addresses, and member credentials. Active orders in shipment will proceed, but tracking references will be purged.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 text-left">
                    <label className="block text-xxs font-bold text-brand-dark-700 dark:text-brand-dark-400 uppercase tracking-wider">
                      Type <span className="text-red-700 font-bold select-all font-mono">DELETE</span> below to confirm:
                    </label>
                    <input 
                      type="text"
                      className="input-field text-xs py-2.5 border border-red-200/60 dark:border-red-900/30 focus:ring-red-500/10 focus:border-red-400"
                      placeholder="Type DELETE"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-brand-dark-50 dark:border-white/5">
                    <button 
                      type="button" 
                      onClick={() => {
                        setDeleteConfirmText('');
                        setActiveModal(null);
                      }}
                      className="btn-secondary py-2 px-4 text-xs rounded-xl"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleDeleteAccount}
                      className="btn-primary py-2 px-5 text-xs rounded-xl bg-red-650 hover:bg-red-700 active:bg-red-800 shadow-[0_4px_12px_rgba(239,68,68,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={loading || deleteConfirmText !== 'DELETE'}
                    >
                      {loading ? 'Deleting...' : 'Delete My Account'}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
