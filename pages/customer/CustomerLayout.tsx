
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, History, Wallet, User, LogOut, Wand2, ChevronRight, Mail, Key, Eye, EyeOff, AlertCircle, Globe } from 'lucide-react';

const CustomerLayout: React.FC = () => {
  const { currentCustomer, customerLogin, customerLogout, config } = useConfig();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  const toggleLanguage = () => {
    const isPt = i18n.language.startsWith('pt');
    i18n.changeLanguage(isPt ? 'en' : 'pt');
  };

  const isCurrentPt = i18n.language.startsWith('pt');

  if (!currentCustomer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white text-center relative">
            <button
              onClick={toggleLanguage}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">{isCurrentPt ? 'EN' : 'PT'}</span>
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm transform -rotate-3">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('customer.login.title')}</h2>
            <p className="text-indigo-100 text-sm mt-1">{t('customer.login.subtitle')}</p>
          </div>

          <div className="p-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              const result = customerLogin(email, password);
              if (!result.success) {
                setError(result.message);
              } else {
                setError('');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('customer.login.email_label')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('contact.form.email_placeholder')}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('customer.login.password_label')}</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-shake">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                {t('customer.login.btn_enter')}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-4">{t('customer.login.no_account')}</p>
              <Link to="/restore" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                <Wand2 className="h-4 w-4" /> {t('customer.login.create_account')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dash', label: t('customer.dashboard.menu.home'), path: '/customer', icon: LayoutDashboard },
    { id: 'history', label: t('customer.dashboard.menu.history'), path: '/customer/history', icon: History },
    { id: 'wallet', label: t('customer.dashboard.menu.wallet'), path: '/customer/wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Wand2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{t('customer.dashboard.welcome', { name: currentCustomer.firstName })}</h1>
              <p className="text-indigo-200 text-sm">{t('customer.dashboard.welcome_subtitle', { store: config.storeName })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
              title={isCurrentPt ? "Switch to English" : "Mudar para Português"}
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-tight">{isCurrentPt ? 'EN' : 'PT'}</span>
            </button>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">{t('customer.dashboard.balance_label')}</p>
              <p className="text-3xl font-black">{currentCustomer.balance.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 -mt-6 mb-20 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
            {menuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                <ChevronRight className={`h-4 w-4 opacity-50 ${location.pathname === item.path ? 'block' : 'hidden'}`} />
              </Link>
            ))}
            <button
              onClick={customerLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut className="h-4 w-4" />
              {t('customer.dashboard.menu.logout')}
            </button>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Key className="h-3 w-3" /> {t('customer.dashboard.vip_title')}
            </h4>
            <p className="text-xs text-indigo-600 leading-relaxed">{t('customer.dashboard.vip_desc')}</p>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
       `}</style>
    </div>
  );
};

export default CustomerLayout;
