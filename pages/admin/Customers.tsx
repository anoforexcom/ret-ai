
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { User, Mail, Calendar, TrendingUp } from 'lucide-react';

const Customers: React.FC = () => {
  const { orders } = useConfig();

  // Processar dados de clientes a partir das encomendas
  const customerMap = new Map();

  orders.forEach(order => {
      if (!customerMap.has(order.customerName)) {
          customerMap.set(order.customerName, {
              name: order.customerName,
              email: order.customerEmail || 'N/A',
              totalSpent: 0,
              orderCount: 0,
              lastOrder: order.date,
              firstOrder: order.date
          });
      }
      const customer = customerMap.get(order.customerName);
      customer.totalSpent += order.amount;
      customer.orderCount += 1;
      if (new Date(order.date) > new Date(customer.lastOrder)) {
          customer.lastOrder = order.date;
      }
      if (new Date(order.date) < new Date(customer.firstOrder)) {
        customer.firstOrder = order.date;
    }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  
  // Calcular métricas globais
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgClv = customers.length > 0 ? totalSpentAll / customers.length : 0;

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Análise de Clientes</h1>
            <p className="text-slate-500 text-sm mt-1">Insights sobre o comportamento e valor dos consumidores.</p>
        </div>

        {/* CLV Banner */}
        <div className="bg-indigo-900 rounded-2xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-700 rounded-full opacity-50 blur-xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-lg font-medium text-indigo-200">Customer Lifetime Value (CLV) Médio</h2>
                    <p className="text-4xl font-bold mt-2">{avgClv.toFixed(2)} €</p>
                    <p className="text-sm text-indigo-300 mt-2">Valor médio que cada cliente gasta na loja.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-green-500 rounded-lg">
                             <TrendingUp className="h-5 w-5 text-white" />
                         </div>
                         <div>
                             <p className="text-sm font-bold">Top Cliente</p>
                             <p className="text-xs text-indigo-200">{customers[0]?.name || 'N/A'} ({customers[0]?.totalSpent.toFixed(2)}€)</p>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Gasto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Encomendas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Última Compra</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Segmento</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {customers.map((customer, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {customer.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{customer.totalSpent.toFixed(2)} €</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{customer.orderCount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(customer.lastOrder).toLocaleDateString('pt-PT')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.totalSpent > avgClv * 1.5 ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            VIP
                                        </span>
                                    ) : customer.orderCount === 1 ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Novo
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                            Regular
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Ainda não existem dados de clientes suficientes.
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

export default Customers;
