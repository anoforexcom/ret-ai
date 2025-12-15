import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Wand2, Lock } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800">
          <Wand2 className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-lg">{config.storeName}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShoppingCart className="h-5 w-5" />
            Encomendas
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="h-5 w-5" />
            Loja & Menus
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;