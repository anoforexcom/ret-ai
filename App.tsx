
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
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
import Testimonials from './pages/Testimonials';
import Pricing from './pages/Pricing';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import StoreSettings from './pages/admin/StoreSettings';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Financials from './pages/admin/Financials';
import Security from './pages/admin/Security';

/**
 * Componente que injeta estilos globais baseados na configuração da loja.
 * Substitui as cores e formas padrão do Tailwind por variáveis dinâmicas.
 */
const StyleInjector: React.FC = () => {
  const { config } = useConfig();

  useEffect(() => {
    const theme = config.theme;
    
    // Injetamos as variáveis no root para que o CSS as possa ler
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', theme.primaryColor);
    root.style.setProperty('--brand-secondary', theme.secondaryColor);
    root.style.setProperty('--brand-radius', theme.borderRadius);
    root.style.setProperty('--brand-font', theme.fontFamily);

    // Criamos ou atualizamos o bloco de style dinâmico para sobrepor classes do Tailwind
    let styleTag = document.getElementById('dynamic-theme-overrides');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-theme-overrides';
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      :root {
        font-family: var(--brand-font), 'Inter', sans-serif !important;
      }

      /* Botões e elementos com fundo indigo/primário */
      .bg-indigo-600, .bg-indigo-500 { background-color: var(--brand-primary) !important; }
      .hover\\:bg-indigo-700:hover { background-color: color-mix(in srgb, var(--brand-primary), black 15%) !important; }
      .bg-indigo-900 { background-color: color-mix(in srgb, var(--brand-primary), black 40%) !important; }
      .bg-indigo-50 { background-color: color-mix(in srgb, var(--brand-primary), white 90%) !important; }
      
      /* Textos e bordas indigo */
      .text-indigo-600 { color: var(--brand-primary) !important; }
      .border-indigo-600 { border-color: var(--brand-primary) !important; }
      .border-indigo-500 { border-color: var(--brand-primary) !important; }
      .focus\\:ring-indigo-500:focus { --tw-ring-color: var(--brand-primary) !important; }

      /* Elementos secundários (Cyan) */
      .bg-cyan-600 { background-color: var(--brand-secondary) !important; }
      .from-indigo-400 { --tw-gradient-from: var(--brand-primary) !important; }
      .to-cyan-400 { --tw-gradient-to: var(--brand-secondary) !important; }
      
      /* Arredondamento (Border Radius) */
      .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-lg, .rounded-md { 
        border-radius: var(--brand-radius) !important; 
      }
      
      /* Ajustes finos de hover e shadows baseados na cor primária */
      .hover\\:shadow-indigo-500\\/25:hover, .hover\\:shadow-indigo-500\\/30:hover {
        --tw-shadow-color: color-mix(in srgb, var(--brand-primary), transparent 75%) !important;
      }
    `;
  }, [config.theme]);

  return null;
};

function App() {
  return (
    <ConfigProvider>
      <StyleInjector />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<StoreSettings />} />
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="financials" element={<Financials />} />
              <Route path="security" element={<Security />} />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restore" element={<Restore />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/testimonials" element={<Testimonials />} />
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
