import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import StockIntake from './pages/StockIntake';
import NewSale from './pages/NewSale';
import Invoice from './pages/Invoice';
import SalesHistory from './pages/SalesHistory';
import Analytics from './pages/Analytics';

import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shakthi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authView, setAuthView] = useState('landing');
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedProductForRestock, setSelectedProductForRestock] = useState(null);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shakthi_user', JSON.stringify(userData));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shakthi_user');
    setSelectedProductForRestock(null);
    setSelectedSaleForInvoice(null);
    setAuthView('landing');
    setActivePage('dashboard');
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestockProduct = (product) => {
    setSelectedProductForRestock(product);
    setActivePage('stock-intake');
  };

  const handleSaleCompleted = (saleData) => {
    setSelectedSaleForInvoice(saleData);
    setActivePage('invoice');
  };

  const handleViewInvoice = (sale) => {
    setSelectedSaleForInvoice(sale);
    setActivePage('invoice');
  };

  const handleBackFromInvoice = () => {
    setActivePage('sales-history');
  };

  // If not logged in, display the Landing Page or Login page
  if (!user) {
    if (authView === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <LandingPage
        onGoToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="app-container">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="main-content">
          {activePage === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onRestock={handleRestockProduct}
            />
          )}

          {activePage === 'inventory' && (
            <Inventory
              onRestockProduct={handleRestockProduct}
            />
          )}

          {activePage === 'stock-intake' && (
            <StockIntake
              initialProduct={selectedProductForRestock}
              onIntakeSuccess={() => {
                setSelectedProductForRestock(null);
                handleNavigate('inventory');
              }}
            />
          )}

          {activePage === 'new-sale' && (
            <NewSale
              onSaleCompleted={handleSaleCompleted}
            />
          )}

          {activePage === 'invoice' && (
            <Invoice
              saleId={selectedSaleForInvoice?.id}
              saleData={selectedSaleForInvoice}
              onBack={handleBackFromInvoice}
            />
          )}

          {activePage === 'sales-history' && (
            <SalesHistory
              onViewInvoice={handleViewInvoice}
            />
          )}

          {activePage === 'analytics' && (
            <Analytics
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
