
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, ArrowUpRight, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders } = useConfig();

  // Métricas
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customerName)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Dados Simulados para Gráfico (Últimos 7 dias)
  const chartData = [45, 20, 60, 35, 80, 55, 90]; 
  const maxVal = Math.max(...chartData);

  const StatCard = ({ title, value, subtext, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
           <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
           <p className={`text-xs font-medium mt-1 flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
             {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
             {subtext}
           </p>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-indigo-500/20`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
            <p className="text-slate-500 text-sm mt-1">Resumo diário e performance da loja.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200">
            Última atualização: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Total" 
          value={`${totalRevenue.toFixed(2)} €`} 
          subtext="+12% vs mês passado"
          icon={DollarSign} 
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
          trend="up"
        />
        <StatCard 
          title="Encomendas" 
          value={totalOrders} 
          subtext="+5% vs mês passado"
          icon={ShoppingBag} 
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
          trend="up"
        />
        <StatCard 
          title="Clientes" 
          value={uniqueCustomers} 
          subtext="3 novos hoje"
          icon={Users} 
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
          trend="up"
        />
        <StatCard 
          title="Ticket Médio" 
          value={`${avgOrderValue.toFixed(2)} €`} 
          subtext="-2% vs mês passado"
          icon={Activity} 
          color="bg-gradient-to-br from-orange-500 to-amber-500"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Tendência de Vendas (Semanal)</h2>
                <button className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
                    Ver relatório completo <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
             </div>
             
             {/* Simple CSS Chart */}
             <div className="h-64 flex items-end justify-between gap-4 px-2">
                {chartData.map((val, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group">
                         <div className="relative w-full bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                            <div 
                                className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                                style={{ height: `${(val / maxVal) * 100}%` }}
                            ></div>
                         </div>
                         <span className="text-xs text-slate-400 font-medium">Dia {i+1}</span>
                    </div>
                ))}
             </div>
          </div>

          {/* Recent Activity / List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Atividade Recente</h2>
            <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{order.customerName}</p>
                                <p className="text-xs text-slate-500">{order.items || 'Restauração'}</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{order.amount.toFixed(2)}€</span>
                    </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-slate-400">Sem atividade.</p>}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 font-medium transition-colors">
                Ver todas as encomendas
            </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
