
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Package, Download, ExternalLink, Calendar, CreditCard } from 'lucide-react';

const CustomerHistory: React.FC = () => {
  const { currentCustomer, orders } = useConfig();
  
  const customerOrders = orders.filter(o => 
    o.customerId === currentCustomer?.id || o.customerEmail === currentCustomer?.email
  );

  return (
    <div className="animate-fadeIn">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
             <h3 className="text-lg font-bold text-slate-900">Histórico de Restauros</h3>
          </div>
          
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <tr>
                      <th className="px-6 py-4 text-left">Encomenda</th>
                      <th className="px-6 py-4 text-left">Data</th>
                      <th className="px-6 py-4 text-left">Plano / Item</th>
                      <th className="px-6 py-4 text-left">Valor</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {customerOrders.map(order => (
                     <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold text-slate-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.date).toLocaleDateString('pt-PT')}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs font-medium text-slate-700">{order.items}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900">{order.amount.toFixed(2)}€</span>
                              <span className="text-[9px] text-slate-400 flex items-center gap-1 uppercase">
                                 <CreditCard className="h-2 w-2" /> {order.paymentMethod || 'Saldo'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              {order.imageUrl && (
                                <a 
                                  href={order.imageUrl} 
                                  download={`restauro-${order.id}.png`}
                                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                  title="Baixar Foto HD"
                                >
                                   <Download className="h-4 w-4" />
                                </a>
                              )}
                              <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all">
                                 <ExternalLink className="h-4 w-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                   {customerOrders.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                           <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                           <p className="text-sm">Ainda não realizou encomendas.</p>
                        </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default CustomerHistory;
