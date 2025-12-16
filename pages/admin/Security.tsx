
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Shield, Lock, FileText, Key, UserCheck } from 'lucide-react';

const Security: React.FC = () => {
  const { auditLogs, isAdmin } = useConfig();

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Segurança e Acesso</h1>
            <p className="text-slate-500 text-sm mt-1">Monitorização de atividade e controlo de permissões.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                     <Shield className="h-6 w-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900">Estado do Sistema</p>
                     <p className="text-xs text-green-600 font-medium">Seguro & Monitorizado</p>
                 </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                     <UserCheck className="h-6 w-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900">Sessão Atual</p>
                     <p className="text-xs text-slate-500">{isAdmin ? 'Administrador (Acesso Total)' : 'Visitante'}</p>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                     <Key className="h-6 w-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900">Autenticação</p>
                     <p className="text-xs text-slate-500">Senha Simples (Demo)</p>
                 </div>
             </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-400" /> Logs de Auditoria
                </h3>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Últimos 50 eventos</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Utilizador</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ação</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200 text-sm">
                        {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                    {new Date(log.date).toLocaleString('pt-PT')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                    {log.user}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700 border border-slate-200">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 max-w-md truncate">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                             <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Sem registos disponíveis.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Security;
