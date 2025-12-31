
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    Shield,
    Lock,
    FileText,
    Key,
    UserCheck,
    Users,
    UserPlus,
    Trash2,
    Mail,
    ShieldAlert,
    BadgeCheck,
    Clock,
    Eye,
    EyeOff,
    Save,
    CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StoreMember, MemberRole } from '../../types';

const Security: React.FC = () => {
    const { auditLogs, config, updateConfig, addAuditLog } = useConfig();
    const { t, i18n } = useTranslation();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [inviteForm, setInviteForm] = useState<Omit<StoreMember, 'id' | 'status' | 'addedAt'>>({
        name: '',
        email: '',
        role: 'manager'
    });

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 4) return;

        updateConfig({ adminPassword: newPassword });
        addAuditLog('Alteração de Senha', 'Senha mestra do painel administrativo atualizada pelo utilizador.');

        setPasswordSuccess(true);
        setNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteForm.name || !inviteForm.email) return;

        const currentMembers = config.members || [];
        const newMember: StoreMember = {
            id: `m_${Date.now()}`,
            ...inviteForm,
            status: 'invited',
            addedAt: new Date().toISOString()
        };

        updateConfig({
            members: [...currentMembers, newMember]
        });

        addAuditLog('Convidar Membro', `Utilizador ${newMember.email} convidado como ${newMember.role}`);
        setShowInviteModal(false);
        setInviteForm({ name: '', email: '', role: 'manager' });
    };

    const removeMember = (id: string) => {
        if (window.confirm('Tem a certeza que deseja remover este membro da equipa?')) {
            const currentMembers = config.members || [];
            const updatedMembers = currentMembers.filter(m => m.id !== id);
            updateConfig({ members: updatedMembers });
            addAuditLog('Remover Membro', `ID: ${id}`);
        }
    };

    const getRoleBadge = (role: MemberRole) => {
        switch (role) {
            case 'owner': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-purple-200">{t('admin.security_v.roles.owner')}</span>;
            case 'admin': return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-indigo-200">{t('admin.security_v.roles.admin')}</span>;
            case 'manager': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-blue-200">{t('admin.security_v.roles.manager')}</span>;
            case 'viewer': return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-slate-200">{t('admin.security_v.roles.viewer')}</span>;
        }
    };

    const getRolePermissions = (role: MemberRole) => {
        switch (role) {
            case 'owner': return t('admin.security_v.roles.perms_owner');
            case 'admin': return t('admin.security_v.roles.perms_admin');
            case 'manager': return t('admin.security_v.roles.perms_manager');
            case 'viewer': return t('admin.security_v.roles.perms_viewer');
            default: return "";
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.security_v.title')}</h1>
                    <p className="text-slate-500 text-sm mt-1">{t('admin.security_v.desc')}</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <UserPlus className="h-5 w-5" /> {t('admin.security_v.invite_btn')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Estado</p>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <BadgeCheck className="h-3 w-3" /> Monitorizado
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Equipa</p>
                        <p className="text-xs text-slate-500">{(config.members || []).length} ativos</p>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Key className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Segurança da Conta</p>
                            <p className="text-xs text-slate-500">Última alteração: Recentemente</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <ShieldAlert className="h-4 w-4" /> 2FA Não Ativo
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Password Management */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-indigo-600" /> {t('admin.security_v.change_pw.title')}
                        </h3>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            {t('admin.security_v.change_pw.desc')}
                        </p>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('admin.security_v.change_pw.label')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                                    placeholder={t('admin.security_v.change_pw.placeholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={newPassword.length < 4}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${newPassword.length >= 4
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Save className="h-4 w-4" /> {t('admin.security_v.change_pw.btn')}
                        </button>

                        {passwordSuccess && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 p-2 rounded-lg border border-green-100 animate-fadeIn">
                                <CheckCircle className="h-4 w-4" /> {t('admin.security_v.change_pw.success')}
                            </div>
                        )}
                    </form>
                </div>

                {/* Team Management Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" /> {t('admin.security_v.team.title')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.team.table.member')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.team.table.role')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.team.table.status')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.team.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {(config.members || []).map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50 transition-colors animate-fadeIn">
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
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {member.status === 'active' ? (
                                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> {t('admin.security_v.team.status.active')}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {t('admin.security_v.team.status.invited')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {member.role !== 'owner' && (
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                                                    title={t('admin.security_v.team.remove_tooltip')}
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
            </div>

            {/* Audit Logs Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-400" /> {t('admin.security_v.audit.title')}
                    </h3>
                    <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">{t('admin.security_v.audit.real_time')}</span>
                </div>

                <div className="overflow-x-auto max-h-[400px]">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.audit.table.datetime')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.audit.table.user')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.audit.table.action')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.security_v.audit.table.details')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors animate-fadeIn">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                                        {new Date(log.date).toLocaleString(i18n.language === 'pt' ? 'pt-PT' : 'en-US')}
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
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                        {t('admin.security_v.audit.no_logs')}
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
                                <UserPlus className="h-6 w-6" /> {t('admin.security_v.modal.title')}
                            </h3>
                            <p className="text-indigo-100 text-sm mt-1">{t('admin.security_v.modal.desc')}</p>
                        </div>

                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.security_v.modal.full_name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={inviteForm.name}
                                    onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                                    placeholder={t('admin.security_v.modal.name_placeholder')}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.security_v.modal.email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        placeholder="email@empresa.com"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.security_v.modal.role_perms')}</label>
                                <div className="relative">
                                    <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        value={inviteForm.role}
                                        onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as MemberRole })}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                                    >
                                        <option value="admin">{t('admin.security_v.roles.admin')} (Quase Total)</option>
                                        <option value="manager">{t('admin.security_v.roles.manager')} (Operações)</option>
                                        <option value="viewer">{t('admin.security_v.roles.viewer')} (Leitura)</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 italic font-medium">
                                    {getRolePermissions(inviteForm.role as MemberRole)}
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    {t('admin.security_v.modal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                                >
                                    {t('admin.security_v.modal.confirm')}
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
