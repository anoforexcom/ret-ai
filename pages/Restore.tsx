import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Download, AlertCircle, ImageIcon, Wand2, Sparkles, Key, ExternalLink } from 'lucide-react';
import { AppStatus } from '../types';
import { restoreImage } from '../services/geminiService';
import PaymentModal from '../components/PaymentModal';
import { useConfig } from '../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';
import { sendPaymentConfirmation } from '../services/emailService';

const Restore: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(true); // Sempre true, o backend controla a chave

  const { addOrder, currentCustomer } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();



  const handleOpenKeySelector = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && typeof aiStudio.openSelectKey === 'function') {
      await aiStudio.openSelectKey();
      // Assume a seleção foi bem-sucedida para evitar condições de corrida
      setHasKey(true);
      setError(null);
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

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const result = await restoreImage(selectedFile);
      setRestoredUrl(result);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);

      const errorMsg = err.message || "";

      // Se a mensagem for longa (provavelmente o nosso erro detalhado do backend), usamos direto
      const isDescriptiveError = errorMsg.split(' ').length > 5;

      // Deteta erros de quota (429/RESOURCE_EXHAUSTED) ou chave não encontrada
      if (
        !isDescriptiveError && (
          errorMsg.includes("Requested entity was not found") ||
          errorMsg.includes("RESOURCE_EXHAUSTED") ||
          errorMsg.includes("quota") ||
          errorMsg.includes("limit") ||
          errorMsg.includes("429") ||
          errorMsg.includes("402")
        )
      ) {
        setHasKey(false);
        setError(t('restore.error_quota'));
      } else {
        // Para erros descritivos ou inesperados, mostra a mensagem crua
        setError(errorMsg || t('restore.error_unexpected'));
      }
    }
  };

  const handleDownloadClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (
    method: string,
    amount: number,
    itemLabel: string,
    customerDetails?: { firstName: string, lastName: string, email: string, id?: string }
  ) => {
    setShowPayment(false);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    // Prioridade para os detalhes enviados pelo modal (que podem incluir o novo cliente registado)
    const finalCustomerId = customerDetails?.id || currentCustomer?.id;
    const finalCustomerName = customerDetails
      ? `${customerDetails.firstName} ${customerDetails.lastName}`.trim()
      : (currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : 'Visitante');
    const finalCustomerEmail = customerDetails?.email || currentCustomer?.email;

    addOrder({
      id: orderId,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      date: new Date().toISOString(),
      amount,
      status: 'completed',
      imageUrl: restoredUrl || undefined,
      paymentMethod: method,
      items: itemLabel
    });

    // Rastreio de Google Analytics (E-commerce Purchase)
    const analyticsAmount = Number(amount) || 0;
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: analyticsAmount,
        currency: 'EUR',
        items: [{
          item_id: itemLabel,
          item_name: itemLabel,
          quantity: 1,
          price: analyticsAmount
        }]
      });
    }


    if (finalCustomerEmail) {
      sendPaymentConfirmation(
        finalCustomerEmail,
        finalCustomerName,
        orderId,
        analyticsAmount,
        itemLabel
      );
    }

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
          <h1 className="text-3xl font-bold text-slate-900">{t('restore.title')}</h1>
          <p className="mt-2 text-slate-600">{t('restore.subtitle')}</p>
        </div>

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
                <h3 className="text-xl font-bold text-slate-900">{t('restore.select_drag')}</h3>
                <p className="text-slate-500 mt-2">{t('restore.processing')}</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">{t('restore.original_photo')}</h4>
                      <button onClick={() => setSelectedFile(null)} className="text-red-500 text-xs font-bold hover:underline">{t('restore.change')}</button>
                    </div>
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img src={previewUrl!} className="w-full h-full object-cover" alt="Original" />
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">{t('restore.processed_via')}</h4>
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
                      {status === AppStatus.PROCESSING ? (
                        <div className="text-center px-4">
                          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-2" />
                          <p className="text-sm font-black text-slate-900">{t('restore.engine_action')}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{t('restore.optimizing')}</p>
                        </div>
                      ) : restoredUrl ? (
                        <img src={restoredUrl} className="w-full h-full object-contain" alt="Restaurada" />
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p className="text-xs">{t('restore.result_here')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3 animate-shake">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">{error}</div>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
                    <button
                      onClick={startAI}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <Wand2 className="h-5 w-5" /> {t('restore.restore_btn')}
                    </button>
                  )}
                  {status === AppStatus.COMPLETED && (
                    <button
                      onClick={handleDownloadClick}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
                    >
                      <Download className="h-5 w-5" /> {t('restore.download_btn')}
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
