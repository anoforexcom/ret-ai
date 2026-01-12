import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wand2, Lock, User, LogOut, Settings, Globe } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { config, currentCustomer, customerLogout, isAdmin } = useConfig();
  const { t, i18n } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  // Toggle Language
  const toggleLanguage = () => {
    const isPt = i18n.language.startsWith('pt');
    i18n.changeLanguage(isPt ? 'en' : 'pt');
  };

  const isCurrentPt = i18n.language.startsWith('pt');

  // Mapa para traduzir os itens do menu configurável (fallback)
  const getTranslatedLabel = (label: string) => {
    // Tenta encontrar uma chave correspondente no ficheiro de tradução
    // Normaliza para lowercase para facilitar o match: "Início" -> "home"
    const key = label.toLowerCase();

    // Mapeamento manual para garantir compatibilidade com o config.mainMenu
    const map: Record<string, string> = {
      'início': 'home',
      'restaurar': 'restore',
      'preços': 'pricing',
      'faq': 'faq',
      'contactos': 'contact'
    };

    const translationKey = map[key] || key;
    return t(`menu.${translationKey}`, label);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">{config.storeName}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {config.mainMenu.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                {getTranslatedLabel(link.label)}
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              className="p-1 rounded-lg hover:bg-slate-100 transition-all active:scale-95"
              title={isCurrentPt ? "Switch to English" : "Mudar para Português"}
            >
              {isCurrentPt ? (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" className="h-5 w-7 rounded-sm shadow-sm border border-slate-100">
                    <rect width="600" height="400" fill="#000080" />
                    <rect width="600" height="400" fill="#cf142b" clipPath="polygon(0 0, 600 0, 600 400, 0 400)" />
                    <path d="M0 0 L600 400 M0 400 L600 0" stroke="#fff" strokeWidth="60" />
                    <path d="M0 0 L600 400 M0 400 L600 0" stroke="#cf142b" strokeWidth="40" />
                    <path d="M300 0 V400 M0 200 H600" stroke="#fff" strokeWidth="100" />
                    <path d="M300 0 V400 M0 200 H600" stroke="#cf142b" strokeWidth="60" />
                  </svg>
                  <span className="text-xs font-bold text-slate-400">EN</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" className="h-5 w-7 rounded-sm shadow-sm border border-slate-100">
                    <rect width="240" height="400" fill="#006600" />
                    <rect x="240" width="360" height="400" fill="#ff0000" />
                    <circle cx="240" cy="200" r="80" fill="#ffff00" />
                    <circle cx="240" cy="200" r="70" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  </svg>
                  <span className="text-xs font-bold text-slate-400">PT</span>
                </div>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Admin Quick Link */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
              title={t('menu.admin_area')}
            >
              <Lock className="h-4 w-4" /> {t('menu.admin')}
            </Link>

            {currentCustomer ? (
              <div className="flex items-center gap-4">
                <Link to="/customer" className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
                  <User className="h-4 w-4" /> {t('menu.dashboard')}
                </Link>
                <button onClick={customerLogout} className="text-slate-400 hover:text-red-500 transition-colors" title={t('menu.logout')}>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/customer" className="text-slate-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> {t('menu.login')}
              </Link>
            )}

            <Link
              to="/restore"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              {t('menu.restore')}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-slate-100 transition-all active:scale-95"
              title={isCurrentPt ? "Switch to English" : "Mudar para Português"}
            >
              {isCurrentPt ? (
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" className="h-4 w-6 rounded-sm shadow-sm border border-slate-100">
                    <rect width="600" height="400" fill="#000080" />
                    <rect width="600" height="400" fill="#cf142b" clipPath="polygon(0 0, 600 0, 600 400, 0 400)" />
                    <path d="M0 0 L600 400 M0 400 L600 0" stroke="#fff" strokeWidth="60" />
                    <path d="M0 0 L600 400 M0 400 L600 0" stroke="#cf142b" strokeWidth="40" />
                    <path d="M300 0 V400 M0 200 H600" stroke="#fff" strokeWidth="100" />
                    <path d="M300 0 V400 M0 200 H600" stroke="#cf142b" strokeWidth="60" />
                  </svg>
                  <span className="text-[10px] font-black text-slate-400">EN</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" className="h-4 w-6 rounded-sm shadow-sm border border-slate-100">
                    <rect width="240" height="400" fill="#006600" />
                    <rect x="240" width="360" height="400" fill="#ff0000" />
                    <circle cx="240" cy="200" r="80" fill="#ffff00" />
                    <circle cx="240" cy="200" r="70" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  </svg>
                  <span className="text-[10px] font-black text-slate-400">PT</span>
                </div>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {config.mainMenu.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(link.path)
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
              >
                {getTranslatedLabel(link.label)}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-100 mt-2 space-y-1">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center gap-3 pl-3 pr-4 py-4 text-base font-black text-indigo-700 bg-indigo-50 rounded-2xl transition-all border-2 border-indigo-100 shadow-sm active:scale-95"
              >
                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                {isCurrentPt ? "Switch to English" : "Mudar para Português"}
              </button>
              <Link to="/customer" onClick={() => setIsOpen(false)} className="flex items-center gap-2 pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">
                <User className="h-4 w-4" /> {t('menu.account')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
