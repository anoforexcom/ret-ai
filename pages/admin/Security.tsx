
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Shield, Lock, FileText, Key, UserCheck, Users, UserPlus, Trash2, Mail, ShieldAlert, BadgeCheck, Clock } from 'lucide-react';
import { StoreMember, MemberRole } from '../../types';

const Security: React.FC = () => {
  const { auditLogs, isAdmin, config, updateConfig, addAuditLog } = useConfig();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<Omit<StoreMember, 'id' | 'status' | 'addedAt'>>({
    name: '',
    email: '',
    role: 'manager'
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const newMember: StoreMember = {
      id: `m_${Date.now()}`,
      ...inviteForm,
      status: 'invited',
      addedAt: new Date().toISOString()
    };

    updateConfig({
      members: [...(config.members || []), newMember]
    });

    addAuditLog('Convidar Membro', `Utilizador ${newMember.email} convidado como ${newMember.role}`);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'manager' });
  };

  const removeMember = (id: string) => {
    if (window.confirm('Tem a certeza que deseja remover este membro da equipa?')) {
      const updatedMembers = config.members.filter(m => m.id !== id);
      updateConfig({ members: updatedMembers });
      addAuditLog('Remover Membro', `ID: ${id}`);
    }
  };

  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case 'owner': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-purple-200">Proprietário</span>;
      case 'admin': return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-indigo-200">Administrador</span>;
      case 'manager': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-blue-200">Gestor</span>;
      case 'viewer': return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-slate-200">Visualizador</span>;
    }
  };

  const getRolePermissions = (role: MemberRole) => {
    switch (role) {
      case 'owner': return 'Acesso total a todas as funcionalidades e configurações.';
      case 'admin': return 'Gestão de encomendas, produtos e utilizadores. Sem acesso à eliminação da loja.';
      case 'manager': return 'Gestão de encomendas e produtos. Acesso limitado a configurações.';
      case 'viewer': return 'Apenas visualização de dados e estatísticas. Sem permissão de edição.';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Segurança e Acesso</h1>
                <p className="text-slate-500 text-sm mt-1">Monitorização de atividade e controlo de permissões da equipa.</p>
            </div>
            <button 
                onClick={() => setShowInviteModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
                <UserPlus className="h-4 w-4" /> Convidar Membro
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                     <Shield className="h-6 w-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900">Estado do Sistema</p>
                     <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <BadgeCheck className="h-3 w-3" /> Seguro & Monitorizado
                     </p>
                 </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                     <UserCheck className="h-6 w-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900">Equipa Ativa</p>
                     <p className="text-xs text-slate-500">{config.members?.length || 1} membros registados</p>
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

        {/* Team Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" /> Gestão de Equipa
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Membro</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo / Função</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Adicionado em</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {config.members?.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        {getRoleBadge(member.role)}
                                        <span className="text-[9px] text-slate-400 max-w-[150px] leading-tight">
                                            {getRolePermissions(member.role)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {member.status === 'active' ? (
                                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Ativo
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Convidado
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                                    {new Date(member.addedAt).toLocaleDateString('pt-PT')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {member.role !== 'owner' && (
                                        <button 
                                            onClick={() => removeMember(member.id)}
                                            className="text-slate-300 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Audit Logs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-400" /> Logs de Auditoria
                </h3>
                <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">Tempo Real</span>
            </div>
            
            <div className="overflow-x-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Utilizador</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ação</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                                    {new Date(log.date).toLocaleString('pt-PT')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-slate-900">{log.user}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 border border-slate-200 uppercase">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500 max-w-md truncate">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                             <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                    Aguardando atividade do sistema...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}></div>
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                    <div className="bg-indigo-600 p-6 text-white">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <UserPlus className="h-6 w-6" /> Convidar para Equipa
                        </h3>
                        <p className="text-indigo-100 text-sm mt-1">O novo membro receberá um email de acesso.</p>
                    </div>
                    
                    <form onSubmit={handleInvite} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                            <input 
                                type="text" 
                                required
                                value={inviteForm.name}
                                onChange={e => setInviteForm({...inviteForm, name: e.target.value})}
                                placeholder="ex: João Silva"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Profissional</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="email" 
                                    required
                                    value={inviteForm.email}
                                    onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                                    placeholder="email@empresa.com"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cargo & Permissões</label>
                            <div className="relative">
                                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <select 
                                    value={inviteForm.role}
                                    onChange={e => setInviteForm({...inviteForm, role: e.target.value as MemberRole})}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                                >
                                    <option value="admin">Administrador (Quase Total)</option>
                                    <option value="manager">Gestor (Operações)</option>
                                    <option value="viewer">Visualizador (Leitura)</option>
                                </select>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic">
                                {getRolePermissions(inviteForm.role as MemberRole)}
                            </p>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="flex-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                            >
                                Enviar Convite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Security;
