import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { User, Mail, Calendar, TrendingUp, Coins, BadgeCheck, Edit2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Customers: React.FC = () => {
    const { orders, config, updateCustomerBalance } = useConfig();
    const { t, i18n } = useTranslation();
    const [editingCustomer, setEditingCustomer] = React.useState<any>(null);
    const [newBalance, setNewBalance] = React.useState<string>("");

    // Processar dados de clientes a partir das encomendas E das contas registadas
    const registeredMap = new Map(); // Mapeia ID -> Customer
    const emailToIdMap = new Map();  // Mapeia Email -> ID
    const nameToIdMap = new Map();   // Mapeia Nome -> ID (Fallback Histórico)
    const visitorMap = new Map();    // Mapeia Email ou Nome -> Visitor
    const allFinalCustomers: any[] = [];

    // 1. Inicializar com Clientes Registados
    (config.customers || []).forEach(c => {
        const normalizedEmail = c.email.trim().toLowerCase();
        const fullName = `${c.firstName} ${c.lastName}`.trim();
        const normalizedName = fullName.toLowerCase();

        const customerData = {
            id: c.id,
            name: fullName,
            email: c.email.trim(),
            totalSpent: 0,
            orderCount: 0,
            lastOrder: c.createdAt,
            isRegistered: true,
            balance: c.balance || 0
        };
        allFinalCustomers.push(customerData);
        registeredMap.set(c.id, customerData);
        if (normalizedEmail) {
            emailToIdMap.set(normalizedEmail, c.id);
        }
        if (normalizedName) {
            nameToIdMap.set(normalizedName, c.id);
        }
    });

    // 2. Processar Encomendas para somar gastos
    orders.forEach(order => {
        // Normalização do estado (muito permissivo para garantir que nada escapa)
        const status = (order.status || "").toLowerCase().trim();
        const isPaid = [
            'completed', 'pago', 'paid', 'success', 'concluído', 'concluido',
            'paga', 'sucesso', 'finalizado', 'aprovado', 'approved'
        ].includes(status);
        if (!isPaid) return;

        const orderEmail = (order.customerEmail || "").trim().toLowerCase();
        const orderName = (order.customerName || "").trim().toLowerCase();
        const orderIdFromOrder = order.customerId;

        // Converter montante de forma robusta (lida com strings, vírgulas, etc)
        let orderAmount = 0;
        if (typeof order.amount === 'number') {
            orderAmount = order.amount;
        } else if (order.amount) {
            orderAmount = parseFloat(order.amount.toString().replace(',', '.').replace(/[^\d.]/g, '')) || 0;
        }

        // Tentar encontrar o cliente registado correspondente
        let targetCustomer: any = null;

        // Prioridade 1: Match por ID
        if (orderIdFromOrder) targetCustomer = registeredMap.get(orderIdFromOrder);

        // Prioridade 2: Match por Email (se não encontrar por ID)
        if (!targetCustomer && orderEmail) {
            const mappedId = emailToIdMap.get(orderEmail);
            if (mappedId) targetCustomer = registeredMap.get(mappedId);
        }

        // Prioridade 3: Match por Nome (Último recurso para encomendas antigas sem ID/Email)
        if (!targetCustomer && orderName) {
            const mappedId = nameToIdMap.get(orderName);
            if (mappedId) targetCustomer = registeredMap.get(mappedId);
        }

        if (targetCustomer) {
            targetCustomer.totalSpent += orderAmount;
            targetCustomer.orderCount += 1;
            if (new Date(order.date) > new Date(targetCustomer.lastOrder)) {
                targetCustomer.lastOrder = order.date;
            }
        } else if (orderEmail || order.customerName) {
            // É um visitante (não registado ou não encontrado nas contas)
            const visitorKey = orderEmail || order.customerName || "unknown";

            if (!visitorMap.has(visitorKey)) {
                const guestData = {
                    name: order.customerName || 'Visitante',
                    email: order.customerEmail || 'Vários',
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrder: order.date,
                    isRegistered: false,
                    balance: 0
                };
                visitorMap.set(visitorKey, guestData);
                allFinalCustomers.push(guestData);
            }

            const guest = visitorMap.get(visitorKey);
            guest.totalSpent += orderAmount;
            guest.orderCount += 1;
            if (new Date(order.date) > new Date(guest.lastOrder)) {
                guest.lastOrder = order.date;
            }
        }
    });

    const customers = allFinalCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

    const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgClv = customers.length > 0 ? totalSpentAll / customers.length : 0;

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">{t('admin.customers_v.title')}</h1>
                <p className="text-slate-500 text-sm mt-1">{t('admin.customers_v.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">{t('admin.customers_v.clv_avg')}</p>
                    <p className="text-3xl font-black">{avgClv.toFixed(2)} €</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('admin.customers_v.registered')}</p>
                    <p className="text-3xl font-black text-slate-900">{(config.customers || []).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('admin.customers_v.escrow')}</p>
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
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.user')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.status')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.balance')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.total_spent')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.last_activity')}</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.customers_v.table.actions')}</th>
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
                                            <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter">{t('admin.customers_v.status.registered')}</span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-tighter">{t('admin.customers_v.status.visitor')}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold ${customer.balance > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                            {customer.balance.toFixed(2)}€
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-black text-slate-900">{customer.totalSpent.toFixed(2)}€</div>
                                        <div className="text-[10px] text-slate-400">{customer.orderCount} {t('admin.customers_v.orders_count')}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(customer.lastOrder).toLocaleDateString(i18n.language === 'pt' ? 'pt-PT' : 'en-US')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {customer.isRegistered && (
                                            <button
                                                onClick={() => {
                                                    setEditingCustomer(customer);
                                                    setNewBalance(customer.balance.toString());
                                                }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title={t('admin.customers_v.edit_balance')}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Ajuste de Saldo */}
            {editingCustomer && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">{t('admin.customers_v.adjust_balance_title')}</h3>
                            <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                                    {editingCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{editingCustomer.name}</p>
                                    <p className="text-xs text-slate-500">{editingCustomer.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        {t('admin.customers_v.table.balance')} (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newBalance}
                                        onChange={(e) => setNewBalance(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const amount = parseFloat(newBalance) || 0;
                                        const diff = amount - editingCustomer.balance;
                                        updateCustomerBalance(editingCustomer.id, diff);
                                        setEditingCustomer(null);
                                    }}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
                                >
                                    {t('admin.customers_v.save_balance')}
                                </button>

                                <button
                                    onClick={() => setEditingCustomer(null)}
                                    className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                                >
                                    {t('admin.customers_v.close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
