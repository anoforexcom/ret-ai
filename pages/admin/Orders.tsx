import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Download, Eye } from 'lucide-react';

const Orders: React.FC = () => {
  const { orders } = useConfig();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Encomendas</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
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
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString('pt-PT')} {new Date(order.date).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{order.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'refunded' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Pago' : order.status === 'refunded' ? 'Reembolsado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3" title="Ver Detalhes">
                        <Eye className="h-4 w-4" />
                    </button>
                    {order.imageUrl && (
                        <a href={order.imageUrl} download className="text-slate-500 hover:text-slate-800" title="Baixar Resultado">
                            <Download className="h-4 w-4" />
                        </a>
                    )}
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

export default Orders;