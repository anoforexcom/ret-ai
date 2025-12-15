import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Save, Plus, Trash2, CreditCard, Layout, Smartphone, Wallet } from 'lucide-react';

const StoreSettings: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'menus'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
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

  const handleApiKeyChange = (key: string, value: string) => {
      updateConfig({ 
          apiKeys: { ...config.apiKeys, [key]: value }
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
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Geral & Rodapé
            </button>
            <button 
                onClick={() => setActiveTab('payments')}
                className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'payments' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Pagamentos & API
            </button>
            <button 
                onClick={() => setActiveTab('menus')}
                className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'menus' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
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
                        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                            <Save className="h-4 w-4" /> Guardar Alterações
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="space-y-8">
                    {/* Method Toggles */}
                    <div>
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Métodos de Pagamento Ativos</h3>
                        <div className="grid gap-4 max-w-xl">
                            {config.paymentMethods.map(method => (
                                <div key={method.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-md border border-slate-200">
                                            {method.type === 'card' && <CreditCard className="h-5 w-5 text-slate-600" />}
                                            {method.type === 'mbway' && <Smartphone className="h-5 w-5 text-red-600" />}
                                            {method.type === 'paypal' && <Wallet className="h-5 w-5 text-blue-600" />}
                                        </div>
                                        <span className="font-medium text-slate-900">{method.name}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={method.enabled} 
                                            onChange={() => togglePayment(method.id)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* API Keys */}
                    <div className="max-w-xl">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Configuração de APIs de Pagamento</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Para receber pagamentos reais, insira as chaves dos provedores. Se deixar em branco, o sistema funcionará em modo de simulação (demo).
                        </p>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <label className="block text-sm font-semibold text-blue-900 mb-1">PayPal Client ID</label>
                                <p className="text-xs text-blue-700 mb-2">Encontre isto no PayPal Developer Dashboard (App & Credentials).</p>
                                <input 
                                    type="text" 
                                    value={config.apiKeys.paypalClientId || ''}
                                    onChange={(e) => handleApiKeyChange('paypalClientId', e.target.value)}
                                    placeholder="ex: AYeX8..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                <Save className="h-4 w-4" /> Guardar Chaves
                            </button>
                        </div>
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