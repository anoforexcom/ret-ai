
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { User, Mail, Calendar, TrendingUp, Coins, BadgeCheck } from 'lucide-react';

const Customers: React.FC = () => {
  const { orders, config } = useConfig();

  // Processar dados de clientes a partir das encomendas E das contas registadas
  const customerMap = new Map();

  // Primeiro adicionamos todos os clientes registados
  (config.customers || []).forEach(c => {
    customerMap.set(c.email.toLowerCase(), {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        totalSpent: 0,
        orderCount: 0,
        lastOrder: c.createdAt,
        isRegistered: true,
        balance: c.balance
    });
  });

  // Depois processamos as encomendas para somar gastos
  orders.forEach(order => {
      const emailKey = order.customerEmail?.toLowerCase();
      if (!emailKey) return;

      if (!customerMap.has(emailKey)) {
          customerMap.set(emailKey, {
              name: order.customerName,
              email: order.customerEmail,
              totalSpent: 0,
              orderCount: 0,
              lastOrder: order.date,
              isRegistered: false,
              balance: 0
          });
      }
      const customer = customerMap.get(emailKey);
      customer.totalSpent += order.amount;
      customer.orderCount += 1;
      if (new Date(order.date) > new Date(customer.lastOrder)) {
          customer.lastOrder = order.date;
      }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgClv = customers.length > 0 ? totalSpentAll / customers.length : 0;

  return (
    <div className="animate-fadeIn">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Análise de Clientes</h1>
            <p className="text-slate-500 text-sm mt-1">Gestão de utilizadores registados e histórico de visitantes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">CLV Médio</p>
                <p className="text-3xl font-black">{avgClv.toFixed(2)} €</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Clientes Registados</p>
                <p className="text-3xl font-black text-slate-900">{(config.customers || []).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo em Custódia</p>
                <p className="text-3xl font-black text-slate-900">
                   {(config.customers || []).reduce((acc, c) => acc + c.balance, 0).toFixed(2)}€
                </p>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilizador</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Gasto Total</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Atividade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {customers.map((customer, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs ${customer.isRegistered ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                                {customer.name}
                                                {customer.isRegistered && <BadgeCheck className="h-3 w-3 text-indigo-500" />}
                                            </div>
                                            <div className="text-[11px] text-slate-500">{customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {customer.isRegistered ? (
                                        <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter">Registado</span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-tighter">Visitante</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold ${customer.balance > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                        {customer.balance.toFixed(2)}€
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-black text-slate-900">{customer.totalSpent.toFixed(2)}€</div>
                                    <div className="text-[10px] text-slate-400">{customer.orderCount} encomendas</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(customer.lastOrder).toLocaleDateString('pt-PT')}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Customers;
