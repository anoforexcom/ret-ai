
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Wand2, Lock, Package, Users, PieChart, ShieldCheck } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';

const AdminLayout: React.FC = () => {
  const { isAdmin, login, logout, config } = useConfig();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      login();
      setError('');
    } else {
      setError('Senha incorreta. (Dica: admin)');
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-4">Senha: admin</p>
        </div>
      </div>
    );
  }

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800">
          <Wand2 className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-lg">{config.storeName}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Visão Geral</p>
          <NavLink to="/admin" end className={navItemClass}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink to="/admin/financials" className={navItemClass}>
            <PieChart className="h-4 w-4" /> Finanças
          </NavLink>

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Gestão</p>
          <NavLink to="/admin/orders" className={navItemClass}>
            <ShoppingCart className="h-4 w-4" /> Encomendas
          </NavLink>
          <NavLink to="/admin/products" className={navItemClass}>
            <Package className="h-4 w-4" /> Produtos (Bundles)
          </NavLink>
          <NavLink to="/admin/customers" className={navItemClass}>
            <Users className="h-4 w-4" /> Clientes
          </NavLink>

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Sistema</p>
          <NavLink to="/admin/settings" className={navItemClass}>
            <Settings className="h-4 w-4" /> Loja & API
          </NavLink>
          <NavLink to="/admin/security" className={navItemClass}>
            <ShieldCheck className="h-4 w-4" /> Segurança
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-100">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
