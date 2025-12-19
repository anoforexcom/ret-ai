
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Wand2, Clock, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { currentCustomer, orders } = useConfig();
  
  const customerOrders = orders.filter(o => 
    o.customerId === currentCustomer?.id || o.customerEmail === currentCustomer?.email
  );

  const completedOrdersCount = customerOrders.filter(o => o.status === 'completed').length;

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

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
    </div>
  );
};

export default CustomerDashboard;
