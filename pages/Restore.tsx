
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Download, AlertCircle, ImageIcon, Wand2, Sparkles, Key, ExternalLink } from 'lucide-react';
import { AppStatus } from '../types';
import { restoreImage } from '../services/geminiService';
import PaymentModal from '../components/PaymentModal';
import { useConfig } from '../contexts/ConfigContext';

// Define interface for AI Studio functions with a unique name to avoid naming collisions.
interface AIStudioSDK {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

// Declaração global para as funções da AI Studio. 
declare global {
  interface Window {
    // Fixed: Added readonly modifier to match potential existing environment declarations and used unique interface name.
    readonly aistudio: AIStudioSDK;
  }
}

const Restore: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(false);
  
  const { addOrder, currentCustomer } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume the key selection was successful as per guidelines to avoid race conditions.
      setHasKey(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("O ficheiro é demasiado grande. Máximo 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRestoredUrl(null);
      setError(null);
      setStatus(AppStatus.IDLE);
    }
  };

  const startAI = async () => {
    if (!selectedFile) return;

    if (!hasKey) {
      setError("Para utilizar o restauro RetroColor AI de alta qualidade, é necessário selecionar a sua própria chave de API paga.");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const result = await restoreImage(selectedFile);
      setRestoredUrl(result);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      
      // If the request fails with "Requested entity was not found.", reset the key selection state as per guidelines.
      if (err.message.includes("Requested entity was not found") || err.message.includes("chave de ligação ao motor RetroColor é inválida")) {
        setHasKey(false);
        setError("A sua chave de autenticação parece inválida. Por favor, selecione novamente para ligar ao RetroColor Engine.");
      } else {
        setError(err.message || "Ocorreu um erro no motor RetroColor AI. Verifique a sua quota.");
      }
    }
  };

  const handleDownloadClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (method: string, amount: number, itemLabel: string) => {
    setShowPayment(false);
    
    addOrder({
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: currentCustomer?.id,
      customerName: currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : 'Visitante',
      customerEmail: currentCustomer?.email,
      date: new Date().toISOString(),
      amount,
      status: 'completed',
      imageUrl: restoredUrl || undefined,
      paymentMethod: method,
      items: itemLabel
    });

    if (restoredUrl) {
      const a = document.createElement('a');
      a.href = restoredUrl;
      a.download = `retrocolor-hd-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" /> RetroColor AI Engine v3
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Estúdio de Restauro</h1>
          <p className="mt-2 text-slate-600">Alta definição e cores realistas com a tecnologia exclusiva RetroColor.</p>
        </div>

        {/* API Key Banner/Check */}
        {!hasKey && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <Key className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ligação ao Motor RetroColor AI</h3>
                <p className="text-xs text-slate-600 max-w-md">
                  Para garantir a máxima qualidade de restauro sem interrupções e com total privacidade, utilize a sua própria chave de ligação paga. 
                </p>
              </div>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Ligar ao Motor AI
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-20 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Selecione ou arraste a sua foto</h3>
                <p className="text-slate-500 mt-2">Processamento imediato via RetroColor Engine</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Foto Original</h4>
                        <button onClick={() => setSelectedFile(null)} className="text-red-500 text-xs font-bold hover:underline">Trocar</button>
                     </div>
                     <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <img src={previewUrl!} className="w-full h-full object-cover" alt="Original" />
                     </div>
                  </div>

                  {/* Resultado */}
                  <div className="space-y-3">
                     <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Processado via RetroColor AI</h4>
                     <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
                        {status === AppStatus.PROCESSING ? (
                          <div className="text-center px-4">
                             <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-2" />
                             <p className="text-sm font-black text-slate-900">Motor RetroColor em ação...</p>
                             <p className="text-[10px] text-slate-500 mt-1">Isso pode levar até 20 segundos para cores perfeitas.</p>
                          </div>
                        ) : restoredUrl ? (
                          <img src={restoredUrl} className="w-full h-full object-contain" alt="Restaurada" />
                        ) : (
                          <div className="text-center text-slate-400">
                             <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                             <p className="text-xs">O resultado aparecerá aqui</p>
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3 animate-shake">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  {status === AppStatus.IDLE && (
                    <button 
                      onClick={startAI} 
                      className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                        hasKey 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Wand2 className="h-5 w-5" /> Restaurar com RetroColor AI
                    </button>
                  )}
                  {status === AppStatus.COMPLETED && (
                    <button 
                      onClick={handleDownloadClick}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
                    >
                      <Download className="h-5 w-5" /> Baixar em Alta Resolução
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Restore;
