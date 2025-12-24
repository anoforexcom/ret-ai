import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Download, Eye, X, User, CreditCard, Package, ExternalLink } from 'lucide-react';
import { Order } from '../../types';

const Orders: React.FC = () => {
  const { orders, config } = useConfig();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getCustomerDisplay = (order: Order) => {
    if (order.customerId) {
      const customer = config.customers.find(c => c.id === order.customerId);
      if (customer) return `${customer.firstName} ${customer.lastName}`;
    }
    return order.customerName || 'Visitante';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Pago / Concluído</span>;
      case 'refunded':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Reembolsado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pendente</span>;
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Encomendas</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 shadow-sm transition-all">
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getCustomerDisplay(order)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString('pt-PT')} <span className="text-slate-400 text-xs">{new Date(order.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 hover:bg-indigo-50 rounded transition-colors"
                      title="Ver Detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {order.imageUrl && (
                      <a
                        href={order.imageUrl}
                        download={`encomenda-${order.id}.png`}
                        className="text-slate-500 hover:text-green-600 inline-block p-1 hover:bg-green-50 rounded transition-colors"
                        title="Baixar Resultado"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p>Ainda não existem encomendas registadas.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                <div>
                  <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
                    Detalhes da Encomenda <span className="text-indigo-600">#{selectedOrder.id}</span>
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Realizada a {new Date(selectedOrder.date).toLocaleString('pt-PT')}</p>
                </div>
                <button
                  type="button"
                  className="bg-white rounded-md text-slate-400 hover:text-slate-500 focus:outline-none p-2 hover:bg-slate-100 transition-colors"
                  onClick={() => setSelectedOrder(null)}
                >
                  <span className="sr-only">Fechar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Left Column: Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Informação do Cliente</h4>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <User className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{getCustomerDisplay(selectedOrder)}</p>
                          <p className="text-xs text-slate-500">
                            {selectedOrder.customerId ? 'Cliente Registado' : 'Cliente Visitante (Sem Registo)'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Detalhes do Pagamento</h4>
                      <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-200">
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">Método</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900 capitalize">{selectedOrder.paymentMethod || 'Desconhecido'}</span>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">Item</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{selectedOrder.items || 'Restauração de Foto'}</span>
                        </div>
                        <div className="p-3 flex justify-between items-center bg-indigo-50">
                          <span className="text-sm font-bold text-indigo-900">Total Pago</span>
                          <span className="text-lg font-bold text-indigo-600">{selectedOrder.amount.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estado Atual</h4>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>

                  {/* Right Column: Image */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ficheiro Restaurado</h4>
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
                        <span className="text-sm">Imagem não disponível</span>
                      </div>
                    )}

                    {selectedOrder.imageUrl && (
                      <div className="mt-4 flex justify-end">
                        <a
                          href={selectedOrder.imageUrl}
                          download={`encomenda-${selectedOrder.id}.png`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Ficheiro
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
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;