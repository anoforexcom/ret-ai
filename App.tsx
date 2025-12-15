import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Restore from './pages/Restore';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import CookiePolicy from './pages/CookiePolicy';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import StoreSettings from './pages/admin/StoreSettings';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes - Rendered without Header/Footer of main site ideally, but for simplicity we hide them via layout or CSS in AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<StoreSettings />} />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restore" element={<Restore />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;