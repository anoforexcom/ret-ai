
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { ProductBundle } from '../../types';
import { Edit2, Plus, Trash2, Check, X, Save, Tag } from 'lucide-react';

const Products: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductBundle | null>(null);

  const handleEdit = (bundle: ProductBundle) => {
    setEditingId(bundle.id);
    setEditForm({ ...bundle });
  };

  const handleSave = () => {
    if (editForm) {
      const newBundles = config.bundles.map(b => b.id === editForm.id ? editForm : b);
      updateConfig({ bundles: newBundles });
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAddNew = () => {
    const newBundle: ProductBundle = {
      id: `bundle_${Date.now()}`,
      label: 'Novo Pacote',
      price: 10,
      photos: 1,
      savings: '',
      active: true
    };
    updateConfig({ bundles: [...config.bundles, newBundle] });
    setEditingId(newBundle.id);
    setEditForm(newBundle);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem a certeza?")) {
        const newBundles = config.bundles.filter(b => b.id !== id);
        updateConfig({ bundles: newBundles });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Produtos</h1>
            <p className="text-slate-500 text-sm mt-1">Configure os pacotes e preços visíveis na loja.</p>
        </div>
        <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 shadow-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Novo Pacote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {config.bundles.map((bundle) => (
          <div key={bundle.id} className={`bg-white rounded-xl shadow-sm border ${bundle.active ? 'border-slate-200' : 'border-slate-100 opacity-75'} overflow-hidden relative group`}>
             {bundle.popular && (
                 <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                     POPULAR
                 </div>
             )}
             
             <div className="p-6">
                {editingId === bundle.id && editForm ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Nome do Pacote</label>
                            <input 
                                type="text" 
                                value={editForm.label}
                                onChange={e => setEditForm({...editForm, label: e.target.value})}
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Preço (€)</label>
                                <input 
                                    type="number" 
                                    value={editForm.price}
                                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                                    className="w-full border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Fotos</label>
                                <input 
                                    type="number" 
                                    value={editForm.photos}
                                    onChange={e => setEditForm({...editForm, photos: Number(e.target.value)})}
                                    className="w-full border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Texto Desconto</label>
                            <input 
                                type="text" 
                                value={editForm.savings || ''}
                                onChange={e => setEditForm({...editForm, savings: e.target.value})}
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                                placeholder="ex: Poupe 50%"
                            />
                        </div>
                         <div className="flex items-center gap-4 pt-2">
                             <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                 <input 
                                    type="checkbox"
                                    checked={editForm.popular || false}
                                    onChange={e => setEditForm({...editForm, popular: e.target.checked})}
                                 />
                                 Destacar como Popular
                             </label>
                             <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                 <input 
                                    type="checkbox"
                                    checked={editForm.active}
                                    onChange={e => setEditForm({...editForm, active: e.target.checked})}
                                 />
                                 Ativo
                             </label>
                         </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-green-700">
                                <Save className="h-4 w-4" /> Guardar
                            </button>
                            <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded text-sm hover:bg-slate-300">
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${bundle.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Tag className="h-6 w-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(bundle)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(bundle.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{bundle.label}</h3>
                        <div className="flex items-baseline mt-1 gap-2">
                            <span className="text-2xl font-bold text-slate-800">{bundle.price}€</span>
                            <span className="text-sm text-slate-500">/ {bundle.photos} fotos</span>
                        </div>
                        {bundle.savings && (
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mt-3">
                                {bundle.savings}
                            </span>
                        )}
                        {!bundle.active && (
                             <span className="inline-block bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full mt-3 ml-2">
                                Inativo
                            </span>
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
