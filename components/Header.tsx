import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wand2, Lock } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { config } = useConfig();

  const isActive = (path: string) => location.pathname === path;

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
          
          <div className="hidden md:flex items-center space-x-8">
            {config.mainMenu.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <Link 
              to="/admin" 
              className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              title="Área de Administração"
            >
              <Lock className="h-4 w-4" />
            </Link>

            <Link
              to="/restore"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Começar
            </Link>
          </div>

          <div className="flex items-center md:hidden">
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
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
                 <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 pl-3 pr-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-500"
                  >
                    <Lock className="h-4 w-4" /> Área Admin
                  </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;