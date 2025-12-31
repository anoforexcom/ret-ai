
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    DollarSign,
    PieChart,
    TrendingUp,
    Plus,
    Trash2,
    AlertCircle,
    ArrowDownCircle,
    ArrowUpCircle,
    Calendar,
    Tag,
    CreditCard,
    Target
} from 'lucide-react';
import { Expense } from '../../types';
import { useTranslation } from 'react-i18next';

const Financials: React.FC = () => {
    const { orders, config, updateConfig, addAuditLog } = useConfig();
    const { t, i18n } = useTranslation();
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        category: 'api',
        amount: 0,
        description: ''
    });

    // Funções de utilidade para consistência de dados
    const isPaidOrder = (status: string) => {
        const s = (status || "").toLowerCase().trim();
        return [
            'completed', 'pago', 'paid', 'success', 'concluído', 'concluido',
            'paga', 'sucesso', 'finalizado', 'aprovado', 'approved'
        ].includes(s);
    };

    const parseAmount = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const str = val.toString().replace(',', '.').replace(/[^\d.]/g, (m: string, i: number) => (m === '.' && val.toString().indexOf('.') === i) ? m : '');
        return parseFloat(str) || 0;
    };

    const currentExpenses = config.expenses || [];

    // Cálculos de Receita
    const totalRevenue = orders.reduce((acc, order) => acc + (isPaidOrder(order.status) ? parseAmount(order.amount) : 0), 0);
    const totalOrders = orders.filter(o => isPaidOrder(o.status)).length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Cálculos de Despesas (Manuais + Automáticas se necessário)
    const totalExpenses = currentExpenses.reduce((acc, exp) => acc + parseAmount(exp.amount), 0);

    // Lucro e Margem
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Breakdown por Categoria
    const categories = {
        api: currentExpenses.filter(e => e.category === 'api').reduce((a, b) => a + parseAmount(b.amount), 0),
        marketing: currentExpenses.filter(e => e.category === 'marketing').reduce((a, b) => a + parseAmount(b.amount), 0),
        infra: currentExpenses.filter(e => e.category === 'infra').reduce((a, b) => a + parseAmount(b.amount), 0),
        outro: currentExpenses.filter(e => e.category === 'outro').reduce((a, b) => a + parseAmount(b.amount), 0),
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExpense.amount <= 0) return;

        const expense: Expense = {
            ...newExpense,
            id: `EXP-${Date.now()}`
        };

        updateConfig({
            expenses: [expense, ...currentExpenses]
        });

        addAuditLog('Adicionar Despesa', `Despesa de ${expense.amount}€ em ${expense.category}`);
        setShowAddExpense(false);
        setNewExpense({
            date: new Date().toISOString().split('T')[0],
            category: 'api',
            amount: 0,
            description: ''
        });
    };

    const removeExpense = (id: string) => {
        if (!confirm(t('admin.financials_v.confirm_delete'))) return;
        updateConfig({
            expenses: currentExpenses.filter(e => e.id !== id)
        });
        addAuditLog('Remover Despesa', `ID: ${id}`);
    };

    // KPI Extras
    const cac = categories.marketing > 0 && totalOrders > 0 ? categories.marketing / totalOrders : 0;
    const roas = categories.marketing > 0 ? totalRevenue / categories.marketing : 0;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.financials_v.title')}</h1>
                    <p className="text-slate-500 text-sm mt-1">{t('admin.financials_v.desc')}</p>
                </div>
                <button
                    onClick={() => setShowAddExpense(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5" /> {t('admin.financials_v.register_expense')}
                </button>
            </div>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{t('admin.financials_v.kpi.gross')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('admin.financials_v.kpi.total_revenue')}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalRevenue.toFixed(2)}€</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <ArrowDownCircle className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{t('admin.financials_v.kpi.spent')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('admin.financials_v.kpi.expenses')}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalExpenses.toFixed(2)}€</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowUpCircle className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t('admin.financials_v.kpi.net')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('admin.financials_v.kpi.real_profit')}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                        {netProfit.toFixed(2)}€
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <PieChart className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{t('admin.financials_v.kpi.efficiency')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('admin.financials_v.kpi.margin')}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{profitMargin.toFixed(1)}%</h3>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-500" /> {t('admin.financials_v.analytics.cost_distribution')}
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('admin.financials_v.analytics.api_ai')}</span>
                                <span className="font-bold text-slate-900">{categories.api.toFixed(2)}€</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: `${totalExpenses > 0 ? (categories.api / totalExpenses) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div> {t('admin.financials_v.analytics.marketing')}</span>
                                <span className="font-bold text-slate-900">{categories.marketing.toFixed(2)}€</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-pink-500 h-full" style={{ width: `${totalExpenses > 0 ? (categories.marketing / totalExpenses) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> {t('admin.financials_v.analytics.infra')}</span>
                                <span className="font-bold text-slate-900">{categories.infra.toFixed(2)}€</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-indigo-500 h-full" style={{ width: `${totalExpenses > 0 ? (categories.infra / totalExpenses) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> {t('admin.financials_v.analytics.others')}</span>
                                <span className="font-bold text-slate-900">{categories.outro.toFixed(2)}€</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-slate-400 h-full" style={{ width: `${totalExpenses > 0 ? (categories.outro / totalExpenses) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">{t('admin.financials_v.analytics.aov')}</span>
                            <span className="font-bold text-slate-900">{aov.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">{t('admin.financials_v.analytics.cac')}</span>
                            <span className="font-bold text-slate-900">{cac.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                            <span className="text-sm text-indigo-700">{t('admin.financials_v.analytics.roas')}</span>
                            <span className="font-bold text-indigo-900">{roas.toFixed(2)}x</span>
                        </div>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">{t('admin.financials_v.history.title')}</h3>
                    </div>
                    <div className="flex-grow overflow-auto max-h-[500px]">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.financials_v.history.table.date')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.financials_v.history.table.category')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.financials_v.history.table.description')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.financials_v.history.table.amount')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {currentExpenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors animate-fadeIn">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(exp.date).toLocaleDateString(i18n.language === 'pt' ? 'pt-PT' : 'en-US')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${exp.category === 'api' ? 'bg-blue-100 text-blue-700' :
                                                exp.category === 'marketing' ? 'bg-pink-100 text-pink-700' :
                                                    exp.category === 'infra' ? 'bg-indigo-100 text-indigo-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                                            {exp.description || t('admin.financials_v.history.no_description')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                            {exp.amount.toFixed(2)}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => removeExpense(exp.id)}
                                                className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                                                title={t('admin.financials_v.history.delete_tooltip')}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentExpenses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                            {t('admin.financials_v.history.no_expenses')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Adicionar Despesa */}
            {showAddExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddExpense(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                        <div className="bg-indigo-600 p-6 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Plus className="h-6 w-6" /> {t('admin.financials_v.modal.title')}
                            </h3>
                            <p className="text-indigo-100 text-sm mt-1">{t('admin.financials_v.modal.desc')}</p>
                        </div>

                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.financials_v.history.table.date')}</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            required
                                            value={newExpense.date}
                                            onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.financials_v.history.table.amount')} (€)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            placeholder="0.00"
                                            value={newExpense.amount || ''}
                                            onChange={e => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.financials_v.history.table.category')}</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                                    >
                                        <option value="api">{t('admin.financials_v.modal.categories.api')}</option>
                                        <option value="marketing">{t('admin.financials_v.modal.categories.marketing')}</option>
                                        <option value="infra">{t('admin.financials_v.modal.categories.infra')}</option>
                                        <option value="outro">{t('admin.financials_v.modal.categories.outro')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.financials_v.history.table.description')}</label>
                                <textarea
                                    rows={2}
                                    placeholder={t('admin.financials_v.modal.placeholder_desc')}
                                    value={newExpense.description}
                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddExpense(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    {t('admin.financials_v.modal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                                >
                                    {t('admin.financials_v.modal.confirm')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financials;
