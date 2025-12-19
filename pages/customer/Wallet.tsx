
import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Wallet as WalletIcon, Plus, CreditCard, Check, ShieldCheck, Coins } from 'lucide-react';

const Wallet: React.FC = () => {
  const { currentCustomer, updateCustomerBalance, addAuditLog } = useConfig();
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const amounts = [
    { value: 10, bonus: 0 },
    { value: 20, bonus: 2, popular: true },
    { value: 50, bonus: 10 },
  ];

  const handleTopUp = () => {
    if (!currentCustomer) return;
    setIsProcessing(true);
    
    // Simulação de gateway de pagamento
    setTimeout(() => {
      const total = selectedAmount + (amounts.find(a => a.value === selectedAmount)?.bonus || 0);
      updateCustomerBalance(currentCustomer.id, total);
      addAuditLog('Recarga de Saldo', `Cliente carregou ${selectedAmount}€ (Bónus: ${total - selectedAmount}€)`);
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                   <Coins className="h-8 w-8" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-slate-900">Carregar Saldo</h2>
                   <p className="text-sm text-slate-500">Adicione fundos para usar em restauros futuros.</p>
                </div>
             </div>
             <div className="text-center md:text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saldo Atual</p>
                <p className="text-4xl font-black text-indigo-600">{currentCustomer?.balance.toFixed(2)}€</p>
             </div>
          </div>

          <div className="p-8">
             <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-600" /> Escolha o valor do carregamento
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {amounts.map((amount) => (
                  <button
                    key={amount.value}
                    onClick={() => setSelectedAmount(amount.value)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedAmount === amount.value 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' 
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {amount.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        RECOMENDADO
                      </span>
                    )}
                    <p className="text-2xl font-black text-slate-900">{amount.value}€</p>
                    {amount.bonus > 0 && (
                      <p className="text-xs font-bold text-green-600">+{amount.bonus}€ DE BÓNUS</p>
                    )}
                    <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAmount === amount.value ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
                       {selectedAmount === amount.value && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </button>
                ))}
             </div>

             <div className="max-w-md mx-auto space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                   <ShieldCheck className="h-5 w-5 text-green-600" />
                   <p className="text-xs text-slate-600 font-medium">Pagamento processado de forma segura via SSL 256-bit.</p>
                </div>

                <button
                  onClick={handleTopUp}
                  disabled={isProcessing || success}
                  className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl ${
                    success ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                   {isProcessing ? 'PROCESSANDO...' : success ? 'CARREGAMENTO COM SUCESSO!' : `CARREGAR ${selectedAmount}€ AGORA`}
                </button>
             </div>
          </div>
       </div>

       <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
             <CreditCard className="h-5 w-5" />
          </div>
          <div>
             <h4 className="text-sm font-bold text-amber-800">Porquê carregar saldo?</h4>
             <ul className="mt-2 space-y-1">
                <li className="text-xs text-amber-700 flex items-center gap-1"><Check className="h-3 w-3" /> Checkouts mais rápidos (sem cartões)</li>
                <li className="text-xs text-amber-700 flex items-center gap-1"><Check className="h-3 w-3" /> Ganhe bónus extra em carregamentos altos</li>
                <li className="text-xs text-amber-700 flex items-center gap-1"><Check className="h-3 w-3" /> Faturação única unificada</li>
             </ul>
          </div>
       </div>
    </div>
  );
};

export default Wallet;
