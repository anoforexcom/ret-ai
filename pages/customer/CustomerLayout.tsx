
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { LayoutDashboard, History, Wallet, User, LogOut, Wand2, ChevronRight, Mail, Key } from 'lucide-react';

const CustomerLayout: React.FC = () => {
  const { currentCustomer, customerLogin, customerLogout, config } = useConfig();
  const [email, setEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const location = useLocation();

  if (!currentCustomer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <User className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Aceder à Minha Conta</h2>
            <p className="text-indigo-100 text-sm mt-1">Gerir fotos, saldo e encomendas.</p>
          </div>
          
          <div className="p-8">
             <form onSubmit={(e) => {
               e.preventDefault();
               if (!customerLogin(email)) {
                 alert("Utilizador não encontrado. Se ainda não tem conta, faça o seu primeiro restauro para se registar!");
               }
             }} className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Registado</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="exemplo@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                   Entrar no Painel
                </button>
             </form>
             <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 mb-4">Ainda não tem conta?</p>
                <Link to="/restore" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                  <Wand2 className="h-4 w-4" /> Restaurar Foto & Criar Conta
                </Link>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dash', label: 'Início', path: '/customer', icon: LayoutDashboard },
    { id: 'history', label: 'Encomendas', path: '/customer/history', icon: History },
    { id: 'wallet', label: 'Saldo & Carregamentos', path: '/customer/wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <div className="bg-indigo-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl border-2 border-white/20">
                   {currentCustomer.firstName.charAt(0)}
                </div>
                <div>
                   <h1 className="text-2xl font-bold">Olá, {currentCustomer.firstName}!</h1>
                   <p className="text-indigo-200 text-sm">Bem-vindo ao seu estúdio pessoal da {config.storeName}</p>
                </div>
             </div>
             <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Saldo Disponível</p>
                <p className="text-3xl font-black">{currentCustomer.balance.toFixed(2)}€</p>
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
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      location.pathname === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
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
                   Sair da Conta
                </button>
             </div>

             <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Key className="h-3 w-3" /> Suporte VIP
                </h4>
                <p className="text-xs text-indigo-600 leading-relaxed">Como utilizador registado, tem prioridade no processamento IA e suporte especializado.</p>
             </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1">
             <Outlet />
          </main>
       </div>
    </div>
  );
};

export default CustomerLayout;
