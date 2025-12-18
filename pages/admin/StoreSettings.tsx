
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Save, Plus, Trash2, CreditCard, Layout, Smartphone, Wallet, Palette, Type, Box, Settings2, Globe, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../types';

const StoreSettings: React.FC = () => {
  const { config, updateConfig, addAuditLog } = useConfig();
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'menus' | 'design'>('general');
  const [saved, setSaved] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    addAuditLog('Configurações Atualizadas', `Separador: ${activeTab}`);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMenuChange = (menuType: 'mainMenu' | 'footerMenu', index: number, field: 'label' | 'path', value: string) => {
    const newMenu = [...config[menuType]];
    newMenu[index] = { ...newMenu[index], [field]: value };
    updateConfig({ [menuType]: newMenu });
  };

  const addMenuItem = (menuType: 'mainMenu' | 'footerMenu') => {
    const newMenu = [...config[menuType], { id: Date.now().toString(), label: 'Novo Link', path: '/' }];
    updateConfig({ [menuType]: newMenu });
  };

  const removeMenuItem = (menuType: 'mainMenu' | 'footerMenu', index: number) => {
    const newMenu = config[menuType].filter((_, i) => i !== index);
    updateConfig({ [menuType]: newMenu });
  };

  const togglePayment = (id: string) => {
    const newPayments = config.paymentMethods.map(p => 
        p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    updateConfig({ paymentMethods: newPayments });
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      name: 'Novo Método',
      enabled: false,
      type: 'card',
      provider: 'manual',
      environment: 'sandbox'
    };
    updateConfig({ paymentMethods: [...config.paymentMethods, newMethod] });
    setEditingPaymentId(newMethod.id);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    const newPayments = config.paymentMethods.map(p => p.id === id ? { ...p, ...updates } : p);
    updateConfig({ paymentMethods: newPayments });
  };

  const removePaymentMethod = (id: string) => {
    if (window.confirm('Eliminar este método de pagamento permanentemente?')) {
      const newPayments = config.paymentMethods.filter(p => p.id !== id);
      updateConfig({ paymentMethods: newPayments });
      addAuditLog('Remover Pagamento', `ID: ${id}`);
    }
  };

  const handleThemeChange = (field: keyof typeof config.theme, value: string) => {
    updateConfig({
      theme: { ...config.theme, [field]: value }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configurações da Loja</h1>
        {saved && (
            <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Alterações guardadas!
            </span>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
            <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Geral & Rodapé
            </button>
            <button 
                onClick={() => setActiveTab('design')}
                className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'design' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Design & Grafismo
            </button>
            <button 
                onClick={() => setActiveTab('payments')}
                className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'payments' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Pagamentos & API
            </button>
            <button 
                onClick={() => setActiveTab('menus')}
                className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'menus' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Menus de Navegação
            </button>
        </div>

        <div className="p-6">
            {activeTab === 'general' && (
                <div className="space-y-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Loja</label>
                        <input 
                            type="text" 
                            value={config.storeName}
                            onChange={(e) => updateConfig({ storeName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título Hero (Página Inicial)</label>
                        <input 
                            type="text" 
                            value={config.heroTitle}
                            onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subtítulo Hero</label>
                        <textarea 
                            value={config.heroSubtitle}
                            onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Texto do Rodapé</label>
                        <textarea 
                            value={config.footerText}
                            onChange={(e) => updateConfig({ footerText: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="pt-4">
                        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            <Save className="h-4 w-4" /> Guardar Alterações
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-10 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-indigo-600" /> Identidade Visual
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cor Primária (Marca)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={config.theme.primaryColor}
                          onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                          className="h-10 w-20 border-none cursor-pointer rounded overflow-hidden"
                        />
                        <input 
                          type="text" 
                          value={config.theme.primaryColor}
                          onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cor Secundária (Gradients)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={config.theme.secondaryColor}
                          onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                          className="h-10 w-20 border-none cursor-pointer rounded overflow-hidden"
                        />
                        <input 
                          type="text" 
                          value={config.theme.secondaryColor}
                          onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Box className="h-5 w-5 text-indigo-600" /> Estilo dos Elementos
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Arredondamento Global (Radius)</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { label: 'Nenhum', value: '0px' },
                        { label: 'Suave', value: '4px' },
                        { label: 'Padrão', value: '8px' },
                        { label: 'Redondo', value: '16px' },
                        { label: 'Extra', value: '24px' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleThemeChange('borderRadius', opt.value)}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                            config.theme.borderRadius === opt.value 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Type className="h-5 w-5 text-indigo-600" /> Tipografia
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Família de Fontes</label>
                    <select
                      value={config.theme.fontFamily}
                      onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Inter">Inter (Padrão Moderno)</option>
                      <option value="serif">Serif (Clássico/Elegante)</option>
                      <option value="mono">Monospaced (Técnico)</option>
                      <option value="sans-serif">System Sans-Serif</option>
                    </select>
                  </div>
                </div>

                <div className="pt-8">
                  <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                    <Save className="h-5 w-5" /> Aplicar Grafismo
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Settings2 className="h-5 w-5 text-indigo-600" /> Métodos & Provedores
                        </h3>
                        <button 
                          onClick={handleAddPaymentMethod}
                          className="text-sm font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                        >
                          <Plus className="h-4 w-4" /> Novo Método
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {config.paymentMethods.map(method => (
                            <div key={method.id} className={`p-6 border rounded-2xl transition-all ${editingPaymentId === method.id ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 rounded-xl">
                                            {method.type === 'card' && <CreditCard className="h-6 w-6 text-slate-600" />}
                                            {method.type === 'mbway' && <Smartphone className="h-6 w-6 text-red-600" />}
                                            {method.type === 'paypal' && <Wallet className="h-6 w-6 text-blue-600" />}
                                            {method.type === 'multibanco' && <Box className="h-6 w-6 text-indigo-600" />}
                                        </div>
                                        <div>
                                          <input 
                                            type="text" 
                                            value={method.name}
                                            onChange={(e) => updatePaymentMethod(method.id, { name: e.target.value })}
                                            className="text-lg font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-48"
                                            placeholder="Nome do Método"
                                          />
                                          <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                                            {method.provider.toUpperCase()} • {method.environment?.toUpperCase() || 'SANDBOX'}
                                          </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => setEditingPaymentId(editingPaymentId === method.id ? null : method.id)}
                                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                                      >
                                        <Settings2 className="h-5 w-5" />
                                      </button>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                          <input 
                                              type="checkbox" 
                                              checked={method.enabled} 
                                              onChange={() => togglePayment(method.id)}
                                              className="sr-only peer" 
                                          />
                                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                      </label>
                                      <button onClick={() => removePaymentMethod(method.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-2">
                                        <Trash2 className="h-5 w-5" />
                                      </button>
                                    </div>
                                </div>

                                {editingPaymentId === method.id && (
                                  <div className="pt-6 border-t border-slate-200/50 space-y-6 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Provedor / Gateway</label>
                                        <select 
                                          value={method.provider}
                                          onChange={(e) => updatePaymentMethod(method.id, { provider: e.target.value as any })}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        >
                                          <option value="stripe">Stripe</option>
                                          <option value="paypal">PayPal</option>
                                          <option value="sibs">SIBS (MB Way / Multibanco)</option>
                                          <option value="adyen">Adyen</option>
                                          <option value="manual">Simulação / Manual</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ambiente</label>
                                        <select 
                                          value={method.environment}
                                          onChange={(e) => updatePaymentMethod(method.id, { environment: e.target.value as any })}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        >
                                          <option value="sandbox">Sandbox / Testes</option>
                                          <option value="live">Live / Produção</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Pagamento</label>
                                        <select 
                                          value={method.type}
                                          onChange={(e) => updatePaymentMethod(method.id, { type: e.target.value as any })}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        >
                                          <option value="card">Cartão (Visa/Mastercard)</option>
                                          <option value="paypal">PayPal Wallet</option>
                                          <option value="mbway">MB Way</option>
                                          <option value="multibanco">Multibanco (Referência)</option>
                                          <option value="apple_pay">Apple Pay / Google Pay</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      {method.provider !== 'manual' && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                          <h4 className="text-xs font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-green-500" /> Credenciais do Gateway
                                          </h4>
                                          <div className="space-y-4">
                                            <div>
                                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Public Key / Client ID</label>
                                              <input 
                                                type="text" 
                                                value={method.clientId || ''}
                                                onChange={(e) => updatePaymentMethod(method.id, { clientId: e.target.value })}
                                                placeholder="ex: pk_test_..."
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                              />
                                            </div>
                                            {method.provider !== 'paypal' && (
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Secret Key (Apenas p/ Referência)</label>
                                                <input 
                                                  type="password" 
                                                  value={method.apiKey || ''}
                                                  onChange={(e) => updatePaymentMethod(method.id, { apiKey: e.target.value })}
                                                  placeholder="••••••••••••••••"
                                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => setEditingPaymentId(null)}
                                          className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-50"
                                        >
                                          Fechar Configuração
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6">
                        <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                            <Save className="h-5 w-5" /> Guardar Todos os Métodos
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'menus' && (
                <div className="space-y-10">
                    {/* Main Menu */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                                <Layout className="h-4 w-4" /> Menu Principal
                            </h3>
                            <button onClick={() => addMenuItem('mainMenu')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                <Plus className="h-4 w-4" /> Adicionar Link
                            </button>
                        </div>
                        <div className="space-y-3">
                            {config.mainMenu.map((item, idx) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <input 
                                        type="text" 
                                        value={item.label}
                                        onChange={(e) => handleMenuChange('mainMenu', idx, 'label', e.target.value)}
                                        placeholder="Nome"
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    />
                                    <input 
                                        type="text" 
                                        value={item.path}
                                        onChange={(e) => handleMenuChange('mainMenu', idx, 'path', e.target.value)}
                                        placeholder="/caminho"
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500"
                                    />
                                    <button onClick={() => removeMenuItem('mainMenu', idx)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-100"></div>

                    {/* Footer Menu */}
                    <div>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                                <Layout className="h-4 w-4" /> Menu Rodapé
                            </h3>
                            <button onClick={() => addMenuItem('footerMenu')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                <Plus className="h-4 w-4" /> Adicionar Link
                            </button>
                        </div>
                        <div className="space-y-3">
                            {config.footerMenu.map((item, idx) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <input 
                                        type="text" 
                                        value={item.label}
                                        onChange={(e) => handleMenuChange('footerMenu', idx, 'label', e.target.value)}
                                        placeholder="Nome"
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    />
                                    <input 
                                        type="text" 
                                        value={item.path}
                                        onChange={(e) => handleMenuChange('footerMenu', idx, 'path', e.target.value)}
                                        placeholder="/caminho"
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500"
                                    />
                                    <button onClick={() => removeMenuItem('footerMenu', idx)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
