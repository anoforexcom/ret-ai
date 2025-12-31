import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Download, Eye, X, User, CreditCard, Package, ExternalLink, Check, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Order } from '../../types';

const Orders: React.FC = () => {
  const { orders, config } = useConfig();
  const { t, i18n } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getCustomerDisplay = (order: Order) => {
    if (order.customerId) {
      const customer = config.customers.find(c => c.id === order.customerId);
      if (customer) return `${customer.firstName} ${customer.lastName}`;
    }
    return order.customerName || t('admin.orders_v.modal.visitor');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">{t('admin.orders_v.badges.paid_completed')}</span>;
      case 'refunded':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">{t('admin.orders_v.badges.refunded')}</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">{t('admin.orders_v.badges.pending')}</span>;
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.orders_v.title')}</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 shadow-sm transition-all">
          {t('admin.orders_v.export_csv')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.id')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.customer')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.status')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.orders_v.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getCustomerDisplay(order)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString(i18n.language === 'pt' ? 'pt-PT' : 'en-US')} <span className="text-slate-400 text-xs">{new Date(order.date).toLocaleTimeString(i18n.language === 'pt' ? 'pt-PT' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                        title={t('admin.orders_v.tooltips.view_details')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {order.status !== 'completed' ? (
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin.orders_v.confirm_paid') || 'Confirmar pagamento?')) {
                              useConfig().updateOrder(order.id, 'completed');
                            }
                          }}
                          className="text-slate-400 hover:text-emerald-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                          title={t('admin.orders_v.tooltips.mark_paid')}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin.orders_v.confirm_pending') || 'Marcar como pendente?')) {
                              useConfig().updateOrder(order.id, 'pending');
                            }
                          }}
                          className="text-slate-400 hover:text-amber-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                          title={t('admin.orders_v.tooltips.mark_pending')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(t('admin.orders_v.confirm_delete') || 'Eliminar esta encomenda permanentemente?')) {
                            useConfig().deleteOrder(order.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                        title={t('admin.orders_v.tooltips.delete_order')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500">{t('admin.orders_v.no_orders')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setSelectedOrder(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">

              {/* Modal Header */}
              <div className="bg-slate-50 px-4 py-4 sm:px-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t('admin.orders_v.modal.details_title')}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t('admin.orders_v.modal.performed_at')} {new Date(selectedOrder.date).toLocaleString(i18n.language === 'pt' ? 'pt-PT' : 'en-US')}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('admin.orders_v.modal.customer_info')}</h4>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</p>
                              <p className="text-xs text-slate-500">{selectedOrder.customerEmail || 'n/a'}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {selectedOrder.customerId ? t('admin.orders_v.modal.registered') : t('admin.orders_v.modal.visitor')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('admin.orders_v.modal.payment_details')}</h4>
                        <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-200">
                          <div className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{t('admin.orders_v.modal.method')}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 capitalize">{selectedOrder.paymentMethod || t('admin.orders_v.modal.unknown')}</span>
                          </div>
                          <div className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{t('admin.orders_v.modal.item')}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">{selectedOrder.items || t('admin.standard_restoration')}</span>
                          </div>
                          <div className="p-3 flex justify-between items-center bg-indigo-50">
                            <span className="text-sm font-bold text-indigo-900">{t('admin.orders_v.modal.total_paid')}</span>
                            <span className="text-lg font-bold text-indigo-600">{selectedOrder.amount.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('admin.orders_v.modal.current_status')}</h4>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>

                    {/* Right Column: Image */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('admin.orders_v.modal.restored_file')}</h4>
                      {selectedOrder.imageUrl ? (
                        <div className="group relative bg-slate-100 rounded-lg border border-slate-200 overflow-hidden aspect-[4/3] flex items-center justify-center">
                          <img
                            src={selectedOrder.imageUrl}
                            alt="Resultado"
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <a
                              href={selectedOrder.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-full hover:bg-indigo-50 transition-colors"
                              title="Abrir no navegador"
                            >
                              <ExternalLink className="h-5 w-5 text-slate-900" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                          <Package className="h-8 w-8 mb-2 opacity-50" />
                          <span className="text-sm">{t('admin.orders_v.modal.image_not_available')}</span>
                        </div>
                      )}

                      {selectedOrder.imageUrl && (
                        <div className="mt-4 flex justify-end">
                          <a
                            href={selectedOrder.imageUrl}
                            download={`order-${selectedOrder.id}.png`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t('admin.orders_v.modal.download_file')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    {t('admin.orders_v.modal.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;