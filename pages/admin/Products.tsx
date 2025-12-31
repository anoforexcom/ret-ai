
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { ProductBundle } from '../../types';
import { Edit2, Plus, Trash2, Save, Tag, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Products: React.FC = () => {
    const { config, updateConfig, addAuditLog } = useConfig();
    const { t } = useTranslation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ProductBundle | null>(null);

    const handleEdit = (bundle: ProductBundle) => {
        setEditingId(bundle.id);
        setEditForm({ ...bundle });
    };

    const handleSave = () => {
        if (editForm) {
            const currentBundles = config.bundles || [];
            const newBundles = currentBundles.map(b => b.id === editForm.id ? editForm : b);
            updateConfig({ bundles: newBundles });
            addAuditLog(t('admin.products_v.audit.edit'), `ID: ${editForm.id}, ${t('admin.products_v.audit.name')}: ${editForm.label}`);
            setEditingId(null);
            setEditForm(null);
        }
    };

    const handleAddNew = () => {
        const currentBundles = config.bundles || [];
        const newBundle: ProductBundle = {
            id: `bundle_${Date.now()}`,
            label: t('admin.products_v.new_bundle_label'),
            price: 10,
            photos: 1,
            savings: '',
            active: true
        };
        updateConfig({ bundles: [...currentBundles, newBundle] });
        addAuditLog(t('admin.products_v.audit.create'), `ID: ${newBundle.id}`);
        setEditingId(newBundle.id);
        setEditForm(newBundle);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('admin.products_v.confirm_delete'))) {
            const currentBundles = config.bundles || [];
            const newBundles = currentBundles.filter(b => b.id !== id);
            updateConfig({ bundles: newBundles });
            addAuditLog(t('admin.products_v.audit.delete'), `ID: ${id}`);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.products_v.title')}</h1>
                    <p className="text-slate-500 text-sm mt-1">{t('admin.products_v.desc')}</p>
                </div>
                <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" /> {t('admin.products_v.add_bundle')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(config.bundles || []).map((bundle) => (
                    <div key={bundle.id} className={`bg-white rounded-xl shadow-sm border transition-all ${bundle.active ? (editingId === bundle.id ? 'border-indigo-600 shadow-md' : 'border-slate-200') : 'border-slate-100 opacity-60'}`}>
                        <div className="p-6">
                            {editingId === bundle.id && editForm ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('admin.products_v.form.name')}</label>
                                        <input
                                            type="text"
                                            value={editForm.label}
                                            onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('admin.products_v.form.price')} (€)</label>
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('admin.products_v.form.photos')}</label>
                                            <input
                                                type="number"
                                                value={editForm.photos}
                                                onChange={e => setEditForm({ ...editForm, photos: Number(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 py-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                                            <input type="checkbox" checked={editForm.popular || false} onChange={e => setEditForm({ ...editForm, popular: e.target.checked })} />
                                            {t('admin.products_v.form.featured')}
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                                            <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({ ...editForm, active: e.target.checked })} />
                                            {t('admin.products_v.form.active')}
                                        </label>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                                            <Save className="h-4 w-4" /> {t('admin.products_v.form.save')}
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">
                                            {t('admin.products_v.form.cancel')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-lg ${bundle.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(bundle)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(bundle.id)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{bundle.label}</h3>
                                    <p className="text-2xl font-black text-slate-900 mt-1">{bundle.price}€</p>
                                    <p className="text-xs text-slate-500 mt-1">{bundle.photos} {t('admin.products_v.photos_included')}</p>
                                    {bundle.popular && (
                                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase">
                                            <Tag className="h-3 w-3" /> {t('admin.products_v.popular_badge')}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
