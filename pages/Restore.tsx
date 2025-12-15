import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Download, AlertCircle, ImageIcon, Wand2 } from 'lucide-react';
import { AppStatus } from '../types';
import { restoreImage } from '../services/geminiService';
import PaymentModal from '../components/PaymentModal';
import { useConfig } from '../contexts/ConfigContext';

const Restore: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const { addOrder } = useConfig();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("O ficheiro é demasiado grande. Máximo 5MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Por favor selecione um ficheiro de imagem válido.");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRestoredUrl(null);
      setError(null);
      setStatus(AppStatus.IDLE);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const resultUrl = await restoreImage(selectedFile);
      setRestoredUrl(resultUrl);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      setError(err.message || "Ocorreu um erro ao processar a imagem.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRestoredUrl(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (method: string) => {
    setShowPayment(false);
    if (restoredUrl) {
      // Register order in admin panel
      addOrder({
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: 'Cliente Visitante',
        date: new Date().toISOString(),
        amount: 4.00,
        status: 'completed',
        imageUrl: restoredUrl,
        paymentMethod: method
      });

      // Create temporary link to download
      const link = document.createElement('a');
      link.href = restoredUrl;
      link.download = `restored-retrocolor-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Estúdio de Restauração</h1>
          <p className="mt-4 text-lg text-slate-600">
            Carregue a sua foto e deixe a IA fazer a magia.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8">
            {/* Upload Area */}
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Upload className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Clique para carregar foto</h3>
                  <p className="text-sm text-slate-500 mt-2">JPG ou PNG até 5MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Preview Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Original</h3>
                    <div className="relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img src={previewUrl!} alt="Original" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Resultado IA</h3>
                    <div className="relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      {status === AppStatus.PROCESSING ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
                          <p className="text-indigo-600 font-medium">Restaurando e colorindo...</p>
                          <p className="text-xs text-slate-400 mt-1">Isto pode demorar até 15 segundos</p>
                        </div>
                      ) : restoredUrl ? (
                        <div className="relative w-full h-full group">
                           <img src={restoredUrl} alt="Restaurada" className="w-full h-full object-contain" />
                           {/* Overlay for watermark effect visually before payment */}
                           <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                              <p className="text-4xl font-bold text-white transform -rotate-45">PREVIEW</p>
                           </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 p-6">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>O resultado aparecerá aqui</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-100 pt-8">
                  <button
                    onClick={handleReset}
                    className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Escolher outra foto
                  </button>

                  <div className="flex gap-4">
                    {status === AppStatus.IDLE && (
                      <button
                        onClick={handleRestore}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                      >
                        <Wand2 className="h-5 w-5" />
                        Restaurar & Colorir
                      </button>
                    )}

                    {status === AppStatus.COMPLETED && (
                      <button
                        onClick={handleDownloadClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 animate-bounce"
                      >
                        <Download className="h-5 w-5" />
                        Baixar Imagem (4€)
                      </button>
                    )}
                  </div>
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
        price="4,00 €"
      />
    </div>
  );
};

export default Restore;