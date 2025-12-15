import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders } = useConfig();

  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  const totalOrders = orders.length;
  // Simulating a visitor count
  const visitors = 1243; 

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-green-500 text-sm font-medium flex items-center bg-green-50 px-2 py-1 rounded">
          <TrendingUp className="h-3 w-3 mr-1" /> +12%
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Visão Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Receita Total" 
          value={`${totalRevenue.toFixed(2)} €`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Encomendas" 
          value={totalOrders} 
          icon={ShoppingBag} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Visitantes (Mês)" 
          value={visitors} 
          icon={Users} 
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Últimas Encomendas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{order.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Sem encomendas recentes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;