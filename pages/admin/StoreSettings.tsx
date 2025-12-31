
import React, { useState, useRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Save, Plus, Trash2, CreditCard, Layout, Smartphone, Wallet, Palette, Type, Box, Settings2, Globe, ShieldCheck, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PaymentMethod } from '../../types';

const StoreSettings: React.FC = () => {
  const { config, updateConfig, addAuditLog, syncStatus } = useConfig();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'menus' | 'design'>('general');
  const [saved, setSaved] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const compBeforeInputRef = useRef<HTMLInputElement>(null);
  const compAfterInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    addAuditLog(t('admin.settings_v.audit.updated'), `${t('admin.settings_v.audit.tab')}: ${activeTab}`);
    setTimeout(() => setSaved(false), 2000);
  };

  // Função auxiliar para redimensionar imagens antes de guardar (evita exceder limite do Firestore/LocalStorage)
  const resizeImageForStore = (base64Str: string, maxDimension: number = 1200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64Str;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after' | 'comp_before' | 'comp_after') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t('admin.settings_v.file_too_large'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        let base64String = reader.result as string;

        // Redimensionar para garantir que cabe no Firestore (limite 1MB por doc)
        base64String = await resizeImageForStore(base64String);

        if (type === 'before') {
          updateConfig({ heroBeforeImage: base64String });
        } else if (type === 'after') {
          updateConfig({ heroAfterImage: base64String });
        } else if (type === 'comp_before') {
          updateConfig({ comparisonBeforeImage: base64String });
        } else if (type === 'comp_after') {
          updateConfig({ comparisonAfterImage: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuChange = (menuType: 'mainMenu' | 'footerMenu', index: number, field: 'label' | 'path', value: string) => {
    const currentMenu = config[menuType] || [];
    const newMenu = [...currentMenu];
    if (newMenu[index]) {
      newMenu[index] = { ...newMenu[index], [field]: value };
      updateConfig({ [menuType]: newMenu });
    }
  };

  const addMenuItem = (menuType: 'mainMenu' | 'footerMenu') => {
    const currentMenu = config[menuType] || [];
    const newMenu = [...currentMenu, { id: Date.now().toString(), label: t('admin.settings_v.new_link_label'), path: '/' }];
    updateConfig({ [menuType]: newMenu });
  };

  const removeMenuItem = (menuType: 'mainMenu' | 'footerMenu', index: number) => {
    const currentMenu = config[menuType] || [];
    const newMenu = currentMenu.filter((_, i) => i !== index);
    updateConfig({ [menuType]: newMenu });
    addAuditLog('Remover Link Menu', `Menu: ${menuType}, Posição: ${index}`);
  };

  const togglePayment = (id: string) => {
    const currentPayments = config.paymentMethods || [];
    const newPayments = currentPayments.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    updateConfig({ paymentMethods: newPayments });
  };

  const handleAddPaymentMethod = () => {
    const currentPayments = config.paymentMethods || [];
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      name: t('admin.settings_v.payments.new_method'),
      enabled: false,
      type: 'card',
      provider: 'manual',
      environment: 'sandbox'
    };
    updateConfig({ paymentMethods: [...currentPayments, newMethod] });
    setEditingPaymentId(newMethod.id);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    const currentPayments = config.paymentMethods || [];
    const newPayments = currentPayments.map(p => p.id === id ? { ...p, ...updates } : p);
    updateConfig({ paymentMethods: newPayments });
  };

  const removePaymentMethod = (id: string) => {
    if (window.confirm(t('admin.settings_v.confirm_delete_payment'))) {
      const currentPayments = config.paymentMethods || [];
      const newPayments = currentPayments.filter(p => p.id !== id);
      updateConfig({ paymentMethods: newPayments });
      addAuditLog('Remover Pagamento', `ID: ${id}`);
    }
  };

  const handleThemeChange = (field: keyof typeof config.theme, value: string) => {
    updateConfig({
      theme: { ...config.theme, [field]: value }
    });
  };

  const handleSocialChange = (field: keyof typeof config.socialLinks, value: string) => {
    updateConfig({
      socialLinks: { ...config.socialLinks, [field]: value }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.settings_v.title')}</h1>
          {syncStatus === 'connected' ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 border border-green-100 text-green-600 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" /> {t('admin.settings_v.sync_active')}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-wider">
              <AlertCircle className="h-3.5 w-3.5" /> {t('admin.settings_v.sync_local')}
            </div>
          )}
        </div>
        {saved && (
          <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            {t('admin.settings_v.saved')}
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
            {t('admin.settings_v.tabs.general')}
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'design' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('admin.settings_v.tabs.design')}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'payments' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('admin.settings_v.tabs.payments')}
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center ${activeTab === 'menus' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('admin.settings_v.tabs.menus')}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.general.basic_info')}
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.settings_v.general.store_name')}</label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => updateConfig({ storeName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.settings_v.general.hero_title')}</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.general.hero_images')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.settings_v.general.image_before')}</label>
                    <div
                      onClick={() => beforeInputRef.current?.click()}
                      className="mt-2 h-40 w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group overflow-hidden"
                    >
                      {config.heroBeforeImage ? (
                        <img src={config.heroBeforeImage} alt="Preview Antes" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 mb-2" />
                          <span className="text-xs text-slate-400 font-bold group-hover:text-indigo-600">{t('admin.settings_v.general.upload_before')}</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={beforeInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'before')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Imagem "Depois"</label>
                    <div
                      onClick={() => afterInputRef.current?.click()}
                      className="mt-2 h-40 w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group overflow-hidden"
                    >
                      {config.heroAfterImage ? (
                        <img src={config.heroAfterImage} alt="Preview Depois" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 mb-2" />
                          <span className="text-xs text-slate-400 font-bold group-hover:text-indigo-600">{t('admin.settings_v.general.upload_after')}</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={afterInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'after')}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.general.second_comparison')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.settings_v.general.image_before')}</label>
                    <div
                      onClick={() => compBeforeInputRef.current?.click()}
                      className="mt-2 h-40 w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group overflow-hidden"
                    >
                      {config.comparisonBeforeImage ? (
                        <img src={config.comparisonBeforeImage} alt="Preview Comp Antes" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 mb-2" />
                          <span className="text-xs text-slate-400 font-bold group-hover:text-indigo-600">{t('admin.settings_v.general.upload_before')}</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={compBeforeInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'comp_before')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Imagem "Depois"</label>
                    <div
                      onClick={() => compAfterInputRef.current?.click()}
                      className="mt-2 h-40 w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group overflow-hidden"
                    >
                      {config.comparisonAfterImage ? (
                        <img src={config.comparisonAfterImage} alt="Preview Comp Depois" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 mb-2" />
                          <span className="text-xs text-slate-400 font-bold group-hover:text-indigo-600">{t('admin.settings_v.general.upload_after')}</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={compAfterInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'comp_after')}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.settings_v.general.footer_text')}</label>
                <textarea
                  value={config.footerText}
                  onChange={(e) => updateConfig({ footerText: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.general.social_networks')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facebook</label>
                    <input
                      type="text"
                      value={config.socialLinks?.facebook || ''}
                      onChange={(e) => handleSocialChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/suapagina"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instagram</label>
                    <input
                      type="text"
                      value={config.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/seuperfil"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TikTok</label>
                    <input
                      type="text"
                      value={config.socialLinks?.tiktok || ''}
                      onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                      placeholder="https://tiktok.com/@seuusuario"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                  <Save className="h-4 w-4" /> {t('admin.settings_v.general.save_btn')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-10 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.design.visual_identity')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.settings_v.design.primary_color')}</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.settings_v.design.secondary_color')}</label>
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
                  <Box className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.design.element_style')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.settings_v.design.radius_global')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { label: t('admin.settings_v.design.radius_options.none'), value: '0px' },
                      { label: t('admin.settings_v.design.radius_options.soft'), value: '4px' },
                      { label: t('admin.settings_v.design.radius_options.default'), value: '8px' },
                      { label: t('admin.settings_v.design.radius_options.round'), value: '16px' },
                      { label: t('admin.settings_v.design.radius_options.extra'), value: '24px' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleThemeChange('borderRadius', opt.value)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${config.theme.borderRadius === opt.value
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
                  <Type className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.design.typography')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.settings_v.design.font_family')}</label>
                  <select
                    value={config.theme.fontFamily}
                    onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Inter">{t('admin.settings_v.design.font_options.inter')}</option>
                    <option value="serif">{t('admin.settings_v.design.font_options.serif')}</option>
                    <option value="mono">{t('admin.settings_v.design.font_options.mono')}</option>
                    <option value="sans-serif">{t('admin.settings_v.design.font_options.system')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-8">
                <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                  <Save className="h-5 w-5" /> {t('admin.settings_v.design.apply_btn')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-indigo-600" /> {t('admin.settings_v.payments.methods_providers')}
                </h3>
                <button
                  onClick={handleAddPaymentMethod}
                  className="text-sm font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  <Plus className="h-4 w-4" /> {t('admin.settings_v.payments.new_method')}
                </button>
              </div>

              <div className="grid gap-6">
                {(config.paymentMethods || []).map(method => (
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
                        <button onClick={() => removePaymentMethod(method.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-2 p-2 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {editingPaymentId === method.id && (
                      <div className="pt-6 border-t border-slate-200/50 space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('admin.settings_v.payments.provider_gateway')}</label>
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
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('admin.settings_v.payments.environment')}</label>
                            <select
                              value={method.environment}
                              onChange={(e) => updatePaymentMethod(method.id, { environment: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                              <option value="sandbox">{t('admin.settings_v.payments.env_options.sandbox')}</option>
                              <option value="live">{t('admin.settings_v.payments.env_options.live')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('admin.settings_v.payments.payment_type')}</label>
                            <select
                              value={method.type}
                              onChange={(e) => updatePaymentMethod(method.id, { type: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                              <option value="card">{t('admin.settings_v.payments.card')}</option>
                              <option value="paypal">{t('admin.settings_v.payments.paypal_wallet')}</option>
                              <option value="mbway">{t('admin.settings_v.payments.mbway')}</option>
                              <option value="multibanco">{t('admin.settings_v.payments.multibanco')}</option>
                              <option value="apple_pay">{t('admin.settings_v.payments.apple_google_pay')}</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {method.provider !== 'manual' && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                              <h4 className="text-xs font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" /> {t('admin.settings_v.payments.gateway_credentials')}
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('admin.settings_v.payments.public_key')} / Client ID</label>
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
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('admin.settings_v.payments.secret_key')}</label>
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
                              {t('admin.settings_v.payments.close_config')}
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
                  <Save className="h-5 w-5" /> {t('admin.settings_v.payments.save_all_btn')}
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
                    <Layout className="h-4 w-4" /> {t('admin.settings_v.menus.main_menu')}
                  </h3>
                  <button onClick={() => addMenuItem('mainMenu')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <Plus className="h-4 w-4" /> {t('admin.settings_v.menus.add_link')}
                  </button>
                </div>
                <div className="space-y-3">
                  {(config.mainMenu || []).map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center animate-fadeIn">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleMenuChange('mainMenu', idx, 'label', e.target.value)}
                        placeholder={t('admin.settings_v.menus.link_name')}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => handleMenuChange('mainMenu', idx, 'path', e.target.value)}
                        placeholder="/caminho"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500"
                      />
                      <button onClick={() => removeMenuItem('mainMenu', idx)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
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
                    <Layout className="h-4 w-4" /> {t('admin.settings_v.menus.footer_menu')}
                  </h3>
                  <button onClick={() => addMenuItem('footerMenu')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <Plus className="h-4 w-4" /> {t('admin.settings_v.menus.add_link')}
                  </button>
                </div>
                <div className="space-y-3">
                  {(config.footerMenu || []).map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center animate-fadeIn">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleMenuChange('footerMenu', idx, 'label', e.target.value)}
                        placeholder={t('admin.settings_v.menus.link_name')}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => handleMenuChange('footerMenu', idx, 'path', e.target.value)}
                        placeholder="/caminho"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500"
                      />
                      <button onClick={() => removeMenuItem('footerMenu', idx)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
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
