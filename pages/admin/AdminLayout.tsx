
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Wand2, 
  Lock, 
  Package, 
  Users, 
  PieChart, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';

const AdminLayout: React.FC = () => {
  const { isAdmin, login, logout, config } = useConfig();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = config.adminPassword || 'admin';
    if (password === currentPassword) {
      login();
      setError('');
    } else {
      setError('Senha incorreta. Verifique as suas credenciais.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Painel de Administração</h2>
          <p className="text-center text-slate-500 mb-8">Introduza a senha de acesso</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Senha"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Entrar
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest">Acesso Restrito • RetroColor AI</p>
        </div>
      </div>
    );
  }

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-lg z-30">
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-base tracking-tight">{config.storeName}</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Abrir Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-lg">{config.storeName}</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar Menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 mt-2">Visão Geral</p>
          <NavLink to="/admin" end className={navItemClass} onClick={handleNavLinkClick}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink to="/admin/financials" className={navItemClass} onClick={handleNavLinkClick}>
            <PieChart className="h-4 w-4" /> Finanças
          </NavLink>

          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 mt-6">Gestão</p>
          <NavLink to="/admin/orders" className={navItemClass} onClick={handleNavLinkClick}>
            <ShoppingCart className="h-4 w-4" /> Encomendas
          </NavLink>
          <NavLink to="/admin/products" className={navItemClass} onClick={handleNavLinkClick}>
            <Package className="h-4 w-4" /> Produtos
          </NavLink>
          <NavLink to="/admin/customers" className={navItemClass} onClick={handleNavLinkClick}>
            <Users className="h-4 w-4" /> Clientes
          </NavLink>

          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 mt-6">Sistema</p>
          <NavLink to="/admin/settings" className={navItemClass} onClick={handleNavLinkClick}>
            <Settings className="h-4 w-4" /> Configurações
          </NavLink>
          <NavLink to="/admin/security" className={navItemClass} onClick={handleNavLinkClick}>
            <ShieldCheck className="h-4 w-4" /> Segurança
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              handleNavLinkClick();
              logout();
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative custom-scrollbar">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
