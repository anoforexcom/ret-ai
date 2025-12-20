
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Wand2, Clock, CheckCircle, ArrowRight, Package, Lock, ShieldCheck, Eye, EyeOff, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { currentCustomer, orders, updateCustomerPassword } = useConfig();
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const customerOrders = orders.filter(o => 
    o.customerId === currentCustomer?.id || o.customerEmail === currentCustomer?.email
  );

  const completedOrdersCount = customerOrders.filter(o => o.status === 'completed').length;

  const handleUpdatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer || newPassword.length < 4) return;
    
    updateCustomerPassword(currentCustomer.id, newPassword);
    setSuccess(true);
    setNewPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                   <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Restauros Concluídos</h3>
                   <p className="text-2xl font-black text-slate-900">{completedOrdersCount}</p>
                </div>
             </div>
             <Link to="/customer/history" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Ver todo o histórico <ArrowRight className="h-3 w-3" />
             </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                   <Wand2 className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Novo Restauro</h3>
                   <p className="text-xs text-slate-400">Dê vida a mais uma memória hoje</p>
                </div>
             </div>
             <Link to="/restore" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                Ir para o Estúdio
             </Link>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Clock className="h-5 w-5 text-slate-400" /> Encomendas Recentes
                </h3>
                <Link to="/customer/history" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Ver Todas</Link>
             </div>
             <div className="divide-y divide-slate-50">
                {customerOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                           <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">{order.items}</p>
                           <p className="text-[11px] text-slate-500">{new Date(order.date).toLocaleDateString('pt-PT')}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{order.amount.toFixed(2)}€</p>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase">Pago</span>
                     </div>
                  </div>
                ))}
                {customerOrders.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                     <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                     <p className="text-sm">Ainda não realizou encomendas.</p>
                  </div>
                )}
             </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                   <Lock className="h-4 w-4 text-indigo-600" /> Segurança
                </h3>
             </div>
             <form onSubmit={handleUpdatePass} className="p-6 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">Defina uma nova palavra-passe para a sua conta RetroColor.</p>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nova Password</label>
                   <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                   </div>
                </div>
                <button 
                  type="submit"
                  disabled={newPassword.length < 4}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    newPassword.length >= 4 
                    ? 'bg-slate-900 text-white hover:bg-black' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                   <Save className="h-4 w-4" /> Atualizar Chave
                </button>
                {success && (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 p-2 rounded-lg border border-green-100 animate-fadeIn">
                     <ShieldCheck className="h-3 w-3" /> Palavra-passe atualizada!
                  </div>
                )}
             </form>
          </div>
       </div>
    </div>
  );
};

export default CustomerDashboard;
