
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, ArrowUpRight, Activity, Wallet } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders, config } = useConfig();
  const { t } = useTranslation();

  // Filtro de Data
  const [dateRange, setDateRange] = React.useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // Últimos 30 dias por defeito
    end: new Date().toISOString().split('T')[0]
  });

  const exportToCSV = () => {
    // Cabeçalhos do CSV
    const headers = ["ID Encomenda", "Data", "Cliente", "Email", "Itens", "Método", "Montante", "Estado"];

    // Dados filtrados e formatados
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.date).toLocaleDateString('pt-PT'),
      o.customerName,
      o.customerEmail || 'N/A',
      o.items,
      o.paymentMethod,
      o.amount.toFixed(2),
      o.status
    ]);

    // Montar conteúdo CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Criar e disparar download
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_financeiro_${dateRange.start}_a_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funções auxiliares para consistência de dados
  const isPaidOrder = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    return [
      'completed', 'pago', 'paid', 'success', 'concluído', 'concluido',
      'paga', 'sucesso', 'finalizado', 'aprovado', 'approved', 'entregue',
      'pago_manual', 'mbway_pago', 'concluída'
    ].includes(s);
  };

  // Função auxiliar para converter montante de forma robusta
  const parseAmount = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const str = val.toString().replace(',', '.').replace(/[^\d.]/g, (m: string, i: number) => (m === '.' && val.toString().indexOf('.') === i) ? m : '');
    return parseFloat(str) || 0;
  };

  // Filtrar encomendas pelo período selecionado
  const filteredOrders = orders.filter(o => {
    if (!o.date) return false;
    try {
      const oDateStr = new Date(o.date).toISOString().split('T')[0];
      return oDateStr >= dateRange.start && oDateStr <= dateRange.end;
    } catch (e) {
      return false;
    }
  });

  // Métricas de Receita (Baseadas no Filtro)
  const totalRevenue = filteredOrders.reduce((acc, order) => acc + (isPaidOrder(order.status) ? parseAmount(order.amount) : 0), 0);
  const totalOrders = filteredOrders.filter(o => isPaidOrder(o.status)).length;

  // Clientes Únicos no Período
  const uniqueCustomerSet = new Set();
  filteredOrders.forEach(o => {
    const email = o.customerEmail?.trim().toLowerCase();
    if (email) uniqueCustomerSet.add(email);
    else if (o.customerName) uniqueCustomerSet.add(o.customerName.trim().toLowerCase());
  });
  const uniqueCustomers = uniqueCustomerSet.size;

  // Métricas de Despesa e Lucro Real (Despesas filtradas por data se houver data, senão totais)
  const filteredExpenses = config.expenses.filter(e => {
    if (!e.date) return true;
    return e.date >= dateRange.start && e.date <= dateRange.end;
  });
  const totalExpenses = filteredExpenses.reduce((acc, exp) => acc + parseAmount(exp.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Agregação de Vendas para o Gráfico (Baseado no Período)
  const getDaysArray = (start: string, end: string) => {
    const arr = [];
    let current = new Date(start + 'T12:00:00Z'); // Usar meio-dia UTC para evitar problemas de fuso
    const endDt = new Date(end + 'T12:00:00Z');
    while (current <= endDt) {
      arr.push(current.toISOString().split('T')[0]);
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return arr;
  };

  const daysInRange = getDaysArray(dateRange.start, dateRange.end);
  // Limitar a 30 dias para não quebrar o layout do gráfico se o range for enorme
  const chartDays = daysInRange.length > 31 ? daysInRange.slice(-31) : daysInRange;

  const chartData = chartDays.map(dayStr => {
    return filteredOrders
      .filter(o => {
        if (!isPaidOrder(o.status)) return false;
        if (!o.date) return false;
        try {
          const oDateStr = new Date(o.date).toISOString().split('T')[0];
          return oDateStr === dayStr;
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, o) => sum + parseAmount(o.amount), 0);
  });

  const maxVal = Math.max(...chartData, 10);

  const StatCard = ({ title, value, subtext, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
          <p className={`text-xs font-medium mt-1 flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trendValue} {subtext}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.dashboard_title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('admin.dashboard_desc')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            {t('admin.system_status')} <span className="text-green-600 font-bold">{t('admin.online')}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100 last:border-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">De</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none p-1 focus:text-indigo-600 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Até</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none p-1 focus:text-indigo-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('admin.gross_revenue')}
          value={`${totalRevenue.toFixed(2)}€`}
          subtext={t('admin.this_month')}
          trendValue="+14%"
          icon={DollarSign}
          color="bg-indigo-600"
          trend="up"
        />
        <StatCard
          title={t('admin.net_profit')}
          value={`${netProfit.toFixed(2)}€`}
          subtext={t('admin.post_expenses')}
          trendValue="+8%"
          icon={Wallet}
          color="bg-emerald-600"
          trend="up"
        />
        <StatCard
          title={t('admin.orders_stat')}
          value={totalOrders}
          subtext={t('admin.converted')}
          trendValue="+5%"
          icon={ShoppingBag}
          color="bg-blue-600"
          trend="up"
        />
        <StatCard
          title={t('admin.unique_customers')}
          value={uniqueCustomers}
          subtext={t('admin.registered')}
          trendValue="+3"
          icon={Users}
          color="bg-purple-600"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('admin.sales_performance')}</h2>
              <p className="text-sm text-slate-400">{t('admin.daily_revenue')}</p>
            </div>
            <button
              onClick={exportToCSV}
              className="text-indigo-600 text-sm font-bold flex items-center hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-indigo-100"
            >
              {t('admin.financial_report')} <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Chart Visuals */}
          <div className="h-64 flex items-end justify-between gap-6 px-4">
            {chartData.map((val, i) => {
              const percentage = maxVal > 0 ? (val / maxVal) * 100 : 0;
              return (
                <div key={i} className="w-full flex flex-col items-center gap-4 group">
                  <div className="relative w-full h-full flex items-end">
                    {/* Hover tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                      {val.toFixed(2)}€
                    </div>
                    <div className="w-full bg-slate-50 rounded-t-xl h-full absolute inset-0 -z-10"></div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-700 ease-out group-hover:from-indigo-700 group-hover:to-indigo-500 shadow-lg shadow-indigo-500/20"
                      style={{
                        height: `${percentage}%`,
                        minHeight: val > 0 ? '4px' : '0'
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {(() => {
                      const [year, month, day] = chartDays[i].split('-');
                      return `${day}/${month}`;
                    })()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t('admin.recent_orders')}</h2>
          <div className="space-y-4 flex-grow">
            {orders.slice(0, 6).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{order.items || t('admin.standard_restoration')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{order.amount.toFixed(2)}€</p>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(order.date).toLocaleDateString('pt-PT')}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <Activity className="h-10 w-10 opacity-20 mb-2" />
                <p className="text-xs">{t('admin.waiting_sales')}</p>
              </div>
            )}
          </div>
          <a href="/#/admin/orders" className="w-full mt-6 py-3 text-center text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
            {t('admin.view_all_history')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
