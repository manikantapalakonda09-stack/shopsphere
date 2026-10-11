import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { categoryApi } from './services/api';

// Components
import DemoRoleSwitcher from './components/DemoRoleSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import DeliveryDashboardPage from './pages/DeliveryDashboardPage';
import SupportDashboardPage from './pages/SupportDashboardPage';

const App = () => {
  const { isAuthenticated, user, hasRole } = useAuth();

  // Navigation state
  const [currentTab, setCurrentTab] = useState('home');
  const [catalogFilters, setCatalogFilters] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [customerInitialTab, setCustomerInitialTab] = useState('orders');

  // Categories cache for Navbar
  const [categories, setCategories] = useState([]);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleNavigate = (tab, params = {}) => {
    setCurrentTab(tab);
    if (tab === 'catalog') {
      setCatalogFilters(params);
    }
    if (tab === 'customer-dashboard' && params.tab) {
      setCustomerInitialTab(params.tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (initialTab = 'login') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const handleAuthEvent = (e) => {
      handleOpenAuth(e.detail || 'login');
    };
    window.addEventListener('shopsphere:open-auth', handleAuthEvent);
    return () => window.removeEventListener('shopsphere:open-auth', handleAuthEvent);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white font-sans antialiased">
      
      {/* 1-Click Role Switcher Bar */}
      <DemoRoleSwitcher onOpenAuth={() => handleOpenAuth('login')} onNavigate={handleNavigate} />

      {/* Primary Sticky Header */}
      <Navbar
        onOpenAuth={() => handleOpenAuth('login')}
        onNavigate={handleNavigate}
        currentTab={currentTab}
        categories={categories}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogPage
            initialFilters={catalogFilters}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'product-detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => handleNavigate('catalog')}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage />
        )}

        {currentTab === 'seller-dashboard' && (
          <SellerDashboardPage />
        )}

        {currentTab === 'customer-dashboard' && (
          <CustomerDashboardPage
            initialTab={customerInitialTab}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'delivery-dashboard' && (
          <DeliveryDashboardPage />
        )}

        {currentTab === 'support-dashboard' && (
          <SupportDashboardPage />
        )}
      </main>

      {/* Marketplace Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

    </div>
  );
};

export default App;
