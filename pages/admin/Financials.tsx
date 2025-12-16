
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { DollarSign, PieChart, TrendingUp, AlertCircle } from 'lucide-react';

const Financials: React.FC = () => {
  const { orders } = useConfig();

  // Cálculos Financeiros
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  
  // Despesas Simuladas (API Costs, Hosting, etc) - 20% da receita + custos fixos
  const operationalCosts = totalRevenue * 0.15; // Taxas de API
  const fixedCosts = 50; // Hosting, domain, etc
  const totalExpenses = operationalCosts + fixedCosts;
  
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Gestão Financeira</h1>
            <p className="text-slate-500 text-sm mt-1">Relatórios de lucros, despesas e previsões.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase">Receita Bruta</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalRevenue.toFixed(2)} €</h3>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full"></div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase">Despesas Estimadas</p>
                <h3 className="text-3xl font-bold text-red-600 mt-2">{totalExpenses.toFixed(2)} €</h3>
                <p className="text-xs text-slate-400 mt-1">Inclui taxas API e custos fixos</p>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(totalExpenses/totalRevenue)*100}%` }}></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase">Lucro Líquido</p>
                <h3 className="text-3xl font-bold text-indigo-600 mt-2">{netProfit.toFixed(2)} €</h3>
                <span className="inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">
                    Margem: {profitMargin.toFixed(1)}%
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-slate-400" /> Distribuição de Custos
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">APIs de IA (Gemini)</span>
                        <span className="font-medium">{operationalCosts.toFixed(2)} €</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-600">Infraestrutura (Vercel/Firebase)</span>
                        <span className="font-medium">{fixedCosts.toFixed(2)} €</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                </div>
            </div>

            {/* Forecasting */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-slate-400" /> Previsão Próximo Mês
                </h3>
                
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5" />
                        <div>
                            <p className="text-sm text-indigo-900 font-medium">Baseado no crescimento atual (+12%)</p>
                            <p className="text-xs text-indigo-700 mt-1">
                                Prevemos um aumento de receita para aprox. <span className="font-bold">{(totalRevenue * 1.12).toFixed(2)} €</span> no próximo mês se a tendência se mantiver.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Receita Esperada</span>
                        <span className="font-bold text-slate-900">{(totalRevenue * 1.12).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Novos Clientes Estimados</span>
                        <span className="font-bold text-slate-900">+{Math.ceil(orders.length * 0.1)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Financials;
