import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Layout & Security
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoutes from './routes/AdminRoutes';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import UserDashboard from './pages/UserDashboard';
import OAuthSuccess from './pages/OAuthSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';
import Settings from './pages/Settings';

// State Actions
import { fetchCurrentUser } from './features/auth/authSlice';

const toastOptions = {
  position: 'bottom-right',
  toastOptions: {
    duration: 3500,
    style: {
      background: 'rgb(var(--surface))',
      color: 'rgb(var(--text))',
      borderRadius: '14px',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      padding: '12px 18px',
      border: '1px solid rgb(var(--border))',
      boxShadow: '0 12px 40px -10px rgba(138, 23, 58, 0.15)',
    },
    success: {
      iconTheme: {
        primary: 'rgb(var(--brand-gold-500))',
        secondary: 'rgb(var(--surface))',
      },
    },
  },
};

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register', '/oauth-success'].includes(location.pathname);
  const showPublicChrome = !isAdminRoute;

  return (
    <div className={`flex flex-col ${isAdminRoute ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-bg text-text font-sans theme-transition`}>
      <Toaster {...toastOptions} />

      {showPublicChrome && !isAuthPage && <Navbar />}

      <main className={isAdminRoute ? 'flex-1 min-h-0 overflow-hidden' : isAuthPage ? 'flex-grow' : 'flex-grow pt-[72px]'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirm/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <AdminRoutes>
                <AdminDashboard />
              </AdminRoutes>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {showPublicChrome && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }

    // Global Theme Initialization
    const theme = localStorage.getItem('merchstore-theme') || 'system';
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dispatch]);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
